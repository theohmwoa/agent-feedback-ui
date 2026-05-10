import kleur from "kleur";

export const log = {
  info:  (msg: string) => console.log(kleur.gray("›") + " " + msg),
  ok:    (msg: string) => console.log(kleur.green("✓") + " " + msg),
  warn:  (msg: string) => console.log(kleur.yellow("⚠") + " " + msg),
  err:   (msg: string) => console.log(kleur.red("✗") + " " + msg),
  step:  (msg: string) => console.log(kleur.cyan("◆") + " " + kleur.bold(msg)),
  empty: () => console.log(""),
  raw:   (msg: string) => console.log(msg),
};

export const c = kleur;
