// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export async function analyzeTranscript(transcript) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript,
      }),
    });
  } catch {
    throw new Error(
      "Couldn't reach VoiceKart AI. Check that the backend is running.",
    );
  }

  const payload = await response.json();

  console.log("Claude returned:", payload);

  if (!response.ok) {
    throw new Error(payload.error || "Backend error");
  }

  return payload;
}