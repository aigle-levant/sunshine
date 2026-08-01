import { supabase } from "../lib/supabase.js";
import { getInstagramContext, saveInstagramContext } from "../lib/storage.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function analyzeInstagram(username) {
  const response = await fetch(`${API_URL}/api/instagram`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to analyze Instagram profile");
  }

  return response.json();
}

export async function saveInstagramAnalysis(userId, username, profile, brandContext) {
  const { error } = await supabase
    .from("social_accounts")
    .insert([
      {
        user_id: userId,
        username: username.replace("@", ""),
        profile: profile,
        brand_context: brandContext,
      },
    ]);

  if (error) {
    saveInstagramContext({
      user_id: userId,
      username: username.replace("@", ""),
      profile,
      brand_context: brandContext,
    });
    return;
  }
}

/** The most recent Brand Integration analysis, however it was persisted. */
export async function getLatestInstagramAnalysis(userId) {
  const { data, error } = await supabase
    .from("social_accounts")
    .select("profile, brand_context")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    const local = getInstagramContext();
    const last = local.length ? local[local.length - 1] : null;

    return last ? { profile: last.profile ?? null, brandContext: last.brand_context ?? null } : null;
  }

  return { profile: data?.profile ?? null, brandContext: data?.brand_context ?? null };
}

