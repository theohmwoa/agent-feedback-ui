/**
 * The real playground.
 *
 * Calls the library's `applyFeedback` with a properly-typed `Action`
 * and `Edit` shape, then translates the resulting `chainOps` into the
 * visual chain mutations the UI needs. No simulation: the JSON the
 * inspector shows is exactly what `applyFeedback` returned.
 *
 * Bridge logic between the library's abstract chainOps and the
 * showcase's chain-of-step-cards lives in `applyOpsToChain`. The two
 * representations don't perfectly map (the library doesn't know about
 * "redrafting" pulses or "rule pinned" tags) so the bridge enriches
 * the visual state from `result.retry`, `result.rejected`, and
 * `result.systemConstraint`.
 */

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyFeedback } from "agent-feedback-ui";
import type {
  Action,
  ChainOp,
  Edit,
  FeedbackStrategy,
  RewriteResult,
} from "agent-feedback-ui";
import { Icon } from "./icons.js";
import { ChainTrack, type StepState } from "./timeline.js";
import {
  STRATEGIES,
  SCENARIOS,
  type ChainStep,
  type ChatPayload,
  type EmailPayload,
  type Scenario,
  type ScenarioPayload,
  type StrategyKind,
  type StrategyMeta,
} from "./data.js";
import { ChatModal, EmailModal } from "./modals.js";

type SimulatorHandle = {
  triggerAgent: () => void;
  programmaticRun: (sId: StrategyKind) => void;
};

interface PlaygroundProps {
  strategy: StrategyMeta;
  setStrategy: (s: StrategyMeta) => void;
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
  registerSimulator: (sim: SimulatorHandle) => void;
}

