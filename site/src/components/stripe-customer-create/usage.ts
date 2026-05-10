export const usage = `import { StripeCustomerCreate } from "@/components/agent-ui/stripe-customer-create";

<StripeCustomerCreate
  intent={{
    name: signup.name,
    email: signup.email,
    phone: signup.phone,
    defaultCurrency: "USD",
    address: signup.address,
    metadata: [
      { key: "signup_source", value: "agent-onboarding-flow" },
    ],
    sendWelcomeEmail: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      stripe.customers.create({
        name: r.payload.name,
        email: r.payload.email,
        phone: r.payload.phone,
        metadata: Object.fromEntries(r.payload.metadata.map(m => [m.key, m.value])),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "StripeCustomerCreateIntent",                              req: true,  desc: "Name, email, phone, currency, address, metadata, tax id, welcome flag." },
  { name: "onResult", type: "(r: ReviewResult<StripeCustomerCreatePayload>) => void", req: true,  desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.metadata", type: "CustomerMetadata[]",                              req: false, desc: "Key/value pairs surfaced in Stripe dashboard. Editable inline." },
];
