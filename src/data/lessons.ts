export const lessons = {
  'algorithms/sliding-window': {
    courseSlug: 'algorithms',
    slug: 'sliding-window',
    number: '05',
    status: 'Código disponible · visual pendiente',
    title: 'Sliding Window: pensar en ventanas, no en ciclos',
    subtitle:
      'De fuerza bruta a recorrido lineal usando estado, límites e invariantes.',
    repoUrl:
      'https://github.com/jeresoftx/rust-algorithms/blob/main/src/patterns/sliding_window.rs',
    repoLabel: 'Ver código en rust-algorithms',
    framing: {
      label: 'La idea en una frase',
      text: 'Una ventana es un rango contiguo que aprende a crecer, contraerse y conservar solo el estado necesario para decidir.',
    },
    concept:
      'Sliding Window sirve cuando el problema pregunta por la mejor subcadena o subarreglo contiguo bajo una condición que puede actualizarse de forma incremental.',
    problem:
      'La fuerza bruta recalcula cada rango desde cero. El patrón evita ese desperdicio manteniendo estado vivo mientras los límites avanzan.',
    mantra: 'expandir → validar → contraer',
    visual: {
      heading: 'Laboratorio visual',
      description:
        'El capítulo debe mostrar cómo se mueven `left` y `right`, qué guarda el mapa de frecuencias y cuándo una ventana deja de ser válida.',
      sample: 'abracadabra',
      left: 3,
      right: 7,
      answer: 'mejor = 4',
    },
    patternSteps: [
      'Expandir `right` para incluir nueva señal.',
      'Actualizar el estado mínimo: conteos, suma, conjunto o deque.',
      'Contraer `left` mientras la ventana viole la condición.',
      'Registrar la mejor respuesta solo cuando la ventana representa una solución válida.',
    ],
    codeSnippet: `pub fn length_of_longest_substring(s: String) -> i32 {
    let mut last_seen = std::collections::HashMap::new();
    let mut left = 0usize;
    let mut best = 0usize;

    for (right, ch) in s.chars().enumerate() {
        if let Some(previous) = last_seen.insert(ch, right) {
            left = left.max(previous + 1);
        }

        best = best.max(right - left + 1);
    }

    best as i32
}`,
    mistakes: [
      'Contraer la ventana antes de que sea inválida.',
      'Actualizar `left` hacia atrás al encontrar un carácter repetido fuera de la ventana actual.',
      'Olvidar que una ventana mínima con conteos necesita multiplicidad, no solo presencia.',
      'Confundir ventana fija, ventana variable y deque monotónica como si fueran el mismo patrón.',
    ],
    practice: [
      'Longest Substring Without Repeating Characters',
      'Minimum Window Substring',
      'Permutation in String',
      'Sliding Window Maximum',
    ],
    closing:
      'El criterio clave no es memorizar dos índices: es reconocer si la condición de validez puede mantenerse al mover límites sin recomputar todo.',
  },
};
