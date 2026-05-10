export const usage = `import { PagerdutyIncidentAck } from "@/components/agent-ui/pagerduty-incident-ack";

<PagerdutyIncidentAck
  intent={{
    incidentNumber: incident.id,
    title: incident.title,
    urgency: incident.urgency,           // "low" | "high"
    service: incident.service.summary,
    alertsCount: incident.alerts_count,
    triggeredAt: formatRelative(incident.created_at),
    oncallName: oncall.name,
    runbookName: "auth-gateway/latency-spike.md",
    slackChannel: "#incident-q5j2x4",
    defaultEtaMins: 15,
    defaultPostAction: "open-slack",
  }}
  onResult={async (r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      await pd.acknowledgeIncident(r.payload.incidentNumber);
      if (r.payload.snoozeMins) await pd.snooze(r.payload.incidentNumber, r.payload.snoozeMins);
      if (r.payload.postAction === "run-runbook") runbook.execute(/* … */);
      if (r.payload.postAction === "open-slack")  slack.openChannel(/* … */);
    }
  }}
/>`;

export const props = [
  { name: "intent",            type: "PdIntent",                            req: true,  desc: "Incident number, title, urgency, service, alerts count, triggered timestamp, oncall." },
  { name: "onResult",          type: "(r: ReviewResult<PdPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.urgency",    type: "'low' | 'high'",                      req: true,  desc: "High shows a red urgency pill." },
  { name: "intent.defaultPostAction", type: "'none' | 'open-slack' | 'run-runbook'", req: false, desc: "Pre-selected follow-up action." },
];
