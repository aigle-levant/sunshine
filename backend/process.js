import express from "express";
import { processTranscript } from "./claude.js";

const router = express.Router();

// POST /api/process
router.post("/", async (req, res) => {
    try {
        const { transcript } = req.body;

        // Validate request
        if (!transcript || transcript.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Transcript is required",
            });
        }

        console.log("🎤 Transcript:", transcript);

        // Send transcript to Claude
        const result = await processTranscript(transcript);

        console.log("✅ Claude Response:", result);

        // Return structured JSON
        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error("❌ Process Error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to process transcript",
        });
    }
});

export default router;