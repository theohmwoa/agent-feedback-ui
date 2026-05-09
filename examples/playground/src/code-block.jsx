// Code block — TypeScript snippet, hand-tokenized for syntax highlighting.

const TS_SNIPPET = `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { FeedbackProvider, useOpenAction } from "agent-feedback-ui/react";
import { EmailModal, SlackModal } from "agent-feedback-ui/templates";
import {
  silentRewrite,
  visibleCorrection,
  rejectAndRetry,
  constraintInjection,
} from "agent-feedback-ui";

// Pick the strategy that fits how your agent should behave.
const strategy = constraintInjection({
  derive: (edit) => deriveRule(edit),
});

export function Composer() {
  const openAction = useOpenAction();

  async function step(messages) {
    const { text } = await generateText({
      model: openai("gpt-5"),
      system: "You are a careful operator. Wait for human edits before sending.",
      messages,
    });

    // Intercept just before the side-effect.
    const result = await openAction({
      modal: <EmailModal />,
      draft: text,
      strategy,
    });

    if (result.rejected) return retry(result);
    if (result.systemConstraint) pinSession(result.systemConstraint);

    return send(result.effectivePayload, { ops: result.chainOps });
  }
}

export const App = () => (
  <FeedbackProvider>
    <Composer />
  </FeedbackProvider>
);`;

// Tokenizer — small but enough for this snippet.
function tokenize(src) {
  const tokens = [];
  const keywords = new Set([
    "import", "from", "const", "function", "return", "export", "async", "await",
    "if", "else", "new",
  ]);
  const types = new Set(["string", "number", "boolean"]);
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    // Comments
    if (c === "/" && src[i + 1] === "/") {
      const end = src.indexOf("\n", i);
      const e = end === -1 ? src.length : end;
      tokens.push({ t: "cmt", v: src.slice(i, e) });
      i = e;
      continue;
    }
    // Strings
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") j += 2; else j++;
      }
      tokens.push({ t: "str", v: src.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // Numbers
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      tokens.push({ t: "num", v: src.slice(i, j) });
      i = j;
      continue;
    }
    // Identifiers
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_$]/.test(src[j])) j++;
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
    // Symbols / whitespace
    if (/[\s]/.test(c)) {
      let j = i;
      while (j < src.length && /\s/.test(src[j])) j++;
      tokens.push({ t: "ws", v: src.slice(i, j) });
      i = j;
      continue;
    }
    // JSX-ish
    if (c === "<" && /[A-Za-z\/]/.test(src[i + 1] || "")) {
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

const CodeSection = () => {
  const [copied, setCopied] = React.useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(TS_SNIPPET).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const toks = React.useMemo(() => tokenize(TS_SNIPPET), []);

  // Render with line numbers
  const lines = [];
  let cur = [];
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
      cur.push({ ...tk, k: idx });
    }
  });
  if (cur.length) lines.push({ no: lineNo, content: cur });

  return (
    <section className="code-section section" id="code">
      <div className="section-inner">
        <div className="section-label"><span className="dot" /> 04 · Code</div>
        <h2 className="section-title">Wire it into your agent in one file.</h2>
        <p className="section-sub">
          Drop into any Vercel AI SDK app. Strategies are plain functions — swap them in and out without
          touching the modal or the chain plumbing.
        </p>

        <div className="code-shell">
          <div className="code-tabs">
            <div className="code-tab active"><span className="dot" />composer.tsx</div>
            <div className="spacer" />
            <button className={`code-copy ${copied ? "copied" : ""}`} onClick={onCopy}>
              <Icon name={copied ? "check" : "copy"} size={12} />
              {copied ? "copied" : "copy"}
            </button>
          </div>
          <pre className="code-pre">
            <code>
              {lines.map(line => (
                <div key={line.no}>
                  <span className="ln">{line.no}</span>
                  {line.content.map((tk) => (
                    <span key={tk.k} className={tk.t === "id" || tk.t === "ws" || tk.t === "sym" ? `tk-${tk.t}` : `tk-${tk.t}`}>
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
};

window.CodeSection = CodeSection;
