/**
 * Code block — TS snippet showing the actual library wire-up.
 * Kept small enough to fit on one screen; matches the API the
 * playground above is calling.
 */

import { useMemo, useState } from "react";
import { Icon } from "./icons.js";

const TS_SNIPPET = `import { tool, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { withFeedback } from "agent-feedback-ui/ai-sdk";
import {
  FeedbackProvider,
  useOpenAction,
} from "agent-feedback-ui/react";
import { EmailModal } from "agent-feedback-ui/templates";

const sendEmail = tool({
  description: "Send an email",
  parameters: z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string(),
  }),
  execute: async (args) => mailer.send(args),
});

function Composer() {
  const openModal = useOpenAction();

  const wrappedSendEmail = withFeedback(sendEmail, "send_email", {
    strategy: { kind: "constraint", extractRule: deriveRule },
    openModal,
    onConstraint: (rule) => sessionRules.push(rule),
  });

  return (
    <button
      onClick={() => generateText({
        model: openai("gpt-5"),
        tools: { send_email: wrappedSendEmail },
        prompt: "Reply to the latest support thread.",
      })}
    >
      Run agent
    </button>
  );
}

export const App = () => (
  <FeedbackProvider templates={{ send_email: EmailModal }}>
    <Composer />
  </FeedbackProvider>
);`;

interface Token {
  t: string;
  v: string;
}

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  const keywords = new Set([
    "import",
    "from",
    "const",
    "function",
    "return",
    "export",
    "async",
    "await",
    "if",
    "else",
    "new",
  ]);
  const types = new Set(["string", "number", "boolean"]);
  let i = 0;
  while (i < src.length) {
    const c = src[i] ?? "";
    if (c === "/" && src[i + 1] === "/") {
      const end = src.indexOf("\n", i);
      const e = end === -1 ? src.length : end;
      tokens.push({ t: "cmt", v: src.slice(i, e) });
      i = e;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") j += 2;
        else j++;
      }
      tokens.push({ t: "str", v: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j] ?? "")) j++;
      tokens.push({ t: "num", v: src.slice(i, j) });
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_$]/.test(src[j] ?? "")) j++;
      const word = src.slice(i, j);
      let cls = "id";
      if (keywords.has(word)) cls = "key";
      else if (types.has(word)) cls = "typ";
      else if (/^[A-Z]/.test(word)) cls = "typ";
      else if (src[j] === "(") cls = "fn";
      tokens.push({ t: cls, v: word });
      i = j;
      continue;
    }
    if (/[\s]/.test(c)) {
      let j = i;
      while (j < src.length && /\s/.test(src[j] ?? "")) j++;
      tokens.push({ t: "ws", v: src.slice(i, j) });
      i = j;
      continue;
    }
    if (c === "<" && /[A-Za-z/]/.test(src[i + 1] ?? "")) {
      let j = i;
      while (j < src.length && src[j] !== ">") j++;
      tokens.push({ t: "jsx", v: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    tokens.push({ t: "sym", v: c });
    i++;
  }
  return tokens;
}

interface RenderedToken extends Token {
  k: string;
}

interface RenderedLine {
  no: number;
  content: RenderedToken[];
}

export function CodeSection() {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(TS_SNIPPET).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const toks = useMemo(() => tokenize(TS_SNIPPET), []);

  const lines: RenderedLine[] = [];
  let cur: RenderedToken[] = [];
  let lineNo = 1;
  toks.forEach((tk, idx) => {
    if (tk.t === "ws" && tk.v.includes("\n")) {
      const parts = tk.v.split("\n");
      parts.forEach((p, i) => {
        if (i > 0) {
          lines.push({ no: lineNo++, content: cur });
          cur = [];
        }
        if (p) cur.push({ t: "ws", v: p, k: `${idx}-${i}` });
      });
    } else {
      cur.push({ ...tk, k: String(idx) });
    }
  });
  if (cur.length) lines.push({ no: lineNo, content: cur });

  return (
    <section className="code-section section" id="code">
      <div className="section-inner">
        <div className="section-label">
          <span className="dot" /> 04 · Code
        </div>
        <h2 className="section-title">Wire it into your agent in one file.</h2>
        <p className="section-sub">
          Drop into any Vercel AI SDK app. Strategies are objects you swap
          in and out without touching the modal or the chain plumbing.
        </p>

        <div className="code-shell">
          <div className="code-tabs">
            <div className="code-tab active">
              <span className="dot" />
              composer.tsx
            </div>
            <div className="spacer" />
            <button
              className={`code-copy ${copied ? "copied" : ""}`}
              onClick={onCopy}
            >
              <Icon name={copied ? "check" : "copy"} size={12} />
              {copied ? "copied" : "copy"}
            </button>
          </div>
          <pre className="code-pre">
            <code>
              {lines.map((line) => (
                <div key={line.no}>
                  <span className="ln">{line.no}</span>
                  {line.content.map((tk) => (
                    <span key={tk.k} className={`tk-${tk.t}`}>
                      {tk.v}
                    </span>
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
