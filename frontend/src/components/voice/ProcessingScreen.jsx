// src/components/voice/ProcessingScreen.jsx
//
// Stage 2 of voice mode: the pause while the transcript is being understood.

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import VoiceOverlay from "./VoiceOverlay";
import { ENGLISH, TAMIL, copyFor, scriptFontStyle } from "./language";

function ProcessingScreen({ transcript = "", language = ENGLISH }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const copy = copyFor(language);

  const mutedText = isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60";

  return (
    <VoiceOverlay labelledBy="voice-processing-title">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-10 text-center">
        {/* Spinner */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          <motion.span
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute h-32 w-32 rounded-full border-2 border-transparent border-t-[#D77A61] border-r-[#D77A61]/40"
          />

          <motion.span
            aria-hidden="true"
            animate={{ rotate: -360 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
            className="absolute h-24 w-24 rounded-full border-2 border-transparent border-b-[#D8B4A0]"
          />

          <motion.span
            animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#D77A61]"
          >
            <Sparkles size={30} strokeWidth={1.6} />
          </motion.span>
        </div>

        <div>
          <h1
            id="voice-processing-title"
            lang={language}
            style={scriptFontStyle(copy.processing)}
            className="text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.15] tracking-[-0.045em]"
          >
            {language === TAMIL ? (
              copy.processing
            ) : (
              <>
                Understanding your
                <br />
                <span className="font-normal italic">request…</span>
              </>
            )}
          </h1>

          {/* Echoed back exactly as spoken or typed — nothing is translated. */}
          {transcript && (
            <p
              style={scriptFontStyle(transcript)}
              className={`mx-auto mt-6 max-w-lg text-base leading-8 ${mutedText}`}
            >
              “{transcript}”
            </p>
          )}
        </div>

        {/* Indeterminate progress */}
        <div
          className={`h-1 w-full max-w-sm overflow-hidden rounded-full ${
            isLight ? "bg-[#223843]/10" : "bg-white/10"
          }`}
        >
          <motion.div
            animate={{ x: ["-100%", "260%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-2/5 rounded-full bg-[#D77A61]"
          />
        </div>
      </div>
    </VoiceOverlay>
  );
}

export default ProcessingScreen;