export function Playground({
  strategy,
  setStrategy,
  scenario,
  setScenario,
  registerSimulator,
}: PlaygroundProps) {
  const [chain, setChain] = useState<ChainStep[]>(scenario.chain);
  const [stateById, setStateById] = useState<Record<string, StepState>>({});
  const [result, setResult] = useState<RewriteResult<ScenarioPayload> | null>(
    null,
  );
  const [constraint, setConstraint] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<"rewrite" | "ops" | "edit">("rewrite");
  const [running, setRunning] = useState(false);

  // Reset when scenario changes.
  useEffect(() => {
    setChain(scenario.chain);
    setStateById({});
    setResult(null);
    setConstraint(null);
    setModalOpen(false);
  }, [scenario.id]);

  /** Build a real `FeedbackStrategy` value from the metadata's kind. */
  const makeStrategy = useCallback(
    (kind: StrategyKind): FeedbackStrategy => {
      if (kind === "constraint") {
        return {
          kind: "constraint",
          extractRule: () => scenario.constraintRule,
        };
      }
      return { kind } as FeedbackStrategy;
    },
    [scenario.constraintRule],
  );

  /**
   * Real strategy execution: build an Action + Edit, call applyFeedback,
   * translate the chainOps into visual chain mutations.
   *
   * If the user's payload matches the agent's draft byte-for-byte we
   * emit an `accept` Edit (passthrough). Otherwise we emit `modify`.
   * Discard from the modal emits `reject`.
   */
  const runEdit = useCallback(
    (
      kind: StrategyKind,
      userPayload: ScenarioPayload | null,
      mode: "submit" | "discard",
    ) => {
      const action: Action<ScenarioPayload> = {
        type: scenario.actionType,
        id: scenario.targetStepId,
        payload: scenario.draft,
        context: { stepId: scenario.targetStepId, runId: "playground" },
      };

      let edit: Edit<ScenarioPayload>;
      if (mode === "discard") {
        edit = {
          actionId: action.id,
          outcome: { kind: "reject" },
        };
      } else if (userPayload && payloadsDiffer(userPayload, scenario.draft)) {
        edit = {
          actionId: action.id,
          outcome: { kind: "modify", payload: userPayload },
        };
      } else {
        edit = {
          actionId: action.id,
          outcome: { kind: "accept" },
        };
      }

      const r = applyFeedback(action, edit, makeStrategy(kind));
      const { chain: newChain, stateById: newStates } = applyOpsToChain(
        scenario,
        r,
        userPayload,
      );

      setChain(newChain);
      setStateById(newStates);
      setResult(r);
      setConstraint(r.systemConstraint ?? null);
    },
    [scenario, makeStrategy],
  );

  const triggerAgent = useCallback(() => {
    if (running) return;
    setRunning(true);
    setStateById({});
    setResult(null);
    setConstraint(null);
    setChain(scenario.chain);
    setTimeout(() => {
      setModalOpen(true);
      setRunning(false);
    }, 350);
  }, [scenario, running]);

  /** "Play all four" runs each strategy against the scenario's canonical edit. */
  const programmaticRun = useCallback(
    (sId: StrategyKind) => {
      runEdit(sId, scenario.draft, "submit");
    },
    [runEdit, scenario.draft],
  );

  useEffect(() => {
    registerSimulator({ triggerAgent, programmaticRun });
  }, [registerSimulator, triggerAgent, programmaticRun]);

  const tokenCost = (result?.chainOps?.length ?? 0) * 50;

  const onModalSubmit = (payload: ScenarioPayload) => {
    setModalOpen(false);
    runEdit(strategy.id, payload, "submit");
  };

  const onModalDiscard = () => {
    setModalOpen(false);
    runEdit(strategy.id, null, "discard");
  };

  const onModalClose = () => {
    setModalOpen(false);
  };

  return (
    <section className="playground section" id="playground">
      <div className="section-inner">
        <div className="section-label">
          <span className="dot" /> 02 · Playground
        </div>
        <h2 className="section-title">
          One canvas. Four strategies. Same edit.
        </h2>
        <p className="section-sub">
          Pick a strategy, run the agent, edit the draft. Watch the chain
          reshape itself in place — driven by real <code>applyFeedback</code>{" "}
          calls.
        </p>

        <div className="playground-shell">
          <div className="shell-bar">
            <div className="shell-bar-left">
              <div className="shell-dots">
                <span /><span /><span />
              </div>
              <div className="shell-path">
                <b>playground</b> / <span>{scenario.id}</span> /{" "}
                <span>{strategy.id}</span>
              </div>
            </div>
            <div className="shell-bar-right">
              <span>strategy</span>
              <span className="kbd">1</span>
              <span className="kbd">2</span>
              <span className="kbd">3</span>
              <span className="kbd">4</span>
              <span style={{ marginLeft: 8 }}>simulate</span>
              <span className="kbd">↵</span>
            </div>
          </div>

          <div className="pg-grid">
            <aside className="pg-rail">
              <div className="rail-title">Feedback strategy</div>
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  className={`strategy-item ${
                    strategy.id === s.id ? "active" : ""
                  }`}
                  onClick={() => setStrategy(s)}
                >
                  <span className="strategy-num">{s.num}</span>
                  <span style={{ minWidth: 0 }}>
                    <span className="strategy-name">{s.name}</span>
                    <div className="strategy-desc">{s.short}</div>
                  </span>
                </button>
              ))}

              <div className="rail-divider" />
              <div className="rail-title">Scenario</div>
              <div className="scenario-row">
                {Object.values(SCENARIOS).map((sc) => (
                  <button
                    key={sc.id}
                    className={`scenario-btn ${
                      scenario.id === sc.id ? "active" : ""
                    }`}
                    onClick={() => setScenario(sc)}
                  >
                    <span className="scn-glyph">{sc.glyph}</span>
                    <div className="scn-name">{sc.name}</div>
                    <div className="scn-meta">{sc.meta}</div>
                  </button>
                ))}
              </div>
            </aside>

            <div className="pg-stage">
              <div className="stage-header">
                <div className="stage-title-block">
                  <div className="stage-title">
                    Agent chain
                    <span className="strat-pill">
                      <span
                        className="pip"
                        style={{ background: strategy.accent }}
                      />
                      {strategy.name}
                    </span>
                  </div>
                </div>
                <div className="stage-actions">
                  <div className="stage-cost">
                    tokens <b>~{tokenCost}</b>
                    <span className="hint">illustrative · ops × 50</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={triggerAgent}
                    disabled={running}
                  >
                    <Icon name="play" size={12} />
                    {running ? "running…" : "Run agent"}
                    <span className="kbd">↵</span>
                  </button>
                </div>
              </div>

              {constraint && (
                <div className="constraint-bar">
                  <span className="lock">
                    <Icon name="lock" size={12} />
                  </span>
                  <div className="ctxt">
                    <div className="clabel">Session constraint pinned</div>
                    <div className="crule">{constraint}</div>
                  </div>
                  <span
                    className="step-tag"
                    style={{ alignSelf: "center" }}
                  >
                    scope: session
                  </span>
                </div>
              )}

              <ChainTrack steps={chain} stateById={stateById} />

              <div className="stage-footer">
                <div className="inspector-tabs">
                  <button
                    className={`inspector-tab ${tab === "rewrite" ? "active" : ""}`}
                    onClick={() => setTab("rewrite")}
                  >
                    RewriteResult <span className="count">{result ? "1" : "0"}</span>
                  </button>
                  <button
                    className={`inspector-tab ${tab === "ops" ? "active" : ""}`}
                    onClick={() => setTab("ops")}
                  >
                    chainOps{" "}
                    <span className="count">{result?.chainOps?.length ?? 0}</span>
                  </button>
                  <button
                    className={`inspector-tab ${tab === "edit" ? "active" : ""}`}
                    onClick={() => setTab("edit")}
                  >
                    effectivePayload{" "}
                    <span className="count">{result ? "1" : "0"}</span>
                  </button>
                </div>
                <pre className="inspector-pane">
                  {!result && (
                    <span style={{ color: "var(--fg-faint)" }}>
                      // run the agent to see RewriteResult — keyboard: ↵
                    </span>
                  )}
                  {result && tab === "rewrite" &&
                    colorJson({
                      retry: result.retry,
                      rejected: result.rejected,
                      systemConstraint: result.systemConstraint ?? null,
                      chainOps: `[${result.chainOps.length} ops]`,
                      effectivePayload: result.effectivePayload,
                    })}
                  {result && tab === "ops" && colorJson(result.chainOps)}
                  {result && tab === "edit" && colorJson(result.effectivePayload ?? null)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && scenario.domain === "email" && (
        <EmailModal
          initial={scenario.draft as EmailPayload}
          onSubmit={(p) => onModalSubmit(p)}
          onDiscard={onModalDiscard}
          onClose={onModalClose}
        />
      )}
      {modalOpen && scenario.domain === "chat" && (
        <ChatModal
          initial={scenario.draft as ChatPayload}
          onSubmit={(p) => onModalSubmit(p)}
          onDiscard={onModalDiscard}
          onClose={onModalClose}
        />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Bridge: library chainOps + flags  ->  showcase chain mutations.
// ---------------------------------------------------------------------------

function applyOpsToChain(
  scenario: Scenario,
  result: RewriteResult<ScenarioPayload>,
  userPayload: ScenarioPayload | null,
): { chain: ChainStep[]; stateById: Record<string, StepState> } {
  const newChain: ChainStep[] = scenario.chain.map((s) => ({ ...s }));
  const stateById: Record<string, StepState> = {};

  // retry: the agent should redraft. Mark the target as redrafting; no
  // chainOps are applied to the visual chain (the library's retry
  // chainOp is an `append_message` we surface via the inspector).
  if (result.retry) {
    const idx = newChain.findIndex((s) => s.id === scenario.targetStepId);
    if (idx >= 0 && newChain[idx]) {
      newChain[idx] = {
        ...newChain[idx],
        body: "redrafting based on user hint…",
        label: "Message · redrafting",
        tag: "retry queued",
        tagKind: "warn",
      };
      stateById[scenario.targetStepId] = "redrafting";
    }
    return { chain: newChain, stateById };
  }

  // reject (without retry): action is dropped. Mark the draft step as
  // faded so it's visually clear the agent didn't proceed.
  if (result.rejected) {
    const idx = newChain.findIndex((s) => s.id === scenario.targetStepId);
    if (idx >= 0 && newChain[idx]) {
      newChain[idx] = {
        ...newChain[idx],
        tag: "discarded",
        tagKind: "warn",
      };
      stateById[scenario.targetStepId] = "fading";
    }
    return { chain: newChain, stateById };
  }

  // Accept / modify (silent / visible / constraint): apply the structural
  // chainOps. We use the user's payload (when present) to render the
  // visible-strategy revision step content rather than the library's
  // generic "I revised your X draft" marker — richer visual.
  for (const op of result.chainOps) {
    applyOpToChain(op, newChain, stateById, scenario, userPayload, result);
  }
  return { chain: newChain, stateById };
}

function applyOpToChain(
  op: ChainOp,
  chain: ChainStep[],
  stateById: Record<string, StepState>,
  scenario: Scenario,
  userPayload: ScenarioPayload | null,
  result: RewriteResult<ScenarioPayload>,
): void {
  if (op.kind === "replace_step") {
    const idx = chain.findIndex((s) => s.id === op.stepId);
    if (idx >= 0 && chain[idx]) {
      chain[idx] = {
        ...chain[idx],
        body: formatPayloadForChain(op.payload, scenario.id),
        label: "Message · revised",
        tag: result.systemConstraint
          ? "rule pinned to session"
          : "rewritten silently",
      };
      stateById[op.stepId] = "edited";
    }
  } else if (op.kind === "append_message") {
    const targetIdx = op.afterStepId
      ? chain.findIndex((s) => s.id === op.afterStepId)
      : chain.length - 1;

    // Use the user's edited content for the revision step body — the
    // library's content is "I revised your send_email draft." which is
    // accurate but visually thin.
    const revisionBody = userPayload
      ? formatPayloadForChain(userPayload, scenario.id)
      : op.content;

    const revisionStep: ChainStep = {
      id: `${op.afterStepId ?? "msg"}-rev`,
      kind: "revision",
      label: "Message · user revision",
      body: revisionBody,
      tag: "user revised this",
      tagKind: "cool",
    };

    if (
      targetIdx >= 0 &&
      chain[targetIdx]?.id === scenario.targetStepId
    ) {
      stateById[chain[targetIdx]!.id] = "superseded";
    }

    const insertAt = targetIdx >= 0 ? targetIdx + 1 : chain.length;
    chain.splice(insertAt, 0, revisionStep);
    stateById[revisionStep.id] = "new";
  }
  // append_system_constraint: surfaced via the constraint bar from
  // result.systemConstraint, no chain mutation.
}

function formatPayloadForChain(payload: unknown, scenarioId: string): string {
  if (typeof payload === "string") return payload;
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    if (scenarioId === "email" && typeof p.subject === "string") {
      const body = typeof p.body === "string" ? p.body : "";
      const head = body.split("\n").find((l) => l.trim().length > 0) ?? "";
      return `${p.subject}\n\n${head}…`;
    }
    if (typeof p.body === "string") return p.body;
    return JSON.stringify(payload);
  }
  return String(payload);
}

function payloadsDiffer(a: ScenarioPayload, b: ScenarioPayload): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

// ---------------------------------------------------------------------------
// Pretty-print JSON with token coloring (used in the inspector pane).
// ---------------------------------------------------------------------------

function colorJson(value: unknown, indent: number = 0): ReactNode {
  const pad = "  ".repeat(indent);
  if (value === null) return <span className="json-null">null</span>;
  if (typeof value === "boolean")
    return <span className="json-bool">{String(value)}</span>;
  if (typeof value === "number")
    return <span className="json-num">{value}</span>;
  if (typeof value === "string")
    return <span className="json-str">{JSON.stringify(value)}</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span>[]</span>;
    return (
      <span>
        {"["}
        {"\n"}
        {value.map((v, i) => (
          <Fragment key={i}>
            {pad}
            {"  "}
            {colorJson(v, indent + 1)}
            {i < value.length - 1 ? "," : ""}
            {"\n"}
          </Fragment>
        ))}
        {pad}
        {"]"}
      </span>
    );
  }
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value);
    if (keys.length === 0) return <span>{"{}"}</span>;
    const obj = value as Record<string, unknown>;
    return (
      <span>
        {"{"}
        {"\n"}
        {keys.map((k, i) => (
          <Fragment key={k}>
            {pad}
            {"  "}
            <span className="json-key">"{k}"</span>:{" "}
            {colorJson(obj[k], indent + 1)}
            {i < keys.length - 1 ? "," : ""}
            {"\n"}
          </Fragment>
        ))}
        {pad}
        {"}"}
      </span>
    );
  }
  return <span>{String(value)}</span>;
}
