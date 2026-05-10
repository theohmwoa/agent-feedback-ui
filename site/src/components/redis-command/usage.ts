export const usage = `import { RedisCommand } from "@/components/agent-ui/redis-command";

<RedisCommand
  intent={{
    instance: "prod-cache-001.cache.use1.amazonaws.com",
    database: 0,
    command: "DEL session:7f3a*",
    key: "session:7f3a*",
    valuePreview: "(deletes 1,284 stale session blobs)",
    risk: "destructive",
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      redisClient.sendCommand(r.payload.command.split(" "));
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "RedisIntent",                           req: true,  desc: "Instance, db number, command, key, value preview, TTL, risk, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<RedisPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.risk", type: "'safe' | 'caution' | 'destructive'",   req: false, desc: "Overrides verb-based heuristic. DESTRUCTIVE on prod requires typing the instance name to confirm." },
];
