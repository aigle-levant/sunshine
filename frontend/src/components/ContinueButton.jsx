import { ArrowRight } from "lucide-react";
import useTheme from "../hooks/useTheme";

function ContinueButton({
  onClick,
  disabled = false,
  isLoading = false,
  label = "Continue",
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const isInactive = disabled || isLoading;

  const activeClasses = isLight
    ? "bg-[#223843] text-[#EFF1F3] hover:bg-[#D8B4A0] hover:text-[#223843]"
    : "bg-[#EFF1F3] text-[#223843] hover:bg-[#D8B4A0]";

  const inactiveClasses = isLight
    ? "cursor-not-allowed bg-[#DBD3D8] text-[#223843]/40"
    : "cursor-not-allowed bg-white/10 text-[#EFF1F3]/40";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isInactive}
      aria-busy={isLoading}
      className={`group flex items-center gap-4 rounded-full px-9 py-4 text-lg font-semibold transition-all duration-300 ${
        isInactive ? inactiveClasses : `${activeClasses} hover:scale-[1.02]`
      }`}
    >
      {isLoading ? "Saving…" : label}

      <ArrowRight
        size={19}
        strokeWidth={1.8}
        className={isInactive ? "" : "transition-transform group-hover:translate-x-1"}
      />
    </button>
  );
}

export default ContinueButton;
