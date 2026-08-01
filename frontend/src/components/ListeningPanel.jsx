// src/components/ListeningPanel.jsx
//
// The live transcript panel shown inside the immersive listening screen.
// Words render as they arrive from the Web Speech API, in whatever script was
// spoken — Tamil, English, or a mix of both.

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import useTheme from "../hooks/useTheme";
import {
  ENGLISH,
  SCRIPT_LABELS,
  copyFor,
  detectScript,
  scriptFontStyle,
} from "./voice/language";

function ListeningPanel({
  isRecording = false,
  transcript = "",
  language = ENGLISH,
}) {
  const { theme } = useTheme();

  const scrollRef = useRef(null);

  const isLight = theme === "light";

  // Long dictation should keep the newest words in view.
  useEffect(() => {
    const node = scrollRef.current;

    if (node) node.scrollTop = node.scrollHeight;
  }, [transcript]);

  if (!isRecording && !transcript) return null;

  const copy = copyFor(language);

  const hasWords = Boolean(transcript.trim());

  const spokenScript = detectScript(transcript);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`w-full rounded-[2rem] border p-7 backdrop-blur-sm sm:p-9 ${
        isLight
          ? "border-[#223843]/10 bg-[#DBD3D8]/45"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            {isRecording && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D77A61] opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                isRecording ? "bg-[#D77A61]" : "bg-[#D8B4A0]"
              }`}
            />
          </span>

          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D77A61]"
            style={scriptFontStyle(copy.liveTranscript)}
          >
            {copy.liveTranscript}
          </p>
        </div>

        {/* What we actually heard, not what the toggle says. */}
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

      <div ref={scrollRef} className="mt-5 max-h-44 overflow-y-auto">
        <p
          aria-live="polite"
          lang={hasWords ? undefined : language}
          style={scriptFontStyle(hasWords ? transcript : copy.placeholder)}
          className={`text-[clamp(1.15rem,2.1vw,1.75rem)] leading-[1.55] tracking-[-0.01em] ${
            hasWords
              ? ""
              : isLight
                ? "italic text-[#223843]/40"
                : "italic text-[#EFF1F3]/40"
          }`}
        >
          {hasWords ? transcript : copy.placeholder}

          {/* Caret keeps the panel alive between phrases. */}
          {isRecording && (
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="ml-1 inline-block h-[1em] w-0.5 translate-y-[0.12em] rounded-full bg-[#D77A61] align-middle"
            />
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default ListeningPanel;
