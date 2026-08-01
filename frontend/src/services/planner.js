import { supabase } from "../lib/supabase.js";
import { readEntries, buildDashboard, formatCurrency } from "../components/dashboard/dashboardData.js";
import {
  getInstagramContext,
  saveWeeklyPlan as saveWeeklyPlanLocal,
  saveCampaign,
} from "../lib/storage.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Builds a plain-text business summary from locally recorded voice entries. */
export function buildBusinessSummary() {
  const data = buildDashboard(readEntries());

  if (data.isEmpty) {
    return "A small business with no recorded orders or customers yet.";
  }

  const lines = [
    `${data.entryCount} recorded updates, ${data.stats.orders} orders and ${data.stats.customers} customers so far.`,
    `Revenue collected: ${formatCurrency(data.stats.revenue)}. Outstanding balance: ${formatCurrency(data.stats.outstanding)}.`,
  ];

  if (data.insights.length) {
    lines.push(`Business insights: ${data.insights.slice(0, 5).map((i) => i.text).join("; ")}.`);
  }

  return lines.join(" ");
}

/** Fetches the most recently saved Instagram brand analysis for this user. */
export async function getLatestBrandContext(userId) {
  const { data, error } = await supabase
    .from("social_accounts")
    .select("brand_context")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    const local = getInstagramContext();
    return local.length ? local[local.length - 1].brand_context ?? null : null;
  }

  return data?.brand_context ?? null;
}

export async function generateWeeklyPlan(businessSummary, brandContext, platform = "Instagram") {
  let response;

  try {
    response = await fetch(`${API_URL}/api/planner/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessSummary,
        brandContext: brandContext ? JSON.stringify(brandContext) : "",
        platform,
      }),
    });
  } catch {
    throw new Error("Couldn't reach VoiceKart AI. Check that the backend is running.");
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Failed to generate weekly plan");
  }

  return payload.week;
}

export async function recommendPlatform(businessSummary) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/planner/recommend-platform`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessSummary }),
    });
  } catch {
    throw new Error("Couldn't reach VoiceKart AI. Check that the backend is running.");
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Failed to get a platform recommendation");
  }

  return { recommendedPlatform: payload.recommendedPlatform, reason: payload.reason };
}

/**
 * Trims the raw Apify Instagram profile (images, thumbnails, full post
 * history, external URLs, ...) down to the handful of fields the strategy
 * prompt actually reads, so the request stays well under Express's body
 * size limit.
 */
function buildPlatformAnalysis(profile, brandContext) {
  if (!profile && !brandContext) return null;

  return {
    bio: profile?.biography || profile?.bio,
    followers: profile?.followers,
    businessCategory: profile?.businessCategory,
    username: profile?.username,
    displayName: profile?.displayName,
    verified: profile?.verified,
    brandTone: brandContext?.brandTone,
    brandDNA: brandContext?.brandDNA,
    audience: brandContext?.audience,
    contentPillars: brandContext?.contentPillars,
    postingFrequency: brandContext?.postingFrequency,
    captions: profile?.latestPosts
      ?.slice(0, 5)
      .map((post) => post.caption)
      .filter(Boolean),
  };
}

export async function generateMarketingStrategy({
  businessSummary,
  brandContext,
  platformAnalysis,
  ownerContext,
  campaignPreferences,
  postingFrequency,
  contentGoal,
  platform = "Instagram",
}) {
  let response;

  const trimmedPlatformAnalysis = buildPlatformAnalysis(platformAnalysis, brandContext);

  const requestBody = {
    businessSummary,
    brandContext: brandContext ? JSON.stringify(brandContext) : "",
    platformAnalysis: trimmedPlatformAnalysis ? JSON.stringify(trimmedPlatformAnalysis) : "",
    ownerContext,
    campaignPreferences,
    postingFrequency,
    contentGoal,
    platform,
  };

  console.log("Generate Strategy Payload");
  console.log(JSON.stringify(requestBody, null, 2));

  try {
    response = await fetch(`${API_URL}/api/planner/generate-strategy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
  } catch {
    throw new Error("Couldn't reach VoiceKart AI. Check that the backend is running.");
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Failed to generate marketing strategy");
  }

  return payload.strategy;
}

export async function regenerateDay(businessSummary, brandContext, dayName) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/planner/regenerate-day`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessSummary,
        brandContext: brandContext ? JSON.stringify(brandContext) : "",
        day: dayName,
      }),
    });
  } catch {
    throw new Error("Couldn't reach VoiceKart AI. Check that the backend is running.");
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Failed to regenerate day");
  }

  return payload.day;
}

export async function saveWeeklyPlan(userId, week) {
  const { error } = await supabase.from("weekly_plans").insert([
    {
      user_id: userId,
      week,
    },
  ]);

  if (error) {
    saveWeeklyPlanLocal(week);
    return;
  }
}

export async function scheduleCampaign(userId, day) {
  const campaign = {
    user_id: userId,
    title: day.title,
    platform: day.platform,
    caption: day.caption,
    whatsapp_message: day.whatsappMessage,
    hashtags: day.hashtags,
    best_time: day.bestTime,
    image_prompt: day.imagePrompt,
    status: "scheduled",
    scheduled_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("campaigns").insert([campaign]);

  if (error) {
    saveCampaign(campaign);
    return;
  }
}
