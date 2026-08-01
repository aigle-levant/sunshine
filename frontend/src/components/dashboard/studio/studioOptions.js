// src/components/dashboard/studio/studioOptions.js
//
// The choices the generator form offers. Data only, so the selects and the
// service agree on one list and adding an option is a one-line change.

export const CONTENT_TYPES = [
  "Instagram Post",
  "Facebook Post",
  "Product Description",
  "Promotional Offer",
  "WhatsApp Marketing",
  "Email",
  "Blog",
  "Advertisement Copy",
];

export const TONES = [
  "Friendly",
  "Professional",
  "Luxury",
  "Funny",
  "Exciting",
  "Persuasive",
];

// The four the rest of the app already handles — the voice prompt understands
// this same set (see backend/prompt.js).
export const LANGUAGES = ["English", "Tamil", "Hindi", "Telugu"];

export const DEFAULTS = {
  contentType: CONTENT_TYPES[0],
  prompt: "",
  tone: TONES[0],
  language: LANGUAGES[0],
  targetAudience: "",
};

/** What the upload accepts, in one place: the input, the drop handler and the copy. */
export const IMAGE_TYPES = ["image/jpeg", "image/png"];

export const IMAGE_ACCEPT = ".jpg,.jpeg,.png";

/** Thumbnails go into localStorage with the history, so keep the source sane. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
