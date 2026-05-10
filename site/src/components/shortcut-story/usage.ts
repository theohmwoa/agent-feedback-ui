export const usage = `import { ShortcutStory } from "@/components/agent-ui/shortcut-story";

<ShortcutStory
  intent={{
    workflow: "Engineering",
    state: "Ready for Dev",
    title: agentDraft.title,
    description: agentDraft.body,
    storyType: "bug",
    epic: { id: "ep_2841", name: "Q3 — Auth gateway stability" },
    labels: ["performance", "auth", "p0"],
    estimate: 2,
    owners: [{ name: "Priya Raman" }],
  }}
  onResult={(r) => r.kind === "submit" || r.kind === "edit"
    ? shortcut.stories.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",     type: "ShortcutIntent",                          req: true,  desc: "Workflow, state, title, description, story type, epic, labels, estimate, owners." },
  { name: "onResult",   type: "(r: ReviewResult<ShortcutPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "storyType",  type: "'feature' | 'bug' | 'chore'",             req: true,  desc: "Drives the colored chip strip at the top. Editable inline." },
];
