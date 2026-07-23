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
- [`nexo-3d/model-sheet.md`](./nexo-3d/model-sheet.md): ficha canónica para
  traducir el arte aprobado de Nexo a modelado 3D, pendiente de revisión humana.
- [`nexo-3d/technical-contract.md`](./nexo-3d/technical-contract.md): contrato
  de producción Blender a GLB, presupuesto y reglas de entrega web de Nexo.
- [`../assets/mascot/nexo-master.svg`](../assets/mascot/nexo-master.svg): arte
  maestro vectorial preparado para importar y riggear en Rive.
