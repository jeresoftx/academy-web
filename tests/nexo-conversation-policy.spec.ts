import { expect, test } from '@playwright/test';

import {
  buildNexoConversationPolicy,
  validateNexoConversationDraft,
} from '../src/lib/nexo/conversation-policy';

test('la política limita turnos, frases e intenciones de Nexo', () => {
  const policy = buildNexoConversationPolicy();

  expect(policy.maxTurnsPerSession).toBeLessThanOrEqual(3);
  expect(policy.maxSentencesPerReply).toBe(2);
  expect(policy.allowedIntents).toEqual([
    'greeting',
    'navigate',
    'search',
    'clarify',
  ]);
  expect(policy.forbiddenCapabilities).toEqual(
    expect.arrayContaining([
      'network_access',
      'file_system_access',
      'write_actions',
      'github_actions',
    ]),
  );
});

test('la política rechaza respuestas largas aunque la intención sea válida', () => {
  const validation = validateNexoConversationDraft({
    intent: 'greeting',
    reply:
      'Hola, soy Nexo. Puedo ayudarte a encontrar cursos. También puedo explicarte el camino completo si quieres.',
  });

  expect(validation.valid).toBe(false);
  expect(validation.reasons).toContain('too_many_sentences');
});

test('la política rechaza acciones fuera del rol bibliotecario', () => {
  const validation = validateNexoConversationDraft({
    intent: 'write_file',
    reply: 'Puedo modificar ese archivo por ti.',
    requestedCapabilities: ['file_system_access', 'write_actions'],
  });

  expect(validation.valid).toBe(false);
  expect(validation.reasons).toEqual(
    expect.arrayContaining([
      'unsupported_intent',
      'forbidden_capability:file_system_access',
      'forbidden_capability:write_actions',
    ]),
  );
});

test('la política acepta una respuesta breve y estructurada', () => {
  const validation = validateNexoConversationDraft({
    intent: 'search',
    reply:
      'Busco ese tema en los cursos publicados. Si hay varias rutas, te pido elegir una.',
  });

  expect(validation).toEqual({ valid: true, reasons: [] });
});
