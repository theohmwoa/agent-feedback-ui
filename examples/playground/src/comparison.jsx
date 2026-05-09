// Side-by-side comparison: same edit through all four strategies.

const MiniStep = ({ kind, body, mode }) => {
  const cls = ["cmp-mini-step"];
  if (mode === "new") cls.push("is-new");
  if (mode === "stale") cls.push("is-stale");
  if (mode === "redraft") cls.push("is-redraft");
  return (
    <div className={cls.join(" ")}>
      <span className="ms-kind">{kind}</span>
      <span className="ms-body">{body}</span>
    </div>
  );
};

const buildMiniSteps = (strategyId, scenario) => {
  // We collapse to a 4-step arc so all four cards render at the same scale.
  const draft = scenario.id === "email" ? "warm reply" : "vague ack";
  const edited = scenario.id === "email" ? "concrete + offer slot" : "rate · region · ETA";
  if (strategyId === "silent") {
    return [
      { kind: "prompt",  body: "user task" },
      { kind: "tool",    body: "fetch context" },
      { kind: "msg",     body: edited, mode: "new" },
      { kind: "tool",    body: "send" },
    ];
  }
  if (strategyId === "visible") {
    return [
      { kind: "prompt",  body: "user task" },
      { kind: "msg",     body: draft, mode: "stale" },
      { kind: "rev",     body: edited, mode: "new" },
      { kind: "tool",    body: "send" },
    ];
  }
  if (strategyId === "retry") {
    return [
      { kind: "prompt",  body: "user task" },
      { kind: "tool",    body: "fetch context" },
      { kind: "msg",     body: "redrafting…", mode: "redraft" },
      { kind: "msg",     body: "new draft", mode: "new" },
    ];
  }
  if (strategyId === "constraint") {
    return [
      { kind: "rule",    body: "session rule pinned", mode: "new" },
      { kind: "prompt",  body: "user task" },
      { kind: "msg",     body: edited, mode: "new" },
      { kind: "tool",    body: "send (rule-aware)" },
    ];
  }
};

const Comparison = ({ scenario, locked, setLocked }) => {
  const ops = { silent: 1, visible: 2, retry: 2, constraint: 2 };
  return (
    <section className="comparison section" id="comparison">
      <div className="section-inner">
        <div className="section-label"><span className="dot" /> 03 · Compare</div>
        <h2 className="section-title">Same edit. Four very different chains.</h2>
        <p className="section-sub">
          Hover a card to highlight. Click to lock and see why the difference matters in practice.
        </p>

        <div className="comparison-grid">
          {STRATEGIES.map(s => {
            const isLocked = locked === s.id;
            const isDimmed = locked && locked !== s.id;
            const steps = buildMiniSteps(s.id, scenario);
            const cost = ops[s.id] * 50;
            return (
              <div
                key={s.id}
                className={`cmp-card ${isLocked ? "locked" : ""} ${isDimmed ? "dimmed" : ""}`}
                onClick={() => setLocked(isLocked ? null : s.id)}
                style={{ "--cmp-accent": s.accent }}
              >
                <div className="cmp-head">
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", minWidth: 0 }}>
                    <span className="cmp-num">{s.num}</span>
                    <div style={{ minWidth: 0 }}>
                      <h3>{s.name}</h3>
                      <p>{s.long}</p>
                    </div>
                  </div>
                  <span className="cmp-tag" style={{ color: s.accent }}>{s.id}</span>
                </div>

                <div className="cmp-mini-track">
                  {steps.map((st, i) => (
                    <React.Fragment key={i}>
                      <MiniStep {...st} />
                      {i < steps.length - 1 && <span className="cmp-mini-arrow"><Icon name="arrow" size={12} /></span>}
                    </React.Fragment>
                  ))}
                </div>

                <div className="cmp-foot">
                  <span>chainOps: <b style={{ color: "var(--fg)" }}>{ops[s.id]}</b></span>
                  <span className="cmp-cost">~<b>{cost}</b> tokens · <span style={{ color: "var(--fg-faint)" }}>illustrative</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

window.Comparison = Comparison;
