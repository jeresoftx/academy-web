# Biblia de modelo: Nexo 3D

**Estado:** propuesta de producción v2; requiere revisión humana antes de
reiniciar el blockout.

**Trazabilidad:** [issue #27](https://github.com/jeresoftx/academy-web/issues/27)
del Project de Nexo. Esta biblia sustituye la lectura simplificada anterior de
la cabeza. No modifica las decisiones del Manual Fundacional RFC-0001.

## Propósito

Nexo debe poder sostener una cámara de render cercana sin perder el carácter
del arte aprobado. El objetivo no es producir un robot genérico inspirado en
las láminas: es reconstruir una versión físicamente coherente de su diseño,
con sus ensamblajes, profundidad, materialidad y expresividad.

La identidad no se sacrifica por velocidad ni por el presupuesto del sitio. La
optimización web ocurre después, como un derivado del modelo maestro.

## Lectura de referencias

Las imágenes generadas no son planos ortográficos perfectos: cambian la luz,
la perspectiva y algún detalle fino entre poses. Por ello se establece una
jerarquía explícita. Una discrepancia no se resuelve por intuición durante el
modelado; se registra y se valida en revisión.

| Prioridad | Fuente                                                                   | Uso canónico                                                              |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| 1         | [`nexo-production-sheet-01.png`](../assets/nexo-production-sheet-01.png) | Anatomía, despiece, frente, perfil, reverso y módulos mecánicos.          |
| 2         | [`nexo-concept-01.png`](../assets/nexo-concept-01.png)                   | Carácter, expresiones, pose, iluminación editorial y estados del núcleo.  |
| 3         | Esta biblia                                                              | Resolución de contradicciones, escala, geometría y límites de producción. |

La meta de "idéntico al arte" significa idéntico a esta especificación canónica
aprobada, no copiar píxeles incompatibles de vistas con distinta perspectiva.

## Diagnóstico que corrige la ficha anterior

La descripción anterior de una "cabeza casi esférica aplastada" era
insuficiente. La cabeza de Nexo es una **carcasa hard-surface de volumen ancho
y redondeado**, formada por una envolvente superior, un marco frontal profundo
y una banda inferior continua. El visor está encastrado dentro de esa carcasa;
no es una esfera pegada ni la banda inferior es una mandíbula flotante.

El perfil muestra además módulos laterales concéntricos, una transición de
cuello corta, panel trasero de servicio y una antena ensamblada. Estas piezas
definen la lectura industrial y deben existir antes de juzgar la semejanza.

## Sistema de coordenadas y escala

- Unidad: metros; escala de escena `1.0`.
- Altura de presentación, de la planta de los pies a los nodos de antena:
  `1.00 m`.
- Origen: punto medio entre los pies sobre el plano `Z = 0`.
- Frente canónico: `-Y`; `Numpad 1` revisa frente, `Numpad 3` perfil derecho.
- Simetría: eje `X`; se modela el lado izquierdo y se refleja salvo donde una
  revisión apruebe una asimetría expresiva.

Las medidas siguientes son envolventes de revisión, no instrucciones para
escalar una esfera. Las proporciones mandan; una pieza puede ocupar menos
volumen interno si conserva el contorno externo aprobado.

| Conjunto           |  Ancho X | Profundidad Y |   Alto Z | Regla visual                                  |
| ------------------ | -------: | ------------: | -------: | --------------------------------------------- |
| Cabeza completa    | `0.54 m` |      `0.33 m` | `0.35 m` | Pesada, ancha, con base inferior contenida.   |
| Visor visible      | `0.40 m` |      `0.05 m` | `0.20 m` | Recesado, nunca pegado ni convexo como lente. |
| Torso completo     | `0.38 m` |      `0.29 m` | `0.25 m` | Más angosto que la cabeza; compacto.          |
| Núcleo visible     | `0.15 m` |      `0.04 m` | `0.15 m` | Disco independiente, centrado y reemplazable. |
| Antena sobre casco | `0.18 m` |      `0.08 m` | `0.12 m` | Base, mástil, horquilla y dos nodos.          |

## Arquitectura de piezas

Una pieza es independiente cuando afecta silueta, tiene una junta o material
distinto, requiere movimiento, debe recibir luz propia o necesita sustituirse
para una expresión. No se separa cada rayón ni cada remache: el despiece sirve
para construir, iluminar, animar y mantener el asset.

### A. Cabeza y rostro

| Identificador                              | Pieza                         | Tratamiento obligatorio                                                                                                 |
| ------------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `nexo_head_shell`                          | Envolvente superior y lateral | Casco redondeado hard-surface, con volumen continuo; no esfera ni cubo biselado como resultado final.                   |
| `nexo_head_lower_bezel`                    | Banda inferior del casco      | Se integra visualmente al casco, sostiene el borde bajo del visor y define la "quijada" sin leerse como plato separado. |
| `nexo_visor_bezel`                         | Marco frontal                 | Anillo grueso, redondeado y empotrado; genera sombra de oclusión alrededor del visor.                                   |
| `nexo_visor_inner`                         | Superficie negra interior     | Cavidad oscura con curvatura leve hacia dentro; conserva contraste bajo luz de estudio.                                 |
| `nexo_eye_l`, `nexo_eye_r`                 | Ojos luminosos                | Objetos independientes para orientación y estados.                                                                      |
| `nexo_brow_l`, `nexo_brow_r`, `nexo_mouth` | Rasgos expresivos             | Elementos independientes, delgados y sustituibles; no se hornean en el visor.                                           |
| `nexo_side_module_l`, `nexo_side_module_r` | Cápsulas laterales            | Ensamblajes concéntricos con carcasa, aro, disco central y transición al casco.                                         |
| `nexo_head_back_panel`                     | Panel posterior               | Placa de servicio con rejilla horizontal, marco y profundidad propia.                                                   |

La regla de lectura frontal es: casco exterior -> bisel profundo -> cavidad de
visor -> rasgos luminosos. Si dos pasos se fusionan visualmente, el modelo no
está listo para detalle.

### B. Antena y cuello

| Identificador                                | Pieza              | Tratamiento obligatorio                                       |
| -------------------------------------------- | ------------------ | ------------------------------------------------------------- |
| `nexo_antenna_base`                          | Base sobre casco   | Disco corto y empotrado, no varilla saliendo de una esfera.   |
| `nexo_antenna_stem`                          | Mástil articulado  | Tramos mecánicos cortos con juntas legibles.                  |
| `nexo_antenna_yoke`                          | Horquilla          | Une ambos nodos con simetría limpia.                          |
| `nexo_antenna_node_l`, `nexo_antenna_node_r` | Nodos dorados      | Esferas emisivas con soporte metálico visible.                |
| `nexo_neck_gimbal`                           | Unión cabeza-torso | Volumen corto articulado; deja una separación de sombra real. |

### C. Torso y núcleo

| Identificador                        | Pieza           | Tratamiento obligatorio                                                                                                 |
| ------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `nexo_torso_shell`                   | Carcasa central | Cápsula mecánica con hombros robustos y paneles principales.                                                            |
| `nexo_chest_bezel`                   | Aro del núcleo  | Bisel independiente con grosor y tornillería visible a cámara cercana.                                                  |
| `nexo_core_outer`, `nexo_core_inner` | Núcleo          | Anillo exterior y emisor interior separados; el patrón radial es geometría o normal horneada según distancia de cámara. |
| `nexo_backpack_panel`                | Panel posterior | Masa técnica que explica el volumen trasero; no se omite por no verse en la pose principal.                             |

### D. Extremidades

Cada lado usa los mismos conjuntos reflejados: `shoulder`, `upper_arm`,
`elbow_joint`, `forearm`, `wrist`, `hand`, `hip`, `thigh`,
`knee_joint`, `shin`, `ankle` y `foot`. Hombros, codos, muñecas,
rodillas y tobillos tienen que ser volúmenes separados: son necesarios para el
rig y para la lectura de máquina artesanal.

Las manos se simplifican a palma, pulgar y dos bloques de dedos legibles; no
se usan manos humanas hiperrealistas. Los pies son anchos, con talón, empeine y
suela; el centro de masa queda bajo y entre ellos.

## Niveles de detalle

| Nivel        | Se modela como geometría                                              | Se hornea o texturiza                                 |
| ------------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| Silueta      | Casco, bisel, visor, módulos, núcleo, articulaciones, pies y antena   | Nunca.                                                |
| Primer plano | Paneles, ranuras, juntas, aros, rejilla trasera y tornillos visibles  | Detalle repetitivo menor a `2 mm`.                    |
| Material     | Biselado real, hendiduras que proyectan sombra y desgaste estructural | Micro-rayones, poros, polvo y variación de rugosidad. |
| Web          | Los elementos que cambian silueta o movimiento                        | El resto mediante normal, AO y mapas de material.     |

Un detalle se elimina del modelo web solo después de comprobar que su ausencia
no cambia la silueta ni la lectura a `112 px`, `224 px` y `448 px`.

## Topología y construcción del maestro

- El casco comienza con una jaula de subdivisión controlada y se ajusta en
  frente, perfil, reverso y tres cuartos; no con una esfera escalada como
  geometría final.
- Se usan modificadores no destructivos mientras sea posible: `Mirror`,
  `Subdivision Surface`, `Bevel` y `Weighted Normal` o su equivalente actual.
- Los huecos tienen espesor y profundidad. Un borde importante debe producir
  sombra real antes de recibir un mapa de normal.
- Las piezas móviles no se fusionan a la carcasa. Cada unión conserva holgura
  física visible y pivote coherente.
- Los booleanos se reservan para cavidades limpias y se revisan antes de
  aplicar. No se aceptan artefactos, caras estiradas ni topología oculta.
- El modelo maestro puede tener la densidad necesaria para un render de alta
  resolución. No hereda el límite de triángulos del GLB web.

## Materialidad de referencia

| Material                | Lectura                        | Aplicación                                      |
| ----------------------- | ------------------------------ | ----------------------------------------------- |
| Grafito envejecido      | Metal oscuro, mate y trabajado | Carcasas, paneles y extremidades.               |
| Metal oscuro secundario | Separación funcional           | Juntas, biseles, articulaciones y cavidades.    |
| Visor negro profundo    | Profundidad, no espejo         | Interior del rostro; deja visibles ojos y boca. |
| Dorado cálido           | Energía y atención             | Nodos, ojos, núcleo y acentos mínimos.          |

El desgaste cuenta historia de taller: leves abrasiones en cantos, zonas de
contacto y uniones. Nunca se usa suciedad uniforme para esconder una mala
superficie.

## Puertas de revisión visual

No se avanza de una puerta a la siguiente sin una comparación aprobada con las
referencias.

1. **Despiece aprobado:** árbol de piezas, prioridad de referencias y escala.
2. **Blockout aprobado:** frente, perfil, reverso y tres cuartos; casco,
   visor, módulos, antena, torso, núcleo, brazos, piernas y pies presentes.
3. **Modelo maestro aprobado:** contorno, juntas, profundidad, anatomía y
   piezas móviles comparados sobre las láminas.
4. **Lookdev aprobado:** grafito, visor, dorado, metal y desgaste leíbles bajo
   iluminación neutra y editorial.
5. **Rig aprobado:** todas las poses de la lámina se logran sin intersecciones
   visibles ni deformación de piezas rígidas.
6. **Derivado web aprobado:** conserva el carácter a tamaños reales y cumple
   el contrato de rendimiento sin degradar la versión maestra.

## Criterios de aceptación del modelo maestro

- El contorno de cabeza, marco de visor y banda inferior coincide con las
  cuatro vistas canónicas; no aparece como esfera, barra o plato separado.
- Frente, lateral y reverso explican las mismas piezas, no tres robots
  distintos.
- Cada módulo lateral, panel trasero, núcleo y articulación tiene profundidad
  suficiente para recibir iluminación creíble.
- Nexo se reconoce sin ojos ni emisión solo por su silueta y ensamblajes.
- El render a tres cuartos conserva oficio, peso y calidez sin depender de la
  luz dramática de la lámina.
- Las decisiones ambiguas se anotan para revisión humana antes de hacerse
  permanentes.

## Trabajo detenido

El archivo exploratorio actual no es un fallo ni una entrega: sirvió para
descubrir la deficiencia de la ficha previa. No se agregan torso, articulaciones
ni detalle hasta aprobar esta biblia y preparar las guías ortográficas de la
puerta 1.
