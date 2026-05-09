/**
 * Live playground for agent-feedback-ui.
 *
 * The "agent" is simulated — clicking the action buttons emits a
 * hardcoded draft. The real value of the demo is showing how the four
 * feedback strategies reshape the chain differently when you edit /
 * accept / discard the draft, and how multiple action types share one
 * FeedbackProvider via a templates registry.
 *
 * Right panel shows exactly what the library produced: the Edit, the
 * RewriteResult, the chainOps a real adapter would apply.
 */

import { useState } from "react";
import { applyFeedback } from "agent-feedback-ui";
import type {
  Action,
  Edit,
  FeedbackStrategy,
  RewriteResult,
} from "agent-feedback-ui";
import {
  EmailModal,
  SlackModal,
  type EmailPayload,
  type SlackPayload,
} from "agent-feedback-ui/templates";
import { FeedbackProvider, useOpenAction } from "agent-feedback-ui/react";

type StrategyKind = FeedbackStrategy["kind"];

interface OutputState {
  action: Action<unknown>;
  edit: Edit<unknown>;
  result: RewriteResult<unknown>;
}

interface Scenario {
  label: string;
  type: "send_email" | "send_slack";
  payload: EmailPayload | SlackPayload;
}

const SCENARIOS: Scenario[] = [
  {
    label: "Email — welcome (formal)",
    type: "send_email",
    payload: {
      to: "alice@example.com",
      subject: "Welcome to Mantiq",
      body:
        "Dear Ms. Lambert,\n\nIt is with great pleasure that we welcome you to the Mantiq platform. Should you require any assistance, please do not hesitate to reach out at your earliest convenience.\n\nWarm regards,\nThe Mantiq Team",
    } as EmailPayload,
  },
  {
    label: "Email — invoice nudge",
    type: "send_email",
    payload: {
      to: "billing@example.com",
      subject: "Invoice #4271 — past due",
      body:
        "Hi team,\n\nWanted to flag that invoice #4271 is now 14 days past due. Could someone confirm receipt and let me know expected payment date?\n\nThanks,\nT",
    } as EmailPayload,
  },
  {
    label: "Slack — deploy announcement",
    type: "send_slack",
    payload: {
      channel: "general",
      text: "Hey team, deploy is complete. Hotfix went out at 14:20 UTC.",
    } as SlackPayload,
  },
  {
    label: "Slack — ephemeral nudge",
    type: "send_slack",
    payload: {
      channel: "engineering",
      text: "Friendly reminder: code review SLA is 4h. You have 2 PRs waiting.",
      ephemeral: true,
    } as SlackPayload,
  },
];

const DEFAULT_RULE_EXTRACTOR = (action: Action, _edit: Edit): string =>
  `For ${action.type} actions, prefer the user's edited tone and structure over the original draft.`;

export function App() {
  const [strategy, setStrategy] = useState<StrategyKind>("silent");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [output, setOutput] = useState<OutputState | null>(null);
  const [constraints, setConstraints] = useState<string[]>([]);

  const fullStrategy: FeedbackStrategy =
    strategy === "constraint"
      ? { kind: "constraint", extractRule: DEFAULT_RULE_EXTRACTOR }
      : strategy === "retry"
        ? { kind: "retry" }
        : { kind: strategy };

  const handleEdit = (action: Action<unknown>, edit: Edit<unknown>) => {
    const result = applyFeedback(action, edit, fullStrategy);
    if (result.systemConstraint) {
      setConstraints((c) => [...c, result.systemConstraint as string]);
    }
    setOutput({ action, edit, result });
  };

  return (
    <FeedbackProvider
      templates={{
        send_email: EmailModal as unknown as React.ComponentType<{
          action: Action<unknown>;
          onSubmit: (edit: Edit<unknown>) => void;
        }>,
        send_slack: SlackModal as unknown as React.ComponentType<{
          action: Action<unknown>;
          onSubmit: (edit: Edit<unknown>) => void;
        }>,
      }}
    >
      <PlaygroundUI
        strategy={strategy}
        setStrategy={setStrategy}
        scenarioIdx={scenarioIdx}
        setScenarioIdx={setScenarioIdx}
        output={output}
        setOutput={setOutput}
        constraints={constraints}
        clearConstraints={() => setConstraints([])}
        onEdit={handleEdit}
      />
    </FeedbackProvider>
  );
}

interface PlaygroundUIProps {
  strategy: StrategyKind;
  setStrategy: (s: StrategyKind) => void;
  scenarioIdx: number;
  setScenarioIdx: (i: number) => void;
  output: OutputState | null;
  setOutput: (o: OutputState | null) => void;
  constraints: string[];
  clearConstraints: () => void;
  onEdit: (action: Action<unknown>, edit: Edit<unknown>) => void;
}

