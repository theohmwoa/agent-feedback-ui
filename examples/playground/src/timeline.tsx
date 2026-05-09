import { Fragment } from "react";
import { Icon } from "./icons.js";
import type { ChainStep } from "./data.js";

export type StepState =
  | "edited"
  | "superseded"
  | "redrafting"
  | "new"
  | "fading"
  | undefined;

interface StepProps {
  step: ChainStep;
  state: StepState;
}

export function Step({ step, state }: StepProps) {
  const cls = ["step"];
  if (state === "edited") cls.push("is-edited");
  if (state === "superseded") cls.push("is-superseded");
  if (state === "redrafting") cls.push("is-redrafting");
  if (state === "new") cls.push("is-new");
  if (state === "fading") cls.push("is-fading");

  const kindClass: Record<ChainStep["kind"], string> = {
    prompt: "k-prompt",
    message: "k-message",
    toolcall: "k-toolcall",
    toolres: "k-toolres",
    revision: "k-revision",
  };

  const isMono = step.kind === "toolcall" || step.kind === "toolres";

  return (
    <div className={cls.join(" ")}>
      <div className="step-head">
        <span className={`step-kind ${kindClass[step.kind] ?? ""}`}>
          {step.label}
        </span>
        <span className="step-id">{step.id}</span>
      </div>
      <div className={`step-body ${isMono ? "mono" : ""}`}>
        {state === "redrafting" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="spark" size={11} />
            redrafting…
          </span>
        ) : (
          step.body
        )}
      </div>
      {step.tag && (
        <span className={`step-tag ${step.tagKind ?? ""}`}>{step.tag}</span>
      )}
    </div>
  );
}

interface ChainTrackProps {
  steps: ChainStep[];
  stateById: Record<string, StepState>;
}

export function ChainTrack({ steps, stateById }: ChainTrackProps) {
  return (
    <div className="chain-canvas">
      <div className="chain-track">
        {steps.map((s, i) => (
          <Fragment key={s.id}>
            <Step step={s} state={stateById[s.id]} />
            {i < steps.length - 1 && (
              <div className="step-arrow">
                <Icon name="arrow" size={16} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
