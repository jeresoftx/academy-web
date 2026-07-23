import { expect, test } from '@playwright/test';

import {
  buildNexoRetrievalPolicy,
  evaluateNexoRetrievalAnswer,
  shouldEvaluateOpenSearch,
} from '../src/lib/nexo/retrieval-policy';

test('la política de recuperación exige fragmentos con fuente canónica', () => {
  const policy = buildNexoRetrievalPolicy();

  expect(policy.chunking).toMatchObject({
    maxWords: 220,
    overlapWords: 35,
  });
  expect(policy.requiredMetadata).toEqual([
    'sourcePath',
    'title',
    'courseSlug',
    'updatedAt',
  ]);
  expect(policy.requiresCitations).toBe(true);
  expect(policy.answerWithoutSufficientSource).toBe('refuse_with_safe_search');
});

test('una respuesta sin citas suficientes se rechaza', () => {
  const evaluation = evaluateNexoRetrievalAnswer({
    answer: 'Sliding Window usa dos índices para recorrer un arreglo.',
    citations: [],
    averageScore: 0.91,
  });

  expect(evaluation.valid).toBe(false);
  expect(evaluation.reasons).toContain('missing_citations');
});

test('una respuesta con score bajo se convierte en búsqueda segura', () => {
  const evaluation = evaluateNexoRetrievalAnswer({
    answer: 'Puede que eso esté en el curso.',
    citations: [{ sourcePath: 'docs/01.md', title: 'Capítulo 1' }],
    averageScore: 0.42,
  });

  expect(evaluation).toEqual({
    valid: false,
    reasons: ['score_below_threshold'],
    fallback: 'refuse_with_safe_search',
  });
});

test('una respuesta breve con cita y score suficiente se acepta', () => {
  const evaluation = evaluateNexoRetrievalAnswer({
    answer:
      'Sliding Window mantiene un rango contiguo y actualiza estado incremental.',
    citations: [
      {
        sourcePath: 'src/data/lessons.ts',
        title: 'Sliding Window: pensar en ventanas, no en ciclos',
      },
    ],
    averageScore: 0.83,
  });

  expect(evaluation).toEqual({ valid: true, reasons: [] });
});

test('OpenSearch solo se justifica al superar umbrales objetivos', () => {
  expect(
    shouldEvaluateOpenSearch({
      indexedDocuments: 180,
      monthlySearches: 4_000,
      p95LatencyMs: 900,
      staticIndexSizeMb: 18,
    }),
  ).toBe(false);

  expect(
    shouldEvaluateOpenSearch({
      indexedDocuments: 1_500,
      monthlySearches: 25_000,
      p95LatencyMs: 1_800,
      staticIndexSizeMb: 160,
    }),
  ).toBe(true);
});
