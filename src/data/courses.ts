export const courses = {
  algorithms: {
    slug: 'algorithms',
    code: 'S1',
    label: 'Fundamentos',
    title: 'Algoritmos',
    subtitle: 'La base de todo',
    repo: 'rust-algorithms',
    repoUrl: 'https://github.com/jeresoftx/rust-algorithms',
    description:
      'Un recorrido por grafos, caminos, ventanas, búsqueda y complejidad para convertir problemas confusos en rutas claras.',
    status: 'Primer curso visualizado',
    bandHeading: 'Primero código probado. Luego video, laboratorio y oficio.',
    bandText:
      'Esta página inaugura el patrón de publicación del sitio: el arte ya existe, el repositorio ya existe, y el contenido puede crecer sin fingir que todo está terminado.',
    chaptersKicker: 'Primeros capítulos',
    chaptersHeading: 'Un mapa inicial para entrar a algoritmos con criterio.',
    objectiveHeading: 'Aprender a elegir, no solo a recordar recetas.',
    repoDescription:
      'La primera versión del curso se apoya en implementaciones Rust, pruebas automatizadas y familias de problemas que ya se pueden estudiar.',
    images: {
      courseCoverDark:
        '/assets/illustrations/courses/algorithms/course-cover.dark.png',
      courseCoverLight:
        '/assets/illustrations/courses/algorithms/course-cover.light.png',
      chapterCoverDark:
        '/assets/illustrations/courses/algorithms/chapter-cover.dark.png',
      chapterCoverLight:
        '/assets/illustrations/courses/algorithms/chapter-cover.light.png',
      heroDesktopDark:
        '/assets/illustrations/courses/algorithms/hero-desktop.dark.png',
      heroDesktopLight:
        '/assets/illustrations/courses/algorithms/hero-desktop.light.png',
      heroMobileDark:
        '/assets/illustrations/courses/algorithms/hero-mobile.dark.png',
      heroMobileLight:
        '/assets/illustrations/courses/algorithms/hero-mobile.light.png',
      ogDark: '/assets/illustrations/courses/algorithms/og-image.dark.png',
      ogLight: '/assets/illustrations/courses/algorithms/og-image.light.png',
      youtubeDark:
        '/assets/illustrations/courses/algorithms/youtube-thumbnail.dark.png',
      youtubeLight:
        '/assets/illustrations/courses/algorithms/youtube-thumbnail.light.png',
    },
    chapters: [
      {
        number: '01',
        title: 'Complejidad y criterio',
        state: 'Base editorial',
        summary:
          'Por qué medir tiempo y memoria cambia la forma de pensar un problema.',
      },
      {
        number: '02',
        title: 'Two pointers',
        state: 'Código disponible',
        summary:
          'Recorrer desde dos extremos, reducir búsquedas y reconocer invariantes.',
      },
      {
        number: '03',
        title: 'Sliding window',
        state: 'Código disponible',
        href: '/courses/algorithms/sliding-window/',
        summary:
          'Ventanas que crecen, se contraen y convierten fuerza bruta en oficio.',
      },
      {
        number: '04',
        title: 'Grafos y caminos',
        state: 'Código disponible',
        summary:
          'Modelar relaciones, recorrer estados y encontrar rutas verificables.',
      },
    ],
    courseMap: {
      kicker: 'Camino completo',
      heading: 'El curso se estudia por patrones, no por una lista de trucos.',
      intro:
        'El mapa completo queda visible desde la primera versión, pero cada capítulo avanza por capas: código probado, notas, visuales, redacción y video cuando aporte claridad real.',
      totalLabel: '23 capítulos visibles desde la primera versión.',
      groups: [
        {
          title: 'Fundamentos de criterio',
          description:
            'La base para decidir antes de codificar: medir, contar, normalizar y acumular señal.',
          chapters: [
            {
              number: '01',
              title: 'Complejidad y criterio',
              state: 'Base editorial',
              summary:
                'Big O, Θ, Ω, memoria y análisis amortizado para comparar alternativas.',
            },
            {
              number: '02',
              title: 'Arrays y hashing',
              state: 'Código disponible',
              summary:
                'Frecuencias, mapas, conjuntos, duplicados, anagramas y conteo.',
            },
            {
              number: '03',
              title: 'Sumas de prefijos',
              state: 'Código disponible',
              summary:
                'Acumulados, subarreglos, diferencias y consultas sin recalcular todo.',
            },
          ],
        },
        {
          title: 'Patrones lineales',
          description:
            'Recorrer secuencias con invariantes claras: extremos, ventanas, pilas y búsqueda sobre decisiones.',
          chapters: [
            {
              number: '04',
              title: 'Two pointers',
              state: 'Código disponible',
              summary:
                'Dos extremos, pares ordenados, compactación y recorridos sincronizados.',
            },
            {
              number: '05',
              title: 'Sliding window',
              state: 'Código disponible',
              href: '/courses/algorithms/sliding-window/',
              summary:
                'Ventanas fijas y variables que crecen, se contraen o se reinician.',
            },
            {
              number: '06',
              title: 'Stack y colas monotónicas',
              state: 'Código disponible',
              summary:
                'Paréntesis, histogramas, temperaturas y máximos por ventana.',
            },
            {
              number: '07',
              title: 'Búsqueda binaria',
              state: 'Código disponible',
              summary:
                'Lower bound, arreglos rotados, matrices y búsqueda sobre respuesta.',
            },
            {
              number: '08',
              title: 'Ordenamiento',
              state: 'Integrado en problemas',
              summary:
                'Ordenar como herramienta: intervalos, geometría, Kruskal y conteos.',
            },
          ],
        },
        {
          title: 'Estructuras y recorridos',
          description:
            'Modelar decisiones, relaciones y prioridades sin perder de vista el costo de cada estructura.',
          chapters: [
            {
              number: '09',
              title: 'Recursión y backtracking',
              state: 'Código disponible',
              summary:
                'Árboles de decisión, poda, combinatoria, particiones y N-Queens.',
            },
            {
              number: '10',
              title: 'Árboles y recorridos',
              state: 'Código disponible',
              summary: 'DFS, BFS, BST, construcción, serialización y caminos.',
            },
            {
              number: '11',
              title: 'Grafos',
              state: 'Código disponible',
              summary:
                'BFS, DFS, componentes, ciclos, topológico y grafos bipartitos.',
            },
            {
              number: '12',
              title: 'Union-Find',
              state: 'Código disponible',
              summary:
                'Conectividad, árboles válidos, provincias y ciclos en no dirigidos.',
            },
            {
              number: '13',
              title: 'Heaps',
              state: 'Código disponible',
              summary:
                'Prioridad, medianas, kth largest, merge k listas y selección.',
            },
            {
              number: '14',
              title: 'Intervalos',
              state: 'Código disponible',
              summary:
                'Fusionar, insertar, salas de reunión, solapes y calendarios.',
            },
            {
              number: '15',
              title: 'Greedy',
              state: 'Código disponible',
              summary:
                'Decisiones locales justificadas: saltos, gas station y scheduling.',
            },
          ],
        },
        {
          title: 'Algoritmos avanzados',
          description:
            'Técnicas que abren problemas más ricos: estados, pesos, rangos, cadenas y geometría.',
          chapters: [
            {
              number: '16',
              title: 'Programación dinámica',
              state: 'Código disponible',
              summary:
                'Estados, transiciones, conteos, subsecuencias, paths y optimización.',
            },
            {
              number: '17',
              title: 'Matemáticas y bits',
              state: 'Código disponible',
              summary:
                'Máscaras, potencias, GCD, criba, conteos y aritmética segura.',
            },
            {
              number: '18',
              title: 'Algoritmos de cadenas',
              state: 'Código disponible',
              summary: 'KMP, Rabin-Karp, Z-function, anagramas y palíndromos.',
            },
            {
              number: '19',
              title: 'Grafos ponderados',
              state: 'Código disponible',
              summary:
                'Dijkstra, Bellman-Ford, Floyd-Warshall y caminos con restricciones.',
            },
            {
              number: '20',
              title: 'MST y Tarjan',
              state: 'Código disponible',
              summary:
                'Prim, Kruskal, puentes, componentes fuertes y aristas críticas.',
            },
            {
              number: '21',
              title: 'Consultas por rangos',
              state: 'Código disponible',
              summary:
                'Fenwick, segment tree, lazy propagation, snapshots y range sums.',
            },
            {
              number: '22',
              title: 'Matrices y simulación',
              state: 'Código disponible',
              summary: 'Rotaciones, recorridos, Sudoku, Game of Life y DP 2D.',
            },
            {
              number: '23',
              title: 'Geometría computacional',
              state: 'Código disponible',
              summary:
                'Producto cruz, orientación, convex hull, líneas y skyline.',
            },
          ],
        },
      ],
    },
    outcomes: [
      'Reconocer patrones antes de escribir código.',
      'Comparar alternativas con complejidad explícita.',
      'Leer soluciones Rust con pruebas y casos reales.',
      'Conectar teoría, repositorio y visualización web.',
    ],
  },
  'design-patterns': {
    slug: 'design-patterns',
    code: 'DP',
    label: 'Oficio',
    title: 'Patrones de diseño',
    subtitle: 'Soluciones que escalan',
    repo: 'rust-design-patterns',
    repoUrl: 'https://github.com/jeresoftx/rust-design-patterns',
    description:
      'Un recorrido por patrones GoF, patrones idiomáticos de Rust, arquitectura y resiliencia para diseñar software con piezas claras y reemplazables.',
    status: 'Catálogo completo visualizado',
    bandHeading: 'Primero oficio visible. Luego capítulos, video y práctica.',
    bandText:
      'Esta ruta convierte el repositorio de patrones en una experiencia legible: concepto, intención, cuándo usarlo, cuándo evitarlo y cómo reconocer sus tradeoffs.',
    chaptersKicker: 'Primeros capítulos',
    chaptersHeading: 'Un mapa inicial para diseñar con piezas compatibles.',
    objectiveHeading: 'Aprender a componer, no solo a nombrar patrones.',
    repoDescription:
      'La primera versión del curso se apoya en ejemplos Rust, documentación por patrón, pruebas y decisiones explícitas sobre cuándo cada solución aporta valor.',
    images: {
      courseCoverDark:
        '/assets/illustrations/courses/design-patterns/course-cover.dark.png',
      courseCoverLight:
        '/assets/illustrations/courses/design-patterns/course-cover.light.png',
      chapterCoverDark:
        '/assets/illustrations/courses/design-patterns/chapter-cover.dark.png',
      chapterCoverLight:
        '/assets/illustrations/courses/design-patterns/chapter-cover.light.png',
      heroDesktopDark:
        '/assets/illustrations/courses/design-patterns/hero-desktop.dark.png',
      heroDesktopLight:
        '/assets/illustrations/courses/design-patterns/hero-desktop.light.png',
      heroMobileDark:
        '/assets/illustrations/courses/design-patterns/hero-mobile.dark.png',
      heroMobileLight:
        '/assets/illustrations/courses/design-patterns/hero-mobile.light.png',
      ogDark: '/assets/illustrations/courses/design-patterns/og-image.dark.png',
      ogLight:
        '/assets/illustrations/courses/design-patterns/og-image.light.png',
      youtubeDark:
        '/assets/illustrations/courses/design-patterns/youtube-thumbnail.dark.png',
      youtubeLight:
        '/assets/illustrations/courses/design-patterns/youtube-thumbnail.light.png',
    },
    chapters: [
      {
        number: '01',
        title: 'Por qué existen los patrones',
        state: 'Base editorial',
        summary:
          'Separar vocabulario útil de recetas rígidas y reconocer cuándo un patrón reduce complejidad real.',
      },
      {
        number: '02',
        title: 'Builder y composición',
        state: 'Código disponible',
        summary:
          'Construir objetos paso a paso sin perder claridad, validación ni legibilidad en Rust.',
      },
      {
        number: '03',
        title: 'Typestate',
        state: 'Código disponible',
        summary:
          'Modelar estados válidos en tipos para que el compilador impida secuencias incorrectas.',
      },
      {
        number: '04',
        title: 'Arquitectura hexagonal',
        state: 'Código disponible',
        summary:
          'Separar dominio, puertos y adaptadores para cambiar infraestructura sin contaminar reglas de negocio.',
      },
    ],
    outcomes: [
      'Distinguir patrón, intención y tradeoff.',
      'Elegir composición antes que herencia accidental.',
      'Leer implementaciones Rust con documentación y pruebas.',
      'Reconocer cuándo no usar un patrón aunque parezca elegante.',
    ],
  },
} as const;
