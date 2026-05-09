// Step card and chain track rendering.

const Step = ({ step, state }) => {
  const cls = ["step"];
  if (state === "edited") cls.push("is-edited");
  if (state === "superseded") cls.push("is-superseded");
  if (state === "redrafting") cls.push("is-redrafting");
  if (state === "new") cls.push("is-new");
  if (state === "fading") cls.push("is-fading");

  const kindClass = {
    prompt: "k-prompt",
    message: "k-message",
    toolcall: "k-toolcall",
    toolres: "k-toolres",
    revision: "k-revision",
  }[step.kind] || "";

  const isMono = step.kind === "toolcall" || step.kind === "toolres";

  return (
    <div className={cls.join(" ")}>
      <div className="step-head">
        <span className={`step-kind ${kindClass}`}>{step.label}</span>
        <span className="step-id">{step.id}</span>
      </div>
      <div className={`step-body ${isMono ? "mono" : ""}`}>
        {state === "redrafting" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="spark" size={11} />
            redrafting…
          </span>
        ) : step.body}
      </div>
      {step.tag && (
        <span className={`step-tag ${step.tagKind || ""}`}>
          {step.tag}
        </span>
      )}
    </div>
  );
};

const ChainTrack = ({ steps, stateById }) => {
  return (
    <div className="chain-canvas">
      <div className="chain-track">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <Step step={s} state={stateById[s.id]} />
            {i < steps.length - 1 && (
              <div className="step-arrow">
                <Icon name="arrow" size={16} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

window.Step = Step;
window.ChainTrack = ChainTrack;
