// src/components/dashboard/studio/imageInsights.js
//
// What we can learn from an uploaded image in the browser, plus a thumbnail
// small enough to store with the history.
//
// The dominant colours and the marketing angle are really computed from the
// pixels — no vision model needed for either. "Detected product" genuinely can't
// be known without one, so it's the single mocked value here and the card says
// so.

/** Sampling grid for colour counting. Small on purpose: it's a histogram. */
const SAMPLE_SIZE = 48;

const THUMBNAIL_SIZE = 96;

/** Quantise to 32-step buckets so near-identical shades count as one colour. */
const BUCKET = 32;

function toHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That image couldn't be read."));
    image.src = url;
  });
}

function drawTo(image, size) {
  const canvas = document.createElement("canvas");

  // Keep the aspect ratio: a squashed thumbnail looks worse than a cropped one.
  const scale = Math.min(size / image.width, size / image.height);

  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return { canvas, context };
}

/** The most common colours, most frequent first, near-duplicates collapsed. */
function dominantColors(image, count = 4) {
  const { canvas, context } = drawTo(image, SAMPLE_SIZE);

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

  const buckets = new Map();

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 128) continue;

    const key = [0, 1, 2]
      .map((offset) => Math.round(data[index + offset] / BUCKET) * BUCKET)
      .map((value) => Math.min(255, value))
      .join(",");

    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const ranked = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.split(",").map(Number));

  const picked = [];

  for (const [r, g, b] of ranked) {
    // Skip a shade that's visually the same as one already picked, so the swatch
    // row shows four different colours rather than four greys.
    const tooClose = picked.some(
      ([pr, pg, pb]) =>
        Math.abs(pr - r) + Math.abs(pg - g) + Math.abs(pb - b) < BUCKET * 2,
    );

    if (tooClose) continue;

    picked.push([r, g, b]);

    if (picked.length === count) break;
  }

  return picked.map(([r, g, b]) => toHex(r, g, b));
}

/**
 * An angle argued from the palette: how warm it is and how bright. Rough, but
 * it's reading the actual image rather than guessing.
 */
function marketingAngle(colors) {
  if (!colors.length) return "Lead with the product and keep the caption short.";

  const rgb = colors.map((hex) => [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ]);

  const average = (index) =>
    rgb.reduce((total, channel) => total + channel[index], 0) / rgb.length;

  const warmth = average(0) - average(2);

  const brightness = (average(0) + average(1) + average(2)) / 3;

  const isWarm = warmth > 12;
  const isBright = brightness > 128;

  if (isWarm && isBright) {
    return "Warm and sunlit — lead with a making-of shot and a friendly caption about the hands behind it.";
  }

  if (isWarm) {
    return "Rich, traditional tones — lean into heritage and craft, and name the technique.";
  }

  if (isBright) {
    return "Clean and airy — give the product space, keep the copy to one line and let the photo carry it.";
  }

  return "Moody and premium — one hero shot, short copy, and a single clear call to action.";
}

// Mocked, and the only mocked value here: naming the product needs a vision
// model. Chosen by file size so the same image always reports the same guess
// instead of changing on every upload.
// TODO(backend): replace with the label returned by the generate route once it
// accepts the image.
const PRODUCT_GUESSES = [
  "Woven textile / saree",
  "Packaged food item",
  "Handmade home decor",
  "Apparel / readymade garment",
  "Jewellery or accessory",
];

function detectedProduct(file) {
  return PRODUCT_GUESSES[(file?.size ?? 0) % PRODUCT_GUESSES.length];
}

/**
 * Everything the Image Intelligence card needs. The caller owns `previewUrl` and
 * must revoke it when the image is replaced or removed.
 */
export async function inspectImage(file) {
  const previewUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(previewUrl);

    const { canvas } = drawTo(image, THUMBNAIL_SIZE);

    const colors = dominantColors(image);

    return {
      previewUrl,
      name: file.name,
      width: image.naturalWidth,
      height: image.naturalHeight,
      colors,
      marketingAngle: marketingAngle(colors),
      detectedProduct: detectedProduct(file),
      // JPEG at 0.7 keeps a 96px thumbnail in the low kilobytes, which matters
      // because the history it's saved with lives in localStorage.
      thumbnail: canvas.toDataURL("image/jpeg", 0.7),
    };
  } catch (error) {
    URL.revokeObjectURL(previewUrl);

    throw error;
  }
}
