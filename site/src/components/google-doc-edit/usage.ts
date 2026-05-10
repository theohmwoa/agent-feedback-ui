export const usage = `import { GoogleDocEdit } from "@/components/agent-ui/google-doc-edit";

<GoogleDocEdit
  intent={{
    docTitle: "Q3 launch — narrative draft v3",
    folder: ["Drive", "Marketing", "Q3 Launches"],
    changes: [
      { kind: "insertion", text: "30% faster TTFR after rollout." },
      { kind: "deletion",  text: "Old Q4 ship date paragraph." },
    ],
    finalPreview: renderedDoc,
    defaultMode: "suggesting",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      gdocs.documents.batchUpdate({ mode: r.payload.mode, requests: r.payload.changes });
    }
  }}
/>`;

export const props = [
  { name: "intent",    type: "GdocIntent",                            req: true,  desc: "Doc title, folder breadcrumb, list of proposed changes (insertion/deletion/formatting), final preview." },
  { name: "onResult",  type: "(r: ReviewResult<GdocPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'. 'edit' means the mode was changed." },
  { name: "defaultMode", type: "'suggesting' | 'editing'",            req: false, desc: "Pre-selected mode. Defaults to 'suggesting'." },
];
