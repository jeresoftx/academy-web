export type NexoRetrievalFallback = 'refuse_with_safe_search';

export interface NexoRetrievalPolicy {
  chunking: {
    maxWords: number;
    overlapWords: number;
  };
  requiredMetadata: string[];
  requiresCitations: boolean;
  minimumAverageScore: number;
  answerWithoutSufficientSource: NexoRetrievalFallback;
  openSearchThresholds: {
    indexedDocuments: number;
    monthlySearches: number;
    p95LatencyMs: number;
    staticIndexSizeMb: number;
  };
}

export interface NexoCitation {
  sourcePath: string;
  title: string;
}

export interface NexoRetrievalAnswer {
  answer: string;
  citations: NexoCitation[];
  averageScore: number;
}

export interface NexoRetrievalEvaluation {
  valid: boolean;
  reasons: string[];
  fallback?: NexoRetrievalFallback;
}

export interface NexoSearchLoad {
  indexedDocuments: number;
  monthlySearches: number;
  p95LatencyMs: number;
  staticIndexSizeMb: number;
}

const RETRIEVAL_POLICY: NexoRetrievalPolicy = {
  chunking: {
    maxWords: 220,
    overlapWords: 35,
  },
  requiredMetadata: ['sourcePath', 'title', 'courseSlug', 'updatedAt'],
  requiresCitations: true,
  minimumAverageScore: 0.7,
  answerWithoutSufficientSource: 'refuse_with_safe_search',
  openSearchThresholds: {
    indexedDocuments: 1_000,
    monthlySearches: 20_000,
    p95LatencyMs: 1_500,
    staticIndexSizeMb: 128,
  },
};

export function buildNexoRetrievalPolicy(): NexoRetrievalPolicy {
  return {
    ...RETRIEVAL_POLICY,
    chunking: { ...RETRIEVAL_POLICY.chunking },
    requiredMetadata: [...RETRIEVAL_POLICY.requiredMetadata],
    openSearchThresholds: { ...RETRIEVAL_POLICY.openSearchThresholds },
  };
}

export function evaluateNexoRetrievalAnswer(
  answer: NexoRetrievalAnswer,
  policy = buildNexoRetrievalPolicy(),
): NexoRetrievalEvaluation {
  const reasons: string[] = [];

  if (policy.requiresCitations && answer.citations.length === 0) {
    reasons.push('missing_citations');
  }

  if (answer.averageScore < policy.minimumAverageScore) {
    reasons.push('score_below_threshold');
  }

  const fallback =
    reasons.length > 0 ? policy.answerWithoutSufficientSource : undefined;

  return {
    valid: reasons.length === 0,
    reasons,
    ...(fallback ? { fallback } : {}),
  };
}

export function shouldEvaluateOpenSearch(
  load: NexoSearchLoad,
  policy = buildNexoRetrievalPolicy(),
): boolean {
  const thresholds = policy.openSearchThresholds;

  return (
    load.indexedDocuments >= thresholds.indexedDocuments &&
    load.monthlySearches >= thresholds.monthlySearches &&
    load.p95LatencyMs >= thresholds.p95LatencyMs &&
    load.staticIndexSizeMb >= thresholds.staticIndexSizeMb
  );
}
