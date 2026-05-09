import type { CSSProperties, SVGProps } from "react";

export type IconName =
  | "github"
  | "sun"
  | "moon"
  | "play"
  | "playall"
  | "copy"
  | "check"
  | "arrow"
  | "lock"
  | "x"
  | "send"
  | "paperclip"
  | "image"
  | "smile"
  | "code"
  | "bold"
  | "list"
  | "link"
  | "spark"
  | "package"
  | "scale"
  | "undo"
  | "more";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, style, ...rest }: IconProps) {
  const s: CSSProperties = { width: size, height: size, ...(style ?? {}) };
  const props: SVGProps<SVGSVGElement> = {
    ...rest,
    style: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "github":
      return <svg {...props}><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
    case "moon":
      return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" /></svg>;
    case "play":
      return <svg {...props}><path d="m6 4 14 8-14 8V4Z" /></svg>;
    case "playall":
      return <svg {...props}><path d="m4 4 8 8-8 8V4Z" /><path d="m13 4 8 8-8 8V4Z" /></svg>;
    case "copy":
      return <svg {...props}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>;
    case "check":
      return <svg {...props}><path d="m4 12 5 5 11-11" /></svg>;
    case "arrow":
      return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "lock":
      return <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /></svg>;
    case "x":
      return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
    case "send":
      return <svg {...props}><path d="m22 2-7 20-4-9-9-4 20-7Z" /></svg>;
    case "paperclip":
      return <svg {...props}><path d="m21 12-8.5 8.5a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5L11 18a2 2 0 0 1-3-3l8-8" /></svg>;
    case "image":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>;
    case "smile":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M9 14s1 2 3 2 3-2 3-2" /><circle cx="9" cy="10" r=".8" /><circle cx="15" cy="10" r=".8" /></svg>;
    case "code":
      return <svg {...props}><path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4 10 20" /></svg>;
    case "bold":
      return <svg {...props}><path d="M6 4h7a4 4 0 0 1 0 8H6V4Zm0 8h8a4 4 0 0 1 0 8H6v-8Z" /></svg>;
    case "list":
      return <svg {...props}><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>;
    case "link":
      return <svg {...props}><path d="M9 15a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1 1" /><path d="M15 9a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1-1" /></svg>;
    case "spark":
      return <svg {...props}><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /></svg>;
    case "package":
      return <svg {...props}><path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z" /><path d="m3 8 9 5 9-5M12 13v9" /></svg>;
    case "scale":
      return <svg {...props}><path d="M12 3v18M5 8l7-3 7 3M5 8l3 8h-6l3-8Zm14 0 3 8h-6l3-8Z" /></svg>;
    case "undo":
      return <svg {...props}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10H9" /></svg>;
    case "more":
      return <svg {...props}><circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" /></svg>;
    default:
      return null;
  }
}
