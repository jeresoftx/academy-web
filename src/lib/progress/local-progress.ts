import type {
  ChapterProgress,
  CourseSlug,
  LocalProgressSnapshot,
  ProgressState,
} from './types';

export const LOCAL_PROGRESS_KEY = 'jeresoft-academy:progress:v1';

const emptySnapshot = (): LocalProgressSnapshot => ({
  version: 1,
  chapters: [],
});

export function readLocalProgress(): LocalProgressSnapshot {
  if (typeof window === 'undefined') {
    return emptySnapshot();
  }

  const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
  if (!raw) {
    return emptySnapshot();
  }

  try {
    const parsed = JSON.parse(raw) as LocalProgressSnapshot;
    return parsed.version === 1 && Array.isArray(parsed.chapters)
      ? parsed
      : emptySnapshot();
  } catch {
    return emptySnapshot();
  }
}

export function writeChapterProgress(input: {
  courseSlug: CourseSlug;
  chapterSlug: string;
  state: ProgressState;
}): ChapterProgress {
  const snapshot = readLocalProgress();
  const completedAt =
    input.state === 'completed' ? new Date().toISOString() : undefined;
  const nextChapter: ChapterProgress = {
    courseSlug: input.courseSlug,
    chapterSlug: input.chapterSlug,
    state: input.state,
    completedAt,
  };

  const chapters = snapshot.chapters.filter(
    (chapter) =>
      chapter.courseSlug !== input.courseSlug ||
      chapter.chapterSlug !== input.chapterSlug,
  );

  const nextSnapshot: LocalProgressSnapshot = {
    version: 1,
    chapters: [...chapters, nextChapter],
  };

  window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(nextSnapshot));
  return nextChapter;
}

export function readChapterProgress(input: {
  courseSlug: CourseSlug;
  chapterSlug: string;
}): ChapterProgress | undefined {
  return readLocalProgress().chapters.find(
    (chapter) =>
      chapter.courseSlug === input.courseSlug &&
      chapter.chapterSlug === input.chapterSlug,
  );
}
