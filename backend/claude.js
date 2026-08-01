import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import buildPrompt from "../prompts/buildPrompt.js";

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function processTranscript(transcript) {
    const prompt = buildPrompt(transcript);

    const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        temperature: 0,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    const text = response.content[0].text;

    return JSON.parse(text);
}