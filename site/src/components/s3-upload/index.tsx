import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { S3_UPLOAD_DEFAULT } from "./types";
import type { S3StorageClass, S3UploadIntent, S3UploadPayload } from "./types";

export type { S3StorageClass, S3UploadFile, S3UploadIntent, S3UploadPayload } from "./types";
export { S3_UPLOAD_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 60)";

const STORAGE_CLASSES: S3StorageClass[] = [
  "Standard",
  "IntelligentTiering",
  "InfrequentAccess",
  "Glacier",
  "DeepArchive",
];

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

export function S3Upload({
  intent = S3_UPLOAD_DEFAULT,
  onResult,
}: {
  intent?: S3UploadIntent;
  onResult?: (r: ReviewResult<S3UploadPayload>) => void;
}) {
  const [storageClass, setStorageClass] = React.useState<S3StorageClass>(intent.storageClass);
  const [publicAccess, setPublicAccess] = React.useState(intent.publicAccess);
  const [encryption, setEncryption] = React.useState(intent.encryption);

  const edited =
    storageClass !== intent.storageClass ||
    publicAccess !== intent.publicAccess ||
    encryption !== intent.encryption;

  const totalBytes = intent.files.reduce((a, f) => a + f.sizeBytes, 0);
  const overwriteCount = intent.files.filter(f => f.willOverwrite).length;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      bucket: intent.bucket,
      keyPrefix: intent.keyPrefix,
      storageClass, publicAccess, encryption,
    },
    summary: `s3://${intent.bucket}/${intent.keyPrefix} · ${intent.files.length} files`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "S3 upload cancelled" });

  return (
    <ModalShell
      width={700}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 10,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <Icon.Layers size={12} />
            s3://{intent.bucket}
          </span>
          <div style={{ flex: 1 }} />
          {intent.isProduction && <Pill tone="warn" size="sm">production</Pill>}
          {publicAccess && <Pill tone="warn" size="sm">public</Pill>}
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
            {intent.files.length} files · {formatBytes(totalBytes)}
            {overwriteCount > 0 && (
              <span style={{ color: "var(--c-warn)", marginLeft: 8 }}>
                · {overwriteCount} overwrite{overwriteCount === 1 ? "" : "s"}
              </span>
            )}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Upload edited" : "Upload"}
          </Button>
        </div>
      }
    >
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

      {/* Key path breadcrumb */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-faint)",
        fontFamily: "var(--font-mono)", fontSize: 12,
      }}>
        <div style={{
          fontSize: 10.5, color: "var(--fg-faint)",
          letterSpacing: 0.6, textTransform: "uppercase",
          marginBottom: 6,
        }}>Destination</div>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <span style={{ color: "var(--fg-faint)" }}>s3://</span>
          <span style={{ color: ACCENT, fontWeight: 500 }}>{intent.bucket}</span>
          {intent.keyPrefix.split("/").map((part, i) => (
            <React.Fragment key={i}>
              <span style={{ color: "var(--fg-faint)" }}>/</span>
              <span style={{ color: "var(--fg)" }}>{part}</span>
            </React.Fragment>
          ))}
          <span style={{ color: "var(--fg-faint)" }}>/</span>
        </div>
      </div>

      {/* Files list */}
      <div style={{ padding: "12px 16px", maxHeight: 220, overflowY: "auto" }}>
        <div style={{
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          {intent.files.map((f, i) => (
            <div key={f.name} style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 140px",
              gap: 10, padding: "8px 12px",
              borderTop: i === 0 ? "none" : "1px solid var(--border-faint)",
              fontFamily: "var(--font-mono)", fontSize: 12,
              alignItems: "center",
              background: f.willOverwrite ? "color-mix(in oklch, var(--c-warn) 5%, transparent)" : "transparent",
            }}>
              <span style={{ color: "var(--fg)", display: "flex", alignItems: "center", gap: 6 }}>
                {f.willOverwrite && (
                  <span title="overwrites existing key" style={{
                    width: 6, height: 6, borderRadius: 999, background: "var(--c-warn)", flexShrink: 0,
                  }} />
                )}
                {f.name}
              </span>
              <span style={{ color: "var(--fg-muted)" }}>{formatBytes(f.sizeBytes)}</span>
              <span style={{ color: "var(--fg-faint)", textAlign: "right" }}>{f.contentType}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div style={{
        padding: "12px 16px 16px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <Setting label="Storage class">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {STORAGE_CLASSES.map(s => {
              const active = storageClass === s;
              return (
                <button
                  key={s}
                  onClick={() => setStorageClass(s)}
                  style={{
                    padding: "4px 10px",
                    fontSize: 11.5, fontFamily: "var(--font-mono)",
                    background: active ? `color-mix(in oklch, ${ACCENT} 16%, transparent)` : "var(--bg-inset)",
                    border: `1px solid ${active ? `color-mix(in oklch, ${ACCENT} 40%, transparent)` : "var(--border)"}`,
                    color: active ? ACCENT : "var(--fg-muted)",
                    borderRadius: 6,
                  }}
                >{s}</button>
              );
            })}
          </div>
        </Setting>

        <Setting label="Encryption">
          <select
            value={encryption}
            onChange={e => setEncryption(e.target.value as typeof encryption)}
            style={{
              height: 28, padding: "0 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              fontSize: 12, fontFamily: "var(--font-mono)",
              color: "var(--fg)",
            }}
          >
            <option value="AES256">AES256</option>
            <option value="aws:kms">aws:kms</option>
            <option value="none">none</option>
          </select>
        </Setting>

        <Setting label="Public access" warn={publicAccess && !intent.publicAccess}>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 12, color: publicAccess ? "var(--c-warn)" : "var(--fg-muted)",
            cursor: "pointer", fontFamily: "var(--font-mono)",
          }}>
            <input
              type="checkbox"
              checked={publicAccess}
              onChange={e => setPublicAccess(e.target.checked)}
              style={{ accentColor: "var(--c-warn)" }}
            />
            {publicAccess ? "PUBLIC — anyone with the URL" : "private"}
          </label>
        </Setting>
      </div>
    </ModalShell>
  );
}

function Setting({
  label, children, warn,
}: {
  label: string; children: React.ReactNode; warn?: boolean;
}) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "120px 1fr",
      alignItems: "center", gap: 12,
    }}>
      <span style={{
        fontSize: 11, fontFamily: "var(--font-mono)",
        color: warn ? "var(--c-warn)" : "var(--fg-faint)",
        letterSpacing: 0.6, textTransform: "uppercase",
      }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}
