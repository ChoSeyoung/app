import { useMemo } from 'react';

import { STARTER_GUIDE_PARTS, type StarterGuideChapterDefinition, type StarterGuidePartDefinition } from '@/constants/starter-guide';
import { t } from '@/constants/i18n';

export type GuideChapter = StarterGuideChapterDefinition & {
  title: string;
  summary: string;
  bullets: string[];
  note: string;
};

export type GuidePart = Omit<StarterGuidePartDefinition, 'chapters'> & {
  title: string;
  description: string;
  chapters: GuideChapter[];
};

export function useStarterGuideContent() {
  return useMemo<GuidePart[]>(
    () =>
      STARTER_GUIDE_PARTS.map((part) => ({
        ...part,
        title: t(part.titleKey),
        description: t(part.descriptionKey),
        chapters: part.chapters.map((chapter) => ({
          ...chapter,
          title: t(chapter.titleKey),
          summary: t(chapter.summaryKey),
          bullets: chapter.bulletKeys.map((key) => t(key)),
          note: t(chapter.noteKey),
        })),
      })),
    []
  );
}
