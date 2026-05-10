export const usage = `import { AirbyteSync } from "@/components/agent-ui/airbyte-sync";

<AirbyteSync
  intent={{
    workspace: "Nordlight",
    connection: "postgres-nordlight-prod → snowflake-analytics",
    source:      { name: "Postgres / nordlight-prod", kind: "Postgres",  hue: 220 },
    destination: { name: "Snowflake / NORDLIGHT.RAW", kind: "Snowflake", hue: 200 },
    streams: agentStreams,
    resetData: false,
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      airbyte.connections.sync({
        connectionId,
        resetData: r.payload.resetData,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "AirbyteIntent",                            req: true,  desc: "Workspace, connection, source/destination endpoints, streams, resetData, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<AirbyteSyncPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.resetData", type: "boolean", req: true, desc: "Reset on prod requires typing the connection name to confirm. Switches submit to a danger button." },
];
