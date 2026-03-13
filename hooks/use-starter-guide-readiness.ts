import { useMemo } from 'react';

import {
  STARTER_GUIDE_READINESS_CHECKLIST,
  STARTER_GUIDE_READINESS_REFERENCES,
  type StarterGuideReadinessChecklistDefinition,
  type StarterGuideReadinessReferenceDefinition,
} from '@/constants/starter-guide';
import { t } from '@/constants/i18n';

export type GuideReadinessChecklistItem = StarterGuideReadinessChecklistDefinition & {
  title: string;
  body: string;
  sources: StarterGuideReadinessReferenceDefinition[];
};

export type ReadinessStatus = 'ready' | 'almost' | 'wait' | 'unknown';

type UseStarterGuideReadinessOptions = {
  birthDate?: string;
  readinessCheckedIds: string[];
};

function parseIsoDate(value?: string): Date | null {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function getAgeInMonths(value?: string): number | null {
  const birthDate = parseIsoDate(value);
  if (!birthDate) return null;

  const now = new Date();
  let months =
    (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth());

  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  return months < 0 ? null : months;
}

export function useStarterGuideReadiness({
  birthDate,
  readinessCheckedIds,
}: UseStarterGuideReadinessOptions) {
  const readinessItems = useMemo<GuideReadinessChecklistItem[]>(
    () =>
      STARTER_GUIDE_READINESS_CHECKLIST.map((item) => ({
        ...item,
        title: t(item.titleKey),
        body: t(item.bodyKey),
        sources: item.sourceIds
          .map((sourceId) => STARTER_GUIDE_READINESS_REFERENCES.find((source) => source.id === sourceId))
          .filter((source): source is StarterGuideReadinessReferenceDefinition => Boolean(source)),
      })),
    []
  );

  const ageInMonths = useMemo(() => getAgeInMonths(birthDate), [birthDate]);
  const autoAgeReady = ageInMonths === null ? null : ageInMonths >= 6;
  const manualChecklistItems = useMemo(
    () => readinessItems.filter((item) => !item.autoDerived),
    [readinessItems]
  );
  const checkedManualCount = manualChecklistItems.filter((item) =>
    readinessCheckedIds.includes(item.id)
  ).length;
  const positiveChecklistCount = readinessItems.filter((item) => {
    if (item.autoDerived === 'ageAroundSixMonths') {
      return autoAgeReady === true;
    }

    return readinessCheckedIds.includes(item.id);
  }).length;

  const readinessStatus: ReadinessStatus = useMemo(() => {
    if (autoAgeReady === null) return 'unknown';
    if (autoAgeReady && checkedManualCount === manualChecklistItems.length) return 'ready';
    if (autoAgeReady && checkedManualCount >= Math.max(manualChecklistItems.length - 1, 0)) return 'almost';
    return 'wait';
  }, [autoAgeReady, checkedManualCount, manualChecklistItems.length]);

  const isReadinessChecklistComplete =
    autoAgeReady !== null && checkedManualCount === manualChecklistItems.length;

  const readinessStatusCopy = useMemo(() => {
    switch (readinessStatus) {
      case 'ready':
        return {
          title: t('starterGuideScreen.readinessStatusReadyTitle'),
          body: t('starterGuideScreen.readinessStatusReadyBody'),
        };
      case 'almost':
        return {
          title: t('starterGuideScreen.readinessStatusAlmostTitle'),
          body: t('starterGuideScreen.readinessStatusAlmostBody'),
        };
      case 'wait':
        return {
          title: t('starterGuideScreen.readinessStatusWaitTitle'),
          body: t('starterGuideScreen.readinessStatusWaitBody'),
        };
      case 'unknown':
      default:
        return {
          title: t('starterGuideScreen.readinessStatusUnknownTitle'),
          body: t('starterGuideScreen.readinessStatusUnknownBody'),
        };
    }
  }, [readinessStatus]);

  return {
    ageInMonths,
    autoAgeReady,
    checkedManualCount,
    isReadinessChecklistComplete,
    manualChecklistItems,
    positiveChecklistCount,
    readinessItems,
    readinessReferences: STARTER_GUIDE_READINESS_REFERENCES,
    readinessStatus,
    readinessStatusCopy,
  };
}
