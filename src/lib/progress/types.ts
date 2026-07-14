export type CourseSlug = 'algorithms' | 'design-patterns';

export type ProgressState = 'not_started' | 'in_progress' | 'completed';

export type ChapterProgress = {
  courseSlug: CourseSlug;
  chapterSlug: string;
  state: ProgressState;
  completedAt?: string;
};

export type LocalProgressSnapshot = {
  version: 1;
  chapters: ChapterProgress[];
};
