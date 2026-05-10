export const usage = `import { SalesforceAccountUpdate } from "@/components/agent-ui/salesforce-account-update";

<SalesforceAccountUpdate
  intent={{
    accountId: account.Id,
    accountName: account.Name,
    industry: account.Industry,
    type: account.Type,
    changes: agentDiff,                  // [{ field, label, before, after }]
    owner: { name, role, email },
    validations: ruleEngine.run(changes),
    requiredMissing: [],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      sf.sobject("Account").update({
        Id: r.payload.accountId,
        ...Object.fromEntries(r.payload.changes.map(c => [c.field, c.after])),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "SalesforceAccountIntent",                            req: true,  desc: "Account ID + name, current values, proposed field changes, owner, validations, required-missing list." },
  { name: "onResult", type: "(r: ReviewResult<SalesforceAccountPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.changes", type: "SalesforceFieldChange[]",                      req: true,  desc: "Only show changed fields. The user can edit each `after` value or drop a row." },
  { name: "intent.validations", type: "SalesforceValidation[]",                   req: false, desc: "warn shows yellow strip; block disables save." },
];
