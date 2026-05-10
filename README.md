# agent-ui

**Beautiful UI for the moment your agent asks "send it?"**

A copy-paste registry of review-and-edit components for AI agent surfaces — emails, messages, issues, queries, patches. shadcn-style: run a CLI command, the source lands in your repo, you own it from there.

> Status: pre-zero. Three components are stable, seven more on the way. The CLI is in design — for now, [browse the components](https://theohmwoa.github.io/agent-feedback-ui/) and copy the source from this repo.

## What this is

When an AI agent is about to send an email, post in Slack, file a Linear issue, run a SQL query — most apps either (1) just let it rip, or (2) put up a generic "Approve / Reject" dialog. The interesting middle ground is the *review-and-edit* surface: a domain-shaped UI pre-filled with the agent's draft that the human can tweak before it ships.

Mirage AI and a handful of others have built one-off versions for specific actions. This is the catalog.

## What's in the box

Each component is:

- **Self-contained** — pure `(intent → result)`. Plug into any agent stack.
- **Themed via CSS variables** — `--agent-ui-accent`, `--agent-ui-radius`, dark + light out of the box.
- **ARIA-correct** — focus traps, escape-to-cancel, keyboard parity. Screen readers can drive the whole thing.
- **Domain-evocative, not branded** — looks like the surface it's reviewing without copying any platform's chrome.

| Component | Status | What it reviews |
|---|---|---|
| `email-compose` | stable | A drafted email — addresses, subject, body, tone hint |
| `slack-message` | stable | A channel reply — thread context, mentions, broadcast toggle |
| `linear-issue` | stable | An issue creation — title, description, priority, labels, assignee |
| `github-pr-review` | soon | Approve / comment / request changes on a PR |
| `sql-query-runner` | soon | Approve a query before prod, with schema awareness |
| `file-patch-preview` | soon | Inline diff with approve / reject / edit per hunk |
| `calendar-event` | soon | Confirm a meeting, attendee resolution, conflict warnings |
| `github-issue` | soon | File a GitHub issue with labels, assignee, milestone |
| `sms-message` | soon | Approve a text, carrier preview, delivery window |

[See them live →](https://theohmwoa.github.io/agent-feedback-ui/)

## How you use a component

Each component is a pure function from intent → result. No provider, no context, no runtime. You decide when it mounts and what you do with the result.

```tsx
import { EmailCompose } from "@/components/agent-ui/email-compose";

<EmailCompose
  intent={{
    to: ["maya@nordlight.studio"],
    subject: "Re: Q3 partnership terms",
    body: agentDraft,
    tone: "warm",
    rationale: "Replying to Maya's last redline.",
  }}
  onResult={(r) => {
    if (r.kind === "submit") sendEmail(r.payload);
    if (r.kind === "edit")   sendEmail(r.payload);   // user changed it; ship the edit
    if (r.kind === "cancel") agent.abort();
  }}
/>
```

The result envelope is the same for every component:

```ts
type ReviewResult<T> =
  | { kind: "submit"; payload: T }
  | { kind: "edit";   payload: T; diff?: Diff }
  | { kind: "cancel" };
```

## How you'll install (CLI, in design)

The end-state is shadcn-shaped:

```bash
npx agent-ui init                              # set up agent-ui.json, paths, theme
npx agent-ui add email-compose slack-message   # writes source into your repo
npx agent-ui list                              # what's in the registry
npx agent-ui diff email-compose                # what changed since you copied it
```

For now (pre-CLI), copy the file from `site/bundle.jsx` or watch this space.

## Principles

1. **No runtime, no provider.** Every component is pure `(intent → result)`. Wire it to whatever agent SDK you already use — AI SDK, Mastra, LangChain, your own.
2. **Copy, don't install.** Source lands in your repo with one command. Restyle, refactor, fork — no upstream breakage. The CLI is the only npm dependency.
3. **Domain-shaped, not branded.** Each component looks like the surface it's reviewing without copying any platform's chrome.
4. **ARIA-correct by default.** Focus traps, escape-to-cancel, role=dialog, keyboard parity with mouse. A screen reader can drive the whole thing.

## What about chain rewrites / "feedback strategies"?

Earlier iterations of this project tried to bake "what should the agent's chain look like after the human edits?" into the library — silent rewrite vs. visible correction vs. constraint injection vs. retry. That's a real research question (see [`examples/strategy-tests/`](examples/strategy-tests/) for an empirical comparison on Gemini), but it's a *separate concern* from the components themselves. Components emit `{ kind: 'submit' | 'edit' | 'cancel', payload }`. What you do with that — including how you reshape the agent's history — is yours.

## Roadmap

- [x] First three components — email-compose, slack-message, linear-issue
- [x] Showcase site
- [ ] CLI: init / add / list / diff
- [ ] Public registry endpoint
- [ ] Seven more components (PR review, SQL runner, file patch, calendar, GH issue, SMS, shell)
- [ ] Theming guide + token reference
- [ ] React 19 / Server Components compat audit

## License

[MIT](LICENSE).
