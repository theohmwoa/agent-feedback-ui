import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { S3_DELETE_DEFAULT } from "./types";
import type { S3DeleteIntent, S3DeletePayload } from "./types";

export type { S3DeleteObject, S3DeleteIntent, S3DeletePayload } from "./types";
export { S3_DELETE_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 60)";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = n / 1024;
  for (const u of units) {
    if (v < 1024) return `${v.toFixed(v < 10 ? 2 : 1)} ${u}`;
    v /= 1024;
  }
  return `${v.toFixed(1)} PB`;
}

export function S3Delete({
  intent = S3_DELETE_DEFAULT,
  onResult,
}: {
  intent?: S3DeleteIntent;
  onResult?: (r: ReviewResult<S3DeletePayload>) => void;
}) {
  const [includeAllVersions, setIncludeAllVersions] = React.useState(intent.includeAllVersions);
  const [confirmText, setConfirmText] = React.useState("");

  const edited = includeAllVersions !== intent.includeAllVersions;
  const confirmed = confirmText === intent.bucket;

  const totalBytes = intent.objects.reduce((a, o) => a + o.sizeBytes, 0);
  const versionCount = intent.objects.reduce((a, o) => a + (o.versions ?? 0), 0);

  const submit = () => {
    if (!confirmed) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: {
        bucket: intent.bucket,
        keys: intent.objects.map(o => o.key),
        includeAllVersions,
      },
      summary: `Delete ${intent.objects.length} from s3://${intent.bucket}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "S3 delete cancelled" });

  return (
    <ModalShell
      width={720}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 10,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          {intent.isProduction && <Pill tone="warn" size="sm">production</Pill>}
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--c-err)",
            padding: "2px 8px",
            border: "1px solid color-mix(in oklch, var(--c-err) 30%, transparent)",
            background: "color-mix(in oklch, var(--c-err) 10%, transparent)",
            borderRadius: 6,
            fontWeight: 700,
          }}>DESTRUCTIVE</span>
          <button onClick={cancel} aria-label="Close" style={{ color: "var(--fg-dim)" }}>
            <Icon.X size={15} />
          </button>
        </div>
      }
      footer={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--bg-inset) 60%, transparent)",
          gap: 10,
        }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            {intent.objects.length} object{intent.objects.length === 1 ? "" : "s"} · {formatBytes(totalBytes)}
            {includeAllVersions && versionCount > 0 && (
              <span style={{ color: "var(--c-err)", marginLeft: 8 }}>
                · +{versionCount} versions
              </span>
            )}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!confirmed}
            icon={<Icon.AlertTriangle size={13} />}
            onClick={submit}
          >
            Permanently delete
          </Button>
        </div>
      }
    >
      {/* Bucket banner — warn-tinted */}
      <div style={{
        padding: "12px 16px",
        background: "color-mix(in oklch, var(--c-err) 8%, transparent)",
        borderBottom: "1px solid color-mix(in oklch, var(--c-err) 22%, transparent)",
        fontFamily: "var(--font-mono)", fontSize: 13,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Icon.AlertTriangle size={14} style={{ color: "var(--c-err)" }} />
        <span style={{ color: "var(--fg-muted)" }}>s3://</span>
        <span style={{ color: "var(--c-err)", fontWeight: 600 }}>{intent.bucket}</span>
        {intent.region && <span style={{ color: "var(--fg-faint)" }}>· {intent.region}</span>}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>cannot be undone</span>
      </div>

      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "12px 16px",
          background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      {/* Big delete count */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "baseline", gap: 8,
      }}>
        <span style={{
          fontSize: 48, fontWeight: 600, letterSpacing: -1.5,
          color: "var(--c-err)",
          lineHeight: 1,
        }}>{intent.objects.length}</span>
        <span style={{
          fontSize: 14, fontFamily: "var(--font-mono)",
          color: "var(--fg-muted)",
        }}>object{intent.objects.length === 1 ? "" : "s"} → ✗</span>
      </div>

      {/* Objects list */}
      <div style={{ padding: "12px 16px", maxHeight: 200, overflowY: "auto" }}>
        <div style={{
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          {intent.objects.map((o, i) => (
            <div key={o.key} style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 140px",
              gap: 10, padding: "8px 12px",
              borderTop: i === 0 ? "none" : "1px solid var(--border-faint)",
              fontFamily: "var(--font-mono)", fontSize: 12,
              alignItems: "center",
            }}>
              <span style={{ color: "var(--fg)", wordBreak: "break-all" }}>
                {o.key}
                {o.versions && o.versions > 1 && (
                  <span style={{
                    marginLeft: 6, padding: "1px 6px",
                    background: includeAllVersions ? "color-mix(in oklch, var(--c-err) 16%, transparent)" : "var(--bg-card)",
                    color: includeAllVersions ? "var(--c-err)" : "var(--fg-faint)",
                    border: `1px solid ${includeAllVersions ? "color-mix(in oklch, var(--c-err) 30%, transparent)" : "var(--border)"}`,
                    borderRadius: 4, fontSize: 10,
                  }}>{o.versions} ver</span>
                )}
              </span>
              <span style={{ color: "var(--fg-muted)" }}>{formatBytes(o.sizeBytes)}</span>
              <span style={{ color: "var(--fg-faint)", textAlign: "right" }}>{o.lastModified}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Versions toggle */}
      <div style={{
        padding: "10px 16px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <label style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 12.5, color: includeAllVersions ? "var(--c-err)" : "var(--fg-muted)",
          cursor: "pointer", fontFamily: "var(--font-mono)",
        }}>
          <input
            type="checkbox"
            checked={includeAllVersions}
            onChange={e => setIncludeAllVersions(e.target.checked)}
            style={{ accentColor: "var(--c-err)" }}
          />
          {includeAllVersions
            ? `Including ALL versions (+${versionCount} more)`
            : "Latest version only"}
        </label>
      </div>

      {/* Confirmation: type bucket name */}
      <div style={{
        margin: "12px 16px 16px",
        padding: "10px 12px",
        background: "color-mix(in oklch, var(--c-err) 8%, transparent)",
        border: "1px solid color-mix(in oklch, var(--c-err) 28%, transparent)",
        borderRadius: 10,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11.5, fontFamily: "var(--font-mono)",
          color: "var(--c-err)", marginBottom: 6,
        }}>
          <Icon.Lock size={11} />
          Type the bucket name to confirm: <span style={{ color: "var(--fg)", fontWeight: 600 }}>{intent.bucket}</span>
        </div>
        <input
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder={intent.bucket}
          style={{
            width: "100%", padding: "6px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 6, outline: 0,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg)",
            caretColor: "var(--c-err)",
          }}
        />
      </div>
    </ModalShell>
  );
}
