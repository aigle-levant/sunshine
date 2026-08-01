// src/components/voice/VoiceRecordingScreen.jsx
//
// Stage 1 of voice mode: a full-screen listening experience. The capture copy
// follows the language being spoken; everything downstream stays in English.

import { motion } from "framer-motion";
import { Mic, Square, X } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import ListeningPanel from "../ListeningPanel";
import VoiceOverlay from "./VoiceOverlay";
import Waveform from "./Waveform";
import {
  ENGLISH,
  TAMIL,
  copyFor,
  getLanguage,
  scriptFontStyle,
} from "./language";

const RINGS = [0, 0.55, 1.1];

function VoiceRecordingScreen({
  transcript = "",
  isListening = false,
  error = null,
  language = ENGLISH,
  onStop,
  onCancel,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const copy = copyFor(language);

  const mutedText = isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60";

  return (
    <VoiceOverlay labelledBy="voice-listening-title">
      <div className="flex items-center justify-between gap-4">
        {/* Language is locked once the recogniser is running. */}
        <span
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            isLight
              ? "border-[#223843]/15 text-[#223843]/70"
              : "border-white/15 text-[#EFF1F3]/70"
          }`}
        >
          {getLanguage(language).label}
        </span>

        <button
          type="button"
          onClick={onCancel}
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

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 py-6 text-center">
        {/* Microphone with pulsing rings */}
        <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
          {isListening &&
            RINGS.map((delay) => (
              <motion.span
                key={delay}
                aria-hidden="true"
                initial={{ scale: 0.6, opacity: 0.5 }}
                animate={{ scale: 1.75, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute h-24 w-24 rounded-full bg-[#D77A61]/35 sm:h-28 sm:w-28"
              />
            ))}

          <motion.div
            animate={isListening ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#D77A61] text-[#EFF1F3] shadow-[0_20px_60px_-15px_rgba(215,122,97,0.75)] sm:h-28 sm:w-28"
          >
            <Mic size={34} strokeWidth={1.6} />
          </motion.div>
        </div>

        <div>
          <h1
            id="voice-listening-title"
            lang={language}
            style={scriptFontStyle(copy.headline)}
            className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.05em]"
          >
            {copy.headline}
            <span className="font-normal italic">…</span>
          </h1>

          <p
            lang={error ? undefined : language}
            style={error ? undefined : scriptFontStyle(copy.subtitle)}
            className={`mt-5 text-lg leading-8 ${mutedText}`}
          >
            {error ?? copy.subtitle}
          </p>

          {/* The English gloss keeps the screen readable either way. */}
          {language === TAMIL && !error && (
            <p className={`mt-2 text-sm ${mutedText}`}>
              Speak anything — I'm listening…
            </p>
          )}
        </div>

        <Waveform active={isListening} />

        <ListeningPanel
          isRecording={isListening}
          transcript={transcript}
          language={language}
        />
      </div>

      {/* Stop */}
      <div className="flex justify-center pb-4 pt-8">
        <motion.button
          type="button"
          onClick={onStop}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          lang={language}
          style={scriptFontStyle(copy.stop)}
          className="flex items-center gap-4 rounded-full bg-[#D77A61] px-10 py-5 text-lg font-semibold text-[#EFF1F3] shadow-[0_18px_45px_-18px_rgba(215,122,97,0.9)] transition-colors duration-300 hover:bg-[#C96B53]"
        >
          <Square size={16} strokeWidth={2.4} fill="currentColor" />
          {copy.stop}
        </motion.button>
      </div>
    </VoiceOverlay>
  );
}

export default VoiceRecordingScreen;
