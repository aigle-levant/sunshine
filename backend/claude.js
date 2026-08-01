import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Must run before the client is constructed: this module is evaluated
// during server.js's import phase, i.e. before its own dotenv.config().
// Resolved against this file, not cwd, so it works from any directory.
dotenv.config({
    path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env"),
});

if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is missing from backend/.env");
}

export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
