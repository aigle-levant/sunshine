// src/components/dashboard/marketing/PlatformCard.jsx
//
// One selectable platform tile inside PlatformSelector. Purely presentational —
// selection state and the click handler live in the parent.

import useTheme from "../../../hooks/useTheme";

function PlatformCard({
  emoji,
  title,
  features = [],
  ctaLabel,
  selected = false,
  onSelect,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const cardBg = isLight
    ? "bg-white border-[#223843]/10"
    : "bg-[#252525] border-white/10";

  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 text-left transition-colors duration-300 ${cardBg} ${
        selected
          ? "border-[#D77A61]"
          : "hover:border-[#D77A61]/60"
      }`}
    >
      <span className="text-3xl">{emoji}</span>

      <h3 className="mt-4 text-lg font-bold">{title}</h3>

      <ul
        className={`mt-3 flex-1 space-y-1.5 text-sm ${
          isLight ? "text-[#223843]/65" : "text-[#EFF1F3]/65"
        }`}
      >
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
          selected
            ? "bg-[#D77A61] text-white"
            : "border border-[#D77A61] text-[#D77A61] hover:bg-[#D77A61] hover:text-white"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

export default PlatformCard;
