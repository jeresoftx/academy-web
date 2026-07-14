<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  readChapterProgress,
  writeChapterProgress,
} from '@/lib/progress/local-progress';
import type { CourseSlug } from '@/lib/progress/types';

const props = defineProps<{
  courseSlug: CourseSlug;
  chapterSlug: string;
}>();

const completed = ref(false);

onMounted(() => {
  completed.value =
    readChapterProgress({
      courseSlug: props.courseSlug,
      chapterSlug: props.chapterSlug,
    })?.state === 'completed';
});

function toggleCompletion() {
  completed.value = !completed.value;
  writeChapterProgress({
    courseSlug: props.courseSlug,
    chapterSlug: props.chapterSlug,
    state: completed.value ? 'completed' : 'in_progress',
  });
}
</script>

<template>
  <button
    class="progress-toggle"
    :class="{ 'is-completed': completed }"
    type="button"
    :aria-pressed="completed"
    @click="toggleCompletion"
  >
    {{ completed ? 'Completado' : 'Marcar como completado' }}
  </button>
</template>

<style scoped>
.progress-toggle {
  min-height: 42px;
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--academy-gold) 18%, var(--card));
  color: var(--foreground);
  padding: 0 14px;
  font-weight: 780;
  line-height: 1.15;
  cursor: pointer;
}

.progress-toggle:hover {
  border-color: color-mix(in srgb, var(--academy-gold) 64%, transparent);
}

.progress-toggle.is-completed {
  border-color: var(--academy-sun);
  background: var(--academy-sun);
  color: var(--academy-ink);
}
</style>
