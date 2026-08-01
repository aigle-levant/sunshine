// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/**
 * Sends a transcript to the backend, which passes it to Claude and returns
 * structured business data: { summary, customers, orders, payments, tasks, insights }
 */
export async function analyzeTranscript(transcript) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
  } catch {
    throw new Error(
      "Couldn't reach VoiceKart AI. Check that the backend is running.",
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.error ?? "Couldn't understand that recording. Please try again.",
    );
  }

  return payload.data;
}
