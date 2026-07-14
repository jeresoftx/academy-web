export const launchTracks = [
  {
    code: 'S1',
    label: 'Fundamentos',
    title: 'Algoritmos',
    repo: 'rust-algorithms',
    href: 'https://github.com/jeresoftx/rust-algorithms',
    courseHref: '/courses/algorithms/',
    status: 'Cantera lista',
    images: {
      dark: '/assets/illustrations/courses/algorithms/course-cover.dark.png',
      light: '/assets/illustrations/courses/algorithms/course-cover.light.png',
    },
    summary:
      '190 problemas implementados, pruebas automatizadas, notas de estudio y familias de algoritmos organizadas por patrón de resolución.',
    topics: [
      'two pointers',
      'sliding window',
      'grafos',
      'programación dinámica',
    ],
    motif: 'graph',
  },
  {
    code: 'DP',
    label: 'Oficio',
    title: 'Patrones de diseño',
    repo: 'rust-design-patterns',
    href: 'https://github.com/jeresoftx/rust-design-patterns',
    courseHref: '/courses/design-patterns/',
    status: 'Catálogo completo',
    images: {
      dark: '/assets/illustrations/courses/design-patterns/course-cover.dark.png',
      light:
        '/assets/illustrations/courses/design-patterns/course-cover.light.png',
    },
    summary:
      'Patrones GoF, idiomáticos de Rust, arquitectura y resiliencia distribuidos con ejemplos, documentación y pruebas.',
    topics: ['builder', 'typestate', 'hexagonal', 'circuit breaker'],
    motif: 'tiles',
  },
  {
    code: 'LAB',
    label: 'Interactivo',
    title: 'Laboratorios web',
    repo: 'academy-web',
    href: 'https://github.com/jeresoftx/academy-web',
    status: 'Siguiente frente',
    summary:
      'Playgrounds, visualizaciones y componentes WebAssembly para tocar conceptos antes de que existan todos los videos.',
    topics: ['visualizaciones', 'wasm', 'playgrounds', 'ejercicios'],
    motif: 'system',
  },
] as const;

export const learningFlow = [
  {
    title: 'Leer',
    text: 'Redacciones claras: concepto, problema, alternativas y justificación antes del código.',
  },
  {
    title: 'Tocar',
    text: 'Repositorios Rust con pruebas, benchmarks donde aportan señal y ejemplos ejecutables.',
  },
  {
    title: 'Ver',
    text: 'Videos llegarán después; el sitio nace preparado para conectarlos cuando existan.',
  },
  {
    title: 'Construir',
    text: 'Laboratorios y visualizaciones web para convertir lectura en criterio practicado.',
  },
] as const;

export const productionPipeline = [
  'Claude escribe el guion',
  'ChatGPT diseña la escena y genera prompts',
  'GPT Image genera la imagen',
  'Canva aplica ajustes mínimos',
  'Revisión humana decide',
  'Publicar',
] as const;
