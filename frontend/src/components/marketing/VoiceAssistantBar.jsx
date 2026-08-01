// src/components/marketing/VoiceAssistantBar.jsx
//
// The bottom of the Marketing page: where planning content will eventually work
// the same way recording an order already does — by saying it.
//
// Interface only. The button has a real pressed state so the interaction can be
// shown, and says plainly that nothing is listening yet; when this is wired up
// it'll go through the same hooks /speak uses (useSpeechTranscript → /api/process).

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import Panel from "../dashboard/Panel";
import { scriptFontStyle } from "../voice/language";

const EXAMPLES = [
  "Post a photo of today's batch on WhatsApp.",
  "வெள்ளிக்கிழமை சேலை பற்றி ஒரு வீடியோ போடுங்கள்.",
  "Plan three stories for this week.",
];

function VoiceAssistantBar({ delay = 0 }) {
  const { theme } = useTheme();

  const [isArmed, setIsArmed] = useState(false);

  const isLight = theme === "light";

  return (
    <Panel
      eyebrow="Voice assistant"
      title="Plan your content by speaking"
      delay={delay}
    >
      <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-9">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <AnimatePresence>
            {isArmed && (
              <>
                {[0, 0.6].map((offset) => (
                  <motion.span
                    key={offset}
                    aria-hidden="true"
                    initial={{ scale: 0.85, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      delay: offset,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute h-20 w-20 rounded-full bg-[#D77A61]/35"
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={() => setIsArmed((current) => !current)}
            aria-pressed={isArmed}
            aria-label={
              isArmed ? "Stop the voice assistant preview" : "Start the voice assistant preview"
            }
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full text-[#EFF1F3] shadow-lg transition-colors duration-300 ${
              isArmed ? "bg-[#C96B53]" : "bg-[#D77A61] hover:bg-[#C96B53]"
            }`}
          >
            {isArmed ? (
              <Square size={24} strokeWidth={2} />
            ) : (
              <Mic size={28} strokeWidth={1.9} />
            )}
          </motion.button>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[17px] font-medium leading-7 tracking-[-0.02em]">
            {isArmed
              ? "This is where the assistant will listen."
              : "Say what you want to post, and it lands on the calendar."}
          </p>

          <p
            className={`mt-2.5 text-[13.5px] leading-7 ${
              isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
            }`}
          >
            Tamil, Tanglish or English — the same way orders and payments are
            already recorded.
          </p>

          <ul className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
            {EXAMPLES.map((example) => (
              <li
                key={example}
                style={scriptFontStyle(example)}
                className={`rounded-full border px-3.5 py-2 text-[12.5px] leading-5 ${
                  isLight
                    ? "border-[#223843]/12 text-[#223843]/60"
                    : "border-white/12 text-[#EFF1F3]/60"
                }`}
              >
                “{example}”
              </li>
            ))}
          </ul>

          <p
            className={`mt-5 text-[12px] leading-6 ${
              isLight ? "text-[#223843]/45" : "text-[#EFF1F3]/45"
            }`}
          >
            Preview only — the microphone isn’t connected on this page yet. To
            record a real update, use Speak.
          </p>
        </div>
      </div>
    </Panel>
  );
}

export default VoiceAssistantBar;
