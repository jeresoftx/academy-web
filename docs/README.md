# docs/

La plantilla de repositorio (RFC-0001 §15) reserva `docs/` para "capítulos en
Markdown, numerados". En los repos de curso eso es el contenido pedagógico.
`academy-web` no enseña un tema: es el sitio que presenta el contenido de los
demás repositorios. Aquí, `docs/` guarda en cambio documentación técnica
propia del sitio — decisiones de arquitectura, cómo funciona el sistema de
temas, cómo se integra el contenido de otros repos — a medida que existan.

Documentos actuales:

- [`visual-system.md`](./visual-system.md): dirección visual inicial del sitio,
  themes dark/light, sistema de ilustraciones, mascota animada y tamaños de
  assets.
- [`nexo-production.md`](./nexo-production.md): ficha 2D de producción de
  Nexo, con capas, paleta, estados y criterios para una futura animación Rive.
- [`nexo-interaction-contract.md`](./nexo-interaction-contract.md): contrato
  de interacción, navegación, accesibilidad y acciones permitidas para Nexo
  bibliotecario.
- [`nexo-local-conversation-evaluation.md`](./nexo-local-conversation-evaluation.md):
  evaluación de conversación local, límites operativos, benchmark reproducible y
  criterios para decidir si Nexo puede usar un modelo local en el futuro.
- [`nexo-3d/model-sheet.md`](./nexo-3d/model-sheet.md): biblia de modelo para
  reconstruir Nexo con fidelidad, despiece, niveles de detalle y criterios de
  revisión humana.
- [`nexo-3d/production-plan.md`](./nexo-3d/production-plan.md): puertas de
  producción desde la referencia hasta el modelo maestro, rig y derivado web.
- [`nexo-3d/technical-contract.md`](./nexo-3d/technical-contract.md): contrato
  que separa la fuente maestra de alta fidelidad del GLB optimizado para web.
- [`../assets/mascot/nexo-master.svg`](../assets/mascot/nexo-master.svg): arte
  maestro vectorial preparado para importar y riggear en Rive.
