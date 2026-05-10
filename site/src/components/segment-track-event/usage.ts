export const usage = `import { SegmentTrackEvent } from "@/components/agent-ui/segment-track-event";

<SegmentTrackEvent
  intent={{
    workspace: "nordlight",
    source: "web-app",
    event: "Onboarding Step Completed",
    knownEvents: trackingPlan.events,
    userId: session.userId,
    properties: JSON.stringify(props, null, 2),
    destinations: [
      { id: "mixpanel",   name: "Mixpanel",    color: "#7856ff", enabled: true },
      { id: "amplitude",  name: "Amplitude",   color: "#1f6feb", enabled: true },
      { id: "customerio", name: "Customer.io", color: "#ffcc00", enabled: false },
    ],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      analytics.track({
        event: r.payload.event,
        userId: r.payload.userId,
        anonymousId: r.payload.anonymousId,
        properties: JSON.parse(r.payload.properties),
        integrations: r.payload.integrations,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "SegmentIntent",                            req: true,  desc: "Workspace, source, event name (with auto-suggest), identify ids, properties JSON, destinations." },
  { name: "onResult", type: "(r: ReviewResult<SegmentPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];
