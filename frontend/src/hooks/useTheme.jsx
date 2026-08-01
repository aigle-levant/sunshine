import { useContext } from "react";
import { ThemeContext } from "../context/theme-context";

// Rendering outside the provider shouldn't crash a component — every consumer
// destructures `theme` immediately.
const FALLBACK = {
  theme: "light",
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
};

export default function useTheme() {
  return useContext(ThemeContext) ?? FALLBACK;
}
