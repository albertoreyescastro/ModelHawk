import {
  detectCustomCompositeScore,
  detectModelFamilies,
  detectPreprocessingOutsideCrossValidationRisk,
  detectScalerBeforeSplit,
  detectSmoteBeforeSplit,
  detectTestSetSelectionRisk,
  detectTestSetThresholdTuningRisk,
  detectThresholdTuning,
} from './audit-heuristics.mjs';
import { includesAny, pickBest } from './audit-types.mjs';
import { computeTaskConfidence } from './audit-heuristics.mjs';

export function analyseSignals(code, markdown, codeCells = []) {
  const lowerCode = code.toLowerCase();
  const lowerMarkdown = markdown.toLowerCase();
  const lowerAll = `${lowerCode}\n${lowerMarkdown}`;

  const smoteSignals = detectSmoteBeforeSplit(code);
  const usesTrainTestSplit = smoteSignals.usesTrainTestSplit;
  const usesSmote = smoteSignals.usesSmote;
  const smoteBeforeSplit = smoteSignals.smoteBeforeSplit;
  const scalerBeforeSplit = detectScalerBeforeSplit(code);

  const usesTrainValidationSplit = includesAny(lowerCode, [
    /validation_split/, /\bx_val\b/, /\by_val\b/, /\bx_valid\b/, /\by_valid\b/, /valid_size/, /val_size/,
  ]);
  const usesAccuracy = includesAny(lowerCode, [/accuracy_score/, /\baccuracy\b/]);
  const usesConfusionMatrix = lowerCode.includes('confusion_matrix');
  const usesClassificationReport = lowerCode.includes('classification_report');
  const usesPrecisionRecallF1 = includesAny(lowerCode, [
    /precision_score/, /recall_score/, /f1_score/, /classification_report/, /\bf1\b/, /\bprecision\b/, /\brecall\b/,
  ]);
  const usesRocAuc = includesAny(lowerCode, [/roc_auc_score/, /roc_curve/, /\bauc\(/]);
  const usesPrauc = includesAny(lowerCode, [
    /average_precision_score/, /precision_recall_curve/, /pr_auc/, /prauc/, /pr-auc/,
  ]);
  const usesProbabilityScores = includesAny(lowerCode, [/predict_proba/, /decision_function/]);
  const usesThresholdTuning = detectThresholdTuning(code);
  const testSetSelectionRisk = detectTestSetSelectionRisk(code);
  const testSetThresholdTuningRisk = codeCells.some((cell) => detectTestSetThresholdTuningRisk(cell));
  const preprocessingOutsideCrossValidationRisk = detectPreprocessingOutsideCrossValidationRisk(code);
  const usesCustomCompositeScore = detectCustomCompositeScore(code);

  const usesRandomState = includesAny(lowerCode, [
    /random_state/, /np\.random\.seed/, /torch\.manual_seed/, /tf\.random\.set_seed/, /\bseed\(/,
  ]);
  const usesCrossValidation = includesAny(lowerCode, [
    /cross_val_score/, /cross_validate/, /gridsearchcv/, /randomizedsearchcv/, /stratifiedkfold/, /\bkfold/, /timeseriessplit/,
  ]);
  const usesStratify = /stratify\s*=/.test(lowerCode);
  const usesPipeline = includesAny(lowerCode, [/\bpipeline\(/, /make_pipeline/, /columntransformer/, /pipeline\./]);
  const usesHyperparameterSearch = includesAny(lowerCode, [/gridsearchcv/, /randomizedsearchcv/, /optuna/, /hyperopt/, /bayessearchcv/]);
  const usesBaseline = includesAny(lowerAll, [/baseline/, /dummyclassifier/, /dummyregressor/, /naive model/, /majority class/, /most frequent/, /simple baseline/]);
  const usesRequirementsOrDependencies = includesAny(lowerMarkdown, [/requirements/, /environment/, /dependencies/, /package versions/, /pip install/, /conda/]);

  const mentionsImbalance = includesAny(lowerAll, [/imbalanced/, /imbalance/, /smote/, /class_weight/, /minority class/, /rare class/, /fraud/, /oversampling/, /undersampling/]);
  const acknowledgesAccuracyLimitation = includesAny(lowerMarkdown, [
    /accuracy alone/, /accuracy is not enough/, /accuracy.*misleading/, /misleading.*accuracy/, /not rely on accuracy/, /accuracy.*imbalance/, /accuracy.*minority/, /high accuracy.*poor/,
  ]);
  const discussesResamplingSafety = includesAny(lowerMarkdown, [
    /smote.*training/, /training.*smote/, /resampling.*training/, /training.*resampling/, /smote.*leakage/, /resampling.*leakage/, /after.*split.*smote/, /smote.*after.*split/,
  ]);
  const mentionsLimitations = includesAny(lowerMarkdown, [/limitation/, /future work/, /weakness/, /caveat/, /constraint/, /assumption/]);
  const mentionsBusinessContext = includesAny(lowerMarkdown, [/business/, /cost/, /false positive/, /false negative/, /trade-?off/, /risk/, /operational/, /stakeholder/]);
  const mentionsConclusion = includesAny(lowerMarkdown, [/conclusion/, /results discussion/, /discussion/, /summary/, /final result/]);
  const hasMarkdownExplanation = markdown.trim().length > 500;

  const usesRegressionMetrics = includesAny(lowerCode, [/mean_squared_error/, /root_mean_squared_error/, /mean_absolute_error/, /r2_score/, /\brmse\b/, /\bmae\b/, /\bmse\b/, /\br2\b/]);
  const usesRegressionModel = includesAny(lowerCode, [/linearregression/, /ridge/, /lasso/, /elasticnet/, /randomforestregressor/, /xgbregressor/, /gradientboostingregressor/, /\bsvr\b/, /regressor/]);
  const usesClassificationModel = includesAny(lowerCode, [/logisticregression/, /randomforestclassifier/, /xgbclassifier/, /gradientboostingclassifier/, /decisiontreeclassifier/, /\bsvc\b/, /kneighborsclassifier/, /classifier/]);
  const usesResidualAnalysis = usesRegressionModel && usesRegressionMetrics && includesAny(lowerAll, [/residual analysis/, /residual plot/, /residuals/, /prediction error distribution/, /error distribution/]);
  const usesClustering = includesAny(lowerCode, [/kmeans/, /dbscan/, /agglomerativeclustering/, /spectralclustering/, /gaussianmixture/, /silhouette_score/, /\bclustering\b/]);
  const usesClusterValidation = includesAny(lowerCode, [/silhouette_score/, /davies_bouldin_score/, /calinski_harabasz_score/, /inertia_/, /\belbow\b/]);
  const usesTimeSeriesSignals = includesAny(lowerAll, [/timeseriessplit/, /\barima\b/, /\bsarima\b/, /\bprophet\b/, /\bforecasting\b/, /\btime series\b/, /walk-forward/, /backtesting/, /temporal validation/, /chronological split/]);
  const usesNlpSignals = includesAny(lowerAll, [/tfidfvectorizer/, /countvectorizer/, /\btokenizer\b/, /tokeni[sz]ation/, /\bnltk\b/, /\bspacy\b/, /\btransformers\b/, /\bbert\b/, /sentence-transformer/, /text classification/, /sentiment analysis/, /\bcorpus\b/]);
  const usesComputerVisionSignals = includesAny(lowerCode, [/\bimport\s+cv2\b/, /\bcv2\./, /\bopencv\b/, /from\s+pil\s+import/, /image\.open\(/, /\bimread\(/, /\btorchvision\b/, /imagedatagenerator/, /image_dataset_from_directory/, /conv2d/, /image classification/]);
  const hasDeepLearningFramework = includesAny(lowerCode, [/import\s+tensorflow/, /from\s+tensorflow/, /import\s+keras/, /from\s+keras/, /import\s+torch/, /from\s+torch/, /torch\.nn/, /tf\.keras/, /keras\.models/]);
  const hasDeepLearningArchitecture = includesAny(lowerCode, [/sequential\(/, /dense\(/, /conv2d/, /lstm/, /dropout\(/, /model\.add\(/, /nn\.module/, /neural network/]);
  const usesDeepLearningSignals = hasDeepLearningFramework && hasDeepLearningArchitecture;
  const usesEarlyStopping = includesAny(lowerCode, [/earlystopping/, /early_stopping/]);
  const usesLearningCurves = includesAny(lowerAll, [/learning curve/, /loss curve/, /val_loss/, /validation loss/, /history\.history/]);
  const usesAnomalySignals = includesAny(lowerAll, [/isolationforest/, /oneclasssvm/, /localoutlierfactor/, /\banomaly\b/, /outlier detection/, /\bfraud\b/, /rare event/]);
  const usesRecommenderSignals = includesAny(lowerAll, [/recommender system/, /recommendation system/, /collaborative filtering/, /matrix factorization/, /\bndcg\b/, /precision@k/, /recall@k/, /map@k/]);
  const usesModelPersistence = includesAny(lowerCode, [/joblib\.dump/, /pickle\.dump/, /save_model/, /model\.save/, /\.pt\b/, /\.pth\b/, /\.h5\b/]);
  const detectedModelFamilies = detectModelFamilies(code);
  const usesMultipleModels = detectedModelFamilies.length >= 2;

  const taskScores = { classification: 0, regression: 0, clustering: 0, forecasting: 0, recommendation: 0, anomaly_detection: 0 };
  if (usesClassificationModel) taskScores.classification += 3;
  if (usesClassificationReport) taskScores.classification += 3;
  if (usesConfusionMatrix) taskScores.classification += 2;
  if (usesPrecisionRecallF1) taskScores.classification += 2;
  if (usesRocAuc || usesPrauc) taskScores.classification += 2;
  if (usesSmote || usesThresholdTuning) taskScores.classification += 2;
  if (usesRegressionModel) taskScores.regression += 3;
  if (usesRegressionMetrics) taskScores.regression += 4;
  if (usesResidualAnalysis) taskScores.regression += 2;
  if (usesClustering) taskScores.clustering += 4;
  if (usesClusterValidation) taskScores.clustering += 2;
  if (usesTimeSeriesSignals) taskScores.forecasting += 4;
  if (usesRecommenderSignals) taskScores.recommendation += 5;
  if (usesAnomalySignals) taskScores.anomaly_detection += 3;
  if (lowerAll.includes('fraud')) taskScores.anomaly_detection += 1;
  const taskPick = pickBest(taskScores);
  const primaryTask = taskPick.label;
  const taskConfidence = computeTaskConfidence(taskPick.score, taskPick.secondScore);
  const secondaryTasks = taskPick.sorted.filter(([task, score]) => task !== primaryTask && score >= 4 && score >= taskPick.score * 0.55).map(([task]) => task);

  const modalityScores = { tabular: 0, text: 0, image: 0, time_series: 0, unknown: 0 };
  if (includesAny(lowerCode, [/\bpandas\b/, /\bdataframe\b/, /read_csv/, /\.csv/, /\bsklearn\b/, /scikit-learn/])) modalityScores.tabular += 4;
  if (usesNlpSignals) modalityScores.text += 6;
  if (usesComputerVisionSignals) modalityScores.image += 6;
  if (usesTimeSeriesSignals) modalityScores.time_series += 6;
  if (modalityScores.tabular >= 4 && !usesNlpSignals && !usesComputerVisionSignals && !usesTimeSeriesSignals) modalityScores.tabular += 3;
  if (Object.values(modalityScores).every((value) => value === 0)) modalityScores.unknown = 1;
  const modalityPick = pickBest(modalityScores);

  return {
    usesTrainTestSplit, usesTrainValidationSplit, usesSmote, smoteBeforeSplit, scalerBeforeSplit,
    usesAccuracy, usesConfusionMatrix, usesClassificationReport, usesPrecisionRecallF1, usesRocAuc, usesPrauc,
    usesProbabilityScores, usesThresholdTuning, testSetSelectionRisk, testSetThresholdTuningRisk,
    preprocessingOutsideCrossValidationRisk, usesCustomCompositeScore, usesRandomState, usesCrossValidation,
    usesStratify, usesPipeline, usesHyperparameterSearch, usesBaseline, usesRequirementsOrDependencies,
    usesRegressionMetrics, usesResidualAnalysis, usesRegressionModel, usesClassificationModel, usesClustering,
    usesClusterValidation, usesTimeSeriesSignals, usesNlpSignals, usesComputerVisionSignals, usesDeepLearningSignals,
    usesEarlyStopping, usesLearningCurves, usesAnomalySignals, usesRecommenderSignals, usesModelPersistence,
    usesMultipleModels, detectedModelFamilies, acknowledgesAccuracyLimitation, discussesResamplingSafety,
    mentionsImbalance, hasMarkdownExplanation, mentionsLimitations, mentionsBusinessContext, mentionsConclusion,
    primaryTask, secondaryTasks, taskConfidence, dataModality: modalityPick.label,
    lowerAll,
  };
}
