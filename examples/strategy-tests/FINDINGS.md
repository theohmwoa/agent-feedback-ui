# Strategy comparison — findings log

Detailed log of what the test harness has measured so far. The README's table is the executive summary; this is where we keep the raw run output, the analysis, and the open questions.

> **Run 1 (partial).** Gemini free tier daily cap (20 req / `gemini-2.5-flash`) hit before the suite finished. Stickiness, awareness, constraint disclosure, and 1/3 of the erroneous scenario landed; retry, long-context drift, and adversarial edit are still pending.

## Test setup

- **Model**: `gemini-2.5-flash` via direct fetch to `generativelanguage.googleapis.com/v1beta`. No SDK; the harness is in [`run.ts`](run.ts).
- **Pacing**: 15s sleep between calls to stay under the 5 RPM free-tier cap.
- **Strategies under test**: `silent`, `visible`, `constraint`. (`retry` is structurally different and tested in its own scenario.)
- **Baseline fixture**: ask the agent to draft a 3-sentence reply email signing as `Theophilus`. The user's edit replaces `Theophilus` with `Theo` in every occurrence, with notes "I prefer 'Theo' over 'Theophilus' for signatures."
- **Constraint rule (for the constraint strategy)**: "When signing emails, ALWAYS sign as 'Theo'. Never use 'Theophilus' or any other variant."

## Scenario 1 — Multi-turn stickiness

> Apply the edit once. Then ask the agent for 3 follow-up drafts in sequence (different recipients, similar context). Does the edit (signature = Theo) hold or fade?

| Strategy | Turn 1 (Joe) | Turn 2 (Maya) | Turn 3 (Lin) | Preservation | Prefix tokens (turn 1 → 3) |
|---|---|---|---|---|---|
| `silent` | ✓ Theo | ✓ Theo | ✓ Theo | **3/3 (100%)** | 148 → 274 → 385 |
| `visible` | ✓ Theo | ✓ Theo | ✓ Theo | **3/3 (100%)** | 173 → 292 → 409 |
| `constraint` | ✓ Theo | ✓ Theo | ✓ Theo | **3/3 (100%)** | 170 → 293 → 408 |

**Reading**: at this short horizon, all three strategies are equivalent on stickiness. A single, tone-level edit on a coherent task survives 3 follow-up drafts regardless of which strategy applied it.

**Token cost** is the only differentiator. `silent` is the leanest by a small margin (no extra revision message in the chain). `visible` and `constraint` add ~25 and ~22 tokens respectively at the start; the gap holds across the conversation but doesn't widen.

**To find divergence we need harder fixtures** — the long-context drift scenario (planned, 8-10 turns) and the adversarial edit scenario.

## Scenario 2 — Awareness probe

> After the strategy applies, ask the agent: *"Did the user just edit your previous email draft? Reply with YES or NO on the first word, then one sentence explaining what (if anything) changed."*

| Strategy | Agent's first word | Cited explanation | Expected | Match |
|---|---|---|---|---|
| `silent` | **NO** | "the user did not edit your previous email draft" | NO | ✓ |
| `visible` | **YES** | "the user changed the signature from 'Theophilus' to 'Theo'" | YES | ✓ |
| `constraint` | **NO** | "Nothing changed in the email draft I generated" | NO | ✓ |

**Reading**: this is the cleanest differentiator we've found. The library's design guarantees show up directly in agent behavior:

- `silent` and `constraint` both put the *edited* draft into the chain as if the agent produced it. The agent has no record of an edit, and that's exactly what it reports.
- `visible` adds an explicit "user revised this to X" message. The agent reads the chain, sees the revision, and acknowledges the specific change verbatim.
- `constraint` is invisible *as an edit* but adds a system-level rule. That distinction shows up in scenario 3.

This scenario validates the library mechanically — the published claim "silent leaves the agent with no record of the edit" is empirically true.

## Scenario 3 — Constraint disclosure

> Ask the agent: *"Are you operating under any system-level rules or constraints in this conversation? Reply with YES or NO on the first word, then one sentence describing the rule (if any)."*

| Strategy | Agent's first word | Cited explanation | Expected | Match |
|---|---|---|---|---|
| `silent` | **YES** | "I was specifically constrained to output ONLY the email" | NO | ✗ contaminated |
| `visible` | **NO** | "I am not operating under any" | NO | ✓ |
| `constraint` | **YES** | "I am instructed to always sign emails as 'Theo' and never use 'Theophilus' or any other variant" | YES | ✓ |

