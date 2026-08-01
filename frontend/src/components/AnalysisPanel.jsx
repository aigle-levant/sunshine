// src/components/AnalysisPanel.jsx
//
// The card grid on the results stage of voice mode. It renders the extracted
// fields read-only, or as inputs when the user is correcting them — the field
// list itself lives in components/voice/extraction.js so the two modes can't
// drift apart.

import { motion } from "framer-motion";

import useTheme from "../hooks/useTheme";
import { RESULT_FIELDS } from "./voice/extraction";

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

  const cardBase = `rounded-[2rem] border p-7 transition-colors duration-500 ${
    isLight
      ? "border-[#223843]/10 bg-[#DBD3D8]/45"
      : "border-white/10 bg-white/5"
  }`;

  const inputBase = `mt-3 w-full rounded-2xl border bg-transparent px-4 py-3 text-xl tracking-[-0.02em] outline-none transition-colors duration-300 focus:border-[#D77A61] ${
    isLight
      ? "border-[#223843]/15 placeholder:text-[#223843]/30"
      : "border-white/15 placeholder:text-[#EFF1F3]/30"
  }`;

  if (error) {
    return (
      <div className={`${cardBase} w-full`}>
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
    <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {RESULT_FIELDS.map((field, index) => {
        const raw = values?.[field.key] ?? "";

        const display = field.format ? field.format(raw) : raw;

        return (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cardBase}
          >
            <label
              htmlFor={`analysis-${field.key}`}
              className="text-sm font-semibold text-[#D77A61]"
            >
              {field.label}
            </label>

            {isLoading ? (
              <div
                className={`mt-5 h-7 w-3/4 animate-pulse rounded-full ${
                  isLight ? "bg-[#DBD3D8]" : "bg-white/10"
                }`}
              />
            ) : isEditing ? (
              <input
                id={`analysis-${field.key}`}
                type="text"
                inputMode={field.inputMode}
                value={raw}
                placeholder="Not mentioned"
                onChange={(event) => onChange?.(field.key, event.target.value)}
                className={inputBase}
              />
            ) : (
              <p
                className={`mt-4 text-[clamp(1.3rem,1.9vw,1.8rem)] leading-[1.4] tracking-[-0.02em] ${
                  display ? "" : placeholderText
                }`}
              >
                {display || "Not mentioned"}
              </p>
            )}
          </motion.div>
        );
      })}

      {/* Confidence — derived, and never editable. */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: RESULT_FIELDS.length * 0.06,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cardBase}
      >
        <p className="text-sm font-semibold text-[#D77A61]">Confidence</p>

        {isLoading ? (
          <div
            className={`mt-5 h-7 w-3/4 animate-pulse rounded-full ${
              isLight ? "bg-[#DBD3D8]" : "bg-white/10"
            }`}
          />
        ) : (
          <>
            <p className="mt-4 text-[clamp(1.3rem,1.9vw,1.8rem)] leading-[1.4] tracking-[-0.02em]">
              {confidence}%
            </p>

            <div
              className={`mt-4 h-1.5 w-full overflow-hidden rounded-full ${
                isLight ? "bg-[#223843]/10" : "bg-white/10"
              }`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-[#D77A61]"
              />
            </div>
          </>
        )}
      </motion.div>

      {/* Summary spans the row — it's the sentence version of everything above. */}
      {!isLoading && values?.summary && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: (RESULT_FIELDS.length + 1) * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`${cardBase} sm:col-span-2 lg:col-span-3`}
        >
          <p className="text-sm font-semibold text-[#D77A61]">Summary</p>

          <p className={`mt-4 text-lg leading-8 ${mutedText}`}>
            {values.summary}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default AnalysisPanel;
