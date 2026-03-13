export type StarterGuideFaqCategory = {
  id: string;
  titleKey: string;
};

export type StarterGuideFaqItem = {
  id: string;
  categoryId: string;
  titleKey: string;
  bodyKey: string;
};

export const STARTER_GUIDE_FAQ_CATEGORIES: StarterGuideFaqCategory[] = [
  {
    id: 'getting-started',
    titleKey: 'starterGuideScreen.faqCategoryGettingStarted',
  },
  {
    id: 'intake-and-refusal',
    titleKey: 'starterGuideScreen.faqCategoryIntake',
  },
  {
    id: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqCategoryReaction',
  },
];

export const STARTER_GUIDE_FAQ_ITEMS: StarterGuideFaqItem[] = [
  {
    id: 'faq-repeat',
    categoryId: 'getting-started',
    titleKey: 'starterGuideScreen.faqRepeatTitle',
    bodyKey: 'starterGuideScreen.faqRepeatShortBody',
  },
  {
    id: 'faq-low-intake',
    categoryId: 'intake-and-refusal',
    titleKey: 'starterGuideScreen.faqLowIntakeTitle',
    bodyKey: 'starterGuideScreen.faqLowIntakeShortBody',
  },
  {
    id: 'faq-allergy',
    categoryId: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqAllergyTitle',
    bodyKey: 'starterGuideScreen.faqAllergyShortBody',
  },
  {
    id: 'faq-first-day-time',
    categoryId: 'getting-started',
    titleKey: 'starterGuideScreen.faqFirstDayTimeTitle',
    bodyKey: 'starterGuideScreen.faqFirstDayTimeBody',
  },
  {
    id: 'faq-water',
    categoryId: 'getting-started',
    titleKey: 'starterGuideScreen.faqWaterTitle',
    bodyKey: 'starterGuideScreen.faqWaterBody',
  },
  {
    id: 'faq-constipation',
    categoryId: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqConstipationTitle',
    bodyKey: 'starterGuideScreen.faqConstipationBody',
  },
  {
    id: 'faq-skip-day',
    categoryId: 'intake-and-refusal',
    titleKey: 'starterGuideScreen.faqSkipDayTitle',
    bodyKey: 'starterGuideScreen.faqSkipDayBody',
  },
  {
    id: 'faq-cold-storage',
    categoryId: 'getting-started',
    titleKey: 'starterGuideScreen.faqStorageTitle',
    bodyKey: 'starterGuideScreen.faqStorageBody',
  },
];
