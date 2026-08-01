// Temporary localStorage-backed persistence, used when Supabase writes fail
// (e.g. RLS blocking the demo user). Mirrors the shape of the Supabase rows
// so swapping back to real persistence later only means dropping these calls.

const KEYS = {
  businessAnalysis: "voicekart:demo:business_analysis",
  campaigns: "voicekart:demo:campaigns",
  instagramContext: "voicekart:demo:instagram_context",
  weeklyPlan: "voicekart:demo:weekly_plan",
  weeklyPlanner: "voicekart:weekly-plan",
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

// ---------------------------------------------------------------------------
// Weekly planner table
//
// The planner is edited row by row, so it needs the current state of a week
// rather than the append-only history above: one slot per week, keyed by that
// week's Monday. `saveWeeklyPlan` still records generated plans as history.
// ---------------------------------------------------------------------------

function readMap(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));

    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    // Private mode, or something else wrote to the key.
    return {};
  }
}

/** Every stored week, keyed by its Monday. `{}` when nothing is saved. */
export function getPlannerWeeks() {
  return readMap(KEYS.weeklyPlanner);
}

/** Rows for one week, or null when that week has never been saved. */
export function getPlannerWeek(weekKey) {
  const rows = getPlannerWeeks()[weekKey];

  if (!Array.isArray(rows)) return null;

  // A row with no id can't be keyed or edited, so it's treated as corrupt.
  return rows.filter((row) => row && typeof row === "object" && row.id);
}

export function savePlannerWeek(weekKey, rows) {
  try {
    const map = readMap(KEYS.weeklyPlanner);

    // An emptied week is removed rather than stored as [], so it falls back to
    // the empty state instead of looking like a saved-but-blank plan.
    if (Array.isArray(rows) && rows.length) map[weekKey] = rows;
    else delete map[weekKey];

    localStorage.setItem(KEYS.weeklyPlanner, JSON.stringify(map));
  } catch {
    // Quota or private mode — the session still works, it just won't persist.
  }
}
