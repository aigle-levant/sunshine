// src/components/ContinueButton.jsx
//
// The forward action at the end of a voice flow. The label and icon change with
// the stage — "Confirm & Save" while reviewing, "Back to Home" once saved — so
// one button carries the whole journey.

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import useTheme from "../hooks/useTheme";

function ContinueButton({
  onClick,
  disabled = false,
  isLoading = false,
  label = "Continue",
  loadingLabel = "Saving…",
  variant = "solid",
  icon: Icon = ArrowRight,
  type = "button",
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const isInactive = disabled || isLoading;

  const variantClasses = {
    solid: isLight
      ? "bg-[#223843] text-[#EFF1F3] hover:bg-[#D8B4A0] hover:text-[#223843]"
      : "bg-[#EFF1F3] text-[#223843] hover:bg-[#D8B4A0]",
    accent: "bg-[#D77A61] text-[#EFF1F3] hover:bg-[#C96B53]",
    ghost: isLight
      ? "border border-[#223843]/15 text-[#223843] hover:bg-[#DBD3D8]"
      : "border border-white/15 text-[#EFF1F3] hover:bg-white/10",
  };

  const inactiveClasses = isLight
    ? "cursor-not-allowed bg-[#DBD3D8] text-[#223843]/40"
    : "cursor-not-allowed bg-white/10 text-[#EFF1F3]/40";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isInactive}
      aria-busy={isLoading}
      whileHover={isInactive ? undefined : { scale: 1.02 }}
      whileTap={isInactive ? undefined : { scale: 0.98 }}
      className={`group flex items-center gap-4 rounded-full px-9 py-4 text-lg font-semibold transition-colors duration-300 ${
        isInactive ? inactiveClasses : variantClasses[variant] ?? variantClasses.solid
      }`}
    >
      {isLoading ? loadingLabel : label}

      {isLoading ? (
        <motion.span
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          className="h-4.75 w-4.75 rounded-full border-2 border-current border-t-transparent opacity-60"
        />
      ) : (
        Icon && (
          <Icon
            size={19}
            strokeWidth={1.8}
            className={
              isInactive ? "" : "transition-transform group-hover:translate-x-1"
            }
          />
        )
      )}
    </motion.button>
  );
}

export default ContinueButton;
