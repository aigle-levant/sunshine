// src/components/voice/VoiceOverlay.jsx
//
// The full-screen shell every voice stage renders inside. Owning the backdrop,
// the fade/scale transition and the scroll lock in one place keeps the three
// stage screens free to be pure layout.

import { useEffect } from "react";
import { motion } from "framer-motion";

import useTheme from "../../hooks/useTheme";

const overlayTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

function VoiceOverlay({ children, labelledBy }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  // Voice mode is immersive — the page behind it shouldn't scroll away.
  useEffect(() => {
    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={overlayTransition}
      className={`fixed inset-0 z-50 overflow-y-auto transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      {/* Soft accent bloom, so the plain background still reads as premium. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isLight ? 0.22 : 0.16, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#D77A61_0%,transparent_62%)] blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }}
        transition={overlayTransition}
        className="relative flex min-h-full flex-col px-6 py-10 md:px-12 lg:px-16"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default VoiceOverlay;
