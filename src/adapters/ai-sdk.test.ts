/**
 * Adapter tests. Mocks the modal opener; verifies the wrapped tool
 * does the right thing for each (strategy, edit outcome) combination.
 */

import { describe, expect, it, vi } from "vitest";
import {
  FeedbackRejectedError,
  FeedbackRetryError,
  withFeedback,
} from "./ai-sdk.js";
import type { Action, Edit, FeedbackStrategy } from "../types.js";

interface EmailArgs {
  to: string;
  subject: string;
  body: string;
}
interface SendResult {
  messageId: string;
}

const ORIGINAL_ARGS: EmailArgs = {
  to: "alice@example.com",
  subject: "Welcome",
  body: "Hi Alice.",
};
const EDITED_ARGS: EmailArgs = {
  to: "alice@example.com",
  subject: "Welcome to the team",
  body: "Hi Alice, glad to have you!",
};

function makeTool() {
  const execute = vi.fn(async (args: EmailArgs): Promise<SendResult> => ({
    messageId: `msg-${args.subject.length}`,
  }));
  return {
    description: "Send an email",
    parameters: { type: "object" },
    execute,
    customField: "preserved",
  };
}

describe("withFeedback", () => {
  it("preserves all non-execute fields on the wrapped tool", () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: async () => ({
        actionId: "x",
        outcome: { kind: "accept" },
      }),
    });
    expect(wrapped.description).toBe("Send an email");
    expect(wrapped.parameters).toEqual({ type: "object" });
    expect(wrapped.customField).toBe("preserved");
  });

  it("throws if the tool has no execute function", () => {
    const tool = { description: "no execute" };
    expect(() =>
      withFeedback(tool, "send_email", {
        strategy: { kind: "silent" },
        openModal: async () => ({ actionId: "x", outcome: { kind: "accept" } }),
      }),
    ).toThrow("no execute function");
  });

  // ---- accept passes original args through ---------------------------------

  it("accept: invokes original execute with the original args", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "accept" },
      }),
    });
    const result = await wrapped.execute!(ORIGINAL_ARGS);
    expect(tool.execute).toHaveBeenCalledOnce();
    expect(tool.execute).toHaveBeenCalledWith(ORIGINAL_ARGS, undefined);
    expect(result).toEqual({ messageId: "msg-7" });
  });

  // ---- silent: invokes execute with the EDITED args ------------------------

  it("silent + modify: invokes original execute with edited args", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "modify", payload: EDITED_ARGS },
      }),
    });
    const result = await wrapped.execute!(ORIGINAL_ARGS);
    expect(tool.execute).toHaveBeenCalledWith(EDITED_ARGS, undefined);
    expect(result).toEqual({ messageId: `msg-${EDITED_ARGS.subject.length}` });
  });

  // ---- visible: same as silent at the execute layer ------------------------
  // (the "visible" message append happens at the chain layer; from the tool's
  // perspective, edited args still flow through to execute)

  it("visible + modify: also invokes execute with edited args", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "visible" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "modify", payload: EDITED_ARGS },
      }),
    });
    await wrapped.execute!(ORIGINAL_ARGS);
    expect(tool.execute).toHaveBeenCalledWith(EDITED_ARGS, undefined);
  });

  // ---- constraint: edited args + onConstraint callback fires ---------------

  it("constraint + modify: invokes execute with edited args AND fires onConstraint", async () => {
    const tool = makeTool();
    const onConstraint = vi.fn();
    const extractRule = vi.fn(
      () => "Use a friendlier tone in welcome emails.",
    );
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "constraint", extractRule },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "modify", payload: EDITED_ARGS },
      }),
      onConstraint,
    });
    await wrapped.execute!(ORIGINAL_ARGS);

    expect(tool.execute).toHaveBeenCalledWith(EDITED_ARGS, undefined);
    expect(extractRule).toHaveBeenCalledOnce();
    expect(onConstraint).toHaveBeenCalledWith(
      "Use a friendlier tone in welcome emails.",
    );
  });

  it("constraint without onConstraint callback: does not throw, just drops the rule", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "constraint", extractRule: () => "rule" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "modify", payload: EDITED_ARGS },
      }),
      // intentionally no onConstraint
    });
    await expect(wrapped.execute!(ORIGINAL_ARGS)).resolves.toBeDefined();
    expect(tool.execute).toHaveBeenCalledWith(EDITED_ARGS, undefined);
  });

  // ---- reject: throws FeedbackRejectedError, original execute NOT called ---

  it("reject under silent: throws FeedbackRejectedError, never invokes execute", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "reject", reason: "wrong recipient" },
      }),
    });
    await expect(wrapped.execute!(ORIGINAL_ARGS)).rejects.toBeInstanceOf(
      FeedbackRejectedError,
    );
    expect(tool.execute).not.toHaveBeenCalled();
  });

  it("FeedbackRejectedError exposes the reason string", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "reject", reason: "wrong recipient" },
      }),
    });
    try {
      await wrapped.execute!(ORIGINAL_ARGS);
      throw new Error("expected throw");
    } catch (err) {
      expect(err).toBeInstanceOf(FeedbackRejectedError);
      const e = err as FeedbackRejectedError;
      expect(e.reason).toBe("wrong recipient");
    }
  });

  // ---- retry: throws FeedbackRetryError, host catches and redrives ---------

  it("retry + modify: throws FeedbackRetryError, never invokes execute", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "retry" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "modify", payload: EDITED_ARGS, notes: "shorter" },
      }),
    });
    await expect(wrapped.execute!(ORIGINAL_ARGS)).rejects.toBeInstanceOf(
      FeedbackRetryError,
    );
    expect(tool.execute).not.toHaveBeenCalled();
  });

  it("FeedbackRetryError carries the retry-prompt content for the host to inject", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "retry" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "modify", payload: EDITED_ARGS, notes: "shorter" },
      }),
    });
    try {
      await wrapped.execute!(ORIGINAL_ARGS);
      throw new Error("expected throw");
    } catch (err) {
      expect(err).toBeInstanceOf(FeedbackRetryError);
      const e = err as FeedbackRetryError;
      expect(e.retryPromptContent).toContain("Re-draft");
      expect(e.retryPromptContent).toContain("shorter");
    }
  });

  // ---- modal opener gets the right action shape ----------------------------

  it("opens the modal with an Action whose type matches toolName and payload matches args", async () => {
    const tool = makeTool();
    const opener = vi.fn(
      async (action: Action<EmailArgs>): Promise<Edit<EmailArgs>> => {
        expect(action.type).toBe("send_email");
        expect(action.payload).toEqual(ORIGINAL_ARGS);
        expect(typeof action.id).toBe("string");
        expect(action.id.length).toBeGreaterThan(0);
        return { actionId: action.id, outcome: { kind: "accept" } };
      },
    );
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: opener,
    });
    await wrapped.execute!(ORIGINAL_ARGS);
    expect(opener).toHaveBeenCalledOnce();
  });

  it("uses the supplied generateId factory when provided", async () => {
    const tool = makeTool();
    let idCalls = 0;
    const generateId = () => `custom-id-${++idCalls}`;
    const seenIds: string[] = [];
    const opener = async (action: Action<EmailArgs>) => {
      seenIds.push(action.id);
      return {
        actionId: action.id,
        outcome: { kind: "accept" } as const,
      };
    };
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: opener,
      generateId,
    });
    await wrapped.execute!(ORIGINAL_ARGS);
    await wrapped.execute!(ORIGINAL_ARGS);
    expect(seenIds).toEqual(["custom-id-1", "custom-id-2"]);
  });

  // ---- ctx is forwarded to the original execute ----------------------------

  it("forwards the AI SDK execution context to the original execute", async () => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy: { kind: "silent" },
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "accept" },
      }),
    });
    const fakeCtx = { toolCallId: "tc-1", messages: [] };
    await wrapped.execute!(ORIGINAL_ARGS, fakeCtx);
    expect(tool.execute).toHaveBeenCalledWith(ORIGINAL_ARGS, fakeCtx);
  });
});

// ---- type strategy parameterization (smoke that all 4 build) -------------

describe("strategy types compile and execute", () => {
  const strategies: FeedbackStrategy[] = [
    { kind: "silent" },
    { kind: "visible" },
    { kind: "retry" },
    { kind: "constraint", extractRule: () => "r" },
  ];

  it.each(strategies)("strategy %j does not crash on accept", async (strategy) => {
    const tool = makeTool();
    const wrapped = withFeedback(tool, "send_email", {
      strategy,
      openModal: async () => ({
        actionId: "act-1",
        outcome: { kind: "accept" },
      }),
    });
    await expect(wrapped.execute!(ORIGINAL_ARGS)).resolves.toBeDefined();
  });
});
