# Ficha 2D de producción: Nexo

**Estado:** dirección de producción aprobada para preparar arte vectorial; el
archivo `.riv` final sigue sujeto a revisión humana.

## Concepto

Nexo es un compañero de taller modular. Acompaña el aprendizaje con una
silueta amable y precisa: observa, piensa, señala y celebra sin competir con el
contenido ni hablar por la persona que estudia.

## Problema

El concept art aprobado define su carácter, pero no se puede animar ni cargar
directamente en el sitio: usa detalle y sombreado propios de una lámina
editorial. Rive necesita piezas separadas, una paleta limitada y reglas claras
para cada expresión.

## Alternativas

1. Animar la lámina 3D. Conserva el acabado, pero aumenta el peso y hace
   difícil reutilizar las partes.
2. Usar el prototipo Lottie indefinidamente. Es funcional, pero no representa
   todavía la dirección visual aprobada.
3. Construir una ficha 2D de producción. Reduce el arte a capas animables sin
   perder la identidad del personaje.

## Decisión

Adoptar la tercera alternativa. La lámina
[`assets/nexo-production-sheet-01.png`](./assets/nexo-production-sheet-01.png)
es referencia de vistas, poses y expresiones. El futuro asset web se dibujará
en vectores independientes; no se exportará esta imagen como animación ni se
cargará a las personas visitantes.

## Identidad no negociable

- Cabeza de visor redondeado, más ancha que el torso.
- Dos ojos dorados y una boca visible dentro del visor.
- Antena superior con dos nodos conectados, como un pequeño grafo.
- Torso compacto con un núcleo circular amarillo.
- Brazos y piernas cortos con articulaciones claras y silueta legible.
- Carácter: compañero de oficio, sereno, curioso y confiable; nunca una
  recompensa infantil ni un asistente que dicta decisiones.

## Paleta

La paleta reutiliza los tokens existentes del sitio.

| Rol                      | Token            | Color     |
| ------------------------ | ---------------- | --------- |
| Fondo y sombra profunda  | `--academy-ink`  | `#0a0907` |
| Material principal       | grafito mate     | `#27241f` |
| Plano iluminado          | marfil           | `#f5efe6` |
| Acento y energía         | `--academy-sun`  | `#ffd21a` |
| Brillo cálido secundario | `--academy-gold` | `#d99a32` |

El amarillo solar es el único color saturado. No se usarán degradados
multicolor, LEDs azules ni brillos constantes.

## Artboard y capas

El artboard base será de `256 × 256 px`, con una zona segura de `16 px`. Se
exportará como vectores nativos de Rive, no como una textura raster.

| Grupo   | Capas separadas                               |
| ------- | --------------------------------------------- |
| Sombra  | sombra de contacto, halo del núcleo           |
| Antena  | base, brazo, nodo izquierdo, nodo derecho     |
| Cabeza  | carcasa, visor, ojos, cejas, boca             |
| Torso   | carcasa, paneles, núcleo, icono del núcleo    |
| Brazos  | hombro, brazo, antebrazo, mano para cada lado |
| Piernas | cadera, muslo, pierna, pie para cada lado     |

La boca, las cejas y el icono del núcleo no se fusionan con el visor o el
torso: son capas intercambiables. Esto permite cambiar expresión y señal sin
redibujar el cuerpo.

## Estados visuales

| Estado       | Pose                    | Rostro        | Núcleo       |
| ------------ | ----------------------- | ------------- | ------------ |
| Reposo       | balanceo mínimo         | sonrisa suave | ramificación |
| Atención     | cabeza inclinada        | admiración    | destello     |
| Pensamiento  | mano cerca del visor    | concentración | ramificación |
| Señalamiento | brazo extendido         | alerta        | aviso        |
| Celebración  | ambos brazos arriba     | risa          | destello     |
| Frío         | hombros recogidos       | temblor breve | copo         |
| Calor        | mano separada del torso | alivio        | sol          |
| Cansancio    | postura baja            | línea suave   | luna         |

Las expresiones son lenguaje escénico, no una afirmación de emociones reales,
conciencia o autonomía decisoria.

## Movimiento y rendimiento

- Los cambios de núcleo duran entre `180` y `420 ms`.
- El reposo usa una sola respiración sutil, seguida de pausa amplia.
- No hay movimiento infinito, parpadeo rápido ni recompensas visuales.
- Con `prefers-reduced-motion`, se muestra la pose estática y no se ejecutan
  transiciones.
- El archivo `.riv` debe aspirar a `100–300 KB` y no superar `500 KB` sin una
  justificación escrita y revisión humana.

## Entregables y revisión

1. La lámina de referencia actual conserva la identidad aprobada.
2. La siguiente persona artista crea el archivo fuente editable de Rive con las
   capas anteriores.
3. Se revisan legibilidad a `112 px`, contraste en themes dark/light,
   `prefers-reduced-motion`, peso y ausencia de texto integrado.
4. Solo después se sustituye el prototipo Lottie en el sitio mediante un issue
   y un PR independiente.
