/**
 * Strategy executor tests.
 *
 * Coverage matrix is the load-bearing thing here. Every (strategy, edit
 * outcome) combination is exercised, plus a handful of edge cases the
 * adapter packages will trip over (missing stepId, missing notes,
 * untyped payloads).
 */

import { describe, expect, it, vi } from "vitest";
import { applyFeedback } from "./strategy.js";
import type { Action, Edit, FeedbackStrategy } from "./types.js";

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

const ACTION: Action<EmailPayload> = {
  type: "send_email",
  id: "act-1",
  payload: {
    to: "alice@example.com",
    subject: "Welcome",
    body: "Hey Alice, welcome aboard.",
  },
  context: { stepId: "step-1", runId: "run-1" },
};

const ALL_STRATEGIES: FeedbackStrategy[] = [
  { kind: "silent" },
  { kind: "visible" },
  { kind: "retry" },
  {
    kind: "constraint",
    extractRule: () => "Always greet with full name in welcome emails.",
  },
];

// ---- accept passes through under every strategy ----------------------------

describe("accept outcome", () => {
  it.each(ALL_STRATEGIES)(
    "is a passthrough under strategy %j",
    (strategy) => {
      const edit: Edit<EmailPayload> = {
        actionId: ACTION.id,
        outcome: { kind: "accept" },
      };
      const result = applyFeedback(ACTION, edit, strategy);
      expect(result.effectivePayload).toEqual(ACTION.payload);
      expect(result.chainOps).toEqual([]);
      expect(result.retry).toBe(false);
      expect(result.rejected).toBe(false);
      expect(result.systemConstraint).toBeUndefined();
    },
  );
});

// ---- modify: each strategy has a distinct chain shape ----------------------

describe("modify outcome", () => {
  const editedPayload: EmailPayload = {
    to: "alice@example.com",
    subject: "Welcome to the team",
    body: "Hi Alice, glad to have you.",
  };

  it("silent: replaces the step in place, no record", () => {
    const result = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: { kind: "modify", payload: editedPayload },
      },
      { kind: "silent" },
    );
    expect(result.effectivePayload).toEqual(editedPayload);
    expect(result.chainOps).toHaveLength(1);
    expect(result.chainOps[0]).toEqual({
      kind: "replace_step",
      stepId: "step-1",
      payload: editedPayload,
    });
    expect(result.retry).toBe(false);
    expect(result.rejected).toBe(false);
  });

  it("silent: yields no chain ops if no stepId is provided", () => {
    // Adapters without chain-step identity (raw provider tool-use loops)
    // still get a usable effectivePayload but no replace_step op.
    const action: Action<EmailPayload> = {
      ...ACTION,
      context: { runId: "run-1" }, // intentionally no stepId
    };
    const result = applyFeedback(
      action,
      {
        actionId: action.id,
        outcome: { kind: "modify", payload: editedPayload },
      },
      { kind: "silent" },
    );
    expect(result.effectivePayload).toEqual(editedPayload);
    expect(result.chainOps).toEqual([]);
  });

  it("visible: keeps original draft, appends a user-correction message", () => {
    const result = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: {
          kind: "modify",
          payload: editedPayload,
          notes: "shorter and warmer",
        },
      },
      { kind: "visible" },
    );
    expect(result.effectivePayload).toEqual(editedPayload);
    expect(result.chainOps).toHaveLength(1);
    const op = result.chainOps[0];
    expect(op).toMatchObject({
      kind: "append_message",
      role: "user",
      afterStepId: "step-1",
    });
    if (op.kind !== "append_message") throw new Error("type guard");
    expect(op.content).toContain("send_email");
    expect(op.content).toContain("shorter and warmer");
  });

  it("visible: omits the reason suffix when notes are absent", () => {
    const result = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: { kind: "modify", payload: editedPayload },
      },
      { kind: "visible" },
    );
    const op = result.chainOps[0];
    if (op?.kind !== "append_message") throw new Error("type guard");
    expect(op.content).not.toContain("Reason");
  });

  it("retry: signals retry and surfaces the user's version as guidance", () => {
    const result = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: { kind: "modify", payload: editedPayload, notes: "be friendlier" },
      },
      { kind: "retry" },
    );
    expect(result.retry).toBe(true);
    expect(result.rejected).toBe(false);
    // effectivePayload is the *original* under retry — agent will redraft.
    expect(result.effectivePayload).toEqual(ACTION.payload);
    expect(result.chainOps).toHaveLength(1);
    const op = result.chainOps[0];
    if (op?.kind !== "append_message") throw new Error("type guard");
    expect(op.content).toContain("Re-draft");
    expect(op.content).toContain("be friendlier");
  });

  it("retry: produces deterministic JSON of the user's version (cache stability)", () => {
    // The retry message embeds the user's edit as JSON. Object key order
    // must be stable so the prompt the agent sees is byte-identical
    // across runs that produce the same logical edit — required for
    // prompt cache hits.
    const a = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: {
          kind: "modify",
          payload: { to: "x", subject: "y", body: "z" },
        },
      },
      { kind: "retry" },
    );
    const b = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: {
          kind: "modify",
          // SAME logical edit, different JS-object property insertion order.
          payload: { body: "z", subject: "y", to: "x" },
        },
      },
      { kind: "retry" },
    );
    const aOp = a.chainOps[0];
    const bOp = b.chainOps[0];
    if (aOp?.kind !== "append_message" || bOp?.kind !== "append_message") {
      throw new Error("type guard");
    }
    expect(aOp.content).toEqual(bOp.content);
  });

  it("constraint: replaces the step AND appends a system constraint", () => {
    const extractRule = vi.fn(
      () => "Use a friendlier tone in welcome emails.",
    );
    const result = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: { kind: "modify", payload: editedPayload },
      },
      { kind: "constraint", extractRule },
    );
    expect(extractRule).toHaveBeenCalledOnce();
    expect(result.systemConstraint).toBe(
      "Use a friendlier tone in welcome emails.",
    );
    expect(result.chainOps).toHaveLength(2);
    expect(result.chainOps[0]).toMatchObject({ kind: "replace_step" });
    expect(result.chainOps[1]).toMatchObject({
      kind: "append_system_constraint",
      content: "Use a friendlier tone in welcome emails.",
    });
  });

  it("constraint: passes the action and edit verbatim to extractRule", () => {
    const extractRule = vi.fn(() => "rule");
    const edit: Edit<EmailPayload> = {
      actionId: ACTION.id,
      outcome: {
        kind: "modify",
        payload: editedPayload,
        notes: "warmer",
      },
    };
    applyFeedback(ACTION, edit, { kind: "constraint", extractRule });
    const callArgs = extractRule.mock.calls[0];
    expect(callArgs).toBeDefined();
    expect(callArgs?.[0]).toEqual(ACTION);
    expect(callArgs?.[1]).toEqual(edit);
  });
});

