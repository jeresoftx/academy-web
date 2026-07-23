export type NexoConversationIntent =
  'greeting' | 'navigate' | 'search' | 'clarify';

export type NexoForbiddenCapability =
  'network_access' | 'file_system_access' | 'write_actions' | 'github_actions';

export interface NexoConversationPolicy {
  maxTurnsPerSession: number;
  maxSentencesPerReply: number;
  allowedIntents: NexoConversationIntent[];
  forbiddenCapabilities: NexoForbiddenCapability[];
  sessionStorage: 'ephemeral';
  requiresHumanDecisionBeforeEndpoint: true;
}

export interface NexoConversationDraft {
  intent: string;
  reply: string;
  requestedCapabilities?: string[];
}

export interface NexoConversationValidation {
  valid: boolean;
  reasons: string[];
}

const POLICY: NexoConversationPolicy = {
  maxTurnsPerSession: 3,
  maxSentencesPerReply: 2,
  allowedIntents: ['greeting', 'navigate', 'search', 'clarify'],
  forbiddenCapabilities: [
    'network_access',
    'file_system_access',
    'write_actions',
    'github_actions',
  ],
  sessionStorage: 'ephemeral',
  requiresHumanDecisionBeforeEndpoint: true,
};

export function buildNexoConversationPolicy(): NexoConversationPolicy {
  return {
    ...POLICY,
    allowedIntents: [...POLICY.allowedIntents],
    forbiddenCapabilities: [...POLICY.forbiddenCapabilities],
  };
}

export function validateNexoConversationDraft(
  draft: NexoConversationDraft,
  policy = buildNexoConversationPolicy(),
): NexoConversationValidation {
  const reasons: string[] = [];

  if (!policy.allowedIntents.includes(draft.intent as NexoConversationIntent)) {
    reasons.push('unsupported_intent');
  }

  if (countSentences(draft.reply) > policy.maxSentencesPerReply) {
    reasons.push('too_many_sentences');
  }

  draft.requestedCapabilities?.forEach((capability) => {
    if (
      policy.forbiddenCapabilities.includes(
        capability as NexoForbiddenCapability,
      )
    ) {
      reasons.push(`forbidden_capability:${capability}`);
    }
  });

  return {
    valid: reasons.length === 0,
    reasons,
  };
}

function countSentences(reply: string): number {
  return reply
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean).length;
}
