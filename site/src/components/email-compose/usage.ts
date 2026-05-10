export const usage = `import { EmailCompose, type EmailIntent } from "@/components/agent-ui/email-compose";

export function ApproveEmailStep({ intent, onResolve }: {
  intent: EmailIntent;
  onResolve: (r: ReviewResult) => void;
}) {
  return (
    <EmailCompose
      intent={intent}
      onResult={(result) => {
        // result.kind === 'submit' | 'edit' | 'cancel'
        // edited fields land in result.payload
        onResolve(result);
      }}
    />
  );
}`;

export const props = [
  { name: "intent",   type: "EmailIntent",                       req: true,  desc: "Draft proposed by the agent: to, cc, subject, body, tone, rationale." },
  { name: "onResult", type: "(r: ReviewResult<EmailPayload>) => void", req: true,  desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "tone",     type: "'warm' | 'neutral' | 'terse'",      req: false, desc: "Shown as a hint chip; doesn't transform copy." },
];
