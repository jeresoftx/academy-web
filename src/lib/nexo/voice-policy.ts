export type NexoVoiceActivationMode = 'hold_button' | 'keyboard_hold';

export type NexoVoicePipelineStep =
  | 'capture_opt_in'
  | 'transcribe'
  | 'show_transcript'
  | 'confirm_intent'
  | 'route_or_search'
  | 'optional_tts';

export interface NexoVoicePolicy {
  activationModes: NexoVoiceActivationMode[];
  maxCaptureSeconds: number;
  requiresVisibleTranscript: boolean;
  requiresTextFallback: boolean;
  passiveListening: false;
  discardAudioAfterTranscription: true;
  pipeline: NexoVoicePipelineStep[];
  tts: {
    enabledByDefault: boolean;
    separateFromTranscription: boolean;
    lipSyncRequired: boolean;
  };
}

export interface NexoVoiceSession {
  activationMode: string;
  captureSeconds: number;
  transcriptVisible: boolean;
  textFallbackAvailable: boolean;
}

export interface NexoVoiceValidation {
  valid: boolean;
  reasons: string[];
}

const VOICE_POLICY: NexoVoicePolicy = {
  activationModes: ['hold_button', 'keyboard_hold'],
  maxCaptureSeconds: 15,
  requiresVisibleTranscript: true,
  requiresTextFallback: true,
  passiveListening: false,
  discardAudioAfterTranscription: true,
  pipeline: [
    'capture_opt_in',
    'transcribe',
    'show_transcript',
    'confirm_intent',
    'route_or_search',
    'optional_tts',
  ],
  tts: {
    enabledByDefault: false,
    separateFromTranscription: true,
    lipSyncRequired: false,
  },
};

export function buildNexoVoicePolicy(): NexoVoicePolicy {
  return {
    ...VOICE_POLICY,
    activationModes: [...VOICE_POLICY.activationModes],
    pipeline: [...VOICE_POLICY.pipeline],
    tts: { ...VOICE_POLICY.tts },
  };
}

export function validateNexoVoiceSession(
  session: NexoVoiceSession,
  policy = buildNexoVoicePolicy(),
): NexoVoiceValidation {
  const reasons: string[] = [];

  if (
    !policy.activationModes.includes(
      session.activationMode as NexoVoiceActivationMode,
    )
  ) {
    reasons.push('unsupported_activation');
  }

  if (session.captureSeconds > policy.maxCaptureSeconds) {
    reasons.push('capture_too_long');
  }

  if (policy.requiresVisibleTranscript && !session.transcriptVisible) {
    reasons.push('missing_visible_transcript');
  }

  if (policy.requiresTextFallback && !session.textFallbackAvailable) {
    reasons.push('missing_text_fallback');
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
