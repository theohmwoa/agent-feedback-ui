// Shared data for the playground.
// Strategies, scenarios, and the canonical chain we render.

const STRATEGIES = [
  {
    id: "silent",
    num: 1,
    name: "Silent rewrite",
    short: "Replace draft. Agent has no record.",
    long: "The user's edit overwrites the agent's draft in place. The agent continues from the new state — no message about the change, no constraint surfaced.",
    accent: "var(--s-silent)",
  },
  {
    id: "visible",
    num: 2,
    name: "Visible correction",
    short: "Keep both. Append a revision message.",
    long: "Original draft stays in the chain. A new revision message is appended so the agent (and any reader) can see what the human changed and why.",
    accent: "var(--s-visible)",
  },
  {
    id: "retry",
    num: 3,
    name: "Reject and retry",
    short: "Discard. Prompt the agent to redraft.",
    long: "The draft is discarded entirely. The agent is asked to redraft, with the user's edit attached as a hint about what the right answer should look like.",
    accent: "var(--s-retry)",
  },
  {
    id: "constraint",
    num: 4,
    name: "Constraint injection",
    short: "Apply edit + derive a session rule.",
    long: "The edit is applied AND a session-wide constraint is derived from it. Future drafts in this session will respect the rule automatically.",
    accent: "var(--s-constraint)",
  },
];

const SCENARIOS = {
  email: {
    id: "email",
    name: "Email draft",
    glyph: "✉",
    meta: "EmailModal",
    domain: "email",
    targetStepId: "msg-2",
    chain: [
      { id: "p-0", kind: "prompt",   label: "User prompt",
        body: "Reply to the support thread from Acme — they're churning over latency. Keep it warm." },
      { id: "tc-1", kind: "toolcall", label: "ToolCall",
        body: "search_threads({ from: \"acme.com\", topic: \"latency\" })" },
      { id: "tr-1", kind: "toolres",  label: "ToolResult",
        body: "3 messages · last reply 4d ago · sentiment: frustrated" },
      { id: "msg-2", kind: "message", label: "Message · draft",
        body: "Hey Sam, totally hear you. We've shipped some perf wins this week — want to hop on a quick call?" },
      { id: "tc-3", kind: "toolcall", label: "ToolCall",
        body: "send_email({ to: \"sam@acme.com\", subject: \"…\" })" },
    ],
    edit: {
      to: "sam@acme.com",
      cc: "renewals@yourco.com",
      subject: "Following up — latency in your Acme workspace",
      body: "Hi Sam,\n\nThanks for flagging this — and sorry it's been rough. We deployed a fix on Tuesday that cuts p95 by ~40% on the workspace your team is on. I've pinned a 20-min slot Thursday so we can review the trace together. Worth keeping you in this seat.\n\n— J",
    },
    constraintRule: "Never propose a call before offering a written status update.",
  },
  chat: {
    id: "chat",
    name: "Team message",
    glyph: "#",
    meta: "SlackModal",
    domain: "chat",
    targetStepId: "msg-2",
    chain: [
      { id: "p-0", kind: "prompt",   label: "User prompt",
        body: "Post in #incidents — Stripe webhooks 5xxing for the last 9m. Ack the page." },
      { id: "tc-1", kind: "toolcall", label: "ToolCall",
        body: "fetch_metric({ name: \"stripe_webhook_5xx\", window: \"15m\" })" },
      { id: "tr-1", kind: "toolres",  label: "ToolResult",
        body: "rate=12.4/s · started 09:21Z · region=us-east-1" },
      { id: "msg-2", kind: "message", label: "Message · draft",
        body: "Heads up team — looking into webhook errors. Will share more soon 🙏" },
      { id: "tc-3", kind: "toolcall", label: "ToolCall",
        body: "post_message({ channel: \"#incidents\" })" },
    ],
    edit: {
      channel: "#incidents",
      body: "Acking the page — Stripe webhook 5xx rate at 12.4/s in us-east-1, started 09:21Z. I'm IC. Status page updated. Pulling on retry-queue depth next; will post in 5.",
    },
    constraintRule: "Always include error rate, region, and start-time in incident acks.",
  },
};

window.STRATEGIES = STRATEGIES;
window.SCENARIOS = SCENARIOS;
