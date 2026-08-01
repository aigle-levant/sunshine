// src/components/voice/language.js
//
// Language handling for voice mode. Tamil is the primary language, English is
// the secondary; the transcript is always sent onward in whatever was spoken —
// nothing here translates anything.

export const TAMIL = "ta-IN";
export const ENGLISH = "en-IN";

const STORAGE_KEY = "voicekart:language";

export const LANGUAGES = [
  { code: TAMIL, label: "தமிழ்", englishLabel: "Tamil" },
  { code: ENGLISH, label: "English", englishLabel: "English" },
];

/**
 * The Web Speech API's `lang` takes a single BCP-47 tag, and no shipping
 * browser exposes automatic language detection — so in practice the toggle is
 * always what users get. This probe is the one place to flip if that changes.
 */
export function supportsAutoDetect() {
  if (typeof window === "undefined") return false;

  const Recognition =
    window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;

  return Boolean(
    Recognition && "autoDetectLanguage" in (Recognition.prototype ?? {}),
  );
}

export function getLanguage(code) {
  return LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];
}

export function loadLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (LANGUAGES.some((language) => language.code === stored)) return stored;
  } catch {
    // Private mode — fall through to the default.
  }

  return TAMIL;
}

export function saveLanguage(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Not worth breaking the flow over.
  }
}

// Unicode property escapes keep this readable in ASCII and immune to any
// re-encoding of this file.
const TAMIL_SCRIPT = /\p{Script=Tamil}/u;
const LATIN_SCRIPT = /[A-Za-z]/;

/**
 * What was actually spoken, read off the transcript rather than off the toggle
 * — a Tamil recogniser happily returns Latin words for code-mixed speech.
 */
export function detectScript(text) {
  if (!text) return null;

  const hasTamil = TAMIL_SCRIPT.test(text);
  const hasLatin = LATIN_SCRIPT.test(text);

  if (hasTamil && hasLatin) return "mixed";
  if (hasTamil) return "tamil";
  if (hasLatin) return "latin";

  return null;
}

export const SCRIPT_LABELS = {
  tamil: "Tamil",
  latin: "English",
  mixed: "Tamil + English",
};

/**
 * Browsers do fall back automatically for Tamil glyphs, but the result is often
 * a poor face. Naming real system Tamil fonts costs nothing and looks far
 * better; applied only to text that actually contains Tamil.
 */
const TAMIL_FONT_STACK =
  '"Noto Sans Tamil", "Nirmala UI", "Latha", "Tamil Sangam MN", ui-sans-serif, system-ui, sans-serif';

export function scriptFontStyle(text) {
  const script = detectScript(text);

  return script === "tamil" || script === "mixed"
    ? { fontFamily: TAMIL_FONT_STACK }
    : undefined;
}

/**
 * Listening-stage copy in the language being spoken. Results stay in English
 * labels — only the capture experience follows the speaker.
 */
export const COPY = {
  [TAMIL]: {
    headline: "எதையும் பேசுங்கள்",
    subtitle: "நான் கேட்டுக்கொண்டிருக்கிறேன்…",
    placeholder: "பேசத் தொடங்குங்கள், உங்கள் வார்த்தைகள் இங்கே தோன்றும்…",
    stop: "பதிவை நிறுத்து",
    liveTranscript: "நேரடி பதிவு",
    processing: "உங்கள் கோரிக்கையைப் புரிந்துகொள்கிறேன்…",
    or: "அல்லது",
    typePlaceholder: "நடந்ததை இங்கே தட்டச்சு செய்யுங்கள்…",
    send: "அனுப்பு",
  },
  [ENGLISH]: {
    headline: "Speak anything",
    subtitle: "I'm listening…",
    placeholder: "Start speaking to see your words appear here…",
    stop: "Stop Recording",
    liveTranscript: "Live transcript",
    processing: "Understanding your request…",
    or: "or",
    typePlaceholder: "Type what happened in your business…",
    send: "Send",
  },
};

export function copyFor(code) {
  return COPY[code] ?? COPY[ENGLISH];
}
