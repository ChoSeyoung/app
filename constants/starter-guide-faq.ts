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
    id: 'tools-and-storage',
    titleKey: 'starterGuideScreen.faqCategoryTools',
  },
  {
    id: 'intake-and-refusal',
    titleKey: 'starterGuideScreen.faqCategoryIntake',
  },
  {
    id: 'schedule-and-expansion',
    titleKey: 'starterGuideScreen.faqCategorySchedule',
  },
  {
    id: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqCategoryReaction',
  },
];

export const STARTER_GUIDE_FAQ_ITEMS: StarterGuideFaqItem[] = [
  {
    id: 'faq-start-age',
    categoryId: 'getting-started',
    titleKey: 'starterGuideScreen.faqStartAgeTitle',
    bodyKey: 'starterGuideScreen.faqStartAgeBody',
  },
  {
    id: 'faq-method-choice',
    categoryId: 'getting-started',
    titleKey: 'starterGuideScreen.faqMethodChoiceTitle',
    bodyKey: 'starterGuideScreen.faqMethodChoiceBody',
  },
  {
    id: 'faq-utensils',
    categoryId: 'tools-and-storage',
    titleKey: 'starterGuideScreen.faqUtensilsTitle',
    bodyKey: 'starterGuideScreen.faqUtensilsBody',
  },
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
    categoryId: 'schedule-and-expansion',
    titleKey: 'starterGuideScreen.faqWaterTitle',
    bodyKey: 'starterGuideScreen.faqWaterBody',
  },
  {
    id: 'faq-iron-start',
    categoryId: 'schedule-and-expansion',
    titleKey: 'starterGuideScreen.faqIronStartTitle',
    bodyKey: 'starterGuideScreen.faqIronStartBody',
  },
  {
    id: 'faq-constipation',
    categoryId: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqConstipationTitle',
    bodyKey: 'starterGuideScreen.faqConstipationBody',
  },
  {
    id: 'faq-skip-day',
    categoryId: 'schedule-and-expansion',
    titleKey: 'starterGuideScreen.faqSkipDayTitle',
    bodyKey: 'starterGuideScreen.faqSkipDayBody',
  },
  {
    id: 'faq-spit-out',
    categoryId: 'intake-and-refusal',
    titleKey: 'starterGuideScreen.faqSpitOutTitle',
    bodyKey: 'starterGuideScreen.faqSpitOutBody',
  },
  {
    id: 'faq-texture-refusal',
    categoryId: 'intake-and-refusal',
    titleKey: 'starterGuideScreen.faqTextureRefusalTitle',
    bodyKey: 'starterGuideScreen.faqTextureRefusalBody',
  },
  {
    id: 'faq-meal-count',
    categoryId: 'schedule-and-expansion',
    titleKey: 'starterGuideScreen.faqMealCountTitle',
    bodyKey: 'starterGuideScreen.faqMealCountBody',
  },
  {
    id: 'faq-protein-start',
    categoryId: 'schedule-and-expansion',
    titleKey: 'starterGuideScreen.faqProteinStartTitle',
    bodyKey: 'starterGuideScreen.faqProteinStartBody',
  },
  {
    id: 'faq-cold-storage',
    categoryId: 'tools-and-storage',
    titleKey: 'starterGuideScreen.faqStorageTitle',
    bodyKey: 'starterGuideScreen.faqStorageBody',
  },
  {
    id: 'faq-rash-what',
    categoryId: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqRashWhatTitle',
    bodyKey: 'starterGuideScreen.faqRashWhatBody',
  },
  {
    id: 'faq-vomit-what',
    categoryId: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqVomitWhatTitle',
    bodyKey: 'starterGuideScreen.faqVomitWhatBody',
  },
  {
    id: 'faq-poop-change',
    categoryId: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqPoopChangeTitle',
    bodyKey: 'starterGuideScreen.faqPoopChangeBody',
  },
  {
    id: 'faq-hospital-when',
    categoryId: 'reaction-and-observation',
    titleKey: 'starterGuideScreen.faqHospitalWhenTitle',
    bodyKey: 'starterGuideScreen.faqHospitalWhenBody',
  },
];
