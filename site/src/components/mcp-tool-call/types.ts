import type { AgentMeta } from "../../types";

export type McpTransport = "stdio" | "sse" | "streamable-http";
export type McpConnectionStatus = "connected" | "connecting" | "disconnected" | "error";

export type McpArgField = {
  name: string;
  type: "string" | "number" | "boolean" | "enum" | "json";
  description?: string;
  required?: boolean;
  value: string | number | boolean;
  enumOptions?: string[];
};

export type McpToolIntent = AgentMeta & {
  serverName: string;
  serverUrl?: string;
  transport: McpTransport;
  toolName: string;
  toolDescription?: string;
  args: McpArgField[];
  expectedReturn?: string;
  status: McpConnectionStatus;
  affectsProduction?: boolean;
};

export type McpToolPayload = {
  serverName: string;
  toolName: string;
  args: Record<string, string | number | boolean>;
};

export const MCP_TOOL_DEFAULT: McpToolIntent = {
  agent: "atlas",
  action: "mcp-tool-call",
  serverName: "supabase-prod",
  serverUrl: "stdio: npx -y @supabase/mcp-server-supabase",
  transport: "stdio",
  toolName: "supabase.run_sql",
  toolDescription: "Run a SQL statement against the project's primary Postgres. Returns up to 1000 rows or affected count.",
  args: [
    {
      name: "project_ref",
      type: "string",
      description: "Supabase project ref",
      required: true,
      value: "qzrdmlmxkyqthfdslbej",
    },
    {
      name: "query",
      type: "string",
      description: "SQL to execute",
      required: true,
      value: "select id, email from auth.users where last_sign_in_at > now() - interval '7 days' limit 100",
    },
    {
      name: "read_only",
      type: "boolean",
      description: "Refuse if statement would mutate",
      required: false,
      value: true,
    },
    {
      name: "format",
      type: "enum",
      description: "Output format",
      required: false,
      value: "json",
      enumOptions: ["json", "csv", "markdown"],
    },
  ],
  expectedReturn: `{
  rows: Array<{ id: string; email: string }>,
  rowCount: number
}`,
  status: "connected",
  affectsProduction: true,
  rationale: "Pulling weekly active users for the engagement report — read-only flag is set so this can't mutate the table.",
};
