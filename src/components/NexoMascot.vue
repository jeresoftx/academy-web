<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import type { AnimationItem } from 'lottie-web';
import {
  CloudRain,
  Eye,
  GitBranch,
  MoonStar,
  Snowflake,
  Sparkles,
  SunMedium,
  TriangleAlert,
} from '@lucide/vue';
import animationData from '@/animations/nexo.json';

const STATES = [
  { key: 'idle', label: 'Reposo', segment: [0, 59] },
  { key: 'attention', label: 'Atención', segment: [60, 119] },
  { key: 'thinking', label: 'Pensando', segment: [120, 179] },
  { key: 'pointing', label: 'Señalando', segment: [180, 239] },
  { key: 'celebrating', label: 'Celebrando', segment: [240, 299] },
] as const;

const EXPRESSIONS = [
  'admiracion',
  'risa',
  'enojo',
  'tristeza',
  'miedo',
  'frio',
  'calor',
  'cansancio',
] as const;

const CORE_ICONS = [
  'branch',
  'sparkles',
  'alert',
  'rain',
  'eye',
  'snowflake',
  'sun',
  'moon',
] as const;

const AMBIENT_ACTIONS = [
  { state: 'attention', expression: 'admiracion', coreIcon: 'sparkles' },
  { state: 'celebrating', expression: 'risa', coreIcon: 'sparkles' },
  { state: 'pointing', expression: 'enojo', coreIcon: 'alert' },
  { state: 'idle', expression: 'tristeza', coreIcon: 'rain' },
  { state: 'attention', expression: 'miedo', coreIcon: 'eye' },
  { state: 'thinking', expression: 'frio', coreIcon: 'snowflake' },
  { state: 'celebrating', expression: 'calor', coreIcon: 'sun' },
  { state: 'idle', expression: 'cansancio', coreIcon: 'moon' },
] as const;

const POSITION_KEY = 'jeresoft-academy:nexo-position';
const VIEWPORT_MARGIN = 20;
const FALLBACK_WIDGET_SIZE = 132;
const MIN_ACTION_DELAY = 9_000;
const MAX_ACTION_DELAY = 18_000;

type NexoState = (typeof STATES)[number]['key'];
type NexoExpression = (typeof EXPRESSIONS)[number];
type NexoCoreIcon = (typeof CORE_ICONS)[number];

interface Position {
  x: number;
  y: number;
}

interface RelativePosition {
  x: number;
  y: number;
}

interface StoredRelativePosition {
  relativeX: number;
  relativeY: number;
}

const container = ref<HTMLDivElement | null>(null);
const widget = ref<HTMLElement | null>(null);
const currentState = ref<NexoState>('thinking');
const expression = ref<NexoExpression>('admiracion');
const coreIcon = ref<NexoCoreIcon>('branch');
const position = ref<Position>({ x: 0, y: 0 });
const relativePosition = ref<RelativePosition>({ x: 1, y: 1 });
const isDragging = ref(false);
const isReady = ref(false);
const reducedMotion = ref(false);

let animation: AnimationItem | null = null;
let mediaQuery: MediaQueryList | null = null;
let pointerOffset: Position | null = null;
let actionTimer: ReturnType<typeof setTimeout> | null = null;

const widgetStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  visibility: isReady.value ? 'visible' : 'hidden',
}));

function segmentFor(state: NexoState) {
  return STATES.find((item) => item.key === state)?.segment ?? [0, 59];
}

function play(
  state: NexoState,
  nextExpression = expression.value,
  nextCoreIcon = coreIcon.value,
) {
  currentState.value = state;
  expression.value = nextExpression;
  coreIcon.value = nextCoreIcon;

  if (!animation) {
    return;
  }

  const [start, end] = segmentFor(state);
  animation.goToAndStop(start, true);

  if (!reducedMotion.value) {
    animation.playSegments([start, end], true);
  }
}

function updateMotionPreference(event: MediaQueryListEvent | MediaQueryList) {
  reducedMotion.value = event.matches;
  play(currentState.value);
  scheduleAction();
}

function clearActionTimer() {
  if (actionTimer) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }
}

function scheduleAction() {
  clearActionTimer();

  if (reducedMotion.value) {
    return;
  }

  const delay =
    MIN_ACTION_DELAY + Math.random() * (MAX_ACTION_DELAY - MIN_ACTION_DELAY);

  actionTimer = setTimeout(() => {
    const availableActions = AMBIENT_ACTIONS.filter(
      (action) => action.expression !== expression.value,
    );
    const nextAction =
      availableActions[Math.floor(Math.random() * availableActions.length)];

    play(nextAction.state, nextAction.expression, nextAction.coreIcon);
    scheduleAction();
  }, delay);
}

