export const usage = `import { DatadogAlertMute } from "@/components/agent-ui/datadog-alert-mute";

<DatadogAlertMute
  intent={{
    monitorId: monitor.id,
    monitorName: monitor.name,
    type: monitor.type,                  // "metric" | "anomaly" | …
    state: monitor.overall_state,        // "alert" | "warn" | "ok"
    tagScope: ["env:prod", "service:auth-gateway"],
    defaultDuration: "1h",
    defaultReason: agentReason,
    recentTriggers: 12,
  }}
  onResult={async (r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      await ddog.muteMonitor({
        monitor_id: r.payload.monitorId,
        scope: r.payload.scope.join(","),
        end: durationToEnd(r.payload.duration),
        reason: r.payload.reason,
      });
      if (r.payload.createIncident) await ddog.createIncident(/* … */);
    }
  }}
/>`;

export const props = [
  { name: "intent",         type: "DdIntent",                            req: true,  desc: "Monitor id/name, type, state, tag scope, default duration, reason." },
  { name: "onResult",       type: "(r: ReviewResult<DdPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.state",   type: "'alert' | 'warn' | 'ok'",             req: true,  desc: "Drives the colored state badge in the header." },
  { name: "intent.tagScope", type: "string[]",                            req: true, desc: "Tag selectors. User can drop any tag to widen the mute." },
];
