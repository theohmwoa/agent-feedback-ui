export const usage = `import { McpToolCall } from "@/components/agent-ui/mcp-tool-call";

<McpToolCall
  intent={{
    serverName: "supabase-prod",
    transport: "stdio",
    toolName: "supabase.run_sql",
    toolDescription: tool.description,
    args: argsFromSchema(tool.inputSchema),  // [{ name, type, description, required, value }]
    expectedReturn: tool.outputSchemaSummary,
    status: client.connectionStatus,
    affectsProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      mcpClient.callTool(r.payload.serverName, {
        name: r.payload.toolName,
        arguments: r.payload.args,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "McpToolIntent",                            req: true,  desc: "Server name + transport, tool name + description, generated arg fields, expected return shape, connection status." },
  { name: "onResult", type: "(r: ReviewResult<McpToolPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];
