import { useMemo } from 'react';

import { STARTER_GUIDE_SUPPLIES_CHECKLIST } from '@/constants/starter-guide';
import { t } from '@/constants/i18n';

export type GuideSuppliesChecklistItem = {
  id: string;
  title: string;
  body: string;
};

export function useStarterGuideSupplies(suppliesCheckedIds: string[]) {
  const suppliesItems = useMemo<GuideSuppliesChecklistItem[]>(
    () =>
      STARTER_GUIDE_SUPPLIES_CHECKLIST.map((item) => ({
        id: item.id,
        title: t(item.titleKey),
        body: t(item.bodyKey),
      })),
    []
  );

  const checkedSuppliesCount = suppliesItems.filter((item) => suppliesCheckedIds.includes(item.id)).length;
  const isSuppliesChecklistComplete = checkedSuppliesCount === suppliesItems.length;

  return {
    suppliesItems,
    checkedSuppliesCount,
    isSuppliesChecklistComplete,
  };
}
