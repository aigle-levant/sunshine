import express from "express";
import { anthropic } from "../claude.js";

const router = express.Router();

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function buildPrompt(businessSummary, brandContext) {
  return `You are an expert social media marketing strategist.

Business Summary
${businessSummary || "No business summary available."}

Brand Context
${brandContext || "No brand context available."}

Generate a complete marketing calendar for the next 7 days.

For each day generate
- day
- platform
- campaign title
- campaign objective
- instagram caption
- whatsapp message
- hashtags
- best posting time
- image prompt
- suggested AI design tool

Maintain the same writing tone as the existing Instagram profile.

Alternate between promotional, educational, engagement and storytelling posts.

Return ONLY JSON.

Schema
{
  "week": [
    {
      "day": "",
      "platform": "Instagram",
      "title": "",
      "objective": "",
      "caption": "",
      "whatsappMessage": "",
      "hashtags": [],
      "bestTime": "",
      "imagePrompt": "",
      "aiTool": ""
    }
  ]
}`;
}

router.post("/generate", async (req, res) => {
  try {
    const { businessSummary, brandContext } = req.body;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: buildPrompt(businessSummary, brandContext),
        },
      ],
    });

    let content = response.content[0].text.trim();
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const json = JSON.parse(content);

    if (!Array.isArray(json.week)) {
      throw new Error("Claude did not return a valid week array");
    }

    json.week = json.week
      .slice(0, 7)
      .map((entry, index) => ({ ...entry, day: entry.day || DAYS[index] }));

    res.json({ success: true, week: json.week });
  } catch (err) {
    console.error("Planner route error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate weekly plan",
    });
  }
});

router.post("/recommend-platform", async (req, res) => {
  try {
    const { businessSummary } = req.body;

    const prompt = `Based on the business summary below, recommend the most effective marketing platform.

Business Summary
${businessSummary || "No business summary available."}

Return ONLY JSON.

Schema
{
  "recommendedPlatform": "Instagram",
  "reason": "Your customers engage more with visual product showcases."
}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    let content = response.content[0].text.trim();
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const json = JSON.parse(content);

    res.json({
      success: true,
      recommendedPlatform: json.recommendedPlatform,
      reason: json.reason,
    });
  } catch (err) {
    console.error("Planner recommend-platform error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to recommend a platform",
    });
  }
});

router.post("/generate-strategy", async (req, res) => {
  try {
    const {
      businessSummary,
      brandContext,
      platformAnalysis,
      ownerContext,
      campaignPreferences,
      postingFrequency,
      contentGoal,
    } = req.body;

    const prompt = `You are an expert marketing strategist.

Using the following information

Business Summary
${businessSummary || "No business summary available."}

Brand Context
${brandContext || "No brand context available."}

Instagram Analysis
${platformAnalysis || "No platform analysis available."}

Owner Context
${ownerContext || "None provided — use your best judgement."}

Campaign Preferences
${Array.isArray(campaignPreferences) && campaignPreferences.length ? campaignPreferences.join(", ") : "AI Recommended"}

Posting Frequency
${postingFrequency || "Not specified"}

Content Goal
${contentGoal || "Not specified"}

Create a marketing strategy.

Return ONLY JSON.

Schema
{
  "brandSummary": "",
  "marketingObjective": "",
  "recommendedPlatforms": ["Instagram", "WhatsApp"],
  "contentMix": [
    { "type": "Educational", "percentage": 30 }
  ],
  "postingSchedule": "",
  "weeklyTheme": "",
  "keyMessages": [],
  "ctaStyle": "",
  "recommendedHashtags": [],
  "imageStyle": "",
  "nextStep": "Generate Weekly Planner"
}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1200,
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    let content = response.content[0].text.trim();
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const json = JSON.parse(content);

    res.json({ success: true, strategy: json });
  } catch (err) {
    console.error("Planner generate-strategy error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate marketing strategy",
    });
  }
});

router.post("/regenerate-day", async (req, res) => {
  try {
    const { businessSummary, brandContext, day } = req.body;

    if (!day) {
      return res.status(400).json({ success: false, error: "day is required" });
    }

    const prompt = `You are an expert social media marketing strategist.

Business Summary
${businessSummary || "No business summary available."}

Brand Context
${brandContext || "No brand context available."}

Generate ONE new marketing post idea for ${day}, different from before.

Return ONLY JSON.

Schema
{
  "day": "${day}",
  "platform": "Instagram",
  "title": "",
  "objective": "",
  "caption": "",
  "whatsappMessage": "",
  "hashtags": [],
  "bestTime": "",
  "imagePrompt": "",
  "aiTool": ""
}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 800,
      temperature: 0.9,
      messages: [{ role: "user", content: prompt }],
    });

    let content = response.content[0].text.trim();
    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const json = JSON.parse(content);

    res.json({ success: true, day: json });
  } catch (err) {
    console.error("Planner regenerate-day error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to regenerate day",
    });
  }
});

export default router;
