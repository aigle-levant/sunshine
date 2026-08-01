// src/components/AnalysisPanel.jsx
//
// What the assistant understood, as the label → value table the landing page
// promises (see home/Solution.jsx). One card, one row per field, so the shape
// of the result is the same thing the user was shown before they spoke.
//
// The field list lives in components/voice/extraction.js so the read-only and
// editing modes can't drift apart.

import { motion } from "framer-motion";

import useTheme from "../hooks/useTheme";
import { RESULT_FIELDS } from "./voice/extraction";

const EASE = [0.22, 1, 0.36, 1];

function AnalysisPanel({
  values,
  isEditing = false,
  onChange,
  isLoading = false,
  error = null,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  if (!values && !isLoading && !error) return null;

  const mutedText = isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70";

  const placeholderText = isLight ? "text-[#223843]/35" : "text-[#EFF1F3]/35";

  const cardBase = `w-full max-w-3xl rounded-[2rem] border p-8 transition-colors duration-500 sm:p-10 ${
    isLight
      ? "border-[#223843]/10 bg-[#DBD3D8]/45"
      : "border-white/10 bg-white/5"
  }`;

  const divider = "h-px bg-current/10";

  if (error) {
    return (
      <div className={cardBase}>
        <p className="text-sm font-semibold text-[#D77A61]">Couldn't process</p>

        <p className={`mt-4 text-lg leading-8 ${mutedText}`}>
          {typeof error === "string"
            ? error
            : "Something went wrong while understanding your recording. Please try speaking again."}
        </p>
      </div>
    );
  }

  const confidence = Number(values?.confidence ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cardBase}
    >
      <p className="text-sm font-semibold text-[#D77A61]">
        VoiceKart AI understands
      </p>

      <dl className={`mt-6 flex flex-col gap-1 ${mutedText}`}>
        {RESULT_FIELDS.map((field, index) => {
          const raw = values?.[field.key] ?? "";

          const display = field.format ? field.format(raw) : raw;

          const inputId = `analysis-${field.key}`;

          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.05 * index, ease: EASE }}
              className="flex items-center justify-between gap-6 py-2"
            >
              <dt className="shrink-0 text-base">
                <label htmlFor={isEditing ? inputId : undefined}>
                  {field.label}
                </label>
              </dt>

              <dd className="min-w-0 flex-1 text-right">
                {isLoading ? (
                  <span
                    className={`ml-auto block h-5 w-28 animate-pulse rounded-full ${
                      isLight ? "bg-[#223843]/12" : "bg-white/12"
                    }`}
                  />
                ) : isEditing ? (
                  // Right-aligned so the column doesn't jump when editing starts.
                  <input
                    id={inputId}
                    type="text"
                    inputMode={field.inputMode}
                    value={raw}
                    placeholder="Not mentioned"
                    onChange={(event) => onChange?.(field.key, event.target.value)}
                    className={`w-full rounded-xl border bg-transparent px-3 py-1.5 text-right text-base outline-none transition-colors duration-300 focus:border-[#D77A61] ${
                      isLight
                        ? "border-[#223843]/15 placeholder:text-[#223843]/30"
                        : "border-white/15 placeholder:text-[#EFF1F3]/30"
                    }`}
                  />
                ) : (
                  <span
                    className={`block truncate text-base ${
                      display ? "" : placeholderText
                    }`}
                  >
                    {display || "Not mentioned"}
                  </span>
                )}
              </dd>
            </motion.div>
          );
        })}
      </dl>

      <div className={`my-7 ${divider}`} />

      {/* Confidence — derived from how much came back filled in, never editable. */}
      <div className="flex items-center justify-between gap-6">
        <p className={`text-base ${mutedText}`}>Confidence</p>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
          <div
            className={`h-1.5 w-full max-w-[180px] overflow-hidden rounded-full ${
              isLight ? "bg-[#223843]/10" : "bg-white/10"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isLoading ? 0 : `${confidence}%` }}
              transition={{ duration: 0.9, ease: EASE }}
              className="h-full rounded-full bg-[#D77A61]"
            />
          </div>

          <span className={`shrink-0 text-base tabular-nums ${mutedText}`}>
            {isLoading ? "—" : `${confidence}%`}
          </span>
        </div>
      </div>

      {!isLoading && values?.summary && (
        <>
          <div className={`my-7 ${divider}`} />

          <p className="text-sm font-semibold text-[#D77A61]">Summary</p>

          <p className={`mt-3 text-base leading-8 ${mutedText}`}>
            {values.summary}
          </p>
        </>
      )}
    </motion.div>
  );
}

export default AnalysisPanel;
