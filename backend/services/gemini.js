// backend/services/gemini.js
//
// Gemini, used for one thing only: turning a text prompt into an image. All text
// generation in this project stays with Claude (see claude.js) — captions, weekly
// plans and brand analysis are unchanged.
//
// Which image models a key can actually use varies by project and billing tier,
// and hardcoded model names go stale (two of the four this file used to list no
// longer exist). So the model isn't guessed: the account is asked what it has,
// and each candidate is tried until one returns pixels.

import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Same reason claude.js does this: server.js's imports are all evaluated before
// its own dotenv.config() runs, and resolving against this file rather than cwd
// means it works whichever directory the process was started from.
dotenv.config({
    path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"),
});

let client = null;

/** Model discovery is one network call; hold onto the answer for the process. */
let discoveredModels = null;

/**
 * Built on first use rather than at import.
 *
 * claude.js throws while loading when its key is missing, which is right for a
 * key the whole app depends on. Image generation is one optional feature, so a
 * missing GEMINI_API_KEY must not stop the server booting — voice capture, the
 * planner and Instagram analysis have to keep working without it.
 */
function getClient() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is missing from backend/.env — add it and restart the server to generate images.",
        );
    }

    if (!client) {
        client = new GoogleGenAI({ apiKey });
    }

    return client;
}

/** Lets callers skip the request entirely instead of catching a thrown error. */
export function isImageGenerationConfigured() {
    return Boolean(process.env.GEMINI_API_KEY);
}

/** A data URL, so the frontend can put the result straight into an <img src>. */
function toDataUrl(base64, mimeType) {
    return `data:${mimeType || "image/png"};base64,${base64}`;
}

/**
 * The SDK puts Google's JSON error body in `message`, which reads as a wall of
 * JSON in the UI. Pull out the sentence a human needs.
 */
function apiMessage(error) {
    const raw = String(error?.message ?? "");

    try {
        return JSON.parse(raw)?.error?.message || raw;
    } catch {
        return raw;
    }
}

/**
 * True when the failure means "not this model" rather than "not at all", so the
 * loop should try the next candidate.
 *
 * A quota rejection counts. On the free tier these models report
 * `limit: 0` — an entitlement, not a used-up allowance — and a different model
 * may still be permitted, so it's worth asking rather than giving up.
 *
 * An invalid key or a safety block fails identically on every model, so those
 * stop the loop instead of hammering all ten.
 */
function shouldTryNextModel(error) {
    const status = error?.status;

    if (status === 404 || status === 429) return true;
    if (status !== 400) return false;

    const message = apiMessage(error).toLowerCase();

    return (
        message.includes("not found") ||
        message.includes("not supported") ||
        message.includes("does not support") ||
        message.includes("unsupported") ||
        message.includes("modalit")
    );
}

/**
 * Cheapest and most widely available first: lite, then flash, then pro, then
 * ultra. A free or low-tier key is likeliest to be entitled to the small ones.
 */
function rank(name) {
    if (/lite/i.test(name)) return 0;
    if (/flash/i.test(name)) return 1;
    if (/ultra/i.test(name)) return 3;

    return 2;
}

/**
 * The image-capable models this key can see, in the order worth trying.
 *
 * `generateContent` is the current way to get an image out of Gemini. Imagen's
 * `predict` models are included as a fallback, though the SDK now warns that
 * `generateImages` is deprecated in favour of generateContent.
 */
