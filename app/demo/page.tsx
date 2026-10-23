import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const scores = [
  {
    label: "Leakage risk",
    value: "75/100",
    status: "High",
    detail:
      "The current static audit detects test-set reuse, test-set threshold tuning and preprocessing fitted before cross-validation.",
  },
  {
    label: "Metric quality",
    value: "76/100",
    status: "Good coverage",
    detail:
      "PR-AUC, ROC-AUC, precision, recall and F1 are present, but evaluation methodology still needs correction.",
  },
  {
    label: "Reproducibility",
    value: "90/100",
    status: "Strong",
    detail:
      "Random-state, cross-validation, stratification and workflow-structure signals are present.",
  },
  {
    label: "Portfolio readiness",
    value: "79/100",
    status: "Promising",
    detail:
      "The notebook is well documented, but the methodological issues should be fixed before presenting results as final.",
  },
];

const findings = [
  {
    severity: "High",
    title: "Possible test-set reuse for model or strategy selection",
    text:
      "Multiple candidate model families appear to be evaluated on test-set data and then ranked or shortlisted. Model and preprocessing choices should normally be made using training/validation data, with the test set opened only for final evaluation.",
  },
  {
    severity: "High",
    title: "Threshold exploration appears to use the test set",
    text:
      "A threshold grid or loop appears to be scored against y_test. Decision thresholds should normally be selected on validation or out-of-fold predictions so the held-out test set remains unbiased.",
  },
  {
    severity: "High",
    title: "Preprocessing appears to be fitted before cross-validation",
    text:
      "A transformed training matrix appears to be created with fit_transform before being passed into cross-validation. Fold-specific preprocessing should normally be fitted inside a Pipeline.",
  },
  {
    severity: "Medium",
    title: "Custom weighted model-selection score should be justified",
    text:
      "A hand-weighted composite score appears to be used for ranking. Its weights and cut-offs should be justified from the project objective and should not be chosen from held-out test performance.",
  },
];

const priorityFixes = [
  "Reserve the test set for one final evaluation; move model and preprocessing selection to validation or nested/out-of-fold evaluation.",
  "Tune decision thresholds on validation or out-of-fold predictions and keep test labels out of threshold selection.",
  "Move learned preprocessing into a Pipeline so it is fitted independently inside each cross-validation fold.",
];

const goodPractices = [
  "Clear train/test split and stratification signals detected.",
  "Cross-validation and random-state signals detected.",
  "PR-AUC, ROC-AUC, precision, recall and F1-style evaluation detected.",
  "Baseline comparison and hyperparameter-search signals detected.",
  "Accuracy limitations and resampling safety are discussed in markdown.",
  "Limitations, business context and substantial technical explanation are present.",
];

