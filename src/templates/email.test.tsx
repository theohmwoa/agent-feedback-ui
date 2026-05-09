/**
 * Email template tests. The interesting assertions are about the
 * `Edit` shape emitted on each user action (send-as-is, send-with-edits,
 * discard) — that's the contract the adapter consumes.
 *
 * Rendering correctness is checked lightly (labels, fields populated)
 * but the heavy lifting is the edit-emission contract.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmailModal, type EmailPayload } from "./email.js";
import type { Action, Edit } from "../types.js";

const ACTION: Action<EmailPayload> = {
  type: "send_email",
  id: "act-test-1",
  payload: {
    to: "alice@example.com",
    subject: "Welcome",
    body: "Hi Alice.",
  },
  context: { stepId: "step-1" },
};

describe("EmailModal", () => {
  it("renders pre-filled with the agent's draft", () => {
    render(<EmailModal action={ACTION} onSubmit={vi.fn()} />);
    expect(
      (screen.getByLabelText("To") as HTMLInputElement).value,
    ).toBe("alice@example.com");
    expect(
      (screen.getByLabelText("Subject") as HTMLInputElement).value,
    ).toBe("Welcome");
    expect(
      (screen.getByLabelText("Body") as HTMLTextAreaElement).value,
    ).toBe("Hi Alice.");
  });

  it("renders the optional banner above the form", () => {
    render(
      <EmailModal
        action={ACTION}
        onSubmit={vi.fn()}
        banner={<span data-testid="banner">Agent wants to send this</span>}
      />,
    );
    expect(screen.getByTestId("banner")).toBeTruthy();
  });

  it("emits an `accept` Edit when user clicks Send without editing", () => {
    const onSubmit = vi.fn<(edit: Edit<EmailPayload>) => void>();
    render(<EmailModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText(/^Send$/));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      actionId: ACTION.id,
      outcome: { kind: "accept" },
    });
  });

  it("Send button label flips to 'Send edited' once any field is changed", () => {
    render(<EmailModal action={ACTION} onSubmit={vi.fn()} />);
    expect(screen.queryByText(/^Send edited$/)).toBeNull();
    fireEvent.change(screen.getByLabelText("Subject"), {
      target: { value: "Welcome to the team" },
    });
    expect(screen.getByText(/^Send edited$/)).toBeTruthy();
  });

  it("emits a `modify` Edit with the edited payload on Send-edited", () => {
    const onSubmit = vi.fn<(edit: Edit<EmailPayload>) => void>();
    render(<EmailModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Subject"), {
      target: { value: "Welcome to the team" },
    });
    fireEvent.change(screen.getByLabelText("Body"), {
      target: { value: "Hi Alice, glad to have you!" },
    });
    fireEvent.click(screen.getByText(/^Send edited$/));

    expect(onSubmit).toHaveBeenCalledOnce();
    const arg = onSubmit.mock.calls[0]?.[0];
    expect(arg).toBeDefined();
    expect(arg?.actionId).toBe(ACTION.id);
    expect(arg?.outcome.kind).toBe("modify");
    if (arg?.outcome.kind !== "modify") throw new Error("type guard");
    expect(arg.outcome.payload).toEqual({
      to: "alice@example.com",
      subject: "Welcome to the team",
      body: "Hi Alice, glad to have you!",
    });
  });

  it("attaches notes to the modify Edit when the user fills the notes field", () => {
    const onSubmit = vi.fn<(edit: Edit<EmailPayload>) => void>();
    render(<EmailModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Body"), {
      target: { value: "Different body" },
    });
    fireEvent.change(
      screen.getByLabelText("Notes for the agent (optional)"),
      { target: { value: "be friendlier" } },
    );
    fireEvent.click(screen.getByText(/^Send edited$/));

    const arg = onSubmit.mock.calls[0]?.[0];
    if (arg?.outcome.kind !== "modify") throw new Error("type guard");
    expect(arg.outcome.notes).toBe("be friendlier");
  });

  it("emits a `reject` Edit on Discard", () => {
    const onSubmit = vi.fn<(edit: Edit<EmailPayload>) => void>();
    render(<EmailModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Discard"));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      actionId: ACTION.id,
      outcome: { kind: "reject" },
    });
  });

  it("attaches notes as the rejection reason when present", () => {
    const onSubmit = vi.fn<(edit: Edit<EmailPayload>) => void>();
    render(<EmailModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.change(
      screen.getByLabelText("Notes for the agent (optional)"),
      { target: { value: "wrong recipient" } },
    );
    fireEvent.click(screen.getByText("Discard"));

    const arg = onSubmit.mock.calls[0]?.[0];
    if (arg?.outcome.kind !== "reject") throw new Error("type guard");
    expect(arg.outcome.reason).toBe("wrong recipient");
  });

  it("preserves cc and bcc fields when the user sets them", () => {
    const onSubmit = vi.fn<(edit: Edit<EmailPayload>) => void>();
    render(<EmailModal action={ACTION} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Cc"), {
      target: { value: "bob@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Bcc"), {
      target: { value: "ops@example.com" },
    });
    fireEvent.click(screen.getByText(/^Send edited$/));

    const arg = onSubmit.mock.calls[0]?.[0];
    if (arg?.outcome.kind !== "modify") throw new Error("type guard");
    expect(arg.outcome.payload.cc).toBe("bob@example.com");
    expect(arg.outcome.payload.bcc).toBe("ops@example.com");
  });
});
