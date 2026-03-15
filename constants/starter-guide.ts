export type StarterGuideChapterDefinition = {
  id: string;
  titleKey: string;
  summaryKey: string;
  bulletKeys: string[];
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
  readinessCheckedIds: string[];
  suppliesCheckedIds: string[];
  lastChapterId?: string;
};

export type StarterGuideReadinessReferenceDefinition = {
  id: string;
  shortLabel: string;
  title: string;
  organization: string;
  year: string;
  url: string;
  summaryKey: string;
};

export type StarterGuideReadinessChecklistDefinition = {
  id: string;
  titleKey: string;
  bodyKey: string;
  sourceIds: string[];
  autoDerived?: 'ageAroundSixMonths';
};

export type StarterGuideSuppliesChecklistDefinition = {
  id: string;
  titleKey: string;
  bodyKey: string;
};

export const STARTER_GUIDE_PROGRESS_STORAGE_KEY = '@weaning-diary/starter-guide-progress';

export const DEFAULT_STARTER_GUIDE_PROGRESS: StarterGuideProgress = {
  readChapterIds: [],
  bookmarkedChapterIds: [],
  readinessCheckedIds: [],
  suppliesCheckedIds: [],
};

export const STARTER_GUIDE_READINESS_REFERENCES: StarterGuideReadinessReferenceDefinition[] = [
  {
    id: 'who-complementary-feeding-2023',
    shortLabel: 'WHO',
    organization: 'World Health Organization',
    year: '2023',
    title: 'WHO Guideline for complementary feeding of infants and young children 6-23 months of age',
    url: 'https://www.who.int/publications/i/item/9789240081864',
    summaryKey: 'starterGuideScreen.referenceWhoSummary',
  },
  {
    id: 'cdc-solid-foods-2025',
    shortLabel: 'CDC',
    organization: 'Centers for Disease Control and Prevention',
    year: '2025',
    title: 'When, What, and How to Introduce Solid Foods',
    url: 'https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html',
    summaryKey: 'starterGuideScreen.referenceCdcSummary',
  },
  {
    id: 'nhs-first-solid-foods',
    shortLabel: 'NHS',
    organization: 'NHS',
    year: 'Current guidance',
    title: "Your baby's first solid foods",
    url: 'https://www.nhs.uk/conditions/baby/weaning-and-feeding/babys-first-solid-foods/',
    summaryKey: 'starterGuideScreen.referenceNhsSummary',
  },
  {
    id: 'aap-baby-food-and-feeding',
    shortLabel: 'AAP',
    organization: 'HealthyChildren.org',
    year: 'Current guidance',
    title: 'Baby Food & Feeding',
    url: 'https://www.healthychildren.org/English/healthy-living/growing-healthy/Pages/baby-food-and-feeding.aspx',
    summaryKey: 'starterGuideScreen.referenceAapSummary',
  },
];

export const STARTER_GUIDE_READINESS_CHECKLIST: StarterGuideReadinessChecklistDefinition[] = [
  {
    id: 'age-around-six-months',
    titleKey: 'starterGuideScreen.readinessAgeTitle',
    bodyKey: 'starterGuideScreen.readinessAgeBody',
    sourceIds: ['who-complementary-feeding-2023', 'cdc-solid-foods-2025', 'nhs-first-solid-foods'],
    autoDerived: 'ageAroundSixMonths',
  },
  {
    id: 'steady-head-and-supported-sit',
    titleKey: 'starterGuideScreen.readinessPostureTitle',
    bodyKey: 'starterGuideScreen.readinessPostureBody',
    sourceIds: ['cdc-solid-foods-2025', 'nhs-first-solid-foods', 'aap-baby-food-and-feeding'],
  },
  {
    id: 'eyes-hands-mouth-coordination',
    titleKey: 'starterGuideScreen.readinessCoordinationTitle',
    bodyKey: 'starterGuideScreen.readinessCoordinationBody',
    sourceIds: ['cdc-solid-foods-2025', 'nhs-first-solid-foods'],
  },
  {
    id: 'swallows-instead-of-pushing-out',
    titleKey: 'starterGuideScreen.readinessSwallowTitle',
    bodyKey: 'starterGuideScreen.readinessSwallowBody',
    sourceIds: ['cdc-solid-foods-2025', 'nhs-first-solid-foods', 'aap-baby-food-and-feeding'],
  },
  {
    id: 'shows-interest-in-food',
    titleKey: 'starterGuideScreen.readinessInterestTitle',
    bodyKey: 'starterGuideScreen.readinessInterestBody',
    sourceIds: ['cdc-solid-foods-2025', 'aap-baby-food-and-feeding'],
  },
];

