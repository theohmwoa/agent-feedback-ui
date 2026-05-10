import React from "react";
import { Icon } from "./icons";
import { Pill } from "./primitives";

type Result = {
  kind: "submit" | "edit" | "cancel";
  summary?: string;
} | null;

export function ResultToast({
  result, onDismiss,
}: {
  result: unknown;
  onDismiss: () => void;
}) {
  React.useEffect(() => {
    if (!result) return;
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [result, onDismiss]);

  if (!result) return null;
  const r = result as Result;
  if (!r) return null;
  const tone = r.kind === "submit" ? "ok" : r.kind === "edit" ? "accent" : "default";
  const label =
    r.kind === "submit" ? "result.kind = 'submit'" :
    r.kind === "edit"   ? "result.kind = 'edit'" :
                          "result.kind = 'cancel'";
  return (
    <div style={{
      position: "fixed",
      left: "50%", bottom: 28, transform: "translateX(-50%)",
      zIndex: 1000,
      animation: "rise-in .35s cubic-bezier(.2,.9,.2,1)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px 10px 14px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)", borderRadius: 999,
        fontFamily: "var(--font-mono)", fontSize: 12,
        color: "var(--fg-muted)",
        boxShadow: "0 12px 32px -10px rgb(0 0 0 / .5)",
        minWidth: 320,
      }}>
        <Pill tone={tone} size="sm">{label}</Pill>
        <span style={{ color: "var(--fg-dim)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {r.summary}
        </span>
        <button onClick={onDismiss} style={{ color: "var(--fg-faint)", display: "inline-flex" }} aria-label="dismiss">
          <Icon.X size={14} />
        </button>
      </div>
    </div>
  );
}
