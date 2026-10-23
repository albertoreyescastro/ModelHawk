const MODEL_FAMILY_PATTERNS = {
  logistic_regression: /\blogisticregression\b/i,
  linear_regression: /\blinearregression\b/i,
  random_forest: /\brandomforest(?:classifier|regressor)?\b/i,
  gradient_boosting: /\b(?:gradientboosting|histgradientboosting)(?:classifier|regressor)?\b/i,
  xgboost: /\b(?:xgbclassifier|xgbregressor|xgboost)\b/i,
  lightgbm: /\b(?:lgbmclassifier|lgbmregressor|lightgbm)\b/i,
  catboost: /\b(?:catboostclassifier|catboostregressor|catboost)\b/i,
  svm: /\b(?:svc|svr|linearsvc|linearsvr|oneclasssvm)\b/i,
  knn: /\b(?:kneighborsclassifier|kneighborsregressor)\b/i,
  decision_tree: /\bdecisiontree(?:classifier|regressor)?\b/i,
  naive_bayes: /\b(?:gaussiannb|multinomialnb|bernoullinb|complementnb)\b/i,
  neural_network: /\b(?:mlpclassifier|mlpregressor|sequential|keras|tensorflow|torch\.nn)\b/i,
};

export function stripPythonImportLines(code) {
  return String(code || "")
    .split(/\r?\n/)
    .map((line) => (/^\s*(?:from\s+\S+\s+import\s+|import\s+)/i.test(line) ? "" : line))
    .join("\n");
}

function firstMatchIndex(text, patterns) {
  let best = -1;
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match && (best === -1 || match.index < best)) best = match.index;
    pattern.lastIndex = 0;
  }
  return best;
}

export function detectSmoteBeforeSplit(code) {
  const executable = stripPythonImportLines(code).toLowerCase();
  const splitIndex = firstMatchIndex(executable, [/\btrain_test_split\s*\(/g]);
  const resampleIndex = firstMatchIndex(executable, [/\.fit_resample\s*\(/g, /\bfit_resample\s*\(/g]);

  return {
    usesTrainTestSplit: splitIndex >= 0,
    usesSmote: /\bsmote\b/i.test(code) || resampleIndex >= 0,
    smoteBeforeSplit: splitIndex >= 0 && resampleIndex >= 0 && resampleIndex < splitIndex,
  };
}

export function detectScalerBeforeSplit(code) {
  const executable = stripPythonImportLines(code).toLowerCase();
  const splitIndex = firstMatchIndex(executable, [/\btrain_test_split\s*\(/g]);
  const hasScaler = /\b(?:standardscaler|minmaxscaler|robustscaler|normalizer)\b/i.test(code);
  const fitTransformIndex = firstMatchIndex(executable, [/\.fit_transform\s*\(/g]);

  return hasScaler && splitIndex >= 0 && fitTransformIndex >= 0 && fitTransformIndex < splitIndex;
}

export function detectThresholdTuning(code) {
  const text = String(code || "").toLowerCase();
  const explicitThresholdName = /\b(?:best_|optimal_|decision_)?thresholds?\b/.test(text);
  const thresholdSearch = /\b(?:precision_recall_curve|roc_curve)\s*\(/.test(text) && explicitThresholdName;
  const thresholdComparison = /(?:predict_proba|decision_function)[\s\S]{0,500}>=?\s*(?:0?\.\d+|threshold|best_threshold|optimal_threshold)/.test(text);
  const scoreSearch = /\b(?:argmax|argmin)\s*\([^\n]*(?:f1|fbeta|youden|cost|profit|recall|precision)/.test(text);
  const thresholdLoop = /\bfor\s+\w*threshold\w*\s+in\s+/.test(text);

  return explicitThresholdName || thresholdSearch || thresholdComparison || scoreSearch || thresholdLoop;
}

export function detectModelFamilies(code) {
  const text = String(code || "");
  return Object.entries(MODEL_FAMILY_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([family]) => family);
}

export function detectTestSetSelectionRisk(code) {
  const text = stripPythonImportLines(code).toLowerCase();
  const modelFamilies = detectModelFamilies(code);
  const testFeatureRefs = (text.match(/\bx_test(?:_scaled)?\b/g) || []).length;
  const testTargetRefs = (text.match(/\by_test\b/g) || []).length;
  const hasRankingOrSelection =
    /\b(?:ranked_df|shortlisted_df|best_per_model|business_score|pass_filter)\b/.test(text) ||
    /\.sort_values\s*\([\s\S]{0,450}(?:f1|recall|precision|roc[_-]?auc|average_precision|business_score)/.test(text);

  return (
    modelFamilies.length >= 2 &&
    testFeatureRefs >= 2 &&
    testTargetRefs >= 2 &&
    hasRankingOrSelection
  );
}

export function detectTestSetThresholdTuningRisk(code) {
  const text = stripPythonImportLines(code).toLowerCase();
  const referencesTestLabels = /\by_test\b/.test(text);
  const hasThresholdGrid =
    /\bthresholds?\s*=\s*(?:\[|np\.|range\s*\()/.test(text) ||
    /\bfor\s+\w+\s+in\s+thresholds?\b/.test(text);
  const appliesThreshold = />=\s*(?:\w*threshold\w*|\bt\b)/.test(text);
  const scoresThresholds =
    /(?:f1_score|precision_score|recall_score|accuracy_score|confusion_matrix)\s*\(\s*y_test\b/.test(text);

  return referencesTestLabels && hasThresholdGrid && appliesThreshold && scoresThresholds;
}

export function detectPreprocessingOutsideCrossValidationRisk(code) {
  const text = stripPythonImportLines(code);
  const assignmentPattern =
    /\b([A-Za-z_]\w*(?:scaled|normalized|standardized)\w*)\s*=\s*[^\n]{0,160}\.fit_transform\s*\(\s*(?:X_train|x_train|X|x)\b/g;

  for (const match of text.matchAll(assignmentPattern)) {
    const variableName = match[1];
    const remainder = text.slice((match.index || 0) + match[0].length);
    const escaped = variableName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cvPattern = new RegExp(
      `\\b(?:cross_validate|cross_val_score)\\s*\\([\\s\\S]{0,800}\\b${escaped}\\b`,
      "i"
    );
    if (cvPattern.test(remainder)) return true;
  }

  return false;
}

export function detectCustomCompositeScore(code) {
  const text = String(code || "").toLowerCase();
  return (
    /\b(?:business|custom|composite|weighted)_?score\b/.test(text) &&
    /(?:0\.\d+\s*\*|\*\s*0\.\d+)/.test(text)
  );
}

export function computeTaskConfidence(bestScore, secondScore) {
  const best = Number.isFinite(bestScore) ? Math.max(0, bestScore) : 0;
  const second = Number.isFinite(secondScore) ? Math.max(0, secondScore) : 0;
  if (best < 2) return 25;

  const evidence = Math.min(65, 25 + best * 5);
  const separationRatio = Math.max(0, best - second) / Math.max(best, 1);
  const separationBoost = Math.min(20, separationRatio * 20);
  return Math.max(25, Math.min(90, Math.round(evidence + separationBoost)));
}
