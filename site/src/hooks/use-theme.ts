import React from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("agent-ui-theme");
      return stored === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("agent-ui-theme", theme); } catch { /* no-op */ }
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")),
  };
}
