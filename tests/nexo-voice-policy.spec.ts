import { expect, test } from '@playwright/test';

import {
  buildNexoVoicePolicy,
  validateNexoVoiceSession,
} from '../src/lib/nexo/voice-policy';

test('la política de voz exige activación explícita y respaldo textual', () => {
  const policy = buildNexoVoicePolicy();

  expect(policy.activationModes).toEqual(['hold_button', 'keyboard_hold']);
  expect(policy.maxCaptureSeconds).toBeLessThanOrEqual(15);
  expect(policy.requiresVisibleTranscript).toBe(true);
  expect(policy.requiresTextFallback).toBe(true);
  expect(policy.passiveListening).toBe(false);
});

test('la política separa transcripción, confirmación y salida TTS', () => {
  const policy = buildNexoVoicePolicy();

  expect(policy.pipeline).toEqual([
    'capture_opt_in',
    'transcribe',
    'show_transcript',
    'confirm_intent',
    'route_or_search',
    'optional_tts',
  ]);
  expect(policy.tts).toMatchObject({
    enabledByDefault: false,
    separateFromTranscription: true,
    lipSyncRequired: false,
  });
});

test('una sesión sin transcripción visible se rechaza', () => {
  const validation = validateNexoVoiceSession({
    activationMode: 'hold_button',
    captureSeconds: 8,
    transcriptVisible: false,
    textFallbackAvailable: true,
  });

  expect(validation.valid).toBe(false);
  expect(validation.reasons).toContain('missing_visible_transcript');
});

test('una sesión pasiva o demasiado larga se rechaza', () => {
  const validation = validateNexoVoiceSession({
    activationMode: 'wake_word',
    captureSeconds: 30,
    transcriptVisible: true,
    textFallbackAvailable: true,
  });

  expect(validation.valid).toBe(false);
  expect(validation.reasons).toEqual(
    expect.arrayContaining(['unsupported_activation', 'capture_too_long']),
  );
});

test('una sesión opt-in corta con respaldo textual se acepta', () => {
  const validation = validateNexoVoiceSession({
    activationMode: 'keyboard_hold',
    captureSeconds: 10,
    transcriptVisible: true,
    textFallbackAvailable: true,
  });

  expect(validation).toEqual({ valid: true, reasons: [] });
});
