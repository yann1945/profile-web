import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Mode terang" : "Mode gelap"}
      className="fixed top-5 right-5 z-[60] flex h-10 w-10 items-center justify-center text-foreground cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90"
    >
      {theme === "dark" ? (
        <Sun size={22} className="text-[color:var(--gold)] drop-shadow-[0_2px_8px_rgba(255,215,0,0.4)]" />
      ) : (
        <Moon size={22} className="text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
      )}
    </button>
  );
}
