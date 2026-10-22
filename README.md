<p align="center">
  <img src="./public/logo.png" alt="ModelHawk logo" width="300" />
</p>

<h1 align="center">ModelHawk</h1>

<p align="center">
  <strong>Static ML notebook auditing with AI examiner notes and professional LaTeX PDF reports.</strong>
</p>

<p align="center">
  <a href="https://github.com/albertoreyescastro/modelhawk">
    <img src="https://img.shields.io/badge/status-prototype-blue" alt="Project status" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini-AI%20provider-4285F4" alt="Gemini AI provider" />
  <img src="https://img.shields.io/badge/Ollama-local%20fallback-222222" alt="Ollama local fallback" />
  <img src="https://img.shields.io/badge/LaTeX-PDF%20reports-008080" alt="LaTeX PDF reports" />
</p>

---

## Overview

**ModelHawk** is a personal AI/ML technical prototype that analyses Jupyter notebooks through static audit rules, detects machine-learning workflow signals, highlights likely risks, generates AI-assisted examiner notes, and exports professional PDF audit reports.

The project combines:

- **Next.js** and **TypeScript** for the web application
- **Static notebook analysis** for deterministic ML workflow checks
- **Gemini API** for hosted AI examiner notes when configured
- **Ollama** as an optional local AI fallback
- **Deterministic fallback logic** when no AI provider is available
- **LaTeX / pdflatex** for professional PDF report generation
- **Portfolio-oriented ML review logic** for technical documentation and interview preparation

ModelHawk is currently a prototype and should be interpreted as technical guidance, not as a guarantee of notebook correctness.

---

## Project status

ModelHawk is a portfolio prototype under active hardening. The repository contains the full web application, a bundled demo notebook, screenshots and a sample PDF report.

There is **no permanent hosted demo URL advertised here**. Run the application locally using the instructions below. This avoids presenting a temporary development tunnel as a production deployment.

---

## Screenshots

### Landing page

![ModelHawk landing page](./public/docs/screenshots/01-landing-page.png)

### Notebook upload workflow

![ModelHawk upload page](./public/docs/screenshots/02-upload-page.png)

### Static audit results

![ModelHawk audit results](./public/docs/screenshots/03-audit-results.png)

### AI examiner notes

![ModelHawk AI examiner notes](./public/docs/screenshots/04-ai-examiner-notes.png)

### LaTeX PDF report

![ModelHawk PDF report](./public/docs/screenshots/05-pdf-report.png)

### Demo page

![ModelHawk demo page](./public/docs/screenshots/06-demo-page.png)

---

## Demo notebook

You can test ModelHawk using the sample fraud detection notebook included in this repository:

[Download demo notebook: credit_card_fraud_detection.ipynb](./public/examples/credit_card_fraud_detection.ipynb)

Recommended test flow:

1. Run the project locally.
2. Go to the **Upload Notebook** page.
3. Upload `credit_card_fraud_detection.ipynb`.
4. Run the static audit.
5. Review the detected project profile, scores, findings, risks, recommendations and AI examiner notes.
6. Download the generated PDF report.

The demo notebook is a machine-learning project focused on:

- credit card fraud detection
- imbalanced classification
- preprocessing
- model comparison
- threshold selection
- precision/recall evaluation
- PR-AUC and ROC-AUC style model assessment

---

## Sample PDF report

A sample generated audit report is included here:

[Open sample ModelHawk PDF report](./public/docs/reports/modelhawk-sample-audit-report.pdf)

The PDF report is generated through the ModelHawk PDF route using LaTeX.

---

## What ModelHawk does

ModelHawk performs a static analysis of uploaded `.ipynb` notebooks.

It does **not** execute notebook code. Instead, it parses notebook content and searches for technical signals related to machine-learning project quality.

Current capabilities include:

- detecting the likely ML project profile
- identifying the primary task, such as classification
- detecting data modality, such as tabular data
- recognising problem traits such as class imbalance, fraud detection, threshold-sensitive evaluation or deep learning signals
- detecting ML workflow signals such as:
  - train/test split
  - train/validation split
  - stratified split
  - cross-validation
  - random seeds
  - pipelines or `ColumnTransformer`
  - SMOTE or resampling
  - baseline models
  - hyperparameter search
  - PR-AUC, ROC-AUC, precision, recall and F1 evaluation
  - threshold tuning
  - markdown explanation and limitations sections