async function discoverImageModels(ai) {
    if (discoveredModels) return discoveredModels;

    const models = [];

    for await (const model of await ai.models.list()) {
        const name = String(model.name ?? "").replace(/^models\//, "");

        if (!name) continue;

        // Video models also expose predict; match on the visual-image families
        // rather than on the action alone.
        if (!/image|imagen|banana/i.test(name)) continue;

        const actions = model.supportedActions ?? [];

        if (actions.includes("generateContent")) {
            models.push({ name, method: "generateContent" });
        } else if (actions.includes("predict")) {
            models.push({ name, method: "predict" });
        }
    }

    discoveredModels = models.sort((a, b) => rank(a.name) - rank(b.name));

    return discoveredModels;
}

/** Exposed for diagnostics: what this key could use, before anything is tried. */
export async function listImageModels() {
    const models = await discoverImageModels(getClient());

    return models.map((model) => `${model.name} (${model.method})`);
}

/** Gemini's own image output: one part of a generateContent response. */
async function generateWithGemini(ai, model, prompt) {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            // TEXT alongside IMAGE because these models may narrate what they drew;
            // the text part is ignored, the inline image part is what we want.
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const parts = response?.candidates?.[0]?.content?.parts ?? [];

    const inlineData = parts.find((part) => part?.inlineData?.data)?.inlineData;

    if (!inlineData?.data) {
        // Usually a safety block, in which case the reason is worth passing on.
        const reason =
            response?.candidates?.[0]?.finishReason ||
            response?.promptFeedback?.blockReason ||
            "no image was returned";

        throw new Error(`Gemini didn't return an image (${reason}).`);
    }

    return toDataUrl(inlineData.data, inlineData.mimeType);
}

/** Imagen models answer on a dedicated method with a different response shape. */
async function generateWithImagen(ai, model, prompt) {
    const response = await ai.models.generateImages({
        model,
        prompt,
        config: { numberOfImages: 1, includeRaiReason: true },
    });

    const first = response?.generatedImages?.[0];

    if (!first?.image?.imageBytes) {
        throw new Error(
            `Imagen didn't return an image (${first?.raiFilteredReason || "no image was returned"}).`,
        );
    }

    return toDataUrl(first.image.imageBytes, first.image.mimeType);
}

/**
 * Generate an image from a text description.
 *
 * Works through every image model this key can see until one produces pixels.
 * A model that's missing or unaffordable is skipped; a bad key or a safety block
 * stops immediately, since retrying those on another model changes nothing.
 *
 * @param {string} prompt What to draw.
 * @param {{ model?: string }} [options] Pins a model, tried before the rest.
 * @returns {Promise<string>} A `data:image/...;base64,...` URL.
 */
export async function generateImage(prompt, { model } = {}) {
    const text = String(prompt ?? "").trim();

    if (!text) {
        throw new Error("An image prompt is required");
    }

    const ai = getClient();

    const pinned = model || process.env.GEMINI_IMAGE_MODEL;

    const discovered = await discoverImageModels(ai);

    const candidates = pinned
        ? [
              {
                  name: pinned,
                  method: pinned.startsWith("imagen") ? "predict" : "generateContent",
              },
              ...discovered.filter((candidate) => candidate.name !== pinned),
          ]
        : discovered;

    if (!candidates.length) {
        throw new Error(
            "This API key can't see any image generation models. Check the key's project in Google AI Studio.",
        );
    }

    const failures = [];

    for (const candidate of candidates) {
        try {
            const image =
                candidate.method === "predict"
                    ? await generateWithImagen(ai, candidate.name, text)
                    : await generateWithGemini(ai, candidate.name, text);

            console.log(`Gemini image generated with ${candidate.name}`);

            return image;
        } catch (err) {
            const reason = apiMessage(err);

            failures.push(`${candidate.name}: ${err?.status ?? ""} ${reason.split("\n")[0]}`.trim());

            if (!shouldTryNextModel(err)) {
                throw new Error(reason);
            }

            console.warn(`Gemini model ${candidate.name} unusable — ${reason.split("\n")[0]}`);
        }
    }

    // Every model refused. A quota rejection here means a free-tier limit of 0 —
    // an entitlement, not an allowance — so lead with that rather than repeating
    // the same paragraph of Google's prose once per model.
    const quotaBlocked = failures.filter((line) => /quota|RESOURCE_EXHAUSTED|429/i.test(line));

    if (quotaBlocked.length) {
        throw new Error(
            `Image generation isn't enabled for this API key: ${quotaBlocked.length} of ${failures.length} image models report a free-tier quota of 0, and the rest are unavailable to new keys. Enable billing on this key's Google Cloud project, or use a key from a billed project. Tried: ${candidates
                .map((candidate) => candidate.name)
                .join(", ")}`,
        );
    }

    throw new Error(`No image model produced an image. ${failures.join(" | ")}`);
}
