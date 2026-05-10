import type { AgentMeta } from "../../types";

export type PatchLine =
  | { kind: "ctx"; text: string; line: number }
  | { kind: "add"; text: string; line: number }
  | { kind: "del"; text: string; line: number };

export type PatchHunk = {
  id: string;
  header: string;
  lines: PatchLine[];
};

export type PatchFile = {
  path: string;
  hunks: PatchHunk[];
};

export type PatchIntent = AgentMeta & {
  files: PatchFile[];
};

export type PatchPayload = {
  files: PatchFile[];
  approvedHunks: string[];
};

export const PATCH_DEFAULT: PatchIntent = {
  agent: "atlas",
  action: "apply-patch",
  files: [
    {
      path: "src/middleware/jwt.ts",
      hunks: [
        {
          id: "h1",
          header: "@@ -12,7 +12,11 @@ export async function verifyJwt(token: string) {",
          lines: [
            { kind: "ctx", line: 12, text: "  const decoded = decode(token);" },
            { kind: "ctx", line: 13, text: "  const kid = decoded.header.kid;" },
            { kind: "ctx", line: 14, text: "" },
            { kind: "del", line: 15, text: "  const jwk = await fetchPublicKey(kid);" },
            { kind: "del", line: 16, text: "  return crypto.verify(token, jwk);" },
            { kind: "add", line: 15, text: "  let jwk = keyCache.get(kid);" },
            { kind: "add", line: 16, text: "  if (!jwk) {" },
            { kind: "add", line: 17, text: "    jwk = await fetchPublicKey(kid);" },
            { kind: "add", line: 18, text: "    keyCache.set(kid, jwk);" },
            { kind: "add", line: 19, text: "  }" },
            { kind: "add", line: 20, text: "  return crypto.verify(token, jwk);" },
            { kind: "ctx", line: 21, text: "}" },
          ],
        },
      ],
    },
    {
      path: "src/middleware/jwt.ts",
      hunks: [
        {
          id: "h2",
          header: "@@ -1,3 +1,5 @@",
          lines: [
            { kind: "add", line: 1, text: "import { LRUCache } from 'lru-cache';" },
            { kind: "add", line: 2, text: "" },
            { kind: "add", line: 3, text: "const keyCache = new LRUCache<string, JWK>({ max: 32, ttl: 1000 * 60 * 60 });" },
            { kind: "ctx", line: 4, text: "" },
            { kind: "ctx", line: 5, text: "import { decode, fetchPublicKey } from './crypto';" },
          ],
        },
      ],
    },
  ],
  rationale: "Module-scoped LRU keyed by `kid` — fixes the hot-path verify by avoiding the synchronous remote JWK fetch on each request.",
};
