// src/components/marketing/ContentTypeLegend.jsx
//
// What the four colours mean. Colour alone shouldn't have to carry the type —
// every chip also shows its icon and its label in the editor — but the legend
// is what makes the month readable at a glance.

import useTheme from "../../hooks/useTheme";
import { CONTENT_TYPE_LIST, tint } from "./contentTypes";

function ContentTypeLegend() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {CONTENT_TYPE_LIST.map((type) => (
        <li key={type.id} className="flex items-center gap-2" title={type.hint}>
          <span
            aria-hidden="true"
            style={{
              backgroundColor: tint(type.color, isLight ? 0.9 : 1),
              boxShadow: `0 0 0 3px ${tint(type.color, 0.2)}`,
            }}
            className="h-2 w-2 shrink-0 rounded-full"
          />

          <span
            className={`text-[12.5px] font-semibold ${
              isLight ? "text-[#223843]/65" : "text-[#EFF1F3]/65"
            }`}
          >
            {type.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ContentTypeLegend;
