export const usage = `import { OktaGrantAccess } from "@/components/agent-ui/okta-grant-access";

<OktaGrantAccess
  intent={{
    user: {
      name: target.profile.displayName,
      email: target.profile.email,
      department: target.profile.department,
      currentGroups: existingGroups.map(g => g.profile.name),
    },
    application: "AWS SSO — Production",
    groupOrRole: "auth-gateway-admin",
    groupKind: "role",
    defaultExpires: "in 7 days",
    requestId: ticket.key,
    requestUrl: ticket.url,
    defaultJustification: agentReason,
    expandsAccess: true,        // shows the warning Pill + danger button
  }}
  onResult={async (r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      await okta.assignGroup({
        userId: target.id,
        groupId: groupByName(r.payload.groupOrRole),
        expiresAt: parseExpiry(r.payload.expiresAt),
        auditNote: r.payload.justification,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",     type: "OktaIntent",                            req: true,  desc: "Target user (with current groups), app, group/role, optional expiration, ticket link." },
  { name: "onResult",   type: "(r: ReviewResult<OktaPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'. Submit blocked until justification ≥ 10 chars." },
  { name: "intent.expandsAccess", type: "boolean",                      req: false, desc: "Shows a 'expands access' warning pill and switches the grant button to danger variant." },
];
