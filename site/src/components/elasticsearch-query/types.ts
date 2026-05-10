import type { AgentMeta } from "../../types";

export type EsVerb = "GET" | "POST" | "PUT" | "DELETE";

export type ElasticsearchIntent = AgentMeta & {
  cluster: string;
  indexPattern: string;
  verb: EsVerb;
  path: string;
  body?: string;
  expectedHits?: number;
  explain?: boolean;
  isProduction?: boolean;
};

export type ElasticsearchPayload = {
  cluster: string;
  indexPattern: string;
  verb: EsVerb;
  path: string;
  body?: string;
  explain: boolean;
};

export const ES_DEFAULT: ElasticsearchIntent = {
  agent: "atlas",
  action: "run-query",
  cluster: "logs-prod-1.es.us-east-1.aws.found.io",
  indexPattern: "logs-app-*",
  verb: "POST",
  path: "/logs-app-*/_search",
  body: `{
  "size": 100,
  "query": {
    "bool": {
      "must": [
        { "term":  { "service.name": "auth-gateway" } },
        { "match": { "message": "JWT verify failed" } }
      ],
      "filter": [
        { "range": { "@timestamp": { "gte": "now-15m" } } }
      ]
    }
  },
  "sort": [ { "@timestamp": "desc" } ]
}`,
  expectedHits: 1842,
  explain: false,
  isProduction: true,
  rationale: "Pulling the last 15 minutes of auth-gateway JWT-verify failures to confirm the patch in #4187 is taking effect.",
};
