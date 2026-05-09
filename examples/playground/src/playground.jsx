// Strategy execution + chain animation.
// Given a base chain and an edit, produces a sequence of state snapshots
// for animation, plus the final RewriteResult.

function runStrategy(strategyId, scenario, edit) {
  const targetId = scenario.targetStepId;
  const baseChain = scenario.chain;
  const editedBody = scenario.id === "email"
    ? `${edit.subject}\n\n${edit.body.split("\n")[0]}…`
    : edit.body;

  if (strategyId === "silent") {
    const next = baseChain.map(s => s.id === targetId
      ? { ...s, body: editedBody, label: "Message · revised", tag: "rewritten silently" }
      : s);
    return {
      chain: next,
      stateById: { [targetId]: "edited" },
      result: {
        effectivePayload: edit,
        chainOps: [{ op: "replace", at: targetId, with: { kind: "message", body: editedBody } }],
        retry: false, rejected: false, systemConstraint: null,
      },
      constraint: null,
    };
  }
  if (strategyId === "visible") {
    const idx = baseChain.findIndex(s => s.id === targetId);
    const revisionStep = {
      id: `${targetId}-rev`,
      kind: "revision",
      label: "Message · user revision",
      body: editedBody,
      tag: "user revised this",
      tagKind: "cool",
    };
    const next = [...baseChain];
    next.splice(idx + 1, 0, revisionStep);
    return {
      chain: next,
      stateById: { [targetId]: "superseded", [revisionStep.id]: "new" },
      result: {
        effectivePayload: edit,
        chainOps: [
          { op: "annotate", at: targetId, note: "superseded" },
          { op: "append", after: targetId, with: { kind: "revision", body: editedBody, source: "user" } },
        ],
        retry: false, rejected: false, systemConstraint: null,
      },
      constraint: null,
    };
  }
  if (strategyId === "retry") {
    const next = baseChain.map(s => s.id === targetId
      ? { ...s, body: "redrafting based on user hint…", label: "Message · redrafting", tag: "retry queued", tagKind: "warn" }
      : s);
    return {
      chain: next,
      stateById: { [targetId]: "redrafting" },
      result: {
        effectivePayload: null,
        chainOps: [
          { op: "discard", at: targetId },
          { op: "retry", with: { hint: editedBody } },
        ],
        retry: true, rejected: true, systemConstraint: null,
      },
      constraint: null,
    };
  }
  if (strategyId === "constraint") {
    const next = baseChain.map(s => s.id === targetId
      ? { ...s, body: editedBody, label: "Message · revised", tag: "rule pinned to session" }
      : s);
    return {
      chain: next,
      stateById: { [targetId]: "edited" },
      result: {
        effectivePayload: edit,
        chainOps: [
          { op: "replace", at: targetId, with: { kind: "message", body: editedBody } },
          { op: "constrain", rule: scenario.constraintRule },
        ],
        retry: false, rejected: false, systemConstraint: scenario.constraintRule,
      },
      constraint: scenario.constraintRule,
    };
  }
}

// JSON pretty-printer with token coloring
function colorJson(value, indent = 0) {
  const pad = "  ".repeat(indent);
  if (value === null) return <span className="json-null">null</span>;
  if (typeof value === "boolean") return <span className="json-bool">{String(value)}</span>;
  if (typeof value === "number") return <span className="json-num">{value}</span>;
  if (typeof value === "string") return <span className="json-str">{JSON.stringify(value)}</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return <span>[]</span>;
    return (
      <span>{"["}{"\n"}{value.map((v, i) => (
        <span key={i}>{pad}{"  "}{colorJson(v, indent + 1)}{i < value.length - 1 ? "," : ""}{"\n"}</span>
      ))}{pad}{"]"}</span>
    );
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return <span>{"{}"}</span>;
  return (
    <span>{"{"}{"\n"}{keys.map((k, i) => (
      <span key={k}>{pad}{"  "}<span className="json-key">"{k}"</span>: {colorJson(value[k], indent + 1)}{i < keys.length - 1 ? "," : ""}{"\n"}</span>
    ))}{pad}{"}"}</span>
  );
}

