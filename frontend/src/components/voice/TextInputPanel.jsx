// src/components/voice/TextInputPanel.jsx
//
// The typed alternative to speaking. Same pipeline, same languages — the text
// goes to the AI exactly as written, Tamil script included.

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { ENGLISH, copyFor, scriptFontStyle } from "./language";

function TextInputPanel({ onSubmit, disabled = false, language = ENGLISH }) {
  const { theme } = useTheme();

  const [value, setValue] = useState("");

  const isLight = theme === "light";

  const copy = copyFor(language);

  const canSubmit = Boolean(value.trim()) && !disabled;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    onSubmit?.(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div
        className={`flex items-center gap-3 rounded-full border py-2 pl-7 pr-2 transition-colors duration-300 focus-within:border-[#D77A61] ${
          isLight
            ? "border-[#223843]/15 bg-[#DBD3D8]/40"
            : "border-white/15 bg-white/5"
        }`}
      >
        <input
          type="text"
          value={value}
          disabled={disabled}
          lang={language}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.typePlaceholder}
          aria-label={copy.typePlaceholder}
          style={scriptFontStyle(value || copy.typePlaceholder)}
          className={`min-w-0 flex-1 bg-transparent py-3 text-base outline-none disabled:cursor-not-allowed ${
            isLight
              ? "placeholder:text-[#223843]/40"
              : "placeholder:text-[#EFF1F3]/40"
          }`}
        />

        <motion.button
          type="submit"
          disabled={!canSubmit}
          aria-label={copy.send}
          whileHover={canSubmit ? { scale: 1.05 } : undefined}
          whileTap={canSubmit ? { scale: 0.95 } : undefined}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            canSubmit
              ? "bg-[#D77A61] text-[#EFF1F3] hover:bg-[#C96B53]"
              : isLight
                ? "cursor-not-allowed bg-[#223843]/10 text-[#223843]/30"
                : "cursor-not-allowed bg-white/10 text-[#EFF1F3]/30"
          }`}
        >
          <ArrowUp size={19} strokeWidth={2} />
        </motion.button>
      </div>
    </form>
  );
}

export default TextInputPanel;