- producing heuristic audit scores
- highlighting good practices
- highlighting risks to verify
- suggesting priority fixes and notebook improvements
- generating viva/interview preparation questions
- generating AI examiner notes from the structured audit result
- exporting a professional PDF audit report compiled with LaTeX

---

## Example output

When tested with the included credit card fraud detection notebook, ModelHawk detects a profile similar to:

```text
Primary task: Classification
Data modality: Tabular
Problem traits: Imbalanced Data, Fraud Detection, Threshold/Cost Sensitive, Deep Learning
Confidence: High
```

Example audit dimensions:

```text
Leakage risk
Metric quality
Reproducibility
Portfolio readiness
```

Example review points include:

```text
Verify that SMOTE/resampling is applied only to the training data.
Check that final conclusions prioritise minority-class performance.
Verify that metrics are calculated on held-out data only.
```

---

## AI examiner layer

ModelHawk includes an AI examiner layer that converts deterministic audit results into clearer technical review notes.

The AI layer does **not** replace the deterministic audit engine. It uses the structured audit result as evidence and produces clearer explanations, recommendations and viva-style answer guidance.

Current provider order:

```text
GEMINI_API_KEY configured
  ↓
Use Gemini API

No Gemini key or Gemini temporarily unavailable
  ↓
Use Ollama if OLLAMA_URL is configured

No external/local provider available
  ↓
Use deterministic ModelHawk fallback examiner
```

The intended architecture is:

```text
Notebook
  ↓
Static parser and deterministic audit rules
  ↓
Structured audit JSON
  ↓
AI examiner notes
  ↓
Web report and PDF report
```

The AI examiner can generate:

- executive summaries
- technical assessments
- risk interpretations
- portfolio-oriented verdicts
- improved recommendations
- suggested markdown cells
- viva/interview answer guidance
- audit limitations

If the primary AI provider is temporarily unavailable, ModelHawk can show an AI provider notice and use a fallback examiner instead.

---

## PDF report generation

ModelHawk can export a professional PDF report using a LaTeX backend.

The PDF report includes:

- cover page
- executive summary
- detected project profile
- notebook structure
- audit scores
- findings
- good practices
- risks to verify
- recommendations
- suggested notebook improvements
- AI examiner notes when available
- viva questions and answer guidance
- detected technical signals

The PDF generator currently depends on a local LaTeX installation such as **MiKTeX** on Windows. A production-friendly LaTeX workflow is planned so that PDF generation does not depend on a local machine.

---

## Tech stack

### Frontend and backend

- Next.js
- React
- TypeScript
- API routes
- Tailwind CSS-style utility classes

### AI examiner

- Gemini API when configured
- Ollama as an optional local fallback
- Deterministic fallback examiner
- Structured JSON-style AI output
- Provider fallback notices

### Report generation

- LaTeX
- `pdflatex`
- Professional PDF report compilation

### ML audit logic

- Static notebook parsing
- Rule-based signal detection
- Heuristic scoring
- Project profile inference
- ML workflow quality checks

---

## Project structure

```text
modelhawk
├── app
│   ├── api
│   │   ├── audit
│   │   │   ├── route.ts
│   │   │   └── ai
│   │   │       └── route.ts
│   │   └── report
│   │       └── pdf
│   │           └── route.ts
│   ├── demo
│   │   └── page.tsx
│   ├── upload
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── examples
│   └── credit_card_fraud_detection.ipynb
├── docs
│   └── reports
│       └── modelhawk-sample-audit-report.pdf
├── public
│   ├── docs
│   │   ├── reports
│   │   │   └── modelhawk-sample-audit-report.pdf
│   │   └── screenshots
│   │       ├── 01-landing-page.png
│   │       ├── 02-upload-page.png
│   │       ├── 03-audit-results.png
│   │       ├── 04-ai-examiner-notes.png
│   │       ├── 05-pdf-report.png
│   │       └── 06-demo-page.png
│   ├── examples
│   │   └── credit_card_fraud_detection.ipynb
│   ├── logo.png
│   ├── report-icon.jpg
│   ├── modelhawk-icon.png
│   ├── modelhawk-wordmark.png
│   └── modelhawk-full-logo.png
├── package.json
├── tsconfig.json
└── README.md
```

---

## Running locally

### 1. Clone the repository

