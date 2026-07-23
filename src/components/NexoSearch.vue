<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import {
  sanitizeSearchQuery,
  searchNexoNavigationEntries,
} from '@/lib/nexo/navigation';

const query = ref('');

const results = computed(() =>
  query.value.length > 0 ? searchNexoNavigationEntries(query.value, 8) : [],
);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  query.value = sanitizeSearchQuery(params.get('q') ?? '');
});

function submitSearch() {
  query.value = sanitizeSearchQuery(query.value);

  const params = new URLSearchParams();

  if (query.value.length > 0) {
    params.set('q', query.value);
  }

  const href = params.toString() ? `/search/?${params.toString()}` : '/search/';
  window.history.pushState(null, '', href);
}
</script>

<template>
  <form
    class="search-form"
    action="/search/"
    method="get"
    @submit.prevent="submitSearch"
  >
    <label for="academy-search">Buscar cursos, capítulos o temas</label>
    <div>
      <input
        id="academy-search"
        v-model="query"
        name="q"
        type="search"
        placeholder="Ej. sliding window, grafos, patrones"
      />
      <button type="submit">Buscar</button>
    </div>
  </form>

  <section class="results-section" aria-live="polite">
    <div v-if="query.length > 0" class="results-heading">
      <p class="system-line">Consulta</p>
      <h2>{{ query }}</h2>
    </div>
    <div v-else class="results-heading">
      <p class="system-line">Punto de partida</p>
      <h2>Escribe un tema para explorar el catálogo publicado.</h2>
    </div>

    <ol v-if="results.length > 0" class="result-list">
      <li v-for="result in results" :key="result.href">
        <a :href="result.href">
          <span>{{ result.type === 'course' ? 'Curso' : 'Capítulo' }}</span>
          <strong>{{ result.title }}</strong>
          <p v-if="result.summary">{{ result.summary }}</p>
        </a>
      </li>
    </ol>

    <div v-else-if="query.length > 0" class="empty-state">
      <h2>No hay una ruta publicada para esta búsqueda.</h2>
      <p>
        El contenido puede existir como plan o repositorio, pero Nexo no inventa
        destinos. Cuando el capítulo se publique, aparecerá aquí.
      </p>
    </div>
  </section>
</template>

<style scoped>
.search-form {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.search-form label {
  color: var(--foreground);
  font-size: 0.9rem;
  font-weight: 800;
}

.search-form div {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.search-form input,
.search-form button {
  min-height: 50px;
  border: 1px solid var(--border);
  border-radius: 14px;
  font: inherit;
}

.search-form input {
  min-width: 0;
  padding: 0 16px;
  background: var(--card);
  color: var(--foreground);
}

.search-form button {
  padding: 0 22px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 800;
  cursor: pointer;
}

.results-section {
  display: grid;
  gap: 24px;
  margin-top: 56px;
}

.results-heading {
  display: grid;
  gap: 8px;
}

.system-line {
  margin: 0;
  color: var(--academy-gold);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.results-heading h2,
.empty-state h2 {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  line-height: 1.1;
  letter-spacing: 0;
}

.result-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.result-list a,
.empty-state {
  display: grid;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card);
  color: var(--foreground);
  text-decoration: none;
}

.result-list a {
  padding: 18px;
}

.result-list a:hover {
  border-color: var(--ring);
}

.result-list span {
  color: var(--academy-gold);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.result-list strong {
  color: var(--foreground);
  font-size: 1.2rem;
  line-height: 1.25;
}

.result-list p,
.empty-state p {
  margin: 0;
  color: var(--academy-readable-muted);
  line-height: 1.6;
}

.empty-state {
  padding: 24px;
}

@media (max-width: 760px) {
  .search-form div {
    grid-template-columns: 1fr;
  }

  .search-form button {
    width: 100%;
  }
}
</style>
