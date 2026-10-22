import test from "node:test";
import assert from "node:assert/strict";
import {
  computeTaskConfidence,
  detectModelFamilies,
  detectScalerBeforeSplit,
  detectSmoteBeforeSplit,
  detectThresholdTuning,
  detectTestSetSelectionRisk,
  detectTestSetThresholdTuningRisk,
  detectPreprocessingOutsideCrossValidationRisk,
  detectCustomCompositeScore,
} from "../lib/audit-heuristics.mjs";

test("SMOTE import before split is not treated as leakage", () => {
  const code = `from imblearn.over_sampling import SMOTE\nfrom sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y)\nX_res, y_res = SMOTE().fit_resample(X_train, y_train)`;
  assert.equal(detectSmoteBeforeSplit(code).smoteBeforeSplit, false);
});

test("fit_resample before actual split is detected", () => {
  const code = `from sklearn.model_selection import train_test_split\nX_res, y_res = SMOTE().fit_resample(X, y)\nX_train, X_test, y_train, y_test = train_test_split(X_res, y_res)`;
  assert.equal(detectSmoteBeforeSplit(code).smoteBeforeSplit, true);
});

test("predict_proba alone is not threshold tuning", () => {
  assert.equal(detectThresholdTuning("scores = model.predict_proba(X_test)[:, 1]"), false);
});

test("explicit threshold selection is detected", () => {
  assert.equal(detectThresholdTuning("best_threshold = 0.37\ny_pred = (scores >= best_threshold).astype(int)"), true);
});

test("one model family is not multiple models", () => {
  assert.deepEqual(detectModelFamilies("model = LogisticRegression()"), ["logistic_regression"]);
});

test("two distinct model families are detected", () => {
  assert.equal(detectModelFamilies("LogisticRegression(); XGBClassifier()").length, 2);
});

test("weak evidence cannot produce high confidence", () => {
  assert.ok(computeTaskConfidence(2, 0) < 60);
  assert.ok(computeTaskConfidence(10, 2) >= 75);
});

test("scaler fitted before actual split is detected despite import", () => {
  const code = `from sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nX_scaled = StandardScaler().fit_transform(X)\nX_train, X_test = train_test_split(X_scaled)`;
  assert.equal(detectScalerBeforeSplit(code), true);
});

test("bundled demo notebook does not falsely flag SMOTE-before-split", async () => {
  const fs = await import("node:fs/promises");
  const notebook = JSON.parse(
    await fs.readFile(new URL("../public/examples/credit_card_fraud_detection.ipynb", import.meta.url), "utf8")
  );
  const code = notebook.cells
    .filter((cell) => cell.cell_type === "code")
    .map((cell) => Array.isArray(cell.source) ? cell.source.join("") : String(cell.source || ""))
    .join("\n");

  assert.equal(detectSmoteBeforeSplit(code).smoteBeforeSplit, false);
  assert.ok(detectModelFamilies(code).length >= 3);
  assert.equal(detectTestSetSelectionRisk(code), true);
  assert.equal(detectPreprocessingOutsideCrossValidationRisk(code), true);
  assert.equal(detectCustomCompositeScore(code), true);

  const codeCells = notebook.cells
    .filter((cell) => cell.cell_type === "code")
    .map((cell) => Array.isArray(cell.source) ? cell.source.join("") : String(cell.source || ""));
  assert.equal(codeCells.some(detectTestSetThresholdTuningRisk), true);
});

test("ranking several models on test-set metrics is flagged", () => {
  const code = `
    rf = RandomForestClassifier()
    xgb = XGBClassifier()
    rf_prob = rf.predict_proba(X_test_scaled)[:, 1]
    xgb_prob = xgb.predict_proba(X_test_scaled)[:, 1]
    rf_f1 = f1_score(y_test, rf_prob > 0.5)
    xgb_f1 = f1_score(y_test, xgb_prob > 0.5)
    ranked_df = results.sort_values(by=["F1-Score"], ascending=False)
  `;
  assert.equal(detectTestSetSelectionRisk(code), true);
});

test("threshold grid scored on y_test is flagged", () => {
  const code = `
    thresholds = [0.3, 0.5, 0.7]
    for t in thresholds:
        y_pred = (y_prob >= t).astype(int)
        score = f1_score(y_test, y_pred)
  `;
  assert.equal(detectTestSetThresholdTuningRisk(code), true);
});

test("validation threshold tuning is not mislabeled as test tuning", () => {
  const code = `
    thresholds = [0.3, 0.5, 0.7]
    for t in thresholds:
        y_pred = (y_val_prob >= t).astype(int)
        score = f1_score(y_val, y_pred)
  `;
  assert.equal(detectTestSetThresholdTuningRisk(code), false);
});

test("scaling training data before cross-validation is flagged", () => {
  const code = `
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    scores = cross_validate(model, X_train_scaled, y_train, cv=5)
  `;
  assert.equal(detectPreprocessingOutsideCrossValidationRisk(code), true);
});

test("custom weighted composite score is detected", () => {
  assert.equal(
    detectCustomCompositeScore('Business_Score = 0.35 * Recall + 0.30 * Precision'),
    true
  );
});
