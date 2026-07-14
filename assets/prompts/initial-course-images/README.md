# Prompts iniciales de imagenes de curso

Este paquete contiene prompts listos para pedir a ChatGPT Images / GPT Image
las primeras imagenes de apoyo grafico para Jeresoft Academy:

- `01-algoritmos.md`
- `02-system-design.md`
- `03-patrones-diseno.md`

## Tamano solicitado

Pedir cada imagen como:

```text
1600x900, horizontal 16:9, alta calidad
```

Ese es el tamano maestro para `course-cover` definido en
`docs/visual-system.md`.

## Donde guardar las imagenes

Guardar los masters generados aqui:

```text
assets/illustrations/courses/algorithms/course-cover.dark.png
assets/illustrations/courses/system-design/course-cover.dark.png
assets/illustrations/courses/design-patterns/course-cover.dark.png
```

Cuando se exporten versiones optimizadas para el sitio, guardarlas aqui:

```text
public/illustrations/courses/algorithms/course-cover.webp
public/illustrations/courses/system-design/course-cover.webp
public/illustrations/courses/design-patterns/course-cover.webp
```

Si despues se generan variantes light, usar:

```text
assets/illustrations/courses/algorithms/course-cover.light.png
assets/illustrations/courses/system-design/course-cover.light.png
assets/illustrations/courses/design-patterns/course-cover.light.png
```

## Regla de produccion

La imagen generada no debe traer el texto final del sitio. El texto principal
se agrega en HTML/CSS o en Canva para piezas sociales. En la imagen solo se
permiten etiquetas tecnicas pequenas si ayudan a la escena.

Flujo:

```text
Claude -> guion
ChatGPT -> escena y prompts
GPT Image -> imagen
Canva -> ajustes minimos
Revision humana -> publicar
```
