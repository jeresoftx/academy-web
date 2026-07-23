import { courses } from '@/data/courses';
import { lessons } from '@/data/lessons';

export type NexoNavigationIntent =
  'open_course' | 'open_chapter' | 'ask_clarification' | 'search';

export type NexoNavigationConfidence = 'low' | 'medium' | 'high';

export type NexoNavigationActionType =
  'open_course' | 'open_chapter' | 'search';

export type NexoNavigationEntryType = 'course' | 'chapter';

export interface NexoNavigationAction {
  type: NexoNavigationActionType;
  label: string;
  href: string;
  courseSlug?: string;
  chapterSlug?: string;
}

export interface NexoNavigationEntry {
  type: NexoNavigationEntryType;
  title: string;
  href: string;
  courseSlug: string;
  chapterSlug?: string;
  keywords: string[];
  summary?: string;
}

export interface NexoNavigationResult {
  intent: NexoNavigationIntent;
  confidence: NexoNavigationConfidence;
  spokenSummary: string;
  visibleSummary: string;
  actions: NexoNavigationAction[];
  fallback?: NexoNavigationAction;
}

interface ScoredEntry {
  entry: NexoNavigationEntry;
  score: number;
}

type CourseChapter = {
  number: string;
  title: string;
  state: string;
  href?: string;
  summary?: string;
};

const COMMAND_WORDS = new Set([
  'a',
  'abre',
  'abrir',
  'busca',
  'buscar',
  'capitulo',
  'curso',
  'de',
  'el',
  'en',
  'ir',
  'la',
  'las',
  'los',
  'muestra',
  'mostrar',
  'navega',
  'navegar',
  'por',
  'quiero',
  'ruta',
  'ver',
]);

const MAX_ACTIONS = 5;

export function sanitizeSearchQuery(query: string): string {
  return replaceControlCharacters(query.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function safeSearchHref(query: string): string {
  const safeQuery = sanitizeSearchQuery(query);
  const params = new URLSearchParams({ q: safeQuery });

  return `/search/?${params.toString()}`;
}

export function buildNexoNavigationRegistry(): NexoNavigationEntry[] {
  const entries = new Map<string, NexoNavigationEntry>();

  Object.values(courses).forEach((course) => {
    const courseHref = `/courses/${course.slug}/`;

    entries.set(courseHref, {
      type: 'course',
      title: course.title,
      href: courseHref,
      courseSlug: course.slug,
      keywords: compactKeywords([
        course.title,
        course.subtitle,
        course.slug,
        course.code,
        course.label,
        course.repo,
        course.description,
        course.status,
        course.chaptersKicker,
        course.chaptersHeading,
        course.objectiveHeading,
        course.outcomes,
      ]),
      summary: course.description,
    });

    collectCourseChapters(course).forEach((chapter) => {
      if (!chapter.href || entries.has(chapter.href)) {
        return;
      }

      entries.set(chapter.href, {
        type: 'chapter',
        title: chapter.title,
        href: chapter.href,
        courseSlug: course.slug,
        chapterSlug: chapterSlugFromHref(course.slug, chapter.href),
        keywords: compactKeywords([
          chapter.title,
          chapter.number,
          chapter.state,
          chapter.summary,
        ]),
        summary: chapter.summary,
      });
    });
  });

  Object.values(lessons).forEach((lesson) => {
    const href = `/courses/${lesson.courseSlug}/${lesson.slug}/`;

    entries.set(href, {
      type: 'chapter',
      title: lesson.title,
      href,
      courseSlug: lesson.courseSlug,
      chapterSlug: lesson.slug,
      keywords: compactKeywords([
        lesson.title,
        lesson.subtitle,
        lesson.slug,
        lesson.number,
        lesson.status,
        lesson.framing.text,
        lesson.concept,
        lesson.problem,
        lesson.mantra,
        lesson.visual.heading,
        lesson.visual.description,
        lesson.patternSteps,
        lesson.mistakes,
        lesson.practice,
        lesson.closing,
      ]),
      summary: lesson.subtitle,
    });
  });

  return [...entries.values()];
}

export function searchNexoNavigationEntries(
  query: string,
  limit = MAX_ACTIONS,
): NexoNavigationEntry[] {
  const scored = scoreRegistry(query);

  return scored.slice(0, limit).map(({ entry }) => entry);
}

export function resolveNexoNavigation(query: string): NexoNavigationResult {
  const safeQuery = sanitizeSearchQuery(query);
  const fallback = searchAction(safeQuery);
  const scored = scoreRegistry(query);

  if (safeQuery.length === 0 || scored.length === 0) {
    return {
      intent: 'search',
      confidence: 'low',
      spokenSummary: 'No encontré una ruta exacta. Puedo buscar eso.',
      visibleSummary:
        'No encontré una ruta exacta; preparo una búsqueda segura.',
      actions: [fallback],
      fallback,
    };
  }

  const bestScore = scored[0]?.score ?? 0;
  const candidates = scored
    .filter(({ score }) => bestScore - score <= 20)
    .slice(0, MAX_ACTIONS);

  if (candidates.length > 1) {
    const actions = candidates.map(({ entry }) => entryToAction(entry));

    return {
      intent: 'ask_clarification',
      confidence: 'medium',
      spokenSummary: 'Encontré varias opciones. Elige cuál quieres abrir.',
      visibleSummary: 'Encontré varias opciones; elige una para continuar.',
      actions,
      fallback,
    };
  }

  const action = entryToAction(scored[0].entry);
  const isCourse = action.type === 'open_course';

  return {
    intent: isCourse ? 'open_course' : 'open_chapter',
    confidence: 'high',
    spokenSummary: `${action.label}.`,
    visibleSummary: action.label,
    actions: [action],
    fallback,
  };
}

function scoreRegistry(query: string): ScoredEntry[] {
  const normalizedQuery = normalizeQueryWithoutCommands(query);
  const tokens = normalizedQuery.split(' ').filter(Boolean);

  if (tokens.length === 0) {
    return [];
  }

  return buildNexoNavigationRegistry()
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, normalizedQuery, tokens),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);
}

