import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../chrome/icons";
import { Button } from "../chrome/primitives";

export function NotFound() {
  return (
    <section style={{ padding: "120px 0 160px" }}>
      <div className="wrap" style={{ maxWidth: 640 }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--fg-faint)", letterSpacing: 0.6,
          marginBottom: 14,
        }}>404</div>
        <h1 style={{
          margin: 0, fontSize: 56, fontWeight: 600, letterSpacing: -1.5,
          lineHeight: 1.05,
        }}>
          That component{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: -0.5 }}>
            doesn't exist
          </span>{" "}
          yet.
        </h1>
        <p style={{
          marginTop: 16, fontSize: 16, lineHeight: 1.55,
          color: "var(--fg-muted)",
        }}>
          The catalog grows by request. If you have a use case, file an issue and tell us what you'd ship today if it existed.
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
          <Link to="/">
            <Button variant="primary" size="lg" icon={<Icon.ArrowLeft size={15} />}>
              Back to catalog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
