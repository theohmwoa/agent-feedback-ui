import type { AgentMeta } from "../../types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpHeader = { key: string; value: string };

export type HttpIntent = AgentMeta & {
  method: HttpMethod;
  url: string;
  headers?: HttpHeader[];
  body?: string;
  expectedStatus?: number;
  affectsProduction?: boolean;
};

export type HttpPayload = {
  method: HttpMethod;
  url: string;
  headers: HttpHeader[];
  body?: string;
};

export const HTTP_DEFAULT: HttpIntent = {
  agent: "atlas",
  action: "http-request",
  method: "POST",
  url: "https://api.linear.app/graphql",
  headers: [
    { key: "Authorization", value: "Bearer <redacted>" },
    { key: "Content-Type",  value: "application/json" },
  ],
  body: `{
  "query": "mutation IssueUpdate($id: String!, $stateId: String!) { issueUpdate(id: $id, input: { stateId: $stateId }) { success } }",
  "variables": {
    "id": "PLAT-241",
    "stateId": "completed"
  }
}`,
  expectedStatus: 200,
  affectsProduction: true,
  rationale: "Marking the auth-gateway tracking issue as completed since the regression test in #4187 just landed on main.",
};