export const STARTER_GUIDE_SUPPLIES_CHECKLIST: StarterGuideSuppliesChecklistDefinition[] = [
  {
    id: 'soft-spoon-and-small-bowl',
    titleKey: 'starterGuideScreen.suppliesSpoonTitle',
    bodyKey: 'starterGuideScreen.suppliesSpoonBody',
  },
  {
    id: 'bib-and-wipes',
    titleKey: 'starterGuideScreen.suppliesBibTitle',
    bodyKey: 'starterGuideScreen.suppliesBibBody',
  },
  {
    id: 'highchair-or-safe-seat',
    titleKey: 'starterGuideScreen.suppliesSeatTitle',
    bodyKey: 'starterGuideScreen.suppliesSeatBody',
  },
  {
    id: 'first-ingredient-plan',
    titleKey: 'starterGuideScreen.suppliesIngredientTitle',
    bodyKey: 'starterGuideScreen.suppliesIngredientBody',
  },
  {
    id: 'recording-flow-ready',
    titleKey: 'starterGuideScreen.suppliesRecordTitle',
    bodyKey: 'starterGuideScreen.suppliesRecordBody',
  },
];

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
          'starterGuideScreen.prepSignalsBullet4',
        ],
        noteKey: 'starterGuideScreen.prepSignalsNote',
      },
      {
        id: 'prep-timing',
        titleKey: 'starterGuideScreen.prepTimingTitle',
        summaryKey: 'starterGuideScreen.prepTimingSummary',
        bulletKeys: [
          'starterGuideScreen.prepTimingBullet1',
          'starterGuideScreen.prepTimingBullet2',
          'starterGuideScreen.prepTimingBullet3',
          'starterGuideScreen.prepTimingBullet4',
        ],
        noteKey: 'starterGuideScreen.prepTimingNote',
      },
      {
        id: 'prep-tools',
        titleKey: 'starterGuideScreen.prepToolsTitle',
        summaryKey: 'starterGuideScreen.prepToolsSummary',
        bulletKeys: [
          'starterGuideScreen.prepToolsBullet1',
          'starterGuideScreen.prepToolsBullet2',
          'starterGuideScreen.prepToolsBullet3',
          'starterGuideScreen.prepToolsBullet4',
        ],
        noteKey: 'starterGuideScreen.prepToolsNote',
      },
      {
        id: 'food-first-menu',
        titleKey: 'starterGuideScreen.foodFirstMenuTitle',
        summaryKey: 'starterGuideScreen.foodFirstMenuSummary',
        bulletKeys: [
          'starterGuideScreen.foodFirstMenuBullet1',
          'starterGuideScreen.foodFirstMenuBullet2',
          'starterGuideScreen.foodFirstMenuBullet3',
          'starterGuideScreen.foodFirstMenuBullet4',
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
          'starterGuideScreen.foodPortionBullet4',
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
          'starterGuideScreen.foodThreeDayBullet4',
        ],
        noteKey: 'starterGuideScreen.foodThreeDayNote',
      },
      {
        id: 'observe-reaction',
        titleKey: 'starterGuideScreen.observeReactionTitle',
        summaryKey: 'starterGuideScreen.observeReactionSummary',
        bulletKeys: [
          'starterGuideScreen.observeReactionBullet1',
          'starterGuideScreen.observeReactionBullet2',
          'starterGuideScreen.observeReactionBullet3',
          'starterGuideScreen.observeReactionBullet4',
        ],
        noteKey: 'starterGuideScreen.observeReactionNote',
      },
      {
        id: 'observe-records',
        titleKey: 'starterGuideScreen.observeRecordsTitle',
        summaryKey: 'starterGuideScreen.observeRecordsSummary',
        bulletKeys: [
          'starterGuideScreen.observeRecordsBullet1',
          'starterGuideScreen.observeRecordsBullet2',
          'starterGuideScreen.observeRecordsBullet3',
          'starterGuideScreen.observeRecordsBullet4',
        ],
        noteKey: 'starterGuideScreen.observeRecordsNote',
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
          'starterGuideScreen.observeRefusalBullet4',
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
          'starterGuideScreen.faqRepeatBullet4',
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
          'starterGuideScreen.faqLowIntakeBullet4',
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
          'starterGuideScreen.faqAllergyBullet4',
        ],
        noteKey: 'starterGuideScreen.faqAllergyNote',
      },
    ],
  },
];