function isValidPosition(value: unknown): value is Position {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Position;
  return Number.isFinite(candidate.x) && Number.isFinite(candidate.y);
}

function isStoredRelativePosition(
  value: unknown,
): value is StoredRelativePosition {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as StoredRelativePosition;
  return (
    Number.isFinite(candidate.relativeX) && Number.isFinite(candidate.relativeY)
  );
}

function viewportBounds() {
  const width = widget.value?.offsetWidth ?? FALLBACK_WIDGET_SIZE;
  const height = widget.value?.offsetHeight ?? FALLBACK_WIDGET_SIZE;
  const maxX = Math.max(
    VIEWPORT_MARGIN,
    window.innerWidth - width - VIEWPORT_MARGIN,
  );
  const maxY = Math.max(
    VIEWPORT_MARGIN,
    window.innerHeight - height - VIEWPORT_MARGIN,
  );

  return {
    minX: VIEWPORT_MARGIN,
    minY: VIEWPORT_MARGIN,
    maxX,
    maxY,
    rangeX: Math.max(0, maxX - VIEWPORT_MARGIN),
    rangeY: Math.max(0, maxY - VIEWPORT_MARGIN),
  };
}

function clampPosition(candidate: Position): Position {
  const { minX, minY, maxX, maxY } = viewportBounds();

  return {
    x: Math.min(Math.max(candidate.x, minX), maxX),
    y: Math.min(Math.max(candidate.y, minY), maxY),
  };
}

function clampRelativePosition(candidate: RelativePosition): RelativePosition {
  return {
    x: Math.min(Math.max(candidate.x, 0), 1),
    y: Math.min(Math.max(candidate.y, 0), 1),
  };
}

function positionFromRelative(candidate: RelativePosition): Position {
  const relative = clampRelativePosition(candidate);
  const { minX, minY, rangeX, rangeY } = viewportBounds();

  return {
    x: minX + relative.x * rangeX,
    y: minY + relative.y * rangeY,
  };
}

function relativeFromPosition(candidate: Position): RelativePosition {
  const positionInViewport = clampPosition(candidate);
  const { minX, minY, rangeX, rangeY } = viewportBounds();

  return {
    x: rangeX === 0 ? 1 : (positionInViewport.x - minX) / rangeX,
    y: rangeY === 0 ? 1 : (positionInViewport.y - minY) / rangeY,
  };
}

function setPosition(candidate: Position) {
  position.value = clampPosition(candidate);
  relativePosition.value = relativeFromPosition(position.value);
}

function savePosition() {
  localStorage.setItem(
    POSITION_KEY,
    JSON.stringify({
      relativeX: relativePosition.value.x,
      relativeY: relativePosition.value.y,
    }),
  );
}

function moveNexo(event: PointerEvent) {
  if (!pointerOffset) {
    return;
  }

  setPosition({
    x: event.clientX - pointerOffset.x,
    y: event.clientY - pointerOffset.y,
  });
}

function stopDragging() {
  if (!pointerOffset) {
    return;
  }

  pointerOffset = null;
  isDragging.value = false;
  savePosition();
  window.removeEventListener('pointermove', moveNexo);
  window.removeEventListener('pointerup', stopDragging);
  window.removeEventListener('pointercancel', stopDragging);
}

function startDragging(event: PointerEvent) {
  if (!event.isPrimary) {
    return;
  }

  event.preventDefault();
  pointerOffset = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y,
  };
  isDragging.value = true;
  window.addEventListener('pointermove', moveNexo);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
}

function keepNexoInViewport() {
  position.value = positionFromRelative(relativePosition.value);
  savePosition();
}

onMounted(async () => {
  if (!container.value) {
    return;
  }

  const { default: lottie } = await import('lottie-web');
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', updateMotionPreference);

  animation = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  });

  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  try {
    const stored = JSON.parse(localStorage.getItem(POSITION_KEY) ?? 'null');

    if (isStoredRelativePosition(stored)) {
      relativePosition.value = clampRelativePosition({
        x: stored.relativeX,
        y: stored.relativeY,
      });
      position.value = positionFromRelative(relativePosition.value);
    } else if (isValidPosition(stored)) {
      setPosition(stored);
      savePosition();
    } else {
      position.value = positionFromRelative(relativePosition.value);
    }
  } catch {
    position.value = positionFromRelative(relativePosition.value);
  }

  isReady.value = true;
  window.addEventListener('resize', keepNexoInViewport);
  play(currentState.value);
  scheduleAction();
});

