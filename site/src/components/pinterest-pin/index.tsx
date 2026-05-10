import React from "react";
import { Icon } from "../../chrome/icons";
import { AgentBadge, Button, Kbd, ModalShell, Pill } from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { PINTEREST_DEFAULT } from "./types";
import type { PinterestIntent, PinterestPayload } from "./types";

export type { PinterestIntent, PinterestPayload } from "./types";
export { PINTEREST_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 25)";

export function PinterestPin({
  intent = PINTEREST_DEFAULT,
  onResult,
}: {
  intent?: PinterestIntent;
  onResult?: (r: ReviewResult<PinterestPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [board, setBoard] = React.useState(intent.board);
  const [link, setLink] = React.useState(intent.link ?? "");
  const [tags, setTags] = React.useState<string[]>(intent.tags);
  const [tagDraft, setTagDraft] = React.useState("");
  const [altText, setAltText] = React.useState(intent.altText ?? "");
  const [boardOpen, setBoardOpen] = React.useState(false);

  const original = React.useRef({
    title: intent.title,
    description: intent.description,
    board: intent.board,
    link: intent.link ?? "",
    tags: intent.tags,
    altText: intent.altText ?? "",
  });
  const edited =
    title !== original.current.title ||
    description !== original.current.description ||
    board !== original.current.board ||
    link !== original.current.link ||
    JSON.stringify(tags) !== JSON.stringify(original.current.tags) ||
    altText !== original.current.altText;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { imageUrl: intent.imageUrl, title, description, board, link: link || undefined, tags, altText: altText || undefined },
    summary: `Pin → ${board} · "${title.slice(0, 32)}${title.length > 32 ? "…" : ""}"`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Pin cancelled" });

  const addTag = () => {
    const v = tagDraft.trim().replace(/^#/, "");
    if (!v || tags.includes(v)) { setTagDraft(""); return; }
    setTags([...tags, v]);
    setTagDraft("");
  };

  return (
    <ModalShell
      width={620}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            review · then publish
          </span>
          <button onClick={cancel} aria-label="Close" style={{
            width: 26, height: 26, borderRadius: 6,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--fg-dim)",
          }}>
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
            {tags.length} tag{tags.length === 1 ? "" : "s"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Publish edited" : "Publish pin"}
            <span style={{ marginLeft: 6, opacity: .55 }}>
              <Kbd>⌘</Kbd>
              <span style={{ marginLeft: 2 }}><Kbd>↵</Kbd></span>
            </span>
          </Button>
        </div>
      }
    >
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10, padding: "12px 16px",
          background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{
        display: "grid", gridTemplateColumns: "260px 1fr",
        gap: 16, padding: 16,
      }}>
        {/* Square image preview */}
        <div style={{
          width: 260, height: 260, borderRadius: 16,
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          backgroundImage: `url(${intent.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          flexShrink: 0,
        }}>
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: ACCENT, color: "white",
            fontSize: 10, fontFamily: "var(--font-mono)",
            padding: "3px 8px", borderRadius: 999,
            textTransform: "uppercase", letterSpacing: 0.6,
          }}>preview</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div>
            <Label>Title</Label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
              style={{
                width: "100%", padding: "8px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 14, fontWeight: 500, color: "var(--fg)", outline: 0,
              }}
            />
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              style={{
                width: "100%", padding: "8px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 13, lineHeight: 1.5, color: "var(--fg)", outline: 0,
                fontFamily: "var(--font-sans)",
              }}
            />
            <span style={{ fontSize: 10.5, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
              {description.length} / 500
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <Label>Board</Label>
            <button
              onClick={() => setBoardOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "8px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 13, color: "var(--fg)", textAlign: "left",
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: 5,
                background: `color-mix(in oklch, ${ACCENT} 30%, var(--bg-card))`,
              }} />
              <span style={{ flex: 1 }}>{board}</span>
              <Icon.ChevronDown size={13} style={{ color: "var(--fg-faint)" }} />
            </button>
            {boardOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: 10,
                padding: 4, zIndex: 10,
                boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
                maxHeight: 220, overflowY: "auto",
              }}>
                {intent.boards.map(b => (
                  <button
                    key={b}
                    onClick={() => { setBoard(b); setBoardOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      width: "100%", padding: "6px 8px",
                      background: b === board ? "var(--bg-inset)" : "transparent",
                      borderRadius: 6,
                      fontSize: 12.5, color: "var(--fg)", textAlign: "left",
                    }}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4,
                      background: `color-mix(in oklch, ${ACCENT} 30%, var(--bg-inset))`,
                    }} />
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Destination link</Label>
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://"
              style={{
                width: "100%", padding: "8px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 12.5, fontFamily: "var(--font-mono)",
                color: "var(--fg)", outline: 0,
              }}
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 6,
              padding: "6px 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              minHeight: 36,
            }}>
              {tags.map(t => (
                <span key={t} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  height: 22, padding: "0 4px 0 8px",
                  background: `color-mix(in oklch, ${ACCENT} 14%, transparent)`,
                  border: `1px solid color-mix(in oklch, ${ACCENT} 28%, transparent)`,
                  borderRadius: 999,
                  fontSize: 11.5, color: ACCENT,
                  fontFamily: "var(--font-mono)",
                }}>
                  #{t}
                  <button
                    onClick={() => setTags(tags.filter(x => x !== t))}
                    aria-label={`remove ${t}`}
                    style={{
                      width: 16, height: 16, borderRadius: 999,
                      color: "currentColor", opacity: .7,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon.X size={9} />
                  </button>
                </span>
              ))}
              <input
                value={tagDraft}
                onChange={e => setTagDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") { e.preventDefault(); addTag(); }
                }}
                placeholder={tags.length ? "" : "add tag"}
                style={{
                  flex: 1, minWidth: 60,
                  background: "transparent", border: 0, outline: 0,
                  fontSize: 12.5, color: "var(--fg)", height: 22,
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          </div>

          <div>
            <Label>Alt text · accessibility</Label>
            <input
              value={altText}
              onChange={e => setAltText(e.target.value)}
              placeholder="Describe the pin for screen readers"
              style={{
                width: "100%", padding: "8px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 12.5, color: "var(--fg)", outline: 0,
              }}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10.5, fontFamily: "var(--font-mono)",
      color: "var(--fg-faint)", letterSpacing: 0.6,
      textTransform: "uppercase", marginBottom: 4,
    }}>{children}</div>
  );
}
