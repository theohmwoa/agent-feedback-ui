import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { PIPEDRIVE_DEFAULT } from "./types";
import type {
  PipedriveDealIntent,
  PipedriveDealPayload,
  PipedriveLabel,
} from "./types";

export type {
  PipedriveDealIntent,
  PipedriveDealPayload,
  PipedriveLabel,
  PipedrivePipeline,
  PipedriveStage,
} from "./types";
export { PIPEDRIVE_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.18 145)";

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function PipedriveDeal({
  intent = PIPEDRIVE_DEFAULT,
  onResult,
}: {
  intent?: PipedriveDealIntent;
  onResult?: (r: ReviewResult<PipedriveDealPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [valueCents, setValueCents] = React.useState(intent.valueCents);
  const [pipelineId, setPipelineId] = React.useState(intent.pipelineId);
  const [stageId, setStageId] = React.useState(intent.stageId);
  const [closeDate, setCloseDate] = React.useState(intent.expectedCloseDate);
  const [labels, setLabels] = React.useState<PipedriveLabel[]>(intent.labels);

  const pipeline = intent.pipelines.find(p => p.id === pipelineId)!;
  const validStage = pipeline.stages.some(s => s.id === stageId)
    ? stageId
    : pipeline.stages[0]!.id;

  const edited =
    title !== intent.title ||
    valueCents !== intent.valueCents ||
    pipelineId !== intent.pipelineId ||
    validStage !== intent.stageId ||
    closeDate !== intent.expectedCloseDate ||
    JSON.stringify(labels) !== JSON.stringify(intent.labels);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      mode: intent.mode,
      title,
      valueCents,
      currency: intent.currency,
      pipelineId,
      stageId: validStage,
      expectedCloseDate: closeDate,
      personId: intent.person.id,
      organizationId: intent.organization.id,
      labelIds: labels.map(l => l.id),
    },
    summary: `${title} · ${formatAmount(valueCents, intent.currency)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Pipedrive action cancelled" });

  const removeLabel = (id: number) => setLabels(prev => prev.filter(l => l.id !== id));
  const addLabel = (l: PipedriveLabel) => {
    if (!labels.some(x => x.id === l.id)) setLabels(prev => [...prev, l]);
  };

  const pickablePipeline = (pid: number) => {
    setPipelineId(pid);
    const p = intent.pipelines.find(x => x.id === pid);
    if (p) setStageId(p.stages[0]!.id);
  };

  const dollars = (valueCents / 100).toFixed(0);

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
          <Pill size="sm" tone="default" style={{
            color: ACCENT,
            background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
            borderColor: `color-mix(in oklch, ${ACCENT} 30%, transparent)`,
          }}>
            {intent.mode === "create" ? "create deal" : "move deal"}
          </Pill>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            Pipedrive
          </span>
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
            owner: {intent.owner.name}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Check size={13} />} onClick={submit}>
            {edited ? `Save edited` : intent.mode === "create" ? "Create deal" : "Move deal"}
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

      {/* Title */}
      <div style={{ padding: "16px 18px 0" }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Deal title"
          style={{
            width: "100%", padding: "6px 0",
            background: "transparent",
            border: 0, borderBottom: "1px solid var(--border-faint)",
            outline: 0,
            fontSize: 18, fontWeight: 600, letterSpacing: -0.2,
            color: "var(--fg)",
          }}
        />
      </div>

      {/* Big value */}
      <div style={{
        padding: "20px 24px",
        textAlign: "center",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 6,
        }}>Deal value</div>
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 22, color: "var(--fg-faint)", marginTop: -10 }}>$</span>
          <input
            value={dollars}
            onChange={e => {
              const n = parseInt(e.target.value, 10);
              if (!isNaN(n)) setValueCents(n * 100);
            }}
            type="number"
            style={{
              width: 240,
              fontSize: 48, fontWeight: 600, letterSpacing: -1.5,
              textAlign: "center",
              background: "transparent",
              border: 0, outline: 0,
              color: "var(--fg)",
            }}
          />
        </div>
      </div>

      {/* Pipeline picker */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Pipeline</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {intent.pipelines.map(p => (
            <button
              key={p.id}
              onClick={() => pickablePipeline(p.id)}
              style={{
                padding: "5px 10px",
                background: pipelineId === p.id
                  ? `color-mix(in oklch, ${ACCENT} 18%, transparent)`
                  : "var(--bg-inset)",
                border: `1px solid ${pipelineId === p.id ? ACCENT : "var(--border)"}`,
                borderRadius: 6,
                fontSize: 12,
                color: pipelineId === p.id ? ACCENT : "var(--fg-muted)",
              }}
            >{p.name}</button>
          ))}
        </div>

        {/* Stage chips (kanban-like) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${pipeline.stages.length}, 1fr)`,
          gap: 4,
        }}>
          {pipeline.stages.map(s => (
            <button
              key={s.id}
              onClick={() => setStageId(s.id)}
              style={{
                padding: "8px 6px",
                background: validStage === s.id
                  ? `color-mix(in oklch, ${ACCENT} 22%, transparent)`
                  : "var(--bg-inset)",
                border: `1px solid ${validStage === s.id ? ACCENT : "var(--border-faint)"}`,
                borderTop: `3px solid ${validStage === s.id ? ACCENT : "var(--border)"}`,
                borderRadius: 4,
                fontSize: 10.5,
                color: validStage === s.id ? "var(--fg)" : "var(--fg-muted)",
                lineHeight: 1.3,
              }}
            >{s.name}</button>
          ))}
        </div>
      </div>

      {/* Person + Org + Close date */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{ padding: "12px 18px", borderRight: "1px solid var(--border-faint)" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>Person</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={intent.person.name} size={22} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{intent.person.name}</span>
          </div>
        </div>
        <div style={{ padding: "12px 18px" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>Organization</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: `color-mix(in oklch, ${ACCENT} 25%, transparent)`,
              color: ACCENT,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)",
            }}>{intent.organization.name.charAt(0)}</div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{intent.organization.name}</span>
          </div>
        </div>
      </div>

      {/* Close date + labels */}
      <div style={{ padding: "12px 18px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          marginBottom: 12,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "var(--fg-muted)", fontSize: 12,
          }}>
            <Icon.Calendar size={12} style={{ color: "var(--fg-faint)" }} />
            Expected close
          </div>
          <input
            value={closeDate}
            onChange={e => setCloseDate(e.target.value)}
            style={{
              padding: "5px 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              fontFamily: "var(--font-mono)", fontSize: 12,
              color: "var(--fg)", outline: 0,
            }}
          />
        </div>

        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Labels</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {labels.map(l => (
            <span
              key={l.id}
              onClick={() => removeLabel(l.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "2px 8px",
                background: `color-mix(in oklch, ${l.color} 14%, transparent)`,
                border: `1px solid color-mix(in oklch, ${l.color} 32%, transparent)`,
                borderRadius: 999,
                fontSize: 11,
                color: l.color,
                cursor: "pointer",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: l.color }} />
              {l.name}
              <Icon.X size={10} />
            </span>
          ))}
          {(intent.availableLabels ?? [])
            .filter(l => !labels.some(x => x.id === l.id))
            .map(l => (
              <button
                key={l.id}
                onClick={() => addLabel(l)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "2px 8px",
                  background: "transparent",
                  border: `1px dashed color-mix(in oklch, ${l.color} 30%, transparent)`,
                  borderRadius: 999,
                  fontSize: 11,
                  color: "var(--fg-muted)",
                }}
              >
                <Icon.Plus size={10} />
                {l.name}
              </button>
            ))}
        </div>
      </div>
    </ModalShell>
  );
}
