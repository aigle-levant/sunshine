// backend/routes/studio.js
//
// The AI Content Studio's generate route. The frontend had been drafting sample
// copy locally against a documented TODO; this is the endpoint that TODO pointed
// at (POST /api/studio/generate).
//
// Text comes from Claude, exactly like the planner and the Instagram analysis.
// Gemini is used only to draw the image, and only if it's configured — a missing
// GEMINI_API_KEY costs the request its picture, never its copy.

import express from "express";

import { anthropic } from "../claude.js";
import { generateImage, isImageGenerationConfigured } from "../services/gemini.js";

const router = express.Router();

function buildPrompt({ contentType, prompt, tone, language, targetAudience }) {
    return `You are an expert marketing copywriter for small Indian businesses.

Write ${contentType || "an Instagram Post"} for this business.

What the owner said
${prompt}

Tone
${tone || "Friendly"}

Language
Write "title", "caption" and "callToAction" in ${language || "English"}.
If that language is not English, write them in that language's own script.

Target audience
${targetAudience || "the business's regular customers"}

Rules
Keep the caption suited to ${contentType || "an Instagram Post"} — short for a status
or a story, longer for a blog or an email.
Do not invent prices, discounts, dates or delivery promises the owner didn't mention.
Hashtags are lowercase, without the # symbol, and omitted entirely for email,
WhatsApp and product descriptions.
"imagePrompt" must always be in English, whatever language the copy is in: it is a
short, concrete description of one photograph that would suit this post — subject,
setting, lighting. No text or logos in the image.

Return ONLY valid JSON. No markdown, no code fences, no explanation.

Schema
{
  "title": "",
  "caption": "",
  "hashtags": [],
  "callToAction": "",
  "imagePrompt": ""
}`;
}

/** Claude occasionally wraps JSON in fences despite being asked not to. */
function parseJson(text) {
    const cleaned = text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/, "")
        .trim();

    return JSON.parse(cleaned);
}

router.post("/generate", async (req, res) => {
    try {
        const { contentType, prompt, tone, language, targetAudience } = req.body;

        if (!prompt || !String(prompt).trim()) {
            return res.status(400).json({
                success: false,
                error: "prompt is required",
            });
        }

        const response = await anthropic.messages.create({
            model: "claude-haiku-4-5",
            max_tokens: 1200,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: buildPrompt({
                        contentType,
                        prompt,
                        tone,
                        language,
                        targetAudience,
                    }),
                },
            ],
        });

        const content = parseJson(response.content[0].text);

        // The image is a bonus, not a precondition: a Gemini failure (missing key,
        // safety block, quota) still returns the copy, with the reason attached so
        // the studio can say why the picture is missing.
        let image = null;
        let imageError = null;

        if (!isImageGenerationConfigured()) {
            imageError = "GEMINI_API_KEY is missing from backend/.env";
        } else {
            try {
                image = await generateImage(content.imagePrompt || prompt);
            } catch (err) {
                console.error("Studio image error:", err);
                imageError = err.message || "Image generation failed";
            }
        }

        res.json({
            success: true,
            title: content.title ?? "",
            caption: content.caption ?? "",
            hashtags: Array.isArray(content.hashtags) ? content.hashtags : [],
            callToAction: content.callToAction ?? "",
            image,
            imageError,
        });
    } catch (err) {
        console.error("Studio route error:", err);

        res.status(500).json({
            success: false,
            error: err.message || "Failed to generate content",
        });
    }
});

export default router;