```bash
git clone https://github.com/albertoreyescastro/modelhawk.git
cd modelhawk
```

### 2. Install dependencies

Use Node.js **20.9.0 or newer**. The repository includes a lockfile, so a clean install is preferred:

```bash
npm ci
```

### 3. Start the Next.js development server

```bash
npm run dev
```

On Windows PowerShell, if script execution causes issues, use:

```powershell
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment variables

Create a `.env.local` file for local development if you want AI examiner notes.

### Gemini provider

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

### Ollama fallback

```env
OLLAMA_MODEL=llama3.2:3b
OLLAMA_URL=http://localhost:11434/api/chat
```

`.env.local` is intentionally ignored by Git and should never be committed.

---

## Running with Ollama fallback

Ollama is optional. It is useful when you want a local fallback provider.

### 1. Install Ollama

Install Ollama for your operating system.

### 2. Pull a local model

Recommended lightweight model:

```bash
ollama pull llama3.2:3b
```

### 3. Test Ollama

```bash
ollama run llama3.2:3b
```

Exit with:

```text
/bye
```

---

## Deployment note

The repository does not treat an ad-hoc development tunnel as a production deployment. If a public deployment is added, it should use a maintained host, HTTPS, request-size limits, rate limiting and the same validation checks used by the local application.

---

## Safety and validation hardening

The current hardening pass adds:

- a 10 MiB notebook upload limit and basic notebook-shape validation
- explicit separation between probability-score detection and actual threshold tuning
- leakage heuristics based on executable calls rather than import statements
- explicit checks for test-set reuse during model/strategy selection and threshold tuning
- checks for learned preprocessing fitted before cross-validation instead of inside folds
- detection of hand-weighted composite model-selection scores as review points
- distinct model-family detection for multi-model claims
- confidence scoring that depends on absolute evidence as well as score separation
- bounded AI-provider request sizes, provider timeouts and per-process concurrency limits
- Gemini API credentials sent in an API-key header rather than the request URL
- bounded PDF request size, per-process concurrency, `pdflatex` timeout and `-no-shell-escape`
- baseline HTTP security headers and a disabled framework-identification header
- deterministic regression tests, including the bundled fraud notebook as a known-risk fixture

Run the local checks with:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Static analysis is intentionally conservative: a detected signal is evidence to review, not proof that the notebook is correct or incorrect.

---

## Limitations

ModelHawk is currently a prototype and should be interpreted carefully.

Current limitations:

- it performs static analysis only
- it does not execute notebooks
- it cannot prove the absence of data leakage
- it cannot guarantee methodological correctness
- it cannot validate runtime outputs, plots or actual metric values
- AI examiner notes improve explanation but do not replace human review
- Gemini or any external provider may be temporarily unavailable or rate-limited
- fallback examiner notes should be treated as guidance, not proof of correctness
- PDF generation currently depends on a local LaTeX installation

The generated report should be treated as **technical guidance**, not as a final guarantee of ML quality.

---

## Roadmap

Planned or possible future improvements:

- add support for more ML project types
- add deeper task-specific audit packs
- add richer notebook structure analysis
- add optional executed-notebook validation
- add a stable public deployment
- make LaTeX PDF generation production-friendly
- add Docker support
- add CI checks
- add more robust PDF rendering options
- add more sample notebooks and reports
- improve AI examiner grounding and consistency
- add provider status display in the UI
- add more detailed report customisation

---

## Why I built this

ModelHawk was built as a personal technical project to explore how machine-learning notebooks can be reviewed more systematically.

The project combines several areas I am interested in:

- machine learning evaluation
- AI-assisted technical review
- static analysis
- local and hosted AI tooling
- technical documentation
- scientific reporting
- web prototyping
- PDF report generation

It is also designed as a portfolio project showing practical experience across AI, data, software prototyping and technical communication.

---

## Author

**Alberto Reyes Castro**

Physics graduate and MSc Artificial Intelligence Technology with Advanced Practice student.

- GitHub: [albertoreyescastro](https://github.com/albertoreyescastro)
- LinkedIn: [Alberto Reyes Castro](https://www.linkedin.com/in/alberto-reyes-ba5546238/)
- Kaggle: [albertoreyescastro20](https://www.kaggle.com/albertoreyescastro20)

---

## License

No license has been added yet.

This repository is public for portfolio and code-review purposes. Reuse rights are not granted unless a license is added in the future.
