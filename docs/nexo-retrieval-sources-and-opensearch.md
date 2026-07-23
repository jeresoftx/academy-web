# Recuperación con fuentes y evaluación de OpenSearch

**Estado:** decisión técnica preliminar; requiere revisión humana antes de
incorporar infraestructura.

**Trazabilidad:** [issue #24](https://github.com/jeresoftx/academy-web/issues/24).

Nexo puede orientar mejor cuando encuentra fragmentos canónicos y muestra de
dónde salen. La fuente de verdad sigue siendo el contenido versionado del sitio y
los repositorios de curso; cualquier índice es reconstruible y secundario.

## Concepto

La recuperación con fuentes no consiste en "hacer que Nexo sepa más", sino en
darle fragmentos verificables para responder poco, citar bien y negarse cuando
no tenga evidencia suficiente.

## Problema

OpenSearch, RAG o búsqueda híbrida agregan operación real: almacenamiento,
actualización incremental, relevancia, latencia, coste, monitoreo y recuperación
ante fallas. Si se incorporan antes de tener suficiente contenido, pueden
complicar el sitio sin mejorar el aprendizaje.

## Alternativas

1. **Búsqueda estática y determinista.** Es suficiente para la primera etapa:
   cursos, capítulos y temas publicados.
2. **Índice local derivado.** Permite fragmentos y citas sin operar un servicio
   externo.
3. **OpenSearch o búsqueda híbrida.** Se reserva para cuando el volumen y la
   latencia lo justifiquen con datos.

La ruta aprobada es progresiva: primero índice estático; después índice local
derivado; por último OpenSearch si los umbrales lo justifican.

## Política ejecutable

La política vive en `src/lib/nexo/retrieval-policy.ts`.

| Dimensión     | Regla                                                 |
| ------------- | ----------------------------------------------------- |
| Fragmento     | Máximo 220 palabras.                                  |
| Solape        | 35 palabras entre fragmentos cercanos.                |
| Metadatos     | `sourcePath`, `title`, `courseSlug`, `updatedAt`.     |
| Citas         | Obligatorias para responder.                          |
| Score mínimo  | Promedio de relevancia igual o mayor a `0.70`.        |
| Sin fuente    | Nexo se niega y ofrece búsqueda segura.               |
| Fuente verdad | Markdown, datos del sitio y repositorios versionados. |
| Índice        | Reconstruible; nunca fuente primaria.                 |

## Metadatos de fragmento

Cada fragmento candidato debe conservar:

```json
{
  "id": "algorithms/sliding-window#concepto",
  "sourcePath": "src/data/lessons.ts",
  "title": "Sliding Window: pensar en ventanas, no en ciclos",
  "courseSlug": "algorithms",
  "chapterSlug": "sliding-window",
  "section": "concepto",
  "updatedAt": "2026-07-23"
}
```

Si no existe `sourcePath`, Nexo no puede presentar el fragmento como evidencia.

## Política de respuesta

Nexo puede responder solo si:

- tiene al menos una cita;
- el promedio de relevancia supera el umbral;
- la respuesta cabe en una explicación breve;
- la cita apunta a contenido canónico;
- no contradice el contrato de interacción.

Si no se cumplen esas condiciones, Nexo debe decir que no encontró fuente
suficiente y ofrecer `/search/?q=...` como ruta segura.

## Umbrales para evaluar OpenSearch

OpenSearch se evalúa cuando todos estos umbrales se cumplan al mismo tiempo:

| Señal                 | Umbral inicial |
| --------------------- | -------------- |
| Documentos indexados  | 1,000          |
| Búsquedas mensuales   | 20,000         |
| Latencia p95 estática | 1,500 ms       |
| Índice estático       | 128 MB         |

Estos números no autorizan OpenSearch por sí mismos. Solo justifican crear un
issue de evaluación con costo, operación, despliegue, monitoreo y rollback.

## Estimación operativa inicial

| Opción            | Almacenamiento | Latencia | Operación  | Costo      |
| ----------------- | -------------- | -------- | ---------- | ---------- |
| Búsqueda estática | Bajo           | Muy baja | Mínima     | Nulo       |
| Índice local      | Medio          | Baja     | Baja       | Nulo       |
| OpenSearch        | Alto           | Variable | Media/alta | Recurrente |

La decisión humana debe registrar por qué el costo operativo vale la pena. Si el
contenido sigue cabiendo en un índice local, OpenSearch no se agrega.

## Actualización incremental

Una futura ingestión debe:

- reconstruirse desde archivos versionados;
- invalidar fragmentos por `sourcePath`;
- registrar fecha de generación;
- fallar cerrado cuando haya metadatos incompletos;
- poder ejecutarse localmente antes de publicar.

## Fuera de alcance

Este documento no incorpora OpenSearch, embeddings, vector store ni servicio de
RAG. Tampoco cambia la búsqueda estática actual. Solo fija la política mínima y
los umbrales para decidir con evidencia.
