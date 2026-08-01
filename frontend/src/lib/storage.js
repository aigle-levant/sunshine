// Temporary localStorage-backed persistence, used when Supabase writes fail
// (e.g. RLS blocking the demo user). Mirrors the shape of the Supabase rows
// so swapping back to real persistence later only means dropping these calls.

const KEYS = {
  businessAnalysis: "voicekart:demo:business_analysis",
  campaigns: "voicekart:demo:campaigns",
  instagramContext: "voicekart:demo:instagram_context",
  weeklyPlan: "voicekart:demo:weekly_plan",
};

function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
}

function appendToList(key, entry) {
  const list = readList(key);
  list.push(entry);
  localStorage.setItem(key, JSON.stringify(list));
}

export function saveBusinessAnalysis(analysis) {
  appendToList(KEYS.businessAnalysis, {
    analysis,
    created_at: new Date().toISOString(),
  });
}

export function getBusinessAnalysis() {
  return readList(KEYS.businessAnalysis);
}

export function saveCampaign(campaign) {
  appendToList(KEYS.campaigns, {
    ...campaign,
    created_at: new Date().toISOString(),
  });
}

export function getCampaigns() {
  return readList(KEYS.campaigns);
}

export function saveInstagramContext(context) {
  appendToList(KEYS.instagramContext, {
    ...context,
    created_at: new Date().toISOString(),
  });
}

export function getInstagramContext() {
  return readList(KEYS.instagramContext);
}

export function saveWeeklyPlan(week) {
  appendToList(KEYS.weeklyPlan, {
    week,
    created_at: new Date().toISOString(),
  });
}

export function getWeeklyPlan() {
  return readList(KEYS.weeklyPlan);
}
