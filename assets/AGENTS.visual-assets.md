# Instrucciones para agentes — Assets visuales

Cuando una tarea esté relacionada con imágenes de Jeresoft Academy:

1. Usa `.agents/skills/jeresoft-visual-designer/SKILL.md`.
2. Conserva la identidad definida en `config/academy-brand.json`.
3. Lee o crea `courses/<course>/art-direction.md` antes de escribir prompts.
4. Empieza por historia visual: concepto, metáfora, escena, storyboard y layout.
5. No generes una sola imagen con varios tamaños.
6. Crea un prompt independiente para cada formato.
7. Guarda arte base sin texto en `generated/`.
8. Compón el copy aprobado en `export/` cuando el asset final lo requiera.
9. Prefiere overlays controlados; no pidas al modelo de imagen que renderice el
   texto final salvo que el usuario lo pida como prueba.
10. Guarda únicamente archivos aprobados en `export/`.
11. Valida `export/` y copia los PNG aprobados a
    `public/assets/illustrations/courses/<course>/`.
12. No crees ZIP salvo que el usuario lo pida explícitamente.
13. Nunca simules que una imagen o ZIP existe si no fue creado.
