import express from "express";
import { anthropic } from "../claude.js";

const router = express.Router();

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function buildPrompt(businessSummary, brandContext, platform = "Instagram") {
  const contentTypeGuidance = "Reel, Carousel, Story or Photo";

  const toneGuidance = "Maintain the same writing tone as the existing Instagram profile.";

  return `You are an expert social media marketing strategist.

Business Summary
${businessSummary || "No business summary available."}

Brand Context
${brandContext || "No brand context available."}

Generate a complete ${platform} marketing calendar for the next 7 days.

For each day generate
- day
- platform
- campaign title
- campaign objective
- ${platform.toLowerCase()} caption
- whatsapp message
- hashtags
- best posting time
- image prompt
- suggested AI design tool

Each day's content type should be one of: ${contentTypeGuidance}.

${toneGuidance}

Alternate between promotional, educational, engagement and storytelling posts.

Return ONLY JSON.

Schema
{
  "week": [
    {
      "day": "",
      "platform": "${platform}",
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
    const { businessSummary, brandContext, platform } = req.body;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: buildPrompt(businessSummary, brandContext, platform),
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

Recommend Instagram if it's suitable for this business.

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
    console.log("\n==============================");
    console.log("🚀 GENERATE STRATEGY REQUEST");
    console.log("==============================");

    console.log("Request Body:");
    console.log(JSON.stringify(req.body, null, 2));

    const {
      businessSummary,
      brandContext,
      platformAnalysis,
      ownerContext,
      campaignPreferences,
      postingFrequency,
      contentGoal,
      platform,
    } = req.body;

    console.log("\nParsed Values:");
    console.log({
      businessSummary,
      brandContext,
      platformAnalysis,
      ownerContext,
      campaignPreferences,
      postingFrequency,
      contentGoal,
      platform,
    });

    const resolvedPlatform = "Instagram";

    const strategyGuidance = "Generate an Instagram-focused strategy: visual storytelling, Reels, Carousels and Stories.";

    const prompt = `You are an expert social media marketing strategist.

Business Summary
${businessSummary || "No business summary available."}

Brand Context
${brandContext || "No brand context available."}

Platform Analysis
${platformAnalysis || "No platform analysis available."}

Owner Context
${ownerContext || "No additional context provided."}

Campaign Preferences
${Array.isArray(campaignPreferences) && campaignPreferences.length ? campaignPreferences.join(", ") : "No specific preferences."}

Posting Frequency
${postingFrequency || "Not specified."}

Content Goal
${contentGoal || "Not specified."}

Platform
${resolvedPlatform}

${strategyGuidance}

Return ONLY JSON.

Schema
{
  "marketingObjective": "",
  "weeklyTheme": "",
  "recommendedPlatforms": ["${resolvedPlatform}"],
  "contentMix": [{ "type": "", "percentage": 0 }],
  "keyMessages": [],
  "ctaStyle": "",
  "imageStyle": ""
}`;

    console.log("\n========== PROMPT ==========");
    console.log(prompt);
    console.log("============================\n");

    console.log("🤖 Calling Claude...");

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1200,
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    console.log("✅ Claude responded");

    console.log("\nRAW RESPONSE:");
    console.log(JSON.stringify(response, null, 2));

    if (!response.content?.length) {
      throw new Error("Claude returned empty content");
    }

    let content = response.content[0].text.trim();

    console.log("\nRAW TEXT:");
    console.log(content);

    content = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    console.log("\nCLEANED JSON:");
    console.log(content);

    const json = JSON.parse(content);

    console.log("\nPARSED JSON:");
    console.log(JSON.stringify(json, null, 2));

    res.json({
      success: true,
      strategy: json,
    });

  } catch (err) {

    console.error("\n==============================");
    console.error("❌ GENERATE STRATEGY FAILED");
    console.error("==============================");

    console.error("Message:");
    console.error(err.message);

    console.error("\nStack:");
    console.error(err.stack);

    console.error("\nFull Error:");
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }
});

router.post("/regenerate-day", async (req, res) => {
  try {
    const { businessSummary, brandContext, day, platform } = req.body;

    if (!day) {
      return res.status(400).json({ success: false, error: "day is required" });
    }

    const resolvedPlatform = "Instagram";

    const prompt = `You are an expert social media marketing strategist.

Business Summary
${businessSummary || "No business summary available."}

Brand Context
${brandContext || "No brand context available."}

Generate ONE new ${resolvedPlatform} marketing post idea for ${day}, different from before.

Return ONLY JSON.

Schema
{
  "day": "${day}",
  "platform": "${resolvedPlatform}",
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
