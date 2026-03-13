import { useMemo } from 'react';

import {
  STARTER_GUIDE_FAQ_CATEGORIES,
  STARTER_GUIDE_FAQ_ITEMS,
  type StarterGuideFaqCategory,
  type StarterGuideFaqItem,
} from '@/constants/starter-guide-faq';
import { t } from '@/constants/i18n';

export type GuideFaqCategory = StarterGuideFaqCategory & {
  title: string;
};

export type GuideFaqItem = StarterGuideFaqItem & {
  title: string;
  body: string;
};

export function useStarterGuideFaq() {
  const categories = useMemo<GuideFaqCategory[]>(
    () =>
      STARTER_GUIDE_FAQ_CATEGORIES.map((category) => ({
        ...category,
        title: t(category.titleKey),
      })),
    []
  );

  const items = useMemo<GuideFaqItem[]>(
    () =>
      STARTER_GUIDE_FAQ_ITEMS.map((item) => ({
        ...item,
        title: t(item.titleKey),
        body: t(item.bodyKey),
      })),
    []
  );

  return {
    categories,
    items,
  };
}