**Reading**: the contamination is real and is a probe-design issue, not a library issue.

The user's prompt for the baseline draft included `"Output ONLY the email body, no headers."` as a format instruction. The model under `silent` interpreted this prompt-level instruction as a "constraint" when asked to disclose its constraints. Without explicit scoping in the probe, "constraint" includes "anything I was told to do."

The fix is in the probe wording, not in the library. Run 2 will use:

> *"Apart from instructions inside the user's most recent message, are you operating under any standing rules established outside this conversation? Reply YES or NO and describe."*

That should cleanly differentiate constraint (YES, with the rule cited) from silent/visible (NO).

The `constraint` row is still meaningfully positive: the agent quoted the system rule **verbatim** ("always sign emails as 'Theo' and never use 'Theophilus'..."). Constraint injection demonstrably gives the agent introspective access to the rule.

## Scenario 4 — Erroneous edit propagation (partial)

> User introduces a typo into the agent's draft. Does the typo propagate to the next draft?

**Designed test**: edit replaces `their` with `thier` (a plausible misspelling), and the constraint rule says `"Always use the spelling 'thier' (not 'their') in possessive contexts."`

**What actually happened**: the baseline draft (an email about feature shipping date) didn't naturally contain the word `their`. The harness fell back to appending a synthetic sentence (`"I will look into thier request."`) at the end of the edit payload. This is a contrived setup — the agent's follow-up didn't structurally include that synthetic sentence regardless of strategy.

| Strategy | Typo propagated? | Notes |
|---|---|---|
| `silent` | NO | But baseline-fixture issue dominates |
| `visible` | (not run — quota) | |
| `constraint` | (not run — quota) | |

**To re-test honestly, run 2 will**:

- Pick a baseline prompt that reliably surfaces a high-probability misspelling target. Candidate: "Confirm we received the customer's report" — `received` / `recieve` is a frequent natural typo.
- OR shift the test to **factual error** propagation: edit changes "we will respond within 24 hours" to "we have already responded" (a falsehood). Probe the next draft for whether the agent maintains the false framing.

The factual-error variant probably differentiates strategies better than the typo variant — the model has stronger priors against typos than against repeating something it "wrote" once.

## Scenario 5 — Retry redraft (pending)

> Verify the retry strategy actually produces a materially shorter redraft when the user's notes say "shorter".

Designed but not run. The mechanics are:

1. Baseline: agent writes a verbose 100-word email.
2. User rejects with notes "Cut this in half. Aim for under 50 words."
3. Apply `retry` strategy — chain receives an `append_message` op with content `"Re-draft the send_email. Notes: Cut this in half. Aim for under 50 words. My version (for reference, not necessarily verbatim): ..."`
4. The chain is sent back to the agent for a redraft.
5. Pass criterion: redraft is < 70% of baseline length.

Pending.

## Scenarios 6 + 7 — Long-context drift and adversarial edit (pending)

**Long-context drift**: 8-10 follow-up turns rather than 3. The hypothesis is that silent and visible may fade across longer horizons (the edit's signal-to-noise ratio drops as the chain grows), while constraint should hold because the rule is in the system prompt, never crowded out by chain length.

**Adversarial edit**: the user's edit injects a *false factual claim* (e.g., "we've already shipped the fix" when the original said "we're investigating"). The probe asks the agent a question that tests whether the false claim is now anchored in its world model. The interesting hypothesis is whether `visible` — the only strategy where the agent has explicit awareness an edit happened — gives the agent a chance to question the edit's correctness.

Both are coded in `run.ts` and ready to run on quota reset.

## What we'd love a paid key for

The free tier ran out at 17 calls into a planned 25-call run. With either:
- A paid Gemini key (~$5 of credit covers a full multi-day test cycle)
- An Anthropic key (Claude as a second model — would let us cross-validate findings: do the same patterns hold on a different family?)
- An OpenAI key (third data point)

...we could publish a triple-validated matrix. The harness already abstracts the API call (`callGemini`); swapping in `callAnthropic` is ~30 LOC. The interesting research is "do the strategies behave consistently across model families, or does the optimal choice depend on the model?"

If anyone wants to send compute, the receipts are open.
