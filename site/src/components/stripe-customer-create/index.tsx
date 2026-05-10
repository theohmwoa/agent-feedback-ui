import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { STRIPE_CUSTOMER_CREATE_DEFAULT } from "./types";
import type {
  StripeCustomerCreateIntent, StripeCustomerCreatePayload, CustomerMetadata, CustomerAddress,
} from "./types";

export type {
  StripeCustomerCreateIntent, StripeCustomerCreatePayload, CustomerMetadata, CustomerAddress,
} from "./types";
export { STRIPE_CUSTOMER_CREATE_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.18 290)";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"];

export function StripeCustomerCreate({
  intent = STRIPE_CUSTOMER_CREATE_DEFAULT,
  onResult,
}: {
  intent?: StripeCustomerCreateIntent;
  onResult?: (r: ReviewResult<StripeCustomerCreatePayload>) => void;
}) {
  const [name, setName] = React.useState(intent.name);
  const [email, setEmail] = React.useState(intent.email);
  const [phone, setPhone] = React.useState(intent.phone ?? "");
  const [currency, setCurrency] = React.useState(intent.defaultCurrency ?? "USD");
  const [address, setAddress] = React.useState<CustomerAddress | undefined>(intent.address);
  const [addressOpen, setAddressOpen] = React.useState(!!intent.address);
  const [metadata, setMetadata] = React.useState<CustomerMetadata[]>(intent.metadata ?? []);
  const [taxId, setTaxId] = React.useState(intent.taxId?.value ?? "");
  const [welcome, setWelcome] = React.useState(intent.sendWelcomeEmail ?? true);

  const edited =
    name !== intent.name ||
    email !== intent.email ||
    phone !== (intent.phone ?? "") ||
    currency !== (intent.defaultCurrency ?? "USD") ||
    JSON.stringify(address) !== JSON.stringify(intent.address) ||
    JSON.stringify(metadata) !== JSON.stringify(intent.metadata ?? []) ||
    taxId !== (intent.taxId?.value ?? "") ||
    welcome !== (intent.sendWelcomeEmail ?? true);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      name, email,
      phone: phone || undefined,
      defaultCurrency: currency,
      address,
      metadata,
      taxId: taxId ? { type: intent.taxId?.type ?? "us_ein", value: taxId } : undefined,
      sendWelcomeEmail: welcome,
    },
    summary: `Customer · ${name} · ${email}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Customer create cancelled" });

  const updateMeta = (i: number, patch: Partial<CustomerMetadata>) =>
    setMetadata(prev => prev.map((m, idx) => idx === i ? { ...m, ...patch } : m));
  const addMeta = () => setMetadata(prev => [...prev, { key: "", value: "" }]);
  const removeMeta = (i: number) => setMetadata(prev => prev.filter((_, idx) => idx !== i));

  const updateAddr = (patch: Partial<CustomerAddress>) =>
    setAddress(prev => ({
      line1: "", city: "", state: "", postalCode: "", country: "US",
      ...prev,
      ...patch,
    } as CustomerAddress));

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
          <Pill tone={intent.livemode ? "warn" : "default"} size="sm">
            {intent.livemode ? "live mode" : "test mode"}
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
            {metadata.length} metadata · {address ? "address ✓" : "no address"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Create edited customer" : "Create customer"}
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

      {/* Identity */}
      <div style={{
        padding: "16px 18px",
        display: "flex", alignItems: "flex-start", gap: 12,
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Avatar name={name} size={40} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <Field label="Name">
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle()} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Field label="Email">
              <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle("mono")} />
            </Field>
            <Field label="Phone">
              <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle("mono")} placeholder="+1 (415) …" />
            </Field>
          </div>
        </div>
      </div>

      {/* Currency + tax */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Field label="Default currency">
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={inputStyle("mono")}
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Tax ID (optional)">
          <input value={taxId} onChange={e => setTaxId(e.target.value)} style={inputStyle("mono")} placeholder="EIN, VAT, …" />
        </Field>
      </div>

      {/* Address — collapsible */}
      <div style={{ borderBottom: "1px solid var(--border-faint)" }}>
        <button
          onClick={() => setAddressOpen(o => !o)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px",
            fontSize: 12, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)", textAlign: "left",
            textTransform: "uppercase", letterSpacing: 0.6,
          }}
        >
          <Icon.ChevronRight
            size={12}
            style={{ transform: addressOpen ? "rotate(90deg)" : "none", transition: "transform .14s" }}
          />
          Address {address && <span style={{ color: "var(--fg-faint)", textTransform: "none", letterSpacing: 0 }}>· {address.city}, {address.state}</span>}
        </button>
        {addressOpen && (
          <div style={{
            padding: "0 18px 14px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Line 1">
                <input
                  value={address?.line1 ?? ""}
                  onChange={e => updateAddr({ line1: e.target.value })}
                  style={inputStyle()}
                />
              </Field>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Line 2">
                <input
                  value={address?.line2 ?? ""}
                  onChange={e => updateAddr({ line2: e.target.value })}
                  style={inputStyle()}
                />
              </Field>
            </div>
            <Field label="City">
              <input value={address?.city ?? ""} onChange={e => updateAddr({ city: e.target.value })} style={inputStyle()} />
            </Field>
            <Field label="State">
              <input value={address?.state ?? ""} onChange={e => updateAddr({ state: e.target.value })} style={inputStyle()} />
            </Field>
            <Field label="Postal code">
              <input value={address?.postalCode ?? ""} onChange={e => updateAddr({ postalCode: e.target.value })} style={inputStyle("mono")} />
            </Field>
            <Field label="Country">
              <input value={address?.country ?? ""} onChange={e => updateAddr({ country: e.target.value })} style={inputStyle("mono")} />
            </Field>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div style={{
        padding: "12px 18px 6px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Metadata</div>
        {metadata.map((m, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 24px", gap: 6,
            marginBottom: 6, alignItems: "center",
          }}>
            <input
              value={m.key}
              onChange={e => updateMeta(i, { key: e.target.value })}
              placeholder="key"
              style={inputStyle("mono")}
            />
            <input
              value={m.value}
              onChange={e => updateMeta(i, { value: e.target.value })}
              placeholder="value"
              style={inputStyle("mono")}
            />
            <button
              onClick={() => removeMeta(i)}
              style={{ color: "var(--fg-faint)", padding: 4 }}
              aria-label="remove"
            ><Icon.X size={11} /></button>
          </div>
        ))}
        <button
          onClick={addMeta}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)", padding: "6px 0",
          }}
        ><Icon.Plus size={11} /> add key/value</button>
      </div>

      {/* Welcome email */}
      <label style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px 14px",
        cursor: "pointer",
        fontSize: 13, color: "var(--fg-muted)",
      }}>
        <input
          type="checkbox"
          checked={welcome}
          onChange={e => setWelcome(e.target.checked)}
          style={{ accentColor: ACCENT }}
        />
        <span>Send welcome email with portal access link</span>
      </label>
    </ModalShell>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{
        fontSize: 11, fontFamily: "var(--font-mono)",
        color: "var(--fg-faint)",
        textTransform: "uppercase", letterSpacing: 0.6,
      }}>{label}</span>
      {children}
    </label>
  );
}
