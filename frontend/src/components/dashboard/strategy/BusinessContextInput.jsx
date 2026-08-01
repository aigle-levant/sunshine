// src/components/dashboard/strategy/BusinessContextInput.jsx
//
// Section 3 — the owner picks one of two mutually exclusive starting points:
// guide the AI with free-form context, or let it decide everything from the
// business summary and brand analysis already on hand. Picking a card is what
// drives generation; the textarea only ever appears once "Add Business
// Context" is chosen.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileEdit, Sparkles } from "lucide-react";

import useTheme from "../../../hooks/useTheme";

const MODE = {
  CONTEXT: "context",
  AI: "ai",
};

function BusinessContextInput({ value, onChange, onGenerateWithContext, onGenerateAuto, generating = false }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [mode, setMode] = useState(null);

  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";
  const textareaBg = isLight
    ? "bg-[#F5F5F5] border-[#223843]/15"
    : "bg-[#333] border-white/15";
  const mutedText = isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60";

  const optionCard = (active) =>
    `flex flex-col rounded-xl border p-5 transition-colors duration-300 ${
      active
        ? "border-[#D77A61]"
        : isLight
          ? "border-[#223843]/12"
          : "border-white/12"
    }`;

  const primaryButton =
    "mt-4 flex w-fit items-center justify-center gap-2 rounded-lg bg-[#D77A61] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C96B53] disabled:cursor-not-allowed disabled:opacity-60";

  const handleAiHandle = () => {
    setMode(MODE.AI);
    onChange("");
    onGenerateAuto();
  };

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <h3 className="text-lg font-bold">Business Context</h3>
      <p className={`mt-1 text-sm ${mutedText}`}>
        Choose how VoiceKart AI should approach your marketing strategy.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className={optionCard(mode === MODE.CONTEXT)}>
          <div className="flex items-center gap-2 text-[#D77A61]">
            <FileEdit size={18} />
            <span className="text-sm font-bold">Add Business Context</span>
          </div>

          <p className={`mt-1.5 text-xs italic ${mutedText}`}>&quot;I want to guide the AI&quot;</p>

          <ul className={`mt-3 list-disc space-y-1 pl-4 text-xs leading-5 ${mutedText}`}>
            <li>Upcoming festival</li>
            <li>Product launch</li>
            <li>Seasonal offer</li>
            <li>Target audience</li>
            <li>Budget</li>
            <li>Competitor</li>
          </ul>

          <button
            type="button"
            onClick={() => setMode(MODE.CONTEXT)}
            disabled={generating}
            className={primaryButton}
          >
            Continue with Context
          </button>
        </div>

        <div className={optionCard(mode === MODE.AI)}>
          <div className="flex items-center gap-2 text-[#D77A61]">
            <Sparkles size={18} />
            <span className="text-sm font-bold">Let VoiceKart AI Decide</span>
          </div>

          <p className={`mt-1.5 text-xs leading-5 ${mutedText}`}>VoiceKart will use</p>

          <ul className={`mt-2 list-disc space-y-1 pl-4 text-xs leading-5 ${mutedText}`}>
            <li>Business summary</li>
            <li>Instagram brand analysis</li>
            <li>Existing customer insights</li>
          </ul>

          <p className={`mt-2 text-xs leading-5 ${mutedText}`}>
            to automatically generate the best marketing strategy.
          </p>

          <button type="button" onClick={handleAiHandle} disabled={generating} className={primaryButton}>
            <Sparkles size={15} />
            Generate Automatically
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mode === MODE.CONTEXT && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5">
              <p className={`text-sm font-semibold ${isLight ? "text-[#223843]" : "text-[#EFF1F3]"}`}>
                Business Context
              </p>

              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={5}
                placeholder={
                  "Example:\n\nLaunching Independence Day offer next week.\nTarget audience: college students.\nBudget ₹10,000.\nNeed more walk-in customers."
                }
                className={`mt-3 w-full resize-y rounded-lg border px-4 py-3 text-sm leading-6 transition-colors duration-300 ${textareaBg} ${
                  isLight ? "placeholder-[#223843]/40" : "placeholder-[#EFF1F3]/40"
                }`}
              />

              <button
                type="button"
                onClick={onGenerateWithContext}
                disabled={generating}
                className={primaryButton}
              >
                <Sparkles size={15} />
                Generate Strategy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BusinessContextInput;
