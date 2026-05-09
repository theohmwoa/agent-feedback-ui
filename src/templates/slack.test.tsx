/**
 * Slack template tests. Mirrors the email template's contract: the
 * three submission paths (accept / modify / reject) emit the right
 * Edit shape with the right payload.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SlackModal, type SlackPayload } from "./slack.js";
import type { Action, Edit } from "../types.js";

const ACTION: Action<SlackPayload> = {
  type: "send_slack",
  id: "act-1",
  payload: {
    channel: "general",
    text: "Hey team, the deploy is done.",
  },
};

describe("SlackModal", () => {
  it("renders pre-filled with the agent's draft", () => {
    render(<SlackModal action={ACTION} onSubmit={vi.fn()} />);
    expect(
      (screen.getByLabelText("Channel") as HTMLInputElement).value,
    ).toBe("general");
    expect(
      (screen.getByLabelText("Message") as HTMLTextAreaElement).value,
    ).toBe("Hey team, the deploy is done.");
  });

  it("emits accept when Send is clicked without edits", () => {
    const onSubmit = vi.fn<(edit: Edit<SlackPayload>) => void>();
    render(<SlackModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText(/^Send$/));
    expect(onSubmit).toHaveBeenCalledWith({
      actionId: ACTION.id,
      outcome: { kind: "accept" },
    });
  });

  it("emits modify with the edited payload when fields change", () => {
    const onSubmit = vi.fn<(edit: Edit<SlackPayload>) => void>();
    render(<SlackModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Deploy is done — all good." },
    });
    fireEvent.change(screen.getByLabelText("Channel"), {
      target: { value: "deploys" },
    });
    fireEvent.click(screen.getByText(/^Send edited$/));

    const arg = onSubmit.mock.calls[0]?.[0];
    if (arg?.outcome.kind !== "modify") throw new Error("type guard");
    expect(arg.outcome.payload.channel).toBe("deploys");
    expect(arg.outcome.payload.text).toBe("Deploy is done — all good.");
  });

  it("toggles the ephemeral flag and includes it in the modify payload", () => {
    const onSubmit = vi.fn<(edit: Edit<SlackPayload>) => void>();
    render(<SlackModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByLabelText("ephemeral"));
    fireEvent.click(screen.getByText(/^Send edited$/));

    const arg = onSubmit.mock.calls[0]?.[0];
    if (arg?.outcome.kind !== "modify") throw new Error("type guard");
    expect(arg.outcome.payload.ephemeral).toBe(true);
  });

  it("emits reject on Discard", () => {
    const onSubmit = vi.fn<(edit: Edit<SlackPayload>) => void>();
    render(<SlackModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Discard"));
    expect(onSubmit).toHaveBeenCalledWith({
      actionId: ACTION.id,
      outcome: { kind: "reject" },
    });
  });

  it("attaches notes as the modify payload's notes field", () => {
    const onSubmit = vi.fn<(edit: Edit<SlackPayload>) => void>();
    render(<SlackModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Different text" },
    });
    fireEvent.change(
      screen.getByLabelText("Notes for the agent (optional)"),
      { target: { value: "tone too dry" } },
    );
    fireEvent.click(screen.getByText(/^Send edited$/));

    const arg = onSubmit.mock.calls[0]?.[0];
    if (arg?.outcome.kind !== "modify") throw new Error("type guard");
    expect(arg.outcome.notes).toBe("tone too dry");
  });

  it("does not show the thread field when the draft has no thread_ts", () => {
    render(<SlackModal action={ACTION} onSubmit={vi.fn()} />);
    expect(screen.queryByLabelText("Thread")).toBeNull();
  });

  it("shows the thread field when the draft is replying in-thread", () => {
    const threadAction: Action<SlackPayload> = {
      ...ACTION,
      payload: { ...ACTION.payload, thread_ts: "1700000000.000200" },
    };
    render(<SlackModal action={threadAction} onSubmit={vi.fn()} />);
    expect(
      (screen.getByLabelText("Thread") as HTMLInputElement).value,
    ).toBe("1700000000.000200");
  });
});
