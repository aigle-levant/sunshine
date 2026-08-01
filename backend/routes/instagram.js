import express from "express";
import { scrapeInstagram } from "../services/instagram.js";
import { anthropic } from "../claude.js";

const router = express.Router();

async function analyzeWithClaude(profile) {
  const captions = profile.latestPosts?.slice(0, 10).map(post => post.caption).filter(Boolean) || [];

  const prompt = `You are an expert social media strategist.

Business Summary
${profile.fullName || profile.username} is an Instagram account with ${profile.followers} followers.

Instagram Bio
${profile.biography || ""}

Followers
${profile.followers}

Business Category
${profile.businessCategory || "Not specified"}

Recent Captions
${captions.join("\n\n") || "No captions available"}

Analyse the brand and provide strategic insights in JSON format with the following schema:

{
  "brandTone": "The brand's personality and tone (e.g., professional, casual, inspirational)",
  "brandDNA": "Core essence and values of the brand",
  "audience": "Description of the target audience",
  "contentPillars": ["pillar1", "pillar2", "pillar3"],
  "postingFrequency": "Estimated posting frequency",
  "bestContentIdeas": ["idea1", "idea2", "idea3"],
  "weeklyCalendar": ["Monday: ...", "Tuesday: ...", "Wednesday: ...", "Thursday: ...", "Friday: ...", "Saturday: ...", "Sunday: ..."],
  "whatsappStrategy": "Strategy for WhatsApp marketing aligned with the brand"
}

Return ONLY valid JSON, no additional text.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let content = response.content[0].text.trim();
  content = content.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

  return JSON.parse(content);
}

router.post("/", async (req, res) => {
  try {
    let { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "Username is required",
      });
    }

    username = username.replace("@", "");

    const profile = await scrapeInstagram(username);

    const brandContext = await analyzeWithClaude(profile);

    res.json({
      success: true,
      profile,
      brandContext,
    });

  } catch (err) {
    console.error("Instagram route error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to analyze Instagram profile",
    });
  }
});

export default router;