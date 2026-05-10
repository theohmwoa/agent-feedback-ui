import React from "react";
import { useSearchParams } from "react-router-dom";
import { Hero } from "../chrome/hero";
import { Browser } from "../chrome/browser";
import { CliSection } from "../chrome/cli-section";
import { Principles } from "../chrome/principles";

export function Landing() {
  const [params, setParams] = useSearchParams();
  const sectionParam = params.get("s");

  // If we arrived with ?s=browser (or similar), scroll to that section
  // and clean the URL.
  React.useEffect(() => {
    if (!sectionParam) return;
    const t = setTimeout(() => {
      const el = document.getElementById(sectionParam);
      if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
      setParams({}, { replace: true });
    }, 30);
    return () => clearTimeout(t);
  }, [sectionParam, setParams]);

  const scrollToBrowser = () => {
    const el = document.getElementById("browser");
    if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
  };

  // Hero opens palette via window event so we don't need extra plumbing.
  const openPalette = () => {
    // Trigger ⌘K-style open by dispatching the keyboard event Shell listens to.
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <>
      <Hero onBrowse={scrollToBrowser} onOpenPalette={openPalette} />
      <Browser />
      <CliSection />
      <Principles />
    </>
  );
}
