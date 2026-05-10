import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Shell } from "./chrome/shell";
import { Landing } from "./pages/landing";
import { ComponentPage } from "./pages/component-page";
import { NotFound } from "./pages/not-found";

export default function App() {
  const { pathname } = useLocation();
  // Scroll to top on route change.
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/c/:slug" element={<ComponentPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
