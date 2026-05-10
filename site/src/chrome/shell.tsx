import React from "react";
import { Icon } from "./icons";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { CommandPalette } from "./command-palette";
import { useTheme } from "../hooks/use-theme";
import { useToast } from "../hooks/use-toast";

export function Shell({ children }: { children: React.ReactNode }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const { toast, show } = useToast();

  // Global ⌘K / Ctrl+K + "/" to open the palette.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
      if (e.key === "/" && !paletteOpen) {
        const t = e.target as HTMLElement | null;
        const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
        if (!typing) { e.preventDefault(); setPaletteOpen(true); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  const onCopy = React.useCallback((msg: string, value?: string) => {
    show({ msg, value });
  }, [show]);

  return (
    <>
      <Nav onOpenPalette={() => setPaletteOpen(true)} theme={theme} onTheme={toggleTheme} />
      {children}
      <Footer />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onTheme={toggleTheme}
        onCopy={onCopy}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)",
            zIndex: 1100,
            padding: "10px 14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: 999,
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg)",
            boxShadow: "0 12px 32px -10px rgb(0 0 0 / .5)",
            animation: "rise-in .25s ease",
          }}
        >
          <Icon.Check size={13} style={{ color: "var(--agent-ui-accent)" }} />
          <span>{toast.msg}</span>
          {toast.value && (
            <span style={{ color: "var(--fg-faint)", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              · {toast.value}
            </span>
          )}
        </div>
      )}
    </>
  );
}

// Helper for components that need to publish a toast (used by per-component
// page's "share link" button). Re-exports the toast hook so pages can share.
export { useToast } from "../hooks/use-toast";
