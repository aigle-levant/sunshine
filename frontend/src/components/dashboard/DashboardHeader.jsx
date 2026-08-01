// src/components/dashboard/DashboardHeader.jsx
//
// Sticky top bar for the dashboard: page title, search, theme and the mic CTA.
// It stays translucent so content scrolling underneath still reads as one page.

import { Menu, Mic, Moon, Search, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useTheme from "../../hooks/useTheme";

function DashboardHeader({
  title = "Overview",
  subtitle = null,
  query = "",
  onQueryChange,
  onOpenNav,
}) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isLight = theme === "light";

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-500 ${
        isLight
          ? "border-[#223843]/10 bg-[#EFF1F3]/85"
          : "border-white/10 bg-[#223843]/85"
      }`}
    >
      <div className="flex flex-wrap items-center gap-4 px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Open navigation"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden ${
            isLight
              ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
              : "border-white/15 hover:bg-white/10"
          }`}
        >
          <Menu size={19} strokeWidth={1.8} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-medium tracking-[-0.04em]">
            {title}
          </h1>

          {subtitle && (
            <p
              className={`truncate text-[13px] ${
                isLight ? "text-[#223843]/55" : "text-[#EFF1F3]/55"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label
            className={`hidden items-center gap-2.5 rounded-full border px-4 py-2.5 transition-colors duration-300 focus-within:border-[#D77A61] sm:flex ${
              isLight
                ? "border-[#223843]/15 bg-[#DBD3D8]/40"
                : "border-white/15 bg-white/5"
            }`}
          >
            <Search size={16} strokeWidth={1.9} className="shrink-0 opacity-55" />

            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange?.(event.target.value)}
              placeholder="Search customers or orders"
              aria-label="Search customers or orders"
              className={`w-44 min-w-0 bg-transparent text-sm outline-none lg:w-56 ${
                isLight
                  ? "placeholder:text-[#223843]/40"
                  : "placeholder:text-[#EFF1F3]/40"
              }`}
            />
          </label>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${
              isLight
                ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
                : "border-white/15 hover:bg-white/10"
            }`}
          >
            {isLight ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            onClick={() => navigate("/speak")}
            className="flex items-center gap-2.5 rounded-full bg-[#D77A61] px-5 py-3 text-sm font-semibold text-[#EFF1F3] transition-all duration-300 hover:scale-[1.02] hover:bg-[#C96B53]"
          >
            <Mic size={16} strokeWidth={1.9} />
            <span className="hidden sm:inline">Speak</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
