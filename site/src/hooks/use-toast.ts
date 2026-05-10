import React from "react";

export type Toast = { msg: string; value?: string };

export function useToast(durationMs = 2400) {
  const [toast, setToast] = React.useState<Toast | null>(null);
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), durationMs);
    return () => clearTimeout(t);
  }, [toast, durationMs]);
  return { toast, show: (t: Toast) => setToast(t), clear: () => setToast(null) };
}
