<template>
  <aside class="github-auth-prompt" aria-label="Guardar progreso">
    <p class="eyebrow">Progreso en la nube</p>
    <h2>Guardar progreso con GitHub</h2>
    <p>
      Puedes seguir estudiando sin cuenta. GitHub solo se usa para sincronizar
      progreso, insignias y futuras entregas.
    </p>
    <a class="github-button" href="/auth/github">Continuar con GitHub</a>
  </aside>
</template>

<style scoped>
.github-auth-prompt {
  display: grid;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  padding: 16px;
}

.eyebrow {
  margin: 0;
  color: var(--academy-gold);
  font-family:
    SFMono-Regular,
    Cascadia Code,
    JetBrains Mono,
    ui-monospace,
    monospace;
  font-size: 11px;
  font-weight: 820;
  letter-spacing: 0;
  text-transform: uppercase;
}

h2,
p {
  margin: 0;
}

h2 {
  font-size: 18px;
  line-height: 1.1;
}

p {
  color: var(--academy-readable-muted);
  line-height: 1.5;
}

.github-button {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--academy-ink);
  color: var(--academy-sun);
  padding: 0 14px;
  font-weight: 780;
  text-decoration: none;
}

.github-button:hover {
  background: color-mix(in srgb, var(--academy-ink) 88%, var(--academy-sun));
}
</style>
