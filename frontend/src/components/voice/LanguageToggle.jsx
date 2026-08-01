// src/components/voice/LanguageToggle.jsx
//
// Tamil / English switch, offered before recording starts. Shown only when the
// browser can't detect the spoken language on its own — which today is always.

import { motion } from "framer-motion";
import { Languages } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import { LANGUAGES } from "./language";

function LanguageToggle({ value, onChange, disabled = false }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] ${
          isLight ? "text-[#223843]/50" : "text-[#EFF1F3]/50"
        }`}
      >
        <Languages size={15} strokeWidth={1.8} />
        Language
      </span>

      <div
        role="radiogroup"
        aria-label="Speech language"
        className={`relative flex rounded-full border p-1 ${
          isLight ? "border-[#223843]/15" : "border-white/15"
        }`}
      >
        {LANGUAGES.map((language) => {
          const isActive = language.code === value;

          return (
            <button
              key={language.code}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange?.(language.code)}
              className={`relative rounded-full px-6 py-2.5 text-base font-semibold transition-colors duration-300 ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              } ${
                isActive
                  ? "text-[#EFF1F3]"
                  : isLight
                    ? "text-[#223843]/60 hover:text-[#223843]"
                    : "text-[#EFF1F3]/60 hover:text-[#EFF1F3]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="language-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#D77A61]"
                />
              )}

              <span className="relative">{language.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageToggle;
