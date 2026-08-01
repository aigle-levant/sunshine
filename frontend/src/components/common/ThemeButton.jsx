import { Moon, Sun } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="flex h-11 w-11 items-center justify-center rounded-full border transition"
      style={{
        borderColor: "var(--text)",
        color: "var(--text)",
      }}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
