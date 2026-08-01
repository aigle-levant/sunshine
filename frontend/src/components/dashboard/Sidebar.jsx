// src/components/dashboard/Sidebar.jsx
//
// Primary dashboard navigation. Active state comes from the router, not from a
// prop — NavLink already knows which section is open.

import { motion } from "framer-motion";
import { Mic, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import useTheme from "../../hooks/useTheme";
import { NAV_ITEMS } from "./navItems";

function Sidebar({ onNavigate, onClose, isMobile = false }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const mutedText = isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60";

  // The desktop rail and the mobile drawer are both mounted at once, so the
  // sliding pill needs a layoutId per instance or the two would animate
  // into each other.
  const pillId = isMobile ? "sidebar-active-drawer" : "sidebar-active-rail";

  return (
    <aside
      className={`flex h-full w-[264px] shrink-0 flex-col border-r px-5 py-6 transition-colors duration-500 ${
        isLight
          ? "border-[#223843]/10 bg-[#EFF1F3]"
          : "border-white/10 bg-[#223843]"
      }`}
    >
      <div className="flex items-center justify-between px-2">
        <Link to="/" className="text-2xl font-semibold tracking-[-0.05em]">
          VoiceKart AI
          <span className="text-[#D77A61]">.</span>
        </Link>

        {/* Only the drawer needs a dismiss — the desktop rail is always open. */}
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
              isLight
                ? "border-[#223843]/15 hover:bg-[#DBD3D8]"
                : "border-white/15 hover:bg-white/10"
            }`}
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        )}
      </div>

      <nav className="mt-9 flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {NAV_ITEMS.map(({ id, label, to, end, icon: Icon }) => (
          <NavLink
            key={id}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors duration-300 ${
                isActive
                  ? "text-[#D77A61]"
                  : isLight
                    ? "text-[#223843]/70 hover:bg-[#DBD3D8]/60 hover:text-[#223843]"
                    : "text-[#EFF1F3]/65 hover:bg-white/5 hover:text-[#EFF1F3]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* One shared pill that slides between items. */}
                {isActive && (
                  <motion.span
                    layoutId={pillId}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                    className={`absolute inset-0 rounded-2xl ${
                      isLight ? "bg-[#D77A61]/12" : "bg-[#D77A61]/18"
                    }`}
                  />
                )}

                <Icon size={19} strokeWidth={1.8} className="relative shrink-0" />
                <span className="relative">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className={`mt-6 rounded-[1.75rem] border p-5 ${
          isLight
            ? "border-[#223843]/10 bg-[#DBD3D8]/50"
            : "border-white/10 bg-white/5"
        }`}
      >
        <p className="text-sm font-semibold">Add by speaking</p>

        <p className={`mt-2 text-[13px] leading-6 ${mutedText}`}>
          Say what happened in Tamil or English — it lands here.
        </p>

        <Link
          to="/speak"
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#D77A61] px-5 py-3 text-sm font-semibold text-[#EFF1F3] transition-colors duration-300 hover:bg-[#C96B53]"
        >
          <Mic size={16} strokeWidth={1.9} />
          Speak
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
