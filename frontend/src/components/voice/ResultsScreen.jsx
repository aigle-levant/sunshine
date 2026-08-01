// src/components/voice/ResultsScreen.jsx
//
// Stage 3 of voice mode: what the assistant understood, with a chance to
// correct it before saving.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Home, Pencil, RotateCcw, X } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import AnalysisPanel from "../AnalysisPanel";
import ContinueButton from "../ContinueButton";
import VoiceOverlay from "./VoiceOverlay";
import { SCRIPT_LABELS, detectScript, scriptFontStyle } from "./language";

function ResultsScreen({
  extraction,
  error = null,
  onSave,
  onRetry,
  onExit,
  transcript = "",
  retryLabel = "Speak again",
}) {
  const { theme } = useTheme();

  const [values, setValues] = useState(extraction ?? {});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isLight = theme === "light";

  const mutedText = isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60";

  const spokenScript = detectScript(transcript);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulated write — long enough to read as work, short enough to feel snappy.
    await new Promise((resolve) => setTimeout(resolve, 900));

    onSave?.(values);

    setIsSaving(false);
    setIsSaved(true);
  };

  return (
    <VoiceOverlay labelledBy="voice-results-title">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onExit}
          aria-label="Close voice mode"
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${
            isLight
              ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
              : "border-white/15 hover:bg-white/10"
          }`}
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          {isSaved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-8 py-16 text-center"
            >
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 16,
                  delay: 0.1,
                }}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-[#D77A61] text-[#EFF1F3] shadow-[0_20px_60px_-15px_rgba(215,122,97,0.75)]"
              >
                <CheckCircle2 size={40} strokeWidth={1.6} />
              </motion.span>

              <div>
                <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.045em]">
                  Business updated
                  <br />
                  <span className="font-normal italic">successfully.</span>
                </h2>

                <p className={`mt-6 text-lg leading-8 ${mutedText}`}>
                  Everything you said is now part of your records.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <ContinueButton
                  onClick={onRetry}
                  label={retryLabel}
                  variant="accent"
                  icon={RotateCcw}
                />

                <ContinueButton
                  onClick={onExit}
                  label="Back to Home"
                  variant="ghost"
                  icon={Home}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]">
                {error ? "I need another try" : "Analysis complete"}
              </p>

              <h2
                id="voice-results-title"
                className="mt-5 max-w-[820px] text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[0.98] tracking-[-0.05em]"
              >
                {error ? (
                  <>
                    I couldn't quite
                    <br />
                    <span className="font-normal italic">catch that.</span>
                  </>
                ) : (
                  <>
                    Here's what I
                    <br />
                    <span className="font-normal italic">understood.</span>
                  </>
                )}
              </h2>

              {/* The spoken words are kept verbatim; only the labels around
                  them are English. */}
              {transcript && (
                <div
                  className={`mt-8 max-w-3xl rounded-[2rem] border p-6 sm:p-7 ${
                    isLight
                      ? "border-[#223843]/10 bg-[#DBD3D8]/45"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-[#D77A61]">
                      You said
                    </p>

                    {spokenScript && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isLight
                            ? "bg-[#223843]/8 text-[#223843]/60"
                            : "bg-white/10 text-[#EFF1F3]/60"
                        }`}
                      >
                        {SCRIPT_LABELS[spokenScript]}
                      </span>
                    )}
                  </div>

                  <p
                    style={scriptFontStyle(transcript)}
                    className={`mt-4 text-lg leading-9 ${mutedText}`}
                  >
                    “{transcript}”
                  </p>
                </div>
              )}

              <div className="mt-12">
                <AnalysisPanel
                  values={error ? undefined : values}
                  isEditing={isEditing}
                  onChange={handleChange}
                  error={error}
                />
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-end gap-4">
                {error ? (
                  <>
                    <ContinueButton
                      onClick={onExit}
                      label="Back to Home"
                      variant="ghost"
                      icon={Home}
                    />

                    <ContinueButton
                      onClick={onRetry}
                      label="Try again"
                      variant="accent"
                      icon={RotateCcw}
                    />
                  </>
                ) : (
                  <>
                    <ContinueButton
                      onClick={() => setIsEditing((editing) => !editing)}
                      label={isEditing ? "Done editing" : "Edit"}
                      variant="ghost"
                      icon={isEditing ? Check : Pencil}
                      disabled={isSaving}
                    />

                    <ContinueButton
                      onClick={handleSave}
                      label="Confirm & Save"
                      loadingLabel="Saving…"
                      isLoading={isSaving}
                      variant="accent"
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </VoiceOverlay>
  );
}

export default ResultsScreen;
