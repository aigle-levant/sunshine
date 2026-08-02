// backend/services/gemini.js
//
// Gemini, used for one thing only: turning a text prompt into an image. All text
// generation in this project stays with Claude (see claude.js) — captions, weekly
// plans and brand analysis are unchanged.

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

/**
 * Tried in order until one answers. Which image models a key can reach depends
 * on the account and the tier, so rather than failing on a model this key isn't
 * entitled to, fall through to the next candidate.
 *
 * Gemini models return images from generateContent; `imagen-*` models use a
 * different SDK method, handled below. GEMINI_IMAGE_MODEL pins one explicitly
 * and is always tried first.
 */
const MODEL_CANDIDATES = [
    "gemini-2.5-flash-image",
    "gemini-2.0-flash-preview-image-generation",
    "imagen-4.0-generate-001",
    "imagen-3.0-generate-002",
];

function modelsToTry(preferred) {
    const configured = preferred || process.env.GEMINI_IMAGE_MODEL;

    if (!configured) return MODEL_CANDIDATES;

    return [configured, ...MODEL_CANDIDATES.filter((model) => model !== configured)];
}

let client = null;

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
 * True when the failure means "not this model" rather than "not at all".
 * An invalid key, a safety block or an exhausted quota fail the same way on
 * every model, so those stop the loop instead of hammering all four.
 */
function isModelUnavailable(error) {
    const status = error?.status;

    if (status === 404) return true;
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

/** What this key can actually reach — used when diagnosing a model failure. */
export async function listImageModels() {
    const ai = getClient();

    const models = [];

    for await (const model of await ai.models.list()) {
        const actions = model.supportedActions ?? [];

        if (
            actions.includes("predict") ||
            /image/i.test(model.name ?? "") ||
            /image/i.test(model.displayName ?? "")
        ) {
            models.push(model.name);
        }
    }

    return models;
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
 * Walks the candidate models until one produces an image. A model this key
 * can't reach is skipped; any other failure (bad key, safety block, quota)
 * stops immediately and is reported as-is.
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

    const candidates = modelsToTry(model);

    let lastError = null;

    for (const candidate of candidates) {
        try {
            const image = candidate.startsWith("imagen")
                ? await generateWithImagen(ai, candidate, text)
                : await generateWithGemini(ai, candidate, text);

            console.log(`Gemini image generated with ${candidate}`);

            return image;
        } catch (err) {
            lastError = err;

            if (!isModelUnavailable(err)) {
                throw new Error(apiMessage(err));
            }

            console.warn(`Gemini model ${candidate} unavailable, trying the next one`);
        }
    }

    throw new Error(
        `No image model available for this API key. Last attempt (${
            candidates[candidates.length - 1]
        }): ${apiMessage(lastError)}`,
    );
}
