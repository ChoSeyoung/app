import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_STARTER_GUIDE_PROGRESS,
  STARTER_GUIDE_PROGRESS_STORAGE_KEY,
  type StarterGuideProgress,
} from '@/constants/starter-guide';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

type StarterGuideProgressListener = (next: StarterGuideProgress) => void;

let starterGuideProgressCache: StarterGuideProgress | undefined;
const listeners = new Set<StarterGuideProgressListener>();

function publishStarterGuideProgress(next: StarterGuideProgress): void {
  starterGuideProgressCache = next;
  listeners.forEach((listener) => {
    listener(next);
  });
}

function isStarterGuideProgress(value: unknown): value is StarterGuideProgress {
  if (!value || typeof value !== 'object') return false;

  const casted = value as Partial<StarterGuideProgress>;

  return (
    Array.isArray(casted.readChapterIds) &&
    casted.readChapterIds.every((item) => typeof item === 'string') &&
    Array.isArray(casted.bookmarkedChapterIds) &&
    casted.bookmarkedChapterIds.every((item) => typeof item === 'string') &&
    (casted.readinessCheckedIds === undefined ||
      (Array.isArray(casted.readinessCheckedIds) &&
        casted.readinessCheckedIds.every((item) => typeof item === 'string'))) &&
    (casted.lastChapterId === undefined || typeof casted.lastChapterId === 'string')
  );
}

function buildUniqueList(next: string[]): string[] {
  return Array.from(new Set(next));
}

export function useStarterGuideProgress(): {
  progress: StarterGuideProgress;
  isLoading: boolean;
  toggleRead: (chapterId: string) => Promise<void>;
  toggleBookmark: (chapterId: string) => Promise<void>;
  toggleReadinessChecked: (itemId: string) => Promise<void>;
  setLastChapter: (chapterId: string) => Promise<void>;
} {
  const [progress, setProgress] = useState(starterGuideProgressCache ?? DEFAULT_STARTER_GUIDE_PROGRESS);
  const [isLoading, setIsLoading] = useState(starterGuideProgressCache === undefined);

  useEffect(() => {
    let isMounted = true;

    const listener: StarterGuideProgressListener = (next) => {
      if (isMounted) {
        setProgress(next);
      }
    };

    listeners.add(listener);

    const load = async () => {
      if (starterGuideProgressCache !== undefined) {
        if (isMounted) {
          setProgress(starterGuideProgressCache);
          setIsLoading(false);
        }
        return;
      }

      try {
        const raw = await safeGetItem(STARTER_GUIDE_PROGRESS_STORAGE_KEY);
        if (!raw) {
          publishStarterGuideProgress(DEFAULT_STARTER_GUIDE_PROGRESS);
          return;
        }

        const parsed = JSON.parse(raw) as unknown;
        publishStarterGuideProgress(
          isStarterGuideProgress(parsed)
            ? {
                ...DEFAULT_STARTER_GUIDE_PROGRESS,
                ...parsed,
                readinessCheckedIds: parsed.readinessCheckedIds ?? DEFAULT_STARTER_GUIDE_PROGRESS.readinessCheckedIds,
              }
            : DEFAULT_STARTER_GUIDE_PROGRESS
        );
      } catch {
        publishStarterGuideProgress(DEFAULT_STARTER_GUIDE_PROGRESS);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
      listeners.delete(listener);
    };
  }, []);

  const persist = useCallback(async (next: StarterGuideProgress) => {
    await safeSetItem(STARTER_GUIDE_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    publishStarterGuideProgress(next);
  }, []);

  const toggleRead = useCallback(
    async (chapterId: string) => {
      const isRead = progress.readChapterIds.includes(chapterId);
      const next: StarterGuideProgress = {
        ...progress,
        readChapterIds: isRead
          ? progress.readChapterIds.filter((item) => item !== chapterId)
          : buildUniqueList([...progress.readChapterIds, chapterId]),
        lastChapterId: chapterId,
      };

      await persist(next);
    },
    [persist, progress]
  );

  const toggleBookmark = useCallback(
    async (chapterId: string) => {
      const isBookmarked = progress.bookmarkedChapterIds.includes(chapterId);
      const next: StarterGuideProgress = {
        ...progress,
        bookmarkedChapterIds: isBookmarked
          ? progress.bookmarkedChapterIds.filter((item) => item !== chapterId)
          : buildUniqueList([...progress.bookmarkedChapterIds, chapterId]),
        lastChapterId: chapterId,
      };

      await persist(next);
    },
    [persist, progress]
  );

  const setLastChapter = useCallback(
    async (chapterId: string) => {
      if (progress.lastChapterId === chapterId) return;

      await persist({
        ...progress,
        lastChapterId: chapterId,
      });
    },
    [persist, progress]
  );

  const toggleReadinessChecked = useCallback(
    async (itemId: string) => {
      const isChecked = progress.readinessCheckedIds.includes(itemId);
      const next: StarterGuideProgress = {
        ...progress,
        readinessCheckedIds: isChecked
          ? progress.readinessCheckedIds.filter((item) => item !== itemId)
          : buildUniqueList([...progress.readinessCheckedIds, itemId]),
      };

      await persist(next);
    },
    [persist, progress]
  );

  return {
    progress,
    isLoading,
    toggleRead,
    toggleBookmark,
    toggleReadinessChecked,
    setLastChapter,
  };
}
