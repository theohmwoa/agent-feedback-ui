import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// React Testing Library doesn't auto-register cleanup when vitest globals
// are off. Without this, each render() leaks DOM into the next test, and
// queries like getByLabelText start returning multiple matches.
afterEach(() => {
  cleanup();
});
