/**
 * Reference template: email compose modal.
 *
 * Domain-shaped (looks like a generic compose UI — to/subject/body/send).
 * Pre-fills with the agent's draft and emits an `Edit<EmailPayload>`
 * when the user submits. The template doesn't know which feedback
 * strategy is active; the strategy executes one level up, in the host's
 * adapter wrap.
 *
 * Styling is intentionally minimal. CSS class names are stable
 * (`afu-*` prefix) so consumers can theme / restyle without forking the
 * component. No CSS is bundled by default — provide your own stylesheet
 * or use the optional `agent-feedback-ui/templates/styles.css` once that
 * ships.
 */

import { useMemo, useState } from "react";

import type { Action, Edit } from "../types.js";

export interface EmailPayload {
  to: string;
  /** Multiple recipients are space- or comma-separated. */
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

export interface EmailModalProps {
  action: Action<EmailPayload>;
  onSubmit: (edit: Edit<EmailPayload>) => void;
  /** Optional rendered above the form — e.g. "Agent wants to send this email". */
  banner?: React.ReactNode;
  /** Override the Send button label. Defaults to "Send" (or "Send (no edits)" when nothing changed). */
  sendLabel?: string;
  /** Override the Discard button label. Defaults to "Discard". */
  discardLabel?: string;
}

export function EmailModal({
  action,
  onSubmit,
  banner,
  sendLabel,
  discardLabel,
}: EmailModalProps): React.ReactElement {
  const draft = action.payload;
  const [to, setTo] = useState(draft.to);
  const [cc, setCc] = useState(draft.cc ?? "");
  const [bcc, setBcc] = useState(draft.bcc ?? "");
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [notes, setNotes] = useState("");

  const isEdited = useMemo(
    () =>
      to !== draft.to ||
      cc !== (draft.cc ?? "") ||
      bcc !== (draft.bcc ?? "") ||
      subject !== draft.subject ||
      body !== draft.body,
    [draft, to, cc, bcc, subject, body],
  );

  const handleSend = () => {
    if (!isEdited) {
      onSubmit({
        actionId: action.id,
        outcome: { kind: "accept" },
      });
      return;
    }
    const edited: EmailPayload = {
      to,
      subject,
      body,
      ...(cc ? { cc } : {}),
      ...(bcc ? { bcc } : {}),
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
    <div className="afu-modal afu-email-modal" role="dialog" aria-label="Review email before sending">
      {banner ? <div className="afu-email-modal__banner">{banner}</div> : null}

      <div className="afu-email-modal__field">
        <label className="afu-email-modal__label" htmlFor={`afu-to-${action.id}`}>
          To
        </label>
        <input
          id={`afu-to-${action.id}`}
          className="afu-email-modal__input"
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="afu-email-modal__field afu-email-modal__field--cc">
        <label className="afu-email-modal__label" htmlFor={`afu-cc-${action.id}`}>
          Cc
        </label>
        <input
          id={`afu-cc-${action.id}`}
          className="afu-email-modal__input"
          type="text"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder=""
        />
      </div>

      <div className="afu-email-modal__field afu-email-modal__field--bcc">
        <label className="afu-email-modal__label" htmlFor={`afu-bcc-${action.id}`}>
          Bcc
        </label>
        <input
          id={`afu-bcc-${action.id}`}
          className="afu-email-modal__input"
          type="text"
          value={bcc}
          onChange={(e) => setBcc(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="afu-email-modal__field">
        <label className="afu-email-modal__label" htmlFor={`afu-subj-${action.id}`}>
          Subject
        </label>
        <input
          id={`afu-subj-${action.id}`}
          className="afu-email-modal__input"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <textarea
        className="afu-email-modal__body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={10}
        aria-label="Body"
      />

      <div className="afu-email-modal__notes">
        <label className="afu-email-modal__label" htmlFor={`afu-notes-${action.id}`}>
          Notes for the agent (optional)
        </label>
        <input
          id={`afu-notes-${action.id}`}
          className="afu-email-modal__input"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What was wrong with the draft?"
        />
      </div>

      <div className="afu-email-modal__actions">
        <button
          type="button"
          className="afu-email-modal__btn afu-email-modal__btn--secondary"
          onClick={handleDiscard}
        >
          {discardLabel ?? "Discard"}
        </button>
        <button
          type="button"
          className="afu-email-modal__btn afu-email-modal__btn--primary"
          onClick={handleSend}
        >
          {sendLabel ?? (isEdited ? "Send edited" : "Send")}
        </button>
      </div>
    </div>
  );
}
