export const usage = `import { StatuspageIncidentCreate } from "@/components/agent-ui/statuspage-incident-create";

<StatuspageIncidentCreate
  intent={{
    pageId: "8d2hxtr1qf3z",
    pageName: "Nordlight Status",
    title: agentTitle,
    status: "investigating",
    impact: "major",
    components: registeredComponents.map(c => ({
      id: c.id, name: c.name, selected: c.affected,
    })),
    message: agentDraftMessage,
    defaultNotify: true,
    subscriberCount: page.subscribers,
  }}
  onResult={async (r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      await statuspage.incidents.create({
        page_id: r.payload.pageId,
        incident: {
          name: r.payload.title,
          status: r.payload.status,
          impact: r.payload.impact,
          component_ids: r.payload.componentIds,
          body: r.payload.message,
          deliver_notifications: r.payload.notifySubscribers,
        },
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",     type: "SpIntent",                            req: true,  desc: "Page id/name, title, status, impact, components, message, subscribers." },
  { name: "onResult",   type: "(r: ReviewResult<SpPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.impact", type: "'none' | 'minor' | 'major' | 'critical'", req: true, desc: "Drives the colored impact chip." },
  { name: "intent.components", type: "SpComponent[]",                req: true, desc: "All registered components — set { selected: true } for affected ones." },
];
