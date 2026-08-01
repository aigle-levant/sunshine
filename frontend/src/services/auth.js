import { supabase } from "../lib/supabase";
import demoUser from "../constants/demoUser";
import { saveBusinessAnalysis, getBusinessAnalysis } from "../lib/storage";

// Auth is temporarily disabled for the hackathon build — every call resolves
// to the demo user instead of hitting Supabase Auth. Restore the original
// supabase.auth.* implementations to bring real login/signup back.

export async function signUp() {
  return demoUser;
}

export async function signInWithPassword() {
  return demoUser;
}

export async function signOut() {
  return;
}

export async function getCurrentUser() {
  return demoUser;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId ?? demoUser.id)
    .single();

  if (error) return null;
  return data;
}

export async function saveAnalysis(userId, analysisData) {
  const { data, error } = await supabase.from("business_analysis").insert([
    {
      user_id: userId ?? demoUser.id,
      analysis: analysisData,
    },
  ]);

  if (error) {
    saveBusinessAnalysis(analysisData);
    return null;
  }

  return data;
}

export async function getLatestAnalysis(userId) {
  const { data, error } = await supabase
    .from("business_analysis")
    .select("*")
    .eq("user_id", userId ?? demoUser.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    const local = getBusinessAnalysis();
    return local.length ? local[local.length - 1] : null;
  }

  return data || null;
}

export async function getAnalysisHistory(userId, limit = 20) {
  const { data, error } = await supabase
    .from("business_analysis")
    .select("*")
    .eq("user_id", userId ?? demoUser.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return getBusinessAnalysis().slice(-limit).reverse();
  }

  return data || [];
}
