/**
 * Reference template: Slack message compose modal.
 *
 * Same shape contract as `EmailModal` (takes `Action<SlackPayload>`,
 * emits `Edit<SlackPayload>`). Stable className hooks (`afu-slack-*`)
 * for theming. No CSS bundled.
 */

import { useMemo, useState } from "react";

import type { Action, Edit } from "../types.js";

export interface SlackPayload {
  /** Channel id or name. By convention `#channel` or `Cxxx` for ids. */
  channel: string;
  /** Optional thread timestamp to reply in-thread. */
  thread_ts?: string;
  /** The message text. Plain text or Slack mrkdwn. */
  text: string;
  /**
   * If true, the message is sent as ephemeral (visible only to one
   * user). Most agents won't use this; surfaced for completeness.
   */
  ephemeral?: boolean;
}

export interface SlackModalProps {
  action: Action<SlackPayload>;
  onSubmit: (edit: Edit<SlackPayload>) => void;
  banner?: React.ReactNode;
  sendLabel?: string;
  discardLabel?: string;
}

export function SlackModal({
  action,
  onSubmit,
  banner,
  sendLabel,
  discardLabel,
}: SlackModalProps): React.ReactElement {
  const draft = action.payload;
  const [channel, setChannel] = useState(draft.channel);
  const [threadTs, setThreadTs] = useState(draft.thread_ts ?? "");
  const [text, setText] = useState(draft.text);
  const [ephemeral, setEphemeral] = useState(draft.ephemeral ?? false);
  const [notes, setNotes] = useState("");

  const isEdited = useMemo(
    () =>
      channel !== draft.channel ||
      threadTs !== (draft.thread_ts ?? "") ||
      text !== draft.text ||
      ephemeral !== (draft.ephemeral ?? false),
    [draft, channel, threadTs, text, ephemeral],
  );

  const handleSend = () => {
    if (!isEdited) {
      onSubmit({ actionId: action.id, outcome: { kind: "accept" } });
      return;
    }
    const edited: SlackPayload = {
      channel,
      text,
      ...(threadTs ? { thread_ts: threadTs } : {}),
      ...(ephemeral ? { ephemeral: true } : {}),
    };
    onSubmit({
      actionId: action.id,
      outcome: {
        kind: "modify",
        payload: edited,
        ...(notes ? { notes } : {}),
      },
    });
  };

  const handleDiscard = () => {
    onSubmit({
      actionId: action.id,
      outcome: {
        kind: "reject",
        ...(notes ? { reason: notes } : {}),
      },
    });
  };

  return (
    <div
      className="afu-modal afu-slack-modal"
      role="dialog"
      aria-label="Review Slack message before sending"
    >
      {banner ? <div className="afu-slack-modal__banner">{banner}</div> : null}

      <div className="afu-slack-modal__header">
        <span className="afu-slack-modal__channel-prefix" aria-hidden="true">
          #
        </span>
        <input
          aria-label="Channel"
          className="afu-slack-modal__channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          placeholder="general"
          spellCheck={false}
          autoComplete="off"
        />
        <label className="afu-slack-modal__ephemeral-toggle">
          <input
            type="checkbox"
            checked={ephemeral}
            onChange={(e) => setEphemeral(e.target.checked)}
          />
          ephemeral
        </label>
      </div>

      {threadTs || draft.thread_ts ? (
        <div className="afu-slack-modal__thread">
          <label className="afu-slack-modal__label" htmlFor={`afu-thread-${action.id}`}>
            Thread
          </label>
          <input
            id={`afu-thread-${action.id}`}
            className="afu-slack-modal__input"
            value={threadTs}
            onChange={(e) => setThreadTs(e.target.value)}
            placeholder="thread_ts"
            spellCheck={false}
          />
        </div>
      ) : null}

      <textarea
        className="afu-slack-modal__text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        aria-label="Message"
        placeholder="Message"
      />

      <div className="afu-slack-modal__notes">
        <label
          className="afu-slack-modal__label"
          htmlFor={`afu-slack-notes-${action.id}`}
        >
          Notes for the agent (optional)
        </label>
        <input
          id={`afu-slack-notes-${action.id}`}
          className="afu-slack-modal__input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What was wrong with the draft?"
        />
      </div>

      <div className="afu-slack-modal__actions">
        <button
          type="button"
          className="afu-slack-modal__btn afu-slack-modal__btn--secondary"
          onClick={handleDiscard}
        >
          {discardLabel ?? "Discard"}
        </button>
        <button
          type="button"
          className="afu-slack-modal__btn afu-slack-modal__btn--primary"
          onClick={handleSend}
        >
          {sendLabel ?? (isEdited ? "Send edited" : "Send")}
        </button>
      </div>
    </div>
  );
}