// ---- reject: behavior splits between retry and the others ------------------

describe("reject outcome", () => {
  const rejectEdit: Edit<EmailPayload> = {
    actionId: ACTION.id,
    outcome: { kind: "reject", reason: "wrong recipient" },
  };

  it.each(["silent", "visible", "constraint"] as const)(
    "marks rejected=true under %s strategy and adds no chain ops",
    (strategyKind) => {
      const strategy: FeedbackStrategy =
        strategyKind === "constraint"
          ? { kind: "constraint", extractRule: () => "rule" }
          : { kind: strategyKind };
      const result = applyFeedback(ACTION, rejectEdit, strategy);
      expect(result.rejected).toBe(true);
      expect(result.retry).toBe(false);
      expect(result.chainOps).toEqual([]);
      expect(result.effectivePayload).toEqual(ACTION.payload);
    },
  );

  it("retry strategy on reject: signals retry with the rejection reason", () => {
    const result = applyFeedback(ACTION, rejectEdit, { kind: "retry" });
    expect(result.retry).toBe(true);
    expect(result.rejected).toBe(false);
    expect(result.chainOps).toHaveLength(1);
    const op = result.chainOps[0];
    if (op?.kind !== "append_message") throw new Error("type guard");
    expect(op.content).toContain("Discard");
    expect(op.content).toContain("wrong recipient");
  });

  it("retry strategy on reject without a reason: still produces a usable prompt", () => {
    const result = applyFeedback(
      ACTION,
      { actionId: ACTION.id, outcome: { kind: "reject" } },
      { kind: "retry" },
    );
    const op = result.chainOps[0];
    if (op?.kind !== "append_message") throw new Error("type guard");
    expect(op.content).toContain("no reason given");
  });
});

// ---- shape sanity for adapter consumers ------------------------------------

describe("shape contracts adapters depend on", () => {
  it("never sets retry=true and rejected=true together", () => {
    // Mutually exclusive by design: adapters branch on these and a both-
    // true case would be ambiguous.
    for (const strategy of ALL_STRATEGIES) {
      for (const outcome of [
        { kind: "accept" } as const,
        {
          kind: "modify" as const,
          payload: ACTION.payload,
        },
        { kind: "reject" } as const,
      ]) {
        const result = applyFeedback(
          ACTION,
          { actionId: ACTION.id, outcome },
          strategy,
        );
        expect(result.retry && result.rejected).toBe(false);
      }
    }
  });

  it("systemConstraint is set iff a constraint strategy ran a modify", () => {
    const constraint: FeedbackStrategy = {
      kind: "constraint",
      extractRule: () => "rule",
    };
    const onModify = applyFeedback(
      ACTION,
      {
        actionId: ACTION.id,
        outcome: { kind: "modify", payload: ACTION.payload },
      },
      constraint,
    );
    expect(onModify.systemConstraint).toBe("rule");

    const onAccept = applyFeedback(
      ACTION,
      { actionId: ACTION.id, outcome: { kind: "accept" } },
      constraint,
    );
    expect(onAccept.systemConstraint).toBeUndefined();

    const onReject = applyFeedback(
      ACTION,
      { actionId: ACTION.id, outcome: { kind: "reject" } },
      constraint,
    );
    expect(onReject.systemConstraint).toBeUndefined();
  });
});
