import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("landing sample mirrors the bundled deterministic fixture", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /Leakage risk" value=\{75\}/);
  assert.match(page, /Metric quality" value=\{76\}/);
  assert.match(page, /Reproducibility" value=\{90\}/);
  assert.match(page, /Portfolio readiness" value=\{79\}/);
  assert.match(page, /test-set selection risk/);
  assert.match(page, /test-set threshold tuning risk/);
});

test("demo and upload describe current PDF and examiner behavior", async () => {
  const demo = await source("app/demo/page.tsx");
  const upload = await source("app/upload/page.tsx");
  assert.doesNotMatch(demo, /A replacement will only be published/);
  assert.match(demo, /PDF reports are generated on demand/);
  assert.match(upload, /deterministic fallback examiner/);
  assert.match(upload, /external AI only/);
});

test("metadata and security configuration stay recruiter-ready", async () => {
  const layout = await source("app/layout.tsx");
  const config = await source("next.config.ts");
  assert.match(layout, /Static ML notebook auditing with deterministic methodology checks/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /summary_large_image/);
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /Strict-Transport-Security/);
  assert.match(config, /frame-ancestors 'none'/);
});
