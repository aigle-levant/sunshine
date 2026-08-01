import { supabase } from "../lib/supabase.js";
import { saveInstagramContext } from "../lib/storage.js";

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