function scoreEntry(
  entry: NexoNavigationEntry,
  normalizedQuery: string,
  tokens: string[],
): number {
  const title = normalizeForMatch(entry.title);
  const keywordList = entry.keywords.map(normalizeForMatch);
  const haystack = normalizeForMatch(
    [entry.title, ...entry.keywords].join(' '),
  );

  if (title === normalizedQuery || keywordList.includes(normalizedQuery)) {
    return 120;
  }

  if (title.includes(normalizedQuery)) {
    return 100;
  }

  if (keywordList.some((keyword) => keyword.includes(normalizedQuery))) {
    return 80;
  }

  if (tokens.every((token) => haystack.includes(token))) {
    return 60 + tokens.length;
  }

  const matchedTokens = tokens.filter((token) => haystack.includes(token));

  return matchedTokens.length > 0 ? matchedTokens.length * 10 : 0;
}

function entryToAction(entry: NexoNavigationEntry): NexoNavigationAction {
  if (entry.type === 'course') {
    return {
      type: 'open_course',
      label: `Abrir ${entry.title}`,
      href: entry.href,
      courseSlug: entry.courseSlug,
    };
  }

  return {
    type: 'open_chapter',
    label: `Abrir ${entry.title}`,
    href: entry.href,
    courseSlug: entry.courseSlug,
    chapterSlug: entry.chapterSlug,
  };
}

function searchAction(query: string): NexoNavigationAction {
  const safeQuery = sanitizeSearchQuery(query);

  return {
    type: 'search',
    label: `Buscar "${safeQuery}"`,
    href: safeSearchHref(safeQuery),
  };
}

function normalizeQueryWithoutCommands(query: string): string {
  return normalizeForMatch(sanitizeSearchQuery(query))
    .split(' ')
    .filter((token) => token.length > 0 && !COMMAND_WORDS.has(token))
    .join(' ');
}

function normalizeForMatch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactKeywords(values: unknown[]): string[] {
  return values
    .flatMap((value) => flattenKeyword(value))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function flattenKeyword(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenKeyword(item));
  }

  if (typeof value === 'string') {
    return [value];
  }

  return [];
}

function collectCourseChapters(
  course: (typeof courses)[keyof typeof courses],
): CourseChapter[] {
  if ('courseMap' in course) {
    const chapters: CourseChapter[] = [];

    course.courseMap.groups.forEach((group) => {
      group.chapters.forEach((chapter) => {
        chapters.push(toCourseChapter(chapter));
      });
    });

    return chapters;
  }

  return course.chapters.map(toCourseChapter);
}

function chapterSlugFromHref(
  courseSlug: string,
  href: string,
): string | undefined {
  const prefix = `/courses/${courseSlug}/`;

  if (!href.startsWith(prefix)) {
    return undefined;
  }

  return href.slice(prefix.length).replace(/\/$/, '');
}

function toCourseChapter(chapter: CourseChapter): CourseChapter {
  return {
    number: chapter.number,
    title: chapter.title,
    state: chapter.state,
    href: chapter.href,
    summary: chapter.summary,
  };
}

function replaceControlCharacters(value: string): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);

    return code < 32 || code === 127 ? ' ' : character;
  }).join('');
}
