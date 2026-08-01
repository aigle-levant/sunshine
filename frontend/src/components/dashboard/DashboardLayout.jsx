// src/components/dashboard/DashboardLayout.jsx
//
// The shell every dashboard route renders inside: a fixed sidebar on desktop, a
// dismissible drawer below `lg`, and a scrolling main column under the header.
// The title comes off the router, so adding a section never means updating this
// file.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import useTheme from "../../hooks/useTheme";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { navItemForPath } from "./navItems";

function DashboardLayout({ children, subtitle, query, onQueryChange }) {
  const { theme } = useTheme();
  const location = useLocation();

  // The drawer is stored as the path it was opened on rather than a boolean, so
  // any route change — a nav tap, but also browser back — closes it without an
  // effect having to sync the two.
  const [openedAt, setOpenedAt] = useState(null);

  const isNavOpen = openedAt === location.pathname;

  const closeNav = () => setOpenedAt(null);

  const isLight = theme === "light";

  const title = navItemForPath(location.pathname).label;

  // The drawer overlays the page, so the page behind it shouldn't scroll.
  useEffect(() => {
    if (!isNavOpen) return undefined;

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isNavOpen]);

  useEffect(() => {
    if (!isNavOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenedAt(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isNavOpen]);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3] text-[#223843]" : "bg-[#223843] text-[#EFF1F3]"
      }`}
    >
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              aria-hidden="true"
              onClick={closeNav}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#223843]/55 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full"
            >
              {/* Tapping the section you're already on won't change the route,
                  so the drawer closes itself rather than waiting for one. */}
              <Sidebar onNavigate={closeNav} onClose={closeNav} isMobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          query={query}
          onQueryChange={onQueryChange}
          onOpenNav={() => setOpenedAt(location.pathname)}
        />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
