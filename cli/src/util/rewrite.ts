// Source in the registry uses the catalog's own layout:
//   src/components/<slug>/index.tsx imports from "../../chrome/primitives",
//   "../../chrome/icons", "../../types", and "./types".
//
// When copied into a user's project the layout flattens — primitives.tsx,
// icons.tsx, and types.ts sit alongside each <slug>/ folder under
// componentPath. So we rewrite:
//
//   "../../chrome/primitives"  →  "<importPrefix>/primitives"
//   "../../chrome/icons"       →  "<importPrefix>/icons"
//   "../../types"              →  "<importPrefix>/types"
//   "./types"                  →  unchanged (component-local)
//
// Where <importPrefix> is the user's importAlias (e.g. "@/components/agent-ui")
// or, if they didn't set one, the relative path back from <slug>/ which is
// always "..".

const PATTERNS: Array<{ from: RegExp; toKey: "primitives" | "icons" | "types" }> = [
  { from: /(["'])\.\.\/\.\.\/chrome\/primitives\1/g,  toKey: "primitives" },
  { from: /(["'])\.\.\/\.\.\/chrome\/icons\1/g,       toKey: "icons" },
  { from: /(["'])\.\.\/\.\.\/types\1/g,               toKey: "types" },
];

export function rewriteImports(
  source: string,
  filePath: string,
  importPrefix: string,
): string {
  let out = source;
  for (const p of PATTERNS) {
    out = out.replace(p.from, (_, q) => `${q}${importPrefix}/${p.toKey}${q}`);
  }
  // No-op for files that aren't components (system files don't have these
  // patterns), but cheap to run unconditionally.
  void filePath;
  return out;
}
