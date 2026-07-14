<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Sun, Moon, Monitor } from '@lucide/vue';
import { Button } from '@/components/ui/button';

// Añadir un tema nuevo: una entrada aquí + su bloque de variables CSS en
// global.css. El script de Layout.astro decide luz/oscuro para "system"
// leyendo prefers-color-scheme; los demás temas se aplican tal cual.
const THEMES = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
] as const;

type Theme = (typeof THEMES)[number]['value'];

const STORAGE_KEY = 'academy-theme';
const current = ref<Theme>('system');
const isReady = ref(false);

function apply(theme: Theme) {
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

function setTheme(theme: Theme) {
  current.value = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  apply(theme);
}

onMounted(() => {
  current.value =
    (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
  isReady.value = true;
});
</script>

<template>
  <div
    class="flex items-center gap-1"
    role="group"
    aria-label="Selector de tema"
  >
    <Button
      v-for="theme in THEMES"
      :key="theme.value"
      :variant="current === theme.value ? 'default' : 'ghost'"
      size="icon"
      :disabled="!isReady"
      :aria-pressed="current === theme.value"
      :aria-label="theme.label"
      @click="setTheme(theme.value)"
    >
      <component :is="theme.icon" class="size-4" />
    </Button>
  </div>
</template>
