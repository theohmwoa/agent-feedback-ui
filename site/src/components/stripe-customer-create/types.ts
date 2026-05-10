import type { AgentMeta } from "../../types";

export type CustomerAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CustomerMetadata = { key: string; value: string };

export type StripeCustomerCreateIntent = AgentMeta & {
  name: string;
  email: string;
  phone?: string;
  defaultCurrency?: string;
  address?: CustomerAddress;
  metadata?: CustomerMetadata[];
  taxId?: { type: string; value: string };
  sendWelcomeEmail?: boolean;
  livemode?: boolean;
};

export type StripeCustomerCreatePayload = {
  name: string;
  email: string;
  phone?: string;
  defaultCurrency: string;
  address?: CustomerAddress;
  metadata: CustomerMetadata[];
  taxId?: { type: string; value: string };
  sendWelcomeEmail: boolean;
};

export const STRIPE_CUSTOMER_CREATE_DEFAULT: StripeCustomerCreateIntent = {
  agent: "atlas",
  action: "create-customer",
  name: "Theodore Park",
  email: "theo@meridian.studio",
  phone: "+1 (415) 555-0182",
  defaultCurrency: "USD",
  address: {
    line1: "3247 Folsom St",
    line2: "Suite 4B",
    city: "San Francisco",
    state: "CA",
    postalCode: "94110",
    country: "US",
  },
  metadata: [
    { key: "signup_source",  value: "agent-onboarding-flow" },
    { key: "trial_extended", value: "14d" },
  ],
  taxId: { type: "us_ein", value: "94-3217408" },
  sendWelcomeEmail: true,
  livemode: false,
  rationale: "Onboarding Theo from the form submission yesterday — payload mapped from the Typeform webhook.",
};
