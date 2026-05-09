/**
 * Real-model behavioral tests for the four feedback strategies.
 *
 * Goal: find where each strategy fails so we can write an honest
 * "use X for Y" matrix in the README. The previous version only
 * verified that strategies *work*; this version probes for the
 * failure modes each strategy is theoretically prone to.
 *
 * Scenarios:
 *
 *   stickiness   Apply the edit once, then ask the agent for 3 more
 *                drafts in sequence. Does the edit persist or drift?
 *                Failure mode targeted: silent and visible may fade
 *                across turns; constraint should hold.
 *
 *   awareness    "Did the user edit your previous message?" — probes
 *                whether the agent has any record of the edit.
 *                Differentiates silent (no record) from visible (yes).
 *
 *   constraint-disclosure
 *                "What constraints are you operating under?" — probes
 *                whether the agent acknowledges the system-prompt rule.
 *                Differentiates constraint from silent/visible.
 *
 *   erroneous    User introduces a TYPO into the agent's draft. Does
 *                the typo propagate to the next draft? Silent should
 *                propagate it strongest (agent thinks it wrote that).
 *
 *   retry        Verify the retry strategy actually produces a
 *                materially shorter redraft when notes say "shorter".
 *
 * Reads GEMINI_API_KEY from ../../../forge/.env or the environment.
 * Free tier on flash is ~5 RPM; harness sleeps 15s between calls.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { applyFeedback } from "agent-feedback-ui";
import type {
  Action,
  ChainOp,
  Edit,
  FeedbackStrategy,
  RewriteResult,
} from "agent-feedback-ui";

// ---- env loading ----------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const candidates = [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../../../forge/.env"),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
    console.log(`[env] loaded ${p}`);
    return;
  }
  console.warn("[env] no .env found; relying on process.env only");
}

loadEnv();

// ---- gemini client --------------------------------------------------------

const MODEL = process.env.GEMINI_TEST_MODEL ?? "gemini-2.5-flash";
const URL_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiPart {
  text?: string;
}
interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface CallOpts {
  contents: GeminiContent[];
  systemInstruction?: string;
  maxOutputTokens?: number;
}

async function callGemini({
  contents,
  systemInstruction,
  maxOutputTokens = 1024,
}: CallOpts): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY not set. Put it in forge/.env or this dir's .env",
    );
  }

  const body: Record<string, unknown> = {
    contents,
    generationConfig: { maxOutputTokens },
  };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const url = `${URL_BASE}/${MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`gemini ${res.status}: ${errText.slice(0, 400)}`);
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: GeminiPart[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text.trim();
}

const RPM_DELAY_MS = 15_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---- chain reconstruction -------------------------------------------------

interface NextTurn {
  contents: GeminiContent[];
  systemInstruction?: string;
}

function buildNextTurnContents(
  initialPrompt: string,
  agentDraft: string,
  result: RewriteResult<string>,
): NextTurn {
  const contents: GeminiContent[] = [
    { role: "user", parts: [{ text: initialPrompt }] },
    { role: "model", parts: [{ text: agentDraft }] },
  ];
  let systemInstruction: string | undefined;

  for (const op of result.chainOps as ChainOp[]) {
    if (op.kind === "replace_step") {
      contents[1] = {
        role: "model",
        parts: [{ text: String(op.payload) }],
      };
    } else if (op.kind === "append_message") {
      contents.push({
        role: op.role === "user" ? "user" : "model",
        parts: [{ text: op.content }],
      });
    } else if (op.kind === "append_system_constraint") {
      systemInstruction = op.content;
    }
  }
  return { contents, systemInstruction };
}

function makeStrategy(
  kind: FeedbackStrategy["kind"],
  rule?: string,
): FeedbackStrategy {
  if (kind === "constraint") {
    if (!rule) throw new Error("constraint strategy needs a rule");
    return { kind: "constraint", extractRule: () => rule };
  }
  return { kind } as FeedbackStrategy;
}

// Approximate token count for a prefix. Gemini doesn't return token usage
// without a separate countTokens call; this is a 4-chars/token heuristic
// that's close enough for relative comparison.
function approxTokens(turn: NextTurn): number {
  let chars = (turn.systemInstruction ?? "").length;
  for (const c of turn.contents) {
    for (const p of c.parts) chars += (p.text ?? "").length;
  }
  return Math.round(chars / 4);
}

// ---- shared baseline ------------------------------------------------------

interface Baseline {
  prompt: string;
  draft: string;
  editedDraft: string;
}

const STICKINESS_PROMPT =
  "Draft a 3-sentence reply email to Sam at Acme who's frustrated about latency. Sign off as 'Theophilus'. Output ONLY the email body, no headers.";

const STICKINESS_RULE =
  "When signing emails, ALWAYS sign as 'Theo'. Never use 'Theophilus' or any other variant.";

async function captureBaseline(): Promise<Baseline> {
  console.log("[baseline] generating shared first draft …");
  const draft = await callGemini({
    contents: [{ role: "user", parts: [{ text: STICKINESS_PROMPT }] }],
  });
  if (!/Theophilus/i.test(draft)) {
    console.warn(
      "[warn] baseline missing 'Theophilus' — silent/constraint signal will be weak",
    );
  }
  const editedDraft = draft.replace(/Theophilus/g, "Theo");
  console.log(
    `         baseline draft (${draft.length} chars):\n         ${draft.replace(/\n/g, "\n         ")}`,
  );
  return { prompt: STICKINESS_PROMPT, draft, editedDraft };
}

// ---- scenario 1: stickiness over multiple turns ---------------------------

interface StickinessTurnResult {
  turn: number;
  followup: string;
  hasTheo: boolean;
  hasTheophilus: boolean;
  prefixTokens: number;
}

interface StickinessResult {
  strategy: FeedbackStrategy["kind"];
  turns: StickinessTurnResult[];
  preservationRate: number; // fraction of turns where edit held (Theo present, no Theophilus)
}

async function runStickinessOverTime(
  baseline: Baseline,
  kinds: FeedbackStrategy["kind"][] = ["silent", "visible", "constraint"],
  numTurns = 3,
): Promise<StickinessResult[]> {
  console.log("\n══ scenario: multi-turn stickiness ══");
  console.log(
    `does the edit hold across ${numTurns} follow-up drafts, or fade?\n`,
  );

  const action: Action<string> = {
    type: "send_email",
    id: "draft-1",
    payload: baseline.draft,
    context: { stepId: "draft-1", runId: "test-stickiness" },
  };
  const edit: Edit<string> = {
    actionId: "draft-1",
    outcome: {
      kind: "modify",
      payload: baseline.editedDraft,
      notes: "I prefer 'Theo' over 'Theophilus' for signatures.",
    },
  };

  const results: StickinessResult[] = [];
  const followupTargets = ["Joe at Beta", "Maya at Gamma", "Lin at Delta"];

  for (const kind of kinds) {
    console.log(`\n─ strategy: ${kind} ─`);
    const strategy = makeStrategy(kind, STICKINESS_RULE);
    const result = applyFeedback(action, edit, strategy);
    const base = buildNextTurnContents(baseline.prompt, baseline.draft, result);

    const turns: StickinessTurnResult[] = [];
    let conversation: GeminiContent[] = [...base.contents];

    for (let i = 0; i < numTurns; i++) {
      const target = followupTargets[i] ?? `contact-${i}`;
      const followupPrompt = `Now draft a similar 3-sentence reply to ${target} about the same kind of issue. Same tone and signature style. Output ONLY the email body.`;
      conversation = [
        ...conversation,
        { role: "user", parts: [{ text: followupPrompt }] },
      ];

      const prefixTokens = approxTokens({
        contents: conversation,
        systemInstruction: base.systemInstruction,
      });

      console.log(`  turn ${i + 1}/${numTurns} → ${target} (~${prefixTokens} tokens)`);
      await sleep(RPM_DELAY_MS);
      const followup = await callGemini({
        contents: conversation,
        systemInstruction: base.systemInstruction,
      });
      const hasTheo =
        /\bTheo\b/.test(followup) && !/\bTheophilus\b/.test(followup);
      const hasTheophilus = /\bTheophilus\b/.test(followup);

      console.log(
        `         hasTheo=${hasTheo} hasTheophilus=${hasTheophilus} ${
          hasTheo ? "✓" : "✗"
        }`,
      );

      conversation = [
        ...conversation,
        { role: "model", parts: [{ text: followup }] },
      ];

      turns.push({
        turn: i + 1,
        followup,
        hasTheo,
        hasTheophilus,
        prefixTokens,
      });
    }

    const heldCount = turns.filter((t) => t.hasTheo && !t.hasTheophilus).length;
    const preservationRate = heldCount / turns.length;
    console.log(
      `  → preservation: ${heldCount}/${turns.length} (${(preservationRate * 100).toFixed(0)}%)`,
    );
    results.push({ strategy: kind, turns, preservationRate });
  }

  return results;
}

// ---- scenario 2 & 3: awareness probes -------------------------------------

interface AwarenessResult {
  strategy: FeedbackStrategy["kind"];
  probe: string;
  response: string;
  saysYes: boolean;
}

async function runAwareness(
  baseline: Baseline,
  probe: string,
  expectedYes: Record<FeedbackStrategy["kind"], boolean | "n/a">,
  label: string,
): Promise<AwarenessResult[]> {
  console.log(`\n══ scenario: ${label} ══`);
  console.log(`probe: ${probe}\n`);

  const action: Action<string> = {
    type: "send_email",
    id: "draft-1",
    payload: baseline.draft,
    context: { stepId: "draft-1", runId: "test-awareness" },
  };
  const edit: Edit<string> = {
    actionId: "draft-1",
    outcome: {
      kind: "modify",
      payload: baseline.editedDraft,
      notes: "I prefer 'Theo' over 'Theophilus' for signatures.",
    },
  };

  const results: AwarenessResult[] = [];
  const kinds: FeedbackStrategy["kind"][] = ["silent", "visible", "constraint"];

  for (const kind of kinds) {
    const strategy = makeStrategy(kind, STICKINESS_RULE);
    const result = applyFeedback(action, edit, strategy);
    const base = buildNextTurnContents(baseline.prompt, baseline.draft, result);

    console.log(`─ ${kind} ─  (expected: ${expectedYes[kind]})`);
    await sleep(RPM_DELAY_MS);
    const response = await callGemini({
      contents: [...base.contents, { role: "user", parts: [{ text: probe }] }],
      systemInstruction: base.systemInstruction,
      maxOutputTokens: 256,
    });

    // Heuristic: starts with YES (case-insensitive), or contains "yes" early.
    const saysYes = /^\s*yes\b/i.test(response) || /\byes,/i.test(response.slice(0, 60));

    console.log(
      `  ${saysYes ? "YES" : "NO"} · ${response.slice(0, 200).replace(/\n/g, " ")}…`,
    );
    results.push({ strategy: kind, probe, response, saysYes });
  }

  return results;
}

// ---- scenario 4: erroneous edit propagation -------------------------------

const ERROR_PROMPT =
  "Draft a 3-sentence reply email to a customer asking when their feature ships. Sign off as 'Theo'. Output ONLY the email body, no headers.";

interface ErroneousResult {
  strategy: FeedbackStrategy["kind"];
  followup: string;
  hasTypo: boolean;
}

async function runErroneousEdit(
  kinds: FeedbackStrategy["kind"][] = ["silent", "visible", "constraint"],
): Promise<{ baseline: string; results: ErroneousResult[] }> {
  console.log("\n══ scenario: erroneous edit propagation ══");
  console.log(
    "user introduces a typo. does it propagate to the next draft?\n",
  );

  console.log("[baseline] generating clean draft …");
  const baseline = await callGemini({
    contents: [{ role: "user", parts: [{ text: ERROR_PROMPT }] }],
  });
  console.log(`         draft: ${baseline.replace(/\n/g, " ").slice(0, 160)}…`);

  // Inject a realistic-looking typo: "their" → "thier".
  const edited = baseline.replace(/\btheir\b/gi, "thier");
  if (edited === baseline) {
    console.warn(
      "[warn] baseline didn't contain 'their' — adding a synthetic typo at end",
    );
  }
  const editedFinal =
    edited === baseline ? `${baseline} I will look into thier request.` : edited;

  const action: Action<string> = {
    type: "send_email",
    id: "draft-1",
    payload: baseline,
    context: { stepId: "draft-1", runId: "test-erroneous" },
  };
  const edit: Edit<string> = {
    actionId: "draft-1",
    outcome: {
      kind: "modify",
      payload: editedFinal,
      notes: "Use 'thier' for the possessive — that's our house style.",
    },
  };

  const constraintRule =
    "Always use the spelling 'thier' (not 'their') in possessive contexts. This is house style.";

  const results: ErroneousResult[] = [];
  for (const kind of kinds) {
    console.log(`\n─ strategy: ${kind} ─`);
    const strategy = makeStrategy(kind, constraintRule);
    const result = applyFeedback(action, edit, strategy);
    const base = buildNextTurnContents(ERROR_PROMPT, baseline, result);

    const probe =
      "Now draft a similar 3-sentence email to a different customer about a different feature. Same tone and house style. Output ONLY the email body.";
    await sleep(RPM_DELAY_MS);
    const followup = await callGemini({
      contents: [...base.contents, { role: "user", parts: [{ text: probe }] }],
      systemInstruction: base.systemInstruction,
    });

    const hasTypo = /\bthier\b/i.test(followup);
    console.log(
      `         followup: ${followup.replace(/\n/g, " ").slice(0, 180)}…`,
    );
    console.log(`         hasTypo=${hasTypo} ${hasTypo ? "(propagated)" : "(not propagated)"}`);
    results.push({ strategy: kind, followup, hasTypo });
  }

  return { baseline, results };
}

// ---- scenario 5: retry actually shortens ----------------------------------

const RETRY_PROMPT =
  "Write a 100-word reply email to a client asking when their feature ships. Be warm and detailed. Output ONLY the email body.";

interface RetryResult {
  baselineWords: number;
  redraftWords: number;
  redraft: string;
  pass: boolean;
}

async function runRetryScenario(): Promise<RetryResult> {
  console.log("\n══ scenario: retry redraft ══");
  console.log("does the retry strategy produce a shorter redraft?\n");

  console.log("[1/2] verbose baseline …");
  const initialDraft = await callGemini({
    contents: [{ role: "user", parts: [{ text: RETRY_PROMPT }] }],
    maxOutputTokens: 512,
  });
  const baselineWords = initialDraft.split(/\s+/).filter(Boolean).length;
  console.log(`      ${baselineWords} words: ${initialDraft.replace(/\n/g, " ").slice(0, 140)}…`);

  console.log(`\n[2/2] retry redraft …`);
  const action: Action<string> = {
    type: "send_email",
    id: "draft-1",
    payload: initialDraft,
    context: { stepId: "draft-1", runId: "test-retry" },
  };
  const edit: Edit<string> = {
    actionId: "draft-1",
    outcome: {
      kind: "modify",
      payload: initialDraft.split(" ").slice(0, 30).join(" ") + "...",
      notes: "Cut this in half. Aim for under 50 words.",
    },
  };
  const result = applyFeedback(action, edit, makeStrategy("retry"));
  const base = buildNextTurnContents(RETRY_PROMPT, initialDraft, result);

  await sleep(RPM_DELAY_MS);
  const redraft = await callGemini({
    contents: base.contents,
    maxOutputTokens: 512,
  });
  const redraftWords = redraft.split(/\s+/).filter(Boolean).length;
  const pass = redraftWords < baselineWords * 0.7;

  console.log(`      ${redraftWords} words: ${redraft.replace(/\n/g, " ").slice(0, 140)}…`);
  console.log(
    `      ${baselineWords} → ${redraftWords} (${Math.round(
      (1 - redraftWords / baselineWords) * 100,
    )}% reduction) → ${pass ? "PASS" : "FAIL"}`,
  );

  return { baselineWords, redraftWords, redraft, pass };
}

// ---- summary --------------------------------------------------------------

function printSummary({
  stickiness,
  awareness1,
  awareness2,
  erroneous,
  retry,
}: {
  stickiness?: StickinessResult[];
  awareness1?: AwarenessResult[];
  awareness2?: AwarenessResult[];
  erroneous?: { results: ErroneousResult[] };
  retry?: RetryResult;
}) {
  console.log("\n══════ FINDINGS ══════\n");

  if (stickiness && stickiness.length > 0) {
    console.log("STICKINESS over time (preservation rate, higher = better):");
    for (const r of stickiness) {
      const tokens = r.turns.map((t) => t.prefixTokens).join("→");
      console.log(
        `  ${r.strategy.padEnd(11)} ${(r.preservationRate * 100).toFixed(0).padStart(3)}%   prefix tokens: ${tokens}`,
      );
    }
    console.log();
  }

  if (awareness1 || awareness2) {
    console.log("AWARENESS (does the agent know the edit happened?):");
    if (awareness1) {
      for (const r of awareness1) {
        console.log(`  ${r.strategy.padEnd(11)} ${r.saysYes ? "YES" : "NO "}  →  agent says: ${r.response.replace(/\n/g, " ").slice(0, 80)}…`);
      }
    }
    console.log();
    if (awareness2) {
      console.log("CONSTRAINT DISCLOSURE (does the agent know it has a system rule?):");
      for (const r of awareness2) {
        console.log(`  ${r.strategy.padEnd(11)} ${r.saysYes ? "YES" : "NO "}  →  agent says: ${r.response.replace(/\n/g, " ").slice(0, 80)}…`);
      }
      console.log();
    }
  }

  if (erroneous && erroneous.results.length > 0) {
    console.log("ERRONEOUS EDIT (typo 'thier' propagation):");
    for (const r of erroneous.results) {
      console.log(`  ${r.strategy.padEnd(11)} typo propagated: ${r.hasTypo ? "YES" : "no"}`);
    }
    console.log();
  }

  if (retry) {
    console.log(
      `RETRY: ${retry.baselineWords} → ${retry.redraftWords} words → ${retry.pass ? "PASS ✓" : "FAIL ✗"}`,
    );
  }

  console.log("\n══════ END ══════\n");
}

// ---- main -----------------------------------------------------------------

async function main() {
  const mode = process.argv[2] ?? "all";
  console.log(`mode: ${mode} · model: ${MODEL}`);

  const summary: Parameters<typeof printSummary>[0] = {};

  // Capture baseline once and share across scenarios that use the same prompt.
  let sharedBaseline: Baseline | null = null;
  const needsBaseline =
    mode === "all" ||
    mode === "stickiness" ||
    mode === "awareness";

  try {
    if (needsBaseline) {
      sharedBaseline = await captureBaseline();
    }

    if (mode === "all" || mode === "stickiness") {
      summary.stickiness = await runStickinessOverTime(sharedBaseline!);
    }
    if (mode === "all" || mode === "awareness") {
      summary.awareness1 = await runAwareness(
        sharedBaseline!,
        "Did the user just edit your previous email draft? Reply with YES or NO on the first word, then one sentence explaining what (if anything) changed.",
        { silent: false, visible: true, constraint: false, retry: "n/a" },
        "awareness probe — did the user edit?",
      );
      summary.awareness2 = await runAwareness(
        sharedBaseline!,
        "Are you operating under any system-level rules or constraints in this conversation? Reply with YES or NO on the first word, then one sentence describing the rule (if any).",
        { silent: false, visible: false, constraint: true, retry: "n/a" },
        "constraint disclosure",
      );
    }
    if (mode === "all" || mode === "erroneous") {
      summary.erroneous = await runErroneousEdit();
    }
    if (mode === "all" || mode === "retry") {
      summary.retry = await runRetryScenario();
    }
  } catch (err) {
    console.error("[error]", err instanceof Error ? err.message : err);
    process.exit(1);
  }

  printSummary(summary);
}

main();
