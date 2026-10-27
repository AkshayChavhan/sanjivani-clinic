// Contrast check for the Sanjivani Clinic palette (task 07).
//
// It reads the colours from src/styles/global.css, checks every colour pair
// the site uses against WCAG 2.2, and exits with an error if any pair fails.
// Run it with: npm run test
//
// - Text needs 4.5:1. Icons, form-field edges and focus outlines need 3:1.
// - The "never use" pairs must FAIL. If one passes, the maths is broken.
// - Black on white must give exactly 21.00:1, for the same reason.
// - Saffron is only ever bg-saffron (with text-saffron-foreground). The last
//   check scans src/ for any other saffron class.
//
// The PAIRS table below is the one place that decides what gets checked.
// design-system/sanjivani-clinic/MASTER.md pastes this script's output.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

const TEXT = 4.5;
const PARTS = 3;

const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
const root = css.match(/\n:root \{([\s\S]*?)\n\}/);
if (!root) {
  console.error("Could not find the :root block in src/styles/global.css.");
  process.exit(1);
}

const vars = new Map();
for (const [, name, value] of root[1].matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
  vars.set(name, value.trim());
}

// A colour is a hex value, a :root variable (one level of var() is followed),
// or a see-through fill blended over a surface: { top, alpha, over }.
function resolve(spec) {
  if (typeof spec === "object") {
    return blend(resolve(spec.top), spec.alpha, resolve(spec.over));
  }
  if (spec.startsWith("#")) return spec;
  let value = vars.get(spec);
  const ref = value?.match(/^var\((--[\w-]+)\)$/);
  if (ref) value = vars.get(ref[1]);
  if (!value || !/^#[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`${spec} doesn't lead to a 6-digit hex colour in :root (found: ${value})`);
  }
  return value;
}

