import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SHOPIFY_PRODUCT_CREATE_DEFAULT } from "./types";
import type {
  ShopifyProductCreateIntent, ShopifyProductCreatePayload, ProductStatus,
} from "./types";

export type {
  ShopifyProductCreateIntent, ShopifyProductCreatePayload, ProductStatus,
} from "./types";
export { SHOPIFY_PRODUCT_CREATE_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.16 145)";
const STATUSES: ProductStatus[] = ["Active", "Draft", "Archived"];

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function ShopifyProductCreate({
  intent = SHOPIFY_PRODUCT_CREATE_DEFAULT,
  onResult,
}: {
  intent?: ShopifyProductCreateIntent;
  onResult?: (r: ReviewResult<ShopifyProductCreatePayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [priceCents, setPriceCents] = React.useState(intent.priceCents);
  const [compareAtCents, setCompareAtCents] = React.useState(intent.compareAtCents);
  const [tracked, setTracked] = React.useState(intent.inventoryTracked ?? true);
  const [qty, setQty] = React.useState(intent.inventoryQty ?? 0);
  const [weight, setWeight] = React.useState(intent.weightGrams ?? 0);
  const [shipping, setShipping] = React.useState(intent.requiresShipping ?? true);
  const [seoTitle, setSeoTitle] = React.useState(intent.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = React.useState(intent.seoDescription ?? "");
  const [status, setStatus] = React.useState<ProductStatus>(intent.status ?? "Draft");
  const [tags, setTags] = React.useState<string[]>(intent.tags ?? []);
  const [tagInput, setTagInput] = React.useState("");

  const edited =
    title !== intent.title ||
    description !== intent.description ||
    priceCents !== intent.priceCents ||
    compareAtCents !== intent.compareAtCents ||
    tracked !== (intent.inventoryTracked ?? true) ||
    qty !== (intent.inventoryQty ?? 0) ||
    weight !== (intent.weightGrams ?? 0) ||
    shipping !== (intent.requiresShipping ?? true) ||
    seoTitle !== (intent.seoTitle ?? "") ||
    seoDesc !== (intent.seoDescription ?? "") ||
    status !== (intent.status ?? "Draft") ||
    JSON.stringify(tags) !== JSON.stringify(intent.tags ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      title, description,
      imageUrl: intent.imageUrl,
      priceCents, compareAtCents,
      currency: intent.currency,
      inventoryTracked: tracked,
      inventoryQty: tracked ? qty : undefined,
      weightGrams: weight || undefined,
      requiresShipping: shipping,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDesc || undefined,
      status, tags,
    },
    summary: `${title} · ${fmt(priceCents, intent.currency)} · ${status}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Product create cancelled` });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
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
          <div style={{ flex: 1 }} />
          <Pill tone={status === "Active" ? "ok" : status === "Draft" ? "default" : "warn"} size="sm">
            {status}
          </Pill>
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
            {tags.length} tag{tags.length === 1 ? "" : "s"} · {tracked ? `${qty} in stock` : "untracked"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Create edited product" : "Create product"}
          </Button>
        </div>
      }
    >
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "12px 16px",
          background: `color-mix(in oklch, ${ACCENT} 8%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px" }}>
        {/* Main column */}
        <div style={{
          padding: "16px 18px",
          borderRight: "1px solid var(--border-faint)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Product title"
            style={{
              width: "100%", padding: "8px 0",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 22, fontWeight: 600, letterSpacing: -0.4,
              color: "var(--fg)",
              borderBottom: "1px solid var(--border-faint)",
            }}
          />

          <Field label="Description" toolbar="rich-text">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              style={{
                width: "100%", padding: "10px 12px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 8, outline: 0,
                fontSize: 13, lineHeight: 1.55,
                color: "var(--fg)",
              }}
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Price">
              <MoneyInput
                cents={priceCents} onChange={setPriceCents} currency={intent.currency}
              />
            </Field>
            <Field label="Compare at (was)">
              <MoneyInput
                cents={compareAtCents ?? 0}
                onChange={c => setCompareAtCents(c || undefined)}
                currency={intent.currency}
              />
            </Field>
          </div>

          {/* Inventory */}
          <div>
            <label style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12.5, color: "var(--fg-muted)",
              cursor: "pointer", marginBottom: 8,
            }}>
              <input
                type="checkbox"
                checked={tracked}
                onChange={e => setTracked(e.target.checked)}
                style={{ accentColor: ACCENT }}
              />
              <span>Track inventory</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Quantity">
                <input
                  type="number"
                  min={0}
                  disabled={!tracked}
                  value={qty}
                  onChange={e => setQty(parseInt(e.target.value) || 0)}
                  style={inputStyle("mono")}
                />
              </Field>
              <Field label="Weight (grams)">
                <input
                  type="number"
                  min={0}
                  value={weight}
                  onChange={e => setWeight(parseInt(e.target.value) || 0)}
                  style={inputStyle("mono")}
                />
              </Field>
            </div>
            <label style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12.5, color: "var(--fg-muted)",
              cursor: "pointer", marginTop: 8,
            }}>
              <input
                type="checkbox"
                checked={shipping}
                onChange={e => setShipping(e.target.checked)}
                style={{ accentColor: ACCENT }}
              />
              <span>This is a physical product (requires shipping)</span>
            </label>
          </div>

          {/* SEO */}
          <details style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
          }}>
            <summary style={{
              padding: "10px 12px",
              fontSize: 12, fontFamily: "var(--font-mono)",
              color: "var(--fg-muted)",
              cursor: "pointer",
              textTransform: "uppercase", letterSpacing: 0.6,
            }}>SEO</summary>
            <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                placeholder="SEO title"
                style={inputStyle()}
              />
              <textarea
                value={seoDesc}
                onChange={e => setSeoDesc(e.target.value)}
                placeholder="SEO description"
                rows={2}
                style={{ ...inputStyle(), padding: "8px 10px", resize: "vertical" as const }}
              />
            </div>
          </details>
        </div>

        {/* Sidebar */}
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Image preview */}
          <div>
            <div style={{
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
              textTransform: "uppercase", letterSpacing: 0.6,
              marginBottom: 6,
            }}>Image</div>
            <div style={{
              aspectRatio: "1 / 1",
              background: "var(--bg-inset)",
              border: "1px dashed var(--border-strong)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundImage: intent.imageUrl ? `url(${intent.imageUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
              {!intent.imageUrl && <Icon.Image size={20} style={{ color: "var(--fg-faint)" }} />}
            </div>
          </div>

          {/* Status */}
          <div>
            <div style={{
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
              textTransform: "uppercase", letterSpacing: 0.6,
              marginBottom: 6,
            }}>Status</div>
            <div style={{
              display: "flex", flexDirection: "column", gap: 4,
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              padding: 4,
            }}>
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: "6px 8px",
                    fontSize: 12, textAlign: "left",
                    background: status === s ? "var(--bg-card)" : "transparent",
                    border: status === s ? "1px solid var(--border)" : "1px solid transparent",
                    color: status === s ? "var(--fg)" : "var(--fg-muted)",
                    borderRadius: 6,
                  }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div style={{
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
              textTransform: "uppercase", letterSpacing: 0.6,
              marginBottom: 6,
            }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
              {tags.map(t => (
                <button
                  key={t}
                  onClick={() => setTags(prev => prev.filter(x => x !== t))}
                  style={{
                    padding: "2px 8px",
                    fontSize: 11, fontFamily: "var(--font-mono)",
                    background: "var(--bg-inset)",
                    border: "1px solid var(--border)",
                    borderRadius: 999,
                    color: "var(--fg-muted)",
                  }}
                >{t} <Icon.X size={9} style={{ verticalAlign: "middle", marginLeft: 2 }} /></button>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="add tag…"
              style={{ ...inputStyle("mono"), padding: "6px 8px", fontSize: 12 }}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function MoneyInput({ cents, onChange, currency }: {
  cents: number;
  onChange: (cents: number) => void;
  currency: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)",
      borderRadius: 8, paddingLeft: 10,
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-faint)" }}>
        {currency === "USD" ? "$" : currency}
      </span>
      <input
        type="number"
        min={0} step={0.01}
        value={(cents / 100).toFixed(2)}
        onChange={e => onChange(Math.round(parseFloat(e.target.value) * 100) || 0)}
        style={{
          flex: 1, padding: "8px 10px",
          background: "transparent",
          border: 0, outline: 0,
          fontFamily: "var(--font-mono)", fontSize: 13,
          color: "var(--fg)",
        }}
      />
    </div>
  );
}

function Field({ label, children, toolbar }: {
  label: string; children: React.ReactNode; toolbar?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 11, fontFamily: "var(--font-mono)",
        color: "var(--fg-faint)",
        textTransform: "uppercase", letterSpacing: 0.6,
      }}>
        {label}
        {toolbar && (
          <span style={{ color: "var(--fg-faint)", textTransform: "none", letterSpacing: 0 }}>· {toolbar}</span>
        )}
      </span>
      {children}
    </label>
  );
}

function inputStyle(font?: "mono"): React.CSSProperties {
  return {
    width: "100%", padding: "8px 10px",
    background: "var(--bg-inset)",
    border: "1px solid var(--border)", borderRadius: 8,
    outline: 0,
    fontSize: 13, color: "var(--fg)",
    fontFamily: font === "mono" ? "var(--font-mono)" : "inherit",
  };
}
