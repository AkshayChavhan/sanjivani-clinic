// Contrast check for the Sanjivani Clinic palette (task 07).
//
// It reads the colours from src/styles/global.css, checks every colour pair
// the site uses against WCAG 2.2, and exits with an error if any pair fails.
// Run it with: npm run test
//
// - Text needs 4.5:1. Icons, form-field edges and focus outlines need 3:1.
// - The "never use" pairs must FAIL. If one passes, the maths is broken.
// - Black on white must give exactly 21.00:1, for the same reason.
//
// The PAIRS table below is the one place that decides what gets checked.
// design-system/sanjivani-clinic/MASTER.md pastes this script's output.

import { readFileSync } from "node:fs";
import { URL } from "node:url";

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
  ["Focus outline on the page", "--ring", "--background", PARTS],
  ["Focus outline on cards", "--ring", "--card", PARTS],
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
];

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

const total = PAIRS.length + NEVER.length + 1;
if (problems.length > 0) {
  console.error(`\n${problems.length} of ${total} checks failed:`);
  for (const p of problems) console.error(`- ${p}`);
  process.exit(1);
}
console.log(`\nAll ${total} checks passed: ${PAIRS.length} pairs, ${NEVER.length} never-use pairs and the control.`);