function channels(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function blend(top, alpha, over) {
  const t = channels(top);
  const o = channels(over);
  return (
    "#" +
    t.map((v, i) => Math.round(alpha * v + (1 - alpha) * o[i]).toString(16).padStart(2, "0")).join("")
  );
}

function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

// [what it is, foreground, background, minimum]
const PAIRS = [
  ["Body text on the page", "--foreground", "--background", TEXT],
  ["Body text on cards", "--card-foreground", "--card", TEXT],
  ["Body text on sage bands", "--foreground", "--muted", TEXT],
  ["Muted text on the page", "--muted-foreground", "--background", TEXT],
  ["Muted text on cards", "--muted-foreground", "--card", TEXT],
  ["Muted text on sage bands", "--muted-foreground", "--muted", TEXT],
  ["Leaf text and links on the page", "--primary", "--background", TEXT],
  ["Leaf text and links on cards", "--primary", "--card", TEXT],
  ["Leaf label on sage (secondary button)", "--secondary-foreground", "--secondary", TEXT],
  ["Off-white label on leaf (primary button)", "--primary-foreground", "--primary", TEXT],
  ["Ink label on saffron (saffron fill)", "--brand-ink", "--brand-saffron", TEXT],
  ["Error text on the page", "--destructive", "--background", TEXT],
  ["Error text on sage bands", "--destructive", "--muted", TEXT],
  ["Error text on its 10% tint", "--destructive", { top: "--destructive", alpha: 0.1, over: "--background" }, TEXT],
  ["Error text on cards", "--destructive", "--card", TEXT],
  ["Hover and highlight text (accent)", "--accent-foreground", "--accent", TEXT],
  ["Menu and dialog text", "--popover-foreground", "--popover", TEXT],
  ["Focus outline on the page", "--ring", "--background", PARTS],
  ["Focus outline on cards", "--ring", "--card", PARTS],
  ["Focus outline on menus and dialogs", "--ring", "--popover", PARTS],
  ["Focus outline on sage bands", "--ring", "--muted", PARTS],
  ["Off-white focus outline on leaf", "--brand-off-white", "--brand-leaf", PARTS],
  ["Field edge on the page", "--input", "--background", PARTS],
  ["Field edge on cards", "--input", "--card", PARTS],
  ["Field edge on sage bands", "--input", "--muted", PARTS],
];

// Pairs the site must never use. Each must fall under its minimum.
const NEVER = [
  ["Saffron text on the page", "--brand-saffron", "--background", TEXT],
  ["Leaf text on saffron", "--brand-leaf", "--brand-saffron", TEXT],
  ["Hairline as a form-field edge", "--border", "--background", PARTS],
  ["Error text on a 20% error tint", "--destructive", { top: "--destructive", alpha: 0.2, over: "--background" }, TEXT],
];

// Saffron classes. Only bg-saffron (any variant, such as hover:) and its
// label text-saffron-foreground are allowed. Everything else is banned:
// text-, border-t-, ring-offset-, opacity like /50, and arbitrary values such
// as text-(--color-saffron) or text-[var(--brand-saffron)]. CSS variables
// (--brand-saffron in a <style> block) aren't classes, so they don't count.
// It can't check pairings: a bg-saffron still needs an ink label, by eye.
const SAFFRON_CLASS = /(?<![\w-])(?:[\w-]+:)*[a-z][\w-]*-(?:saffron(?:-foreground)?(?:\/\d+)?(?![\w-])|[([][^\s"'`]*saffron[^\s"'`]*)/g;
const ALLOWED_SAFFRON = new Set(["bg-saffron", "text-saffron-foreground"]);
const bannedSaffronIn = (text) =>
  (text.match(SAFFRON_CLASS) ?? []).filter((cls) => !ALLOWED_SAFFRON.has(cls.split(":").pop()));

const problems = [];
const line = (status, value, need, name) =>
  console.log(`${status.padEnd(18)} ${value.toFixed(2).padStart(5)}:1  (needs ${need})  ${name}`);

console.log("Pairs the site uses:");
for (const [name, fg, bg, need] of PAIRS) {
  const value = ratio(resolve(fg), resolve(bg));
  const ok = value >= need;
  line(ok ? "pass" : "FAIL", value, need, name);
  if (!ok) problems.push(`${name} is ${value.toFixed(2)}:1, under ${need}:1`);
}

console.log("\nNever-use pairs (each must fail):");
for (const [name, fg, bg, need] of NEVER) {
  const value = ratio(resolve(fg), resolve(bg));
  const failsAsExpected = value < need;
  line(failsAsExpected ? "fails, as expected" : "PASSES: CHECK MATHS", value, need, name);
  if (!failsAsExpected) problems.push(`${name} passes (${value.toFixed(2)}:1), so the check itself may be broken`);
}

const control = ratio("#000000", "#FFFFFF");
console.log(`\nControl: black on white is ${control.toFixed(2)}:1 (must be 21.00)`);
if (control.toFixed(2) !== "21.00") problems.push("Black on white isn't 21.00:1, so the maths is broken");

// The saffron scan. First prove the pattern works on known examples, so a
// broken pattern can't pass quietly.
const mustMatch = [
  "text-saffron",
  "hover:border-saffron",
  "md:ring-saffron/50",
  "border-t-saffron",
  "ring-offset-saffron",
  "drop-shadow-saffron",
  "bg-saffron/50",
  "text-(--color-saffron)",
  "text-[var(--brand-saffron)]",
];
const mustNotMatch = [
  "bg-saffron",
  "hover:bg-saffron",
  "text-saffron-foreground",
  "--brand-saffron",
  "--color-saffron",
  "stroke: var(--brand-saffron);",
];
const selfTestOk =
  mustMatch.every((s) => bannedSaffronIn(` ${s} `).length === 1) &&
  mustNotMatch.every((s) => bannedSaffronIn(` ${s} `).length === 0);
if (!selfTestOk) problems.push("The saffron pattern failed its own examples, so the scan is broken");

const srcDir = fileURLToPath(new URL("../src/", import.meta.url));
const files = readdirSync(srcDir, { recursive: true }).filter((f) => /\.(astro|tsx?|jsx?|mdx?|css|html)$/.test(f));
const banned = [];
for (const file of files) {
  for (const hit of bannedSaffronIn(readFileSync(join(srcDir, file), "utf8"))) {
    banned.push(`${file}: ${hit}`);
  }
}
console.log(
  `\nSaffron scan: ${files.length} files in src/, ${banned.length} banned saffron classes (pattern self-test ${selfTestOk ? "passed" : "FAILED"})`,
);
for (const b of banned) console.log(`  ${b}`);
if (files.length === 0) problems.push("The saffron scan found no files in src/");
if (banned.length > 0) problems.push(`${banned.length} banned saffron classes in src/ (only bg-saffron is allowed)`);

const total = PAIRS.length + NEVER.length + 2;
if (problems.length > 0) {
  console.error(`\nThe check failed. Problems found: ${problems.length}`);
  for (const p of problems) console.error(`- ${p}`);
  process.exit(1);
}
console.log(
  `\nAll ${total} checks passed: ${PAIRS.length} pairs, ${NEVER.length} never-use pairs, the control and the saffron scan.`,
);