function PlaygroundUI({
  strategy,
  setStrategy,
  scenarioIdx,
  setScenarioIdx,
  output,
  setOutput,
  constraints,
  clearConstraints,
  onEdit,
}: PlaygroundUIProps) {
  const openAction = useOpenAction();

  const startAction = async () => {
    const scenario = SCENARIOS[scenarioIdx];
    if (!scenario) return;
    setOutput(null);
    const action: Action<unknown> = {
      type: scenario.type,
      id: `act-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      payload: scenario.payload,
      context: { stepId: `step-${Date.now()}`, runId: "run-playground" },
    };
    const edit = await openAction(action);
    onEdit(action, edit);
  };

  return (
    <div className="afu-playground">
      <header className="afu-playground__header">
        <h1>agent-feedback-ui playground</h1>
        <p>
          Pick a feedback strategy, simulate an agent drafting an email or
          Slack message, edit it (or accept / discard), and see exactly what
          the library produces. Both templates share one{" "}
          <code>FeedbackProvider</code>; the modal opens via{" "}
          <code>useOpenAction()</code>.
        </p>
      </header>

      <main className="afu-playground__main">
        <section className="afu-playground__panel afu-playground__panel--controls">
          <h2>1. Pick a strategy</h2>
          <div className="afu-playground__strategy-grid">
            {(["silent", "visible", "retry", "constraint"] as const).map((s) => (
              <label
                key={s}
                className={`afu-playground__strategy ${strategy === s ? "is-active" : ""}`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value={s}
                  checked={strategy === s}
                  onChange={() => setStrategy(s)}
                />
                <strong>{s}</strong>
                <span className="afu-playground__strategy-desc">
                  {strategyDescription(s)}
                </span>
              </label>
            ))}
          </div>

          <h2>2. Pick a draft scenario</h2>
          <select
            className="afu-playground__select"
            value={scenarioIdx}
            onChange={(e) => setScenarioIdx(Number(e.target.value))}
          >
            {SCENARIOS.map((s, i) => (
              <option key={i} value={i}>
                {s.label}
              </option>
            ))}
          </select>

          <h2>3. Simulate the agent</h2>
          <button
            type="button"
            className="afu-playground__primary"
            onClick={startAction}
          >
            Have agent draft this →
          </button>

          {constraints.length > 0 ? (
            <div className="afu-playground__constraints">
              <h3>System constraints accumulated</h3>
              <ul>
                {constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              <button
                type="button"
                className="afu-playground__link-btn"
                onClick={clearConstraints}
              >
                Clear
              </button>
            </div>
          ) : null}
        </section>

        <section className="afu-playground__panel afu-playground__panel--output">
          <h2>What the library produced</h2>
          {output ? (
            <OutputView state={output} />
          ) : (
            <div className="afu-playground__placeholder">
              Submit the modal to see the resulting <code>Edit</code>,{" "}
              <code>RewriteResult</code>, and <code>chainOps</code>.
            </div>
          )}
        </section>
      </main>

      <footer className="afu-playground__footer">
        <a href="https://github.com/theohmwoa/agent-feedback-ui">
          github.com/theohmwoa/agent-feedback-ui
        </a>
      </footer>
    </div>
  );
}

function OutputView({ state }: { state: OutputState }) {
  const { edit, result } = state;
  return (
    <div className="afu-playground__output">
      <div>
        <h3>1. Edit (what the user did)</h3>
        <pre>{JSON.stringify(edit, null, 2)}</pre>
      </div>

      <div>
        <h3>2. Strategy outcome (flags)</h3>
        <ul className="afu-playground__flags">
          <li>
            <code>retry</code>: <strong>{String(result.retry)}</strong>
            {result.retry ? <small> (host should redrive the agent loop)</small> : null}
          </li>
          <li>
            <code>rejected</code>: <strong>{String(result.rejected)}</strong>
            {result.rejected ? <small> (action will not proceed)</small> : null}
          </li>
          <li>
            <code>systemConstraint</code>:{" "}
            <strong>{result.systemConstraint ? "set" : "—"}</strong>
          </li>
        </ul>
      </div>

      <div>
        <h3>3. effectivePayload (what the tool's execute would receive)</h3>
        <pre>
          {JSON.stringify(
            result.retry || result.rejected
              ? {
                  __note: "tool would NOT execute",
                  originalPayload: result.effectivePayload,
                }
              : result.effectivePayload,
            null,
            2,
          )}
        </pre>
      </div>

      <div>
        <h3>4. chainOps (what the runtime adapter would apply)</h3>
        {result.chainOps.length === 0 ? (
          <pre>[] (no chain modifications)</pre>
        ) : (
          <pre>{JSON.stringify(result.chainOps, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

function strategyDescription(s: StrategyKind): string {
  switch (s) {
    case "silent":
      return "Replace the draft. Agent has no record of the edit.";
    case "visible":
      return "Keep both. Append a 'user revised this' message.";
    case "retry":
      return "Discard the draft. Have the agent redraft with feedback.";
    case "constraint":
      return "Apply the edit and derive a session-wide rule for future drafts.";
  }
}
