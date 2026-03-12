export type StarterGuideChapterDefinition = {
  id: string;
  titleKey: string;
  summaryKey: string;
  bulletKeys: [string, string, string];
  noteKey: string;
};

export type StarterGuidePartDefinition = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  chapters: StarterGuideChapterDefinition[];
};

export type StarterGuideProgress = {
  readChapterIds: string[];
  bookmarkedChapterIds: string[];
  lastChapterId?: string;
};

export const STARTER_GUIDE_PROGRESS_STORAGE_KEY = '@weaning-diary/starter-guide-progress';

export const DEFAULT_STARTER_GUIDE_PROGRESS: StarterGuideProgress = {
  readChapterIds: [],
  bookmarkedChapterIds: [],
};

export const STARTER_GUIDE_PARTS: StarterGuidePartDefinition[] = [
  {
    id: 'initial-topping',
    titleKey: 'starterGuideScreen.partPrepTitle',
    descriptionKey: 'starterGuideScreen.partPrepDescription',
    chapters: [
      {
        id: 'prep-signals',
        titleKey: 'starterGuideScreen.prepSignalsTitle',
        summaryKey: 'starterGuideScreen.prepSignalsSummary',
        bulletKeys: [
          'starterGuideScreen.prepSignalsBullet1',
          'starterGuideScreen.prepSignalsBullet2',
          'starterGuideScreen.prepSignalsBullet3',
        ],
        noteKey: 'starterGuideScreen.prepSignalsNote',
      },
      {
        id: 'food-first-menu',
        titleKey: 'starterGuideScreen.foodFirstMenuTitle',
        summaryKey: 'starterGuideScreen.foodFirstMenuSummary',
        bulletKeys: [
          'starterGuideScreen.foodFirstMenuBullet1',
          'starterGuideScreen.foodFirstMenuBullet2',
          'starterGuideScreen.foodFirstMenuBullet3',
        ],
        noteKey: 'starterGuideScreen.foodFirstMenuNote',
      },
      {
        id: 'food-portion',
        titleKey: 'starterGuideScreen.foodPortionTitle',
        summaryKey: 'starterGuideScreen.foodPortionSummary',
        bulletKeys: [
          'starterGuideScreen.foodPortionBullet1',
          'starterGuideScreen.foodPortionBullet2',
          'starterGuideScreen.foodPortionBullet3',
        ],
        noteKey: 'starterGuideScreen.foodPortionNote',
      },
    ],
  },
  {
    id: 'middle-topping',
    titleKey: 'starterGuideScreen.partFirstFoodTitle',
    descriptionKey: 'starterGuideScreen.partFirstFoodDescription',
    chapters: [
      {
        id: 'food-three-day',
        titleKey: 'starterGuideScreen.foodThreeDayTitle',
        summaryKey: 'starterGuideScreen.foodThreeDaySummary',
        bulletKeys: [
          'starterGuideScreen.foodThreeDayBullet1',
          'starterGuideScreen.foodThreeDayBullet2',
          'starterGuideScreen.foodThreeDayBullet3',
        ],
        noteKey: 'starterGuideScreen.foodThreeDayNote',
      },
    ],
  },
  {
    id: 'late-topping',
    titleKey: 'starterGuideScreen.partObserveTitle',
    descriptionKey: 'starterGuideScreen.partObserveDescription',
    chapters: [
      {
        id: 'observe-refusal',
        titleKey: 'starterGuideScreen.observeRefusalTitle',
        summaryKey: 'starterGuideScreen.observeRefusalSummary',
        bulletKeys: [
          'starterGuideScreen.observeRefusalBullet1',
          'starterGuideScreen.observeRefusalBullet2',
          'starterGuideScreen.observeRefusalBullet3',
        ],
        noteKey: 'starterGuideScreen.observeRefusalNote',
      },
      {
        id: 'faq-repeat',
        titleKey: 'starterGuideScreen.faqRepeatTitle',
        summaryKey: 'starterGuideScreen.faqRepeatSummary',
        bulletKeys: [
          'starterGuideScreen.faqRepeatBullet1',
          'starterGuideScreen.faqRepeatBullet2',
          'starterGuideScreen.faqRepeatBullet3',
        ],
        noteKey: 'starterGuideScreen.faqRepeatNote',
      },
      {
        id: 'faq-low-intake',
        titleKey: 'starterGuideScreen.faqLowIntakeTitle',
        summaryKey: 'starterGuideScreen.faqLowIntakeSummary',
        bulletKeys: [
          'starterGuideScreen.faqLowIntakeBullet1',
          'starterGuideScreen.faqLowIntakeBullet2',
          'starterGuideScreen.faqLowIntakeBullet3',
        ],
        noteKey: 'starterGuideScreen.faqLowIntakeNote',
      },
      {
        id: 'faq-allergy',
        titleKey: 'starterGuideScreen.faqAllergyTitle',
        summaryKey: 'starterGuideScreen.faqAllergySummary',
        bulletKeys: [
          'starterGuideScreen.faqAllergyBullet1',
          'starterGuideScreen.faqAllergyBullet2',
          'starterGuideScreen.faqAllergyBullet3',
        ],
        noteKey: 'starterGuideScreen.faqAllergyNote',
      },
    ],
  },
];
