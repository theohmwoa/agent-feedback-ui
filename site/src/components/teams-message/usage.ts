export const usage = `import { TeamsMessage } from "@/components/agent-ui/teams-message";

<TeamsMessage
  intent={{
    team: "Platform Engineering",
    channel: "Incidents",
    message: agentDraft,
    importance: "Important",
    mentions: ["@Priya Raman"],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      teams.channels.send({
        teamId, channelId,
        body: r.payload.message,
        importance: r.payload.importance.toLowerCase(),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",     type: "TeamsIntent",                            req: true,  desc: "Team, channel, body, importance, mentions." },
  { name: "onResult",   type: "(r: ReviewResult<TeamsPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "importance", type: "'Normal' | 'Important' | 'Urgent'",      req: true,  desc: "Urgent flips the submit button to danger and adds the red flag." },
];
