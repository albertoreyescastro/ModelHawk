export const MAX_NOTEBOOK_BYTES = 10 * 1024 * 1024;
export const MAX_MULTIPART_BYTES = MAX_NOTEBOOK_BYTES + 512 * 1024;

export function sourceToString(source) {
  if (!source) return "";
  return Array.isArray(source) ? source.join("") : String(source);
}

export function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

export function clampScore(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function confidenceLabel(value) {
  if (value >= 80) return "High";
  if (value >= 55) return "Medium";
  return "Low";
}

export function pickBest(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const best = sorted[0] || ["unknown", 0];
  const second = sorted[1] || ["unknown", 0];
  return {
    label: best[1] >= 2 ? best[0] : "unknown",
    score: best[1],
    secondLabel: second[0],
    secondScore: second[1],
    sorted,
  };
}

export function addFinding(findings, severity, title, text) {
  findings.push({ severity, title, text });
}
