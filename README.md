# agent-feedback-ui

**A library for plugging human-in-the-loop feedback into AI agent loops, via domain-shaped UI surfaces — with four different ways the human's edit can affect what the agent does next, and an empirical test suite measuring which strategy actually works for which scenarios.**

> Status: pre-zero. This README is the explainer. Code lands as sibling crates / packages once the protocol is pinned.

## What this solves

Most agent frameworks treat human-in-the-loop as a yes/no approval gate. That misses the more useful interaction shape: *"the agent drafted this email — let me edit it before it goes out."* Mirage AI and a handful of others have built one-off versions of this for specific actions (an email-shaped modal pre-filled with the agent's draft, etc.). What's missing:

1. **A general library** that lets a dev plug this pattern into any agent, not just hand-rolled per app.
2. **A clear, opinionated answer to what the agent should think happened after the human edit.** Today everyone picks differently and nobody measures the consequences.

This repo is both pieces.

## The library

A small, framework-agnostic core. Devs:

1. Register UI surfaces per agent action: `register("send_email", GmailComposeModal)`, `register("create_issue", LinearIssueModal)`, etc.
2. When the agent drafts a registered action, the library intercepts the call, opens the modal pre-filled with the draft, and waits for the human's edit (or pass-through).
3. The dev picks a *feedback strategy* (below) for how the human edit reshapes the agent's chain.
4. The agent continues from the reshaped chain.

Catalog grows by category: messaging, calendar, issue trackers, code, CRM, commerce, etc. Goal of ~100 templates, but the templates are the marketing surface. The actual contribution is the protocol + the four strategies below.

## The four feedback strategies

When the user edits the agent's draft (say, the email it was about to send), the agent's chain can be reshaped four ways. Each has different consequences. **The library makes them interchangeable so they can be compared cleanly.**

| # | Strategy | What the agent sees afterwards | Why you'd pick it |
|---|---|---|---|
| 1 | **Silent rewrite** | The agent's draft is replaced with the user's edit. The agent's chain shows the edited version as if it always drafted that. No record of the human's intervention. | Smoothest UX. No apology spiral. The agent doesn't second-guess itself. |
| 2 | **Visible correction** | Agent's original draft is preserved. A "user revised this to X" message gets inserted after. Agent sees both. | Transparency. Agent can react ("got it, I'll adjust"). Useful if you want learning within a session. |
| 3 | **Reject and retry** | Agent's draft is discarded. The agent receives a "draft this differently — here's what was wrong: [user's notes]" prompt and re-emits. | Forces the agent to genuinely revise rather than apply a one-shot patch. Best for cases where you want the agent to internalize the correction. |
| 4 | **Constraint injection** | The user's edit isn't directly applied; instead a derived constraint ("for emails like this, prefer X over Y") is appended to the system prompt. The current draft proceeds with the user's literal edit, AND future drafts inherit the constraint. | Durable cross-action learning within a session. Risky if the constraint extraction is wrong. |

None of these is universally "correct." That's the point.

## What we measure

For each strategy, on a controlled fixture (an agent task with a planted mistake the user reliably fixes), the test harness reports:

- **Recurrence** — when the agent has to draft a similar action later in the session, does it repeat the original mistake?
- **Coherence** — does the agent apologize, second-guess, get confused, or otherwise derail in the next few turns after the edit?
- **Edit stickiness** — if the agent gets to revise its own output later (e.g. "make it shorter"), does the user's edit survive, or does the agent revert toward its first draft?
- **Token cost** — input tokens spent on the next agent turn after the edit. Strategy 3 (retry) is expected to cost most.
- **Cross-action transfer** — if the user edited the agent's *tone* in an email, does the next Slack draft inherit the new tone? (Sometimes wanted, sometimes not.)

Each strategy gets one number on each axis. We publish the matrix. Devs pick based on what their app actually needs, not vibes.

## Why a library and not just a guide

Anyone *could* build any of these strategies one-off in their own app. Most teams build one (usually #1 because it looks slickest) and never test the alternatives. Making the strategies a one-line config in a shared library is what actually makes the comparison cheap, and what gets adoption.

The protocol is JSON-over-anything (HTTP, websocket, in-process). The first frontend implementation is React; Rust TUI and a wasm bridge come later. Agent side is stack-agnostic — adapters land for the Vercel AI SDK, LangGraph, and raw Anthropic / OpenAI tool-use loops.

## Roadmap

- [ ] Pin the protocol: `Action`, `Edit`, `FeedbackStrategy`, `RewriteResult`
- [ ] Reference implementation: core lib + Vercel AI SDK adapter + email template
- [ ] Three more templates: Slack message, Linear issue, file patch
- [ ] Test harness: fixture agent + planted-mistake task suite
- [ ] First empirical run across the four strategies, results published in this README
- [ ] Catalog expansion (messaging, calendar, code, CRM)

## License

[MIT](LICENSE).