onBeforeUnmount(() => {
  clearActionTimer();
  mediaQuery?.removeEventListener('change', updateMotionPreference);
  window.removeEventListener('resize', keepNexoInViewport);
  stopDragging();
  animation?.destroy();
});
</script>

<template>
  <aside
    ref="widget"
    class="nexo"
    :class="{ 'is-dragging': isDragging }"
    :style="widgetStyle"
    role="region"
    aria-label="Mascota Nexo"
    title="Arrastra a Nexo para cambiar su posición"
    @pointerdown="startDragging"
  >
    <div class="nexo-stage" aria-hidden="true">
      <div ref="container" class="nexo-animation" />
      <span class="nexo-mouth" :data-expression="expression" />
      <span :key="coreIcon" class="nexo-core" :data-icon="coreIcon">
        <GitBranch v-if="coreIcon === 'branch'" />
        <Sparkles v-else-if="coreIcon === 'sparkles'" />
        <TriangleAlert v-else-if="coreIcon === 'alert'" />
        <CloudRain v-else-if="coreIcon === 'rain'" />
        <Eye v-else-if="coreIcon === 'eye'" />
        <Snowflake v-else-if="coreIcon === 'snowflake'" />
        <SunMedium v-else-if="coreIcon === 'sun'" />
        <MoonStar v-else />
      </span>
    </div>
  </aside>
</template>

<style scoped>
.nexo {
  position: fixed;
  z-index: 40;
  width: 132px;
  height: 132px;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.nexo.is-dragging {
  cursor: grabbing;
}

.nexo-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.nexo-animation {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 12px rgb(10 9 7 / 18%));
}

.nexo-mouth {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 20px;
  height: 10px;
  border: 3px solid var(--academy-sun);
  border-top: 0;
  border-radius: 0 0 18px 18px;
  transform: translate(-50%, -50%);
  transition:
    width 180ms ease,
    height 180ms ease,
    border-radius 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.nexo-mouth[data-expression='admiracion'] {
  width: 13px;
  height: 16px;
  border: 3px solid var(--academy-sun);
  border-radius: 50%;
}

.nexo-mouth[data-expression='risa'] {
  width: 28px;
  height: 14px;
  border: 3px solid var(--academy-sun);
  border-top: 0;
  border-radius: 0 0 20px 20px;
  background: var(--academy-ink);
}

.nexo-mouth[data-expression='enojo'] {
  width: 25px;
  height: 9px;
  border: 3px solid var(--academy-sun);
  border-bottom: 0;
  border-radius: 20px 20px 0 0;
  transform: translate(-50%, -35%);
}

.nexo-mouth[data-expression='tristeza'] {
  width: 23px;
  height: 9px;
  border: 3px solid var(--academy-sun);
  border-bottom: 0;
  border-radius: 20px 20px 0 0;
}

.nexo-mouth[data-expression='miedo'] {
  width: 15px;
  height: 21px;
  border: 3px solid var(--academy-sun);
  border-radius: 50%;
  background: var(--academy-ink);
}

.nexo-mouth[data-expression='frio'] {
  width: 27px;
  height: 7px;
  border: 3px solid var(--academy-sun);
  border-radius: 4px;
}

.nexo-mouth[data-expression='calor'] {
  width: 17px;
  height: 17px;
  border: 3px solid var(--academy-sun);
  border-radius: 50%;
  background: var(--academy-sun);
}

.nexo-mouth[data-expression='cansancio'] {
  width: 18px;
  height: 3px;
  border: 0;
  border-radius: 3px;
  background: var(--academy-sun);
}

.nexo-core {
  position: absolute;
  top: 64%;
  left: 50%;
  display: grid;
  width: 27px;
  height: 27px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--academy-sun) 72%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--academy-sun) 20%, transparent);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--academy-ink) 72%, transparent),
    0 0 12px color-mix(in srgb, var(--academy-sun) 42%, transparent);
  color: var(--academy-sun);
  transform: translate(-50%, -50%);
  animation: core-signal 420ms ease-out;
}

.nexo-core :deep(svg) {
  width: 15px;
  height: 15px;
  stroke-width: 2.35;
}

@keyframes core-signal {
  0% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(0.65);
  }

  62% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.13);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nexo-core {
    animation: none;
  }
}

@media (max-width: 560px) {
  .nexo {
    width: 112px;
    height: 112px;
  }
}
</style>
