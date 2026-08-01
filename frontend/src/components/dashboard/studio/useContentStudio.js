// src/components/dashboard/studio/useContentStudio.js
//
// All of the studio's state in one place: the form, the uploaded image, the
// in-flight request, the result and the history. The page below it only renders.
//
// Every call goes through services/contentStudio.js, so when the backend lands
// nothing in this file changes.

import { useCallback, useEffect, useRef, useState } from "react";

import {
  deleteHistory,
  generateContent,
  getHistory,
  saveDraft,
} from "../../../services/contentStudio";
import { getPlannerWeek, savePlannerWeek } from "../../../lib/storage";
import {
  DAYS,
  dateForDay,
  normaliseRow,
  sortRows,
  startOfWeek,
  toKey,
} from "../../planner/plannerModel";
import { inspectImage } from "./imageInsights";
import { DEFAULTS, IMAGE_TYPES, MAX_IMAGE_BYTES } from "./studioOptions";

/** The planner only knows Instagram and WhatsApp; everything else defaults to Instagram. */
function platformForContentType(contentType) {
  return /whats\s*app/i.test(String(contentType ?? "")) ? "WhatsApp" : "Instagram";
}

export default function useContentStudio(seed) {
  const [form, setForm] = useState(() => ({ ...DEFAULTS, ...seed }));
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [addedToPlannerId, setAddedToPlannerId] = useState(null);

  // Object URLs outlive the state that referenced them unless revoked, and the
  // ref means the cleanup below doesn't need `image` as a dependency.
  const previewUrlRef = useRef(null);

  // Guards against a second submit racing the first — the button is disabled
  // while generating, but Enter in a field or a double click shouldn't get past
  // it either.
  const inFlightRef = useRef(false);

  useEffect(() => {
    let active = true;

    getHistory()
      .then((entries) => {
        if (active) setHistory(entries);
      })
      // TODO(backend): surface this once history comes from an API that can fail.
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const setField = useCallback((key) => {
    return (value) => setForm((current) => ({ ...current, [key]: value }));
  }, []);

  const clearImage = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setImage(null);
    setImageError("");
  }, []);

  const selectImage = useCallback(
    async (file) => {
      setImageError("");

      if (!IMAGE_TYPES.includes(file.type)) {
        setImageError("That file isn't a JPG or PNG.");
        return;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        setImageError(
          `That image is larger than ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB.`,
        );
        return;
      }

      try {
        const inspected = await inspectImage(file);

        // Replacing: let go of the previous preview before adopting the new one.
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

        previewUrlRef.current = inspected.previewUrl;

        setImage({ ...inspected, size: file.size, file });
      } catch (err) {
        setImageError(err.message || "That image couldn't be read.");
      }
    },
    [],
  );

  const generate = useCallback(async () => {
    if (inFlightRef.current) return;

    if (!form.prompt.trim()) {
      setError("Describe what you'd like to create first.");
      return;
    }

    inFlightRef.current = true;
    setError("");
    setSavedId(null);
    setAddedToPlannerId(null);
    setIsGenerating(true);

    try {
      const content = await generateContent({ ...form, image: image?.file ?? null });

      setResult(content);
    } catch (err) {
      setError(err.message || "Couldn't generate that. Try again.");
    } finally {
      setIsGenerating(false);
      inFlightRef.current = false;
    }
  }, [form, image]);

  const save = useCallback(async () => {
    if (!result || isSaving) return;

    setIsSaving(true);

    try {
      const entry = await saveDraft(result, { thumbnail: image?.thumbnail ?? null });

      setHistory((current) => [entry, ...current.filter((item) => item.id !== entry.id)]);
      setSavedId(entry.id);
    } catch (err) {
      setError(err.message || "Couldn't save that draft.");
    } finally {
      setIsSaving(false);
    }
  }, [image, isSaving, result]);

  /** Drops the current result into today's slot on the current week of the Weekly Planner. */
  const addToPlanner = useCallback(() => {
    if (!result) return null;

    const weekStart = startOfWeek(new Date());
    const weekKey = toKey(weekStart);
    const day = DAYS[(new Date().getDay() + 6) % 7];
    const platform = platformForContentType(result.contentType);

    const caption = [
      result.caption,
      result.hashtags?.length ? result.hashtags.map((tag) => `#${tag}`).join(" ") : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const row = normaliseRow(
      {
        day,
        date: dateForDay(weekStart, day),
        platform,
        contentType: result.contentType,
        title: result.title,
        caption,
        // Not image.previewUrl: that's an object URL revoked once the studio's
        // image changes or unmounts, so it wouldn't survive into the planner.
        mediaType: image ? "image" : "none",
        mediaUrl: "",
      },
      weekStart,
    );

    savePlannerWeek(weekKey, sortRows([...(getPlannerWeek(weekKey) ?? []), row]));
    setAddedToPlannerId(result.id);

    return row;
  }, [image, result]);

  const removeFromHistory = useCallback(async (id) => {
    // Removed straight away, then confirmed — the list shouldn't wait on a
    // round trip to react to a delete.
    setHistory((current) => current.filter((entry) => entry.id !== id));

    await deleteHistory(id).catch(() => {});
  }, []);

  /** Opening a saved draft puts it back in the result card. */
  const openFromHistory = useCallback((entry) => {
    setError("");
    setSavedId(entry.id);
    setAddedToPlannerId(null);
    setResult({
      id: entry.id,
      title: entry.title,
      caption: entry.caption ?? "",
      hashtags: entry.hashtags ?? [],
      cta: entry.cta ?? "",
      contentType: entry.contentType,
      createdAt: entry.createdAt,
      isPreview: false,
    });

    setForm((current) => ({ ...current, contentType: entry.contentType ?? current.contentType }));
  }, []);

  return {
    form,
    setField,
    image,
    imageError,
    selectImage,
    clearImage,
    result,
    isGenerating,
    error,
    generate,
    save,
    isSaving,
    savedId,
    addToPlanner,
    addedToPlannerId,
    history,
    removeFromHistory,
    openFromHistory,
  };
}
