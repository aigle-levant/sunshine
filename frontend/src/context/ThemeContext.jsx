import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

// Kept in step with the pre-paint script in index.html.
const THEME_COLORS = {
  light: "#EFF1F3",
  dark: "#223843",
};

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Private mode or blocked storage.
    return null;
  }
}

function prefersDark() {
  return Boolean(window.matchMedia?.(DARK_QUERY).matches);
}

function applyTheme(theme) {
  const root = document.documentElement;

  root.dataset.theme = theme;

  // Drives native scrollbars, form controls and the text caret.
  root.style.colorScheme = theme;

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => readStoredTheme() ?? (prefersDark() ? "dark" : "light"),
  );

  // Once the user picks a side we stop following the OS.
  const [isPinned, setIsPinned] = useState(() => readStoredTheme() !== null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (isPinned) return undefined;

    const query = window.matchMedia(DARK_QUERY);

    const handleChange = (event) =>
      setThemeState(event.matches ? "dark" : "light");

    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, [isPinned]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    setIsPinned(true);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The theme still applies for this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
