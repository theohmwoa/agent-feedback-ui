import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { DISCORD_EMBED_DEFAULT, COLOR_SWATCHES } from "./types";
import type { DiscordEmbedIntent, DiscordEmbedPayload, EmbedField } from "./types";

export type { DiscordEmbedIntent, DiscordEmbedPayload, EmbedField } from "./types";
export { DISCORD_EMBED_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.13 280)";

export function DiscordEmbed({
  intent = DISCORD_EMBED_DEFAULT,
  onResult,
}: {
  intent?: DiscordEmbedIntent;
  onResult?: (r: ReviewResult<DiscordEmbedPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [color, setColor] = React.useState(intent.color);
  const [fields, setFields] = React.useState<EmbedField[]>(intent.fields);
  const [thumbnailUrl, setThumbnailUrl] = React.useState(intent.thumbnailUrl ?? "");
  const [footerText, setFooterText] = React.useState(intent.footerText ?? "");

  const edited =
    title !== intent.title ||
    description !== intent.description ||
    color !== intent.color ||
    JSON.stringify(fields) !== JSON.stringify(intent.fields) ||
    thumbnailUrl !== (intent.thumbnailUrl ?? "") ||
    footerText !== (intent.footerText ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      channel: intent.channel,
      embed: { title, description, color, fields, thumbnailUrl: thumbnailUrl || undefined, footerText: footerText || undefined, author: intent.author },
    },
    summary: `#${intent.channel} embed · ${title.slice(0, 40)}${title.length > 40 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Embed cancelled" });

  const updateField = (i: number, patch: Partial<EmbedField>) => {
    setFields(prev => {
      const next = [...prev];
      next[i] = { ...next[i]!, ...patch };
      return next;
    });
  };

  return (
    <ModalShell
      width={680}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <Icon.Hash size={11} />
            {intent.channel}
          </span>
          <div style={{ flex: 1 }} />
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
            {fields.length} field{fields.length === 1 ? "" : "s"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited embed" : "Send embed"}
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 380 }}>
        {/* Editor */}
        <div style={{
          padding: "16px 18px",
          borderRight: "1px solid var(--border-faint)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <Field label="Title">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={inputStyle}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ ...inputStyle, minHeight: 70, fontFamily: "var(--font-sans)", padding: "8px 10px" }}
            />
          </Field>

          <Field label="Accent color">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {COLOR_SWATCHES.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`color ${c}`}
                  style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: c,
                    border: `2px solid ${color === c ? "var(--fg)" : "transparent"}`,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </Field>

          <Field label="Thumbnail URL">
            <input
              value={thumbnailUrl}
              onChange={e => setThumbnailUrl(e.target.value)}
              placeholder="https://…"
              style={{ ...inputStyle, fontFamily: "var(--font-mono)", fontSize: 12 }}
            />
          </Field>

          <Field label="Footer text">
            <input
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              style={{ ...inputStyle, fontSize: 12 }}
            />
          </Field>

          <div>
            <div style={labelStyle}>Fields</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {fields.map((f, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "100px 1fr 24px",
                  gap: 6, alignItems: "center",
                  padding: "4px 6px",
                  background: "var(--bg-inset)",
                  border: "1px solid var(--border-faint)",
                  borderRadius: 6,
                }}>
                  <input
                    value={f.name}
                    onChange={e => updateField(i, { name: e.target.value })}
                    style={{ ...inputStyle, fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--c-slack)", padding: "2px 4px", background: "transparent", border: 0 }}
                  />
                  <input
                    value={f.value}
                    onChange={e => updateField(i, { value: e.target.value })}
                    style={{ ...inputStyle, fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--fg-muted)", padding: "2px 4px", background: "transparent", border: 0 }}
                  />
                  <button
                    onClick={() => setFields(fields.filter((_, j) => j !== i))}
                    style={{ color: "var(--fg-faint)", padding: 2 }}
                    aria-label="remove field"
                  >
                    <Icon.X size={11} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFields([...fields, { name: "Field", value: "" }])}
                style={{
                  fontSize: 11, fontFamily: "var(--font-mono)",
                  color: "var(--fg-faint)", textAlign: "left",
                  padding: "4px 6px",
                  border: "1px dashed var(--border-strong)",
                  borderRadius: 6,
                  background: "transparent",
                }}
              >+ add field</button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{
          padding: "16px 18px",
          background: `color-mix(in oklch, ${ACCENT} 3%, transparent)`,
        }}>
          <div style={labelStyle}>Live preview</div>

          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-faint)",
            borderRadius: 6,
            padding: "10px 12px 12px 14px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: 4, background: color, borderRadius: "6px 0 0 6px",
            }} />
            <div style={{ paddingLeft: 4 }}>
              {intent.author && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 999,
                    background: "var(--bg-inset)",
                  }} />
                  <span style={{ fontSize: 11.5, color: "var(--fg-muted)", fontWeight: 500 }}>
                    {intent.author.name}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14.5, fontWeight: 600,
                    color: "var(--fg)", marginBottom: 4,
                  }}>{title || <span style={{ opacity: .4 }}>Title…</span>}</div>
                  <div style={{
                    fontSize: 13, color: "var(--fg-muted)",
                    lineHeight: 1.45, marginBottom: 10,
                    whiteSpace: "pre-wrap",
                  }}>
                    {description || <span style={{ opacity: .4 }}>Description…</span>}
                  </div>

                  {fields.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 8 }}>
                      {fields.map((f, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--fg)" }}>{f.name}</div>
                          <div style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {footerText && (
                    <div style={{
                      fontSize: 11, color: "var(--fg-faint)",
                      marginTop: 6, paddingTop: 6,
                      borderTop: "1px solid var(--border-faint)",
                    }}>{footerText}</div>
                  )}
                </div>

                {thumbnailUrl && (
                  <div style={{
                    width: 60, height: 60,
                    borderRadius: 6,
                    background: "var(--bg-inset)",
                    border: "1px solid var(--border-faint)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--fg-faint)",
                    flexShrink: 0,
                  }}>
                    <Icon.Image size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 32,
  padding: "0 10px",
  background: "var(--bg-inset)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  outline: 0,
  fontSize: 13, color: "var(--fg)",
  fontFamily: "var(--font-sans)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10.5, fontFamily: "var(--font-mono)",
  color: "var(--fg-faint)", letterSpacing: 0.6,
  textTransform: "uppercase", marginBottom: 6,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}
