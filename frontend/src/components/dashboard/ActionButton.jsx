// src/components/dashboard/ActionButton.jsx
//
// One tile in the quick-actions grid. `variant="accent"` marks the primary
// path — there should only ever be one of those on screen.

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import useTheme from "../../hooks/useTheme";

// Hoisted: building this inside the component would create a new type on every
// render and remount the subtree each time.
const MotionLink = motion.create(Link);

function ActionButton({
  label,
  description = null,
  icon: Icon,
  /** A route to navigate to. Actions without one stay plain buttons. */
  to = null,
  onClick,
  variant = "ghost",
  index = 0,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const isAccent = variant === "accent";

  // A link that navigates must be an anchor, not a button with an onClick —
  // middle-click, ctrl-click and "copy link" all depend on it.
  const MotionTag = to ? MotionLink : motion.button;

  return (
    <MotionTag
      {...(to ? { to } : { type: "button", onClick })}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors duration-300 ${
        isAccent
          ? "border-transparent bg-[#D77A61] text-[#EFF1F3] hover:bg-[#C96B53]"
          : isLight
            ? "border-[#223843]/10 bg-[#EFF1F3]/60 hover:bg-[#EFF1F3]"
            : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          isAccent
            ? "bg-[#EFF1F3]/20 text-[#EFF1F3]"
            : "bg-[#D77A61]/15 text-[#D77A61]"
        }`}
      >
        <Icon size={18} strokeWidth={1.9} />
      </span>

      <span className="text-[15px] font-semibold">{label}</span>

      {description && (
        <span
          className={`text-[13px] leading-6 ${
            isAccent
              ? "text-[#EFF1F3]/80"
              : isLight
                ? "text-[#223843]/55"
                : "text-[#EFF1F3]/55"
          }`}
        >
          {description}
        </span>
      )}
    </MotionTag>
  );
}

export default ActionButton;
