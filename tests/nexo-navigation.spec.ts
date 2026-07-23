import { expect, test } from '@playwright/test';

import {
  buildNexoNavigationRegistry,
  resolveNexoNavigation,
  safeSearchHref,
} from '../src/lib/nexo/navigation';

test('Nexo abre un curso conocido desde el registro canónico', () => {
  const result = resolveNexoNavigation('abrir algoritmos');

  expect(result.intent).toBe('open_course');
  expect(result.confidence).toBe('high');
  expect(result.actions).toEqual([
    expect.objectContaining({
      type: 'open_course',
      label: 'Abrir Algoritmos',
      href: '/courses/algorithms/',
    }),
  ]);
});

test('Nexo abre un capítulo publicado sin inventar rutas', () => {
  const result = resolveNexoNavigation('sliding window');

  expect(result.intent).toBe('open_chapter');
  expect(result.confidence).toBe('high');
  expect(result.actions[0]).toMatchObject({
    type: 'open_chapter',
    label: 'Abrir Sliding Window: pensar en ventanas, no en ciclos',
    href: '/courses/algorithms/sliding-window/',
  });
});

test('Nexo pide aclaración cuando una búsqueda tiene varios resultados', () => {
  const result = resolveNexoNavigation('rust');

  expect(result.intent).toBe('ask_clarification');
  expect(result.confidence).toBe('medium');
  expect(result.actions.length).toBeGreaterThan(1);
  expect(result.visibleSummary).toContain('Encontré varias opciones');
});

test('Nexo responde con búsqueda segura cuando no encuentra ruta', () => {
  const result = resolveNexoNavigation('química cuántica');

  expect(result.intent).toBe('search');
  expect(result.confidence).toBe('low');
  expect(result.actions).toEqual([
    {
      type: 'search',
      label: 'Buscar "química cuántica"',
      href: '/search/?q=qu%C3%ADmica+cu%C3%A1ntica',
    },
  ]);
});

test('Nexo genera parámetros de búsqueda visibles y seguros', () => {
  expect(safeSearchHref('  <script>alert(1)</script> grafos  ')).toBe(
    '/search/?q=alert%281%29+grafos',
  );
});

test('el registro se deriva de cursos y capítulos publicados', () => {
  const registry = buildNexoNavigationRegistry();

  expect(registry.some((entry) => entry.href === '/courses/algorithms/')).toBe(
    true,
  );
  expect(
    registry.some(
      (entry) => entry.href === '/courses/algorithms/sliding-window/',
    ),
  ).toBe(true);
});