const signals = [
  "test-set selection risk",
  "test-set threshold tuning risk",
  "preprocessing outside CV risk",
  "custom composite score",
  "SMOTE",
  "cross-validation",
  "stratification",
  "Pipeline / ColumnTransformer",
  "PR-AUC",
  "ROC-AUC",
  "precision / recall / F1",
  "baseline comparison",
  "hyperparameter search",
  "deep-learning signals",
  "business context",
  "limitations section",
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,#1677FF33,transparent_35%),radial-gradient(circle_at_20%_20%,#5EEBFF22,transparent_30%),linear-gradient(180deg,#020817_0%,#061126_50%,#020817_100%)]" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-lg shadow-blue-500/25">
            <Image
              src="/modelhawk-icon.png"
              alt="ModelHawk icon"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight">
              Model<span className="text-blue-400">Hawk</span>
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Current Audit Sample
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="hidden rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:inline-block"
          >
            Audit a notebook
          </Link>
          <Link
            href="/"
            className="rounded-full border border-blue-400/40 px-5 py-2 text-sm font-medium text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/10"
          >
            Back home
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Deterministic audit · bundled fraud-detection notebook
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              A sample that shows the problems, not just the polish.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              This page mirrors the current ModelHawk static audit for the
              bundled credit-card fraud notebook. The sample intentionally
              exposes methodological weaknesses that a reviewer should catch.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-7 py-3 text-center text-sm font-bold text-[#020817] shadow-xl shadow-blue-500/30 transition hover:scale-[1.02]"
              >
                Run your own audit
              </Link>
              <a
                href="/examples/credit_card_fraud_detection.ipynb"
                className="rounded-full border border-white/10 px-7 py-3 text-center text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Download demo notebook
              </a>
            </div>
            <p className="mt-4 max-w-3xl text-xs leading-5 text-slate-500">
              PDF reports are generated on demand from the current deterministic
              audit result, so exported reports stay aligned with the hardened
              rules used by the live application.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-blue-950/80 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">
              Detected project profile
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Classification · Tabular · Fraud Detection
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Fact label="Confidence" value="High · 80/100" />
              <Fact label="Notebook" value="196 cells" />
              <Fact label="Code cells" value="80" />
              <Fact label="Markdown cells" value="116" />
            </div>
            <div className="mt-6 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-200">
                Audit interpretation
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Strong documentation and metric coverage do not cancel out
                evaluation leakage. The held-out test set appears to influence
                model selection and threshold choice.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {scores.map((score) => (
            <ScoreCard key={score.label} {...score} />
          ))}
        </section>

        <Section
          eyebrow="Current findings"
          title="What the hardened rules actually flag"
          description="These findings come from the deterministic audit endpoint. They are not AI-written guesses."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {findings.map((finding) => (
              <Finding key={finding.title} {...finding} />
            ))}
          </div>
        </Section>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Section
            eyebrow="Priority remediation"
            title="Fix these before final evaluation"
            description="The highest-value changes are methodological, not cosmetic."
          >
            <div className="grid gap-3">
              {priorityFixes.map((item, index) => (
                <Numbered key={item} number={index + 1} text={item} />
              ))}
            </div>
          </Section>

          <Section
            eyebrow="Positive evidence"
            title="What the notebook already does well"
            description="ModelHawk keeps positive signals separate from correctness claims."
          >
            <div className="grid gap-3">
              {goodPractices.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-green-300/20 bg-green-400/10 p-4 text-sm leading-6 text-green-50"
                >
                  {item}
                </div>
              ))}
            </div>
          </Section>
        </div>

        <Section
          eyebrow="Evidence surface"
          title="Signals extracted from the notebook"
          description="The audit combines workflow-order checks, metric signals, reproducibility cues and reporting context."
        >
          <div className="flex flex-wrap gap-2">
            {signals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-white/10 bg-[#020817]/70 px-3 py-1 text-xs font-medium text-slate-300"
              >
                {signal}
              </span>
            ))}
          </div>
        </Section>

        <section className="mt-12 rounded-[2rem] border border-purple-300/20 bg-purple-300/10 p-7">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-purple-300">
            Examiner layer
          </p>
          <h2 className="mt-2 text-3xl font-black">AI is optional, evidence is not.</h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            The live deployment always completes the deterministic audit first.
            If a hosted or local AI provider is configured, ModelHawk can use
            that structured result to produce clearer examiner notes. Without a
            provider, it falls back deterministically. This sample page presents
            the deterministic findings only so the claims remain reproducible.
          </p>
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-blue-500/[0.08] p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
            Try the production workflow
          </p>
          <h2 className="mx-auto mt-2 max-w-3xl text-4xl font-black">
            Upload a notebook and inspect the evidence yourself.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            ModelHawk performs static analysis only. It does not execute uploaded
            notebooks and its output should be treated as technical review
            guidance, not proof of model correctness.
          </p>
          <Link
            href="/upload"
            className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold text-[#020817] transition hover:scale-[1.02]"
          >
            Open the auditor
          </Link>
        </section>
      </section>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-blue-950/40 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black">{title}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ScoreCard({
  label,
  value,
  status,
  detail,
}: {
  label: string;
  value: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
          {status}
        </span>
      </div>
      <p className="mt-4 text-4xl font-black">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#020817]/60 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}

function Finding({
  severity,
  title,
  text,
}: {
  severity: string;
  title: string;
  text: string;
}) {
  const high = severity === "High";
  return (
    <article
      className={`rounded-2xl border p-5 ${
        high
          ? "border-red-300/20 bg-red-400/10"
          : "border-yellow-300/20 bg-yellow-400/10"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
        {severity} severity
      </p>
      <h3 className="mt-2 text-lg font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
    </article>
  );
}

function Numbered({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-blue-300/20 bg-blue-400/10 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-300 text-sm font-black text-[#020817]">
        {number}
      </div>
      <p className="text-sm leading-6 text-slate-200">{text}</p>
    </div>
  );
}
