import React from "react";
import Prism from "prismjs";
// Order matters: typescript ⇒ jsx ⇒ tsx (tsx extends both).
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import { CopyButton } from "./primitives";

function highlight(code: string, lang: string) {
  const grammar = Prism.languages[lang];
  if (!grammar) {
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  return Prism.highlight(code, grammar, lang);
}

export function CodeBlock({
  code,
  lang = "tsx",
  filename = "example.tsx",
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const lineHtml = React.useMemo(
    () => code.split("\n").map(line => highlight(line === "" ? " " : line, lang)),
    [code, lang],
  );
  return (
    <div style={{
      background: "oklch(0.11 0.005 80)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      lineHeight: 1.7,
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        padding: "10px 14px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <span style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{filename}</span>
        <div style={{ flex: 1 }} />
        <CopyButton value={code} label="copy" />
      </div>
      <pre className={`language-${lang}`} style={{
        margin: 0, padding: "16px 18px",
        color: "var(--fg)",
        whiteSpace: "pre",
        overflowX: "auto",
      }}>
        <code className={`language-${lang}`} style={{ display: "block" }}>
          {lineHtml.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              <span aria-hidden="true" style={{
                color: "var(--fg-faint)", width: 22, textAlign: "right",
                userSelect: "none", flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: h }} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