const Playground = ({
  strategy, setStrategy,
  scenario, setScenario,
  registerSimulator,
}) => {
  const [chain, setChain] = React.useState(scenario.chain);
  const [stateById, setStateById] = React.useState({});
  const [result, setResult] = React.useState(null);
  const [constraint, setConstraint] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [tab, setTab] = React.useState("rewrite");
  const [running, setRunning] = React.useState(false);

  // Reset when scenario changes
  React.useEffect(() => {
    setChain(scenario.chain);
    setStateById({});
    setResult(null);
    setConstraint(null);
  }, [scenario.id]);

  const triggerAgent = React.useCallback(() => {
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

  const runWithEdit = React.useCallback((edit) => {
    setModalOpen(false);
    const out = runStrategy(strategy.id, scenario, edit);
    setChain(out.chain);
    setStateById(out.stateById);
    setResult(out.result);
    setConstraint(out.constraint);
  }, [strategy, scenario]);

  // Programmatic run for "play all four"
  const programmaticRun = React.useCallback((stratId) => {
    const out = runStrategy(stratId, scenario, scenario.edit);
    setChain(out.chain);
    setStateById(out.stateById);
    setResult(out.result);
    setConstraint(out.constraint);
  }, [scenario]);

  React.useEffect(() => {
    if (registerSimulator) {
      registerSimulator({ triggerAgent, runWithEdit, programmaticRun });
    }
  }, [registerSimulator, triggerAgent, runWithEdit, programmaticRun]);

  const tokenCost = (result?.chainOps?.length ?? 0) * 50;

  return (
    <section className="playground section" id="playground">
      <div className="section-inner">
        <div className="section-label"><span className="dot" /> 02 · Playground</div>
        <h2 className="section-title">One canvas. Four strategies. Same edit.</h2>
        <p className="section-sub">
          Pick a strategy, run the agent, edit the draft. Watch the chain reshape itself in place.
        </p>

        <div className="playground-shell">
          <div className="shell-bar">
            <div className="shell-bar-left">
              <div className="shell-dots"><span/><span/><span/></div>
              <div className="shell-path">
                <b>playground</b> / <span>{scenario.id}</span> / <span>{strategy.id}</span>
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
              {STRATEGIES.map(s => (
                <button
                  key={s.id}
                  className={`strategy-item ${strategy.id === s.id ? "active" : ""}`}
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
                {Object.values(SCENARIOS).map(sc => (
                  <button
                    key={sc.id}
                    className={`scenario-btn ${scenario.id === sc.id ? "active" : ""}`}
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
                      <span className="pip" style={{ background: strategy.accent }} />
                      {strategy.name}
                    </span>
                  </div>
                </div>
                <div className="stage-actions">
                  <div className="stage-cost">
                    tokens <b>~{tokenCost}</b><span className="hint">illustrative · ops × 50</span>
                  </div>
                  <button className="btn btn-primary" onClick={triggerAgent} disabled={running}>
                    <Icon name="play" size={12} />
                    {running ? "running…" : "Run agent"}
                    <span className="kbd">↵</span>
                  </button>
                </div>
              </div>

              {constraint && (
                <div className="constraint-bar">
                  <span className="lock"><Icon name="lock" size={12} /></span>
                  <div className="ctxt">
                    <div className="clabel">Session constraint pinned</div>
                    <div className="crule">{constraint}</div>
                  </div>
                  <span className="step-tag" style={{ alignSelf: "center" }}>scope: session</span>
                </div>
              )}

              <ChainTrack steps={chain} stateById={stateById} />

              <div className="stage-footer">
                <div className="inspector-tabs">
                  <button className={`inspector-tab ${tab === "rewrite" ? "active" : ""}`} onClick={() => setTab("rewrite")}>
                    RewriteResult <span className="count">{result ? "1" : "0"}</span>
                  </button>
                  <button className={`inspector-tab ${tab === "ops" ? "active" : ""}`} onClick={() => setTab("ops")}>
                    chainOps <span className="count">{result?.chainOps?.length ?? 0}</span>
                  </button>
                  <button className={`inspector-tab ${tab === "edit" ? "active" : ""}`} onClick={() => setTab("edit")}>
                    Edit <span className="count">{result?.effectivePayload ? "1" : "0"}</span>
                  </button>
                </div>
                <pre className="inspector-pane">
                  {!result && <span style={{ color: "var(--fg-faint)" }}>// run the agent to see RewriteResult — keyboard: ↵</span>}
                  {result && tab === "rewrite" && colorJson({
                    effectivePayload: result.effectivePayload ? "[Edit]" : null,
                    chainOps: `[${result.chainOps.length} ops]`,
                    retry: result.retry,
                    rejected: result.rejected,
                    systemConstraint: result.systemConstraint,
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
        <EmailModal initial={scenario.edit} onSend={runWithEdit} onClose={() => setModalOpen(false)} />
      )}
      {modalOpen && scenario.domain === "chat" && (
        <ChatModal initial={scenario.edit} onSend={runWithEdit} onClose={() => setModalOpen(false)} />
      )}
    </section>
  );
};

window.runStrategy = runStrategy;
window.colorJson = colorJson;
window.Playground = Playground;
