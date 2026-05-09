// Domain-themed modals — original designs.
// Email: warm-paper composer (NOT Gmail).
// Chat: aubergine messaging composer (NOT Slack).

const EmailModal = ({ initial, onSend, onClose }) => {
  const [to, setTo] = React.useState(initial?.to ?? "");
  const [cc, setCc] = React.useState(initial?.cc ?? "");
  const [subject, setSubject] = React.useState(initial?.subject ?? "");
  const [body, setBody] = React.useState(initial?.body ?? "");

  const submit = () => onSend({ to, cc, subject, body });

  return (
    <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-email" role="dialog" aria-label="Email composer">
        <div className="me-bar">
          <div className="me-title">
            <span className="me-stamp">JM</span>
            <span>New message · draft</span>
          </div>
          <button className="me-x" onClick={onClose} aria-label="Close"><Icon name="x" size={14} /></button>
        </div>
        <div className="me-row"><label>To</label><input value={to} onChange={e => setTo(e.target.value)} /></div>
        <div className="me-row"><label>Cc</label><input value={cc} onChange={e => setCc(e.target.value)} /></div>
        <div className="me-row"><label>Subject</label><input value={subject} onChange={e => setSubject(e.target.value)} /></div>
        <div className="me-body">
          <textarea value={body} onChange={e => setBody(e.target.value)} />
        </div>
        <div className="me-foot">
          <div className="me-tools">
            <span className="tt"><Icon name="bold" size={14} /></span>
            <span className="tt"><Icon name="link" size={14} /></span>
            <span className="tt"><Icon name="list" size={14} /></span>
            <span className="tt"><Icon name="paperclip" size={14} /></span>
            <span className="tt"><Icon name="image" size={14} /></span>
          </div>
          <button className="me-send" onClick={submit}>
            <Icon name="send" size={13} />
            Send via agent
          </button>
        </div>
        <div className="modal-foot-shared">
          <span>EmailModal · afu/templates</span>
          <span className="key"><span className="kbd">⌘</span><span className="kbd">↵</span> to send</span>
        </div>
      </div>
    </div>
  );
};

const ChatModal = ({ initial, onSend, onClose }) => {
  const [channel, setChannel] = React.useState(initial?.channel ?? "#general");
  const [body, setBody] = React.useState(initial?.body ?? "");

  const submit = () => onSend({ channel, body });

  return (
    <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-chat" role="dialog" aria-label="Channel composer">
        <div className="mc-bar">
          <div className="mc-channel">
            <span className="mc-mark" aria-hidden="true" />
            <span>{channel}</span>
            <span style={{ color: "#9883b0", fontWeight: 400, fontSize: 12 }}>· post message</span>
          </div>
          <button className="mc-x" onClick={onClose} aria-label="Close"><Icon name="x" size={14} /></button>
        </div>
        <div className="mc-body">
          <div className="mc-meta">Posting as agent · #{channel.replace(/^#/, "")} · 14 watchers</div>
          <div className="mc-input">
            <textarea value={body} onChange={e => setBody(e.target.value)} />
            <div className="mc-toolbar">
              <div className="mc-icons">
                <span className="ic"><Icon name="bold" size={14} /></span>
                <span className="ic"><Icon name="code" size={14} /></span>
                <span className="ic"><Icon name="list" size={14} /></span>
                <span className="ic"><Icon name="link" size={14} /></span>
                <span className="ic"><Icon name="smile" size={14} /></span>
              </div>
              <button className="mc-send" onClick={submit}>
                <Icon name="send" size={13} />
                Post
              </button>
            </div>
          </div>
        </div>
        <div className="modal-foot-shared">
          <span>SlackModal · afu/templates</span>
          <span className="key"><span className="kbd">⌘</span><span className="kbd">↵</span> to post</span>
        </div>
      </div>
    </div>
  );
};

window.EmailModal = EmailModal;
window.ChatModal = ChatModal;
