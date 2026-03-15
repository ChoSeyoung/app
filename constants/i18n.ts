type Locale = 'ko' | 'en';

type Messages = {
  common: {
    seeAll: string;
    today: string;
    save: string;
    loading: string;
    optional: string;
  };
  tabs: {
    home: string;
    explore: string;
    mealPlan: string;
    journey: string;
    ingredients: string;
    profile: string;
    more: string;
  };
  home: {
    weekdays: string[];
    greeting: string;
    welcomeSuffix: string;
    todayMealCardTitle: string;
    todayRecordStatusTitle: string;
    todayRecordStatusBody: string;
    todayRecordStatusEmptyTitle: string;
    todayRecordStatusEmptyAction: string;
    todayRecordStatusDone: string;
    todayRecordStatusLatest: string;
    todayRecordStatusView: string;
    cautionAlertTitle: string;
    cautionAlertBody: string;
    cautionAlertFallback: string;
    myJournal: string;
    quickJournal: string;
    profileRequiredTitle: string;
    profileRequiredBody: string;
    profileRequiredAction: string;
    heroTitle: string;
    heroBody: string;
    sideLabel: string;
    editProfile: string;
    cards: {
      morningReactionTitle: string;
      morningReactionBody: string;
      morningReactionChip: string;
      newIngredientTitle: string;
      newIngredientBody: string;
      newIngredientChip: string;
      eveningSleepTitle: string;
      eveningSleepBody: string;
      eveningSleepChip: string;
    };
    actions: {
      observationTitle: string;
      observationBody: string;
      observationChip: string;
      riskTitle: string;
      riskBody: string;
      riskChip: string;
      recordTitle: string;
      recordBody: string;
      recordChip: string;
      defaultTitle: string;
      defaultBody: string;
      defaultChip: string;
      noneFallback: string;
    };
      profileForm: {
        overline: string;
        title: string;
        subtitle: string;
      babyNameLabel: string;
      babyNamePlaceholder: string;
      birthDateLabel: string;
      birthDatePlaceholder: string;
      feedingStartDateLabel: string;
      feedingStartDatePlaceholder: string;
      feedingStageLabel: string;
      mealsPerDayLabel: string;
      feedingMethodLabel: string;
      photoLabel: string;
      photoButton: string;
      photoEditButton: string;
      photoSelected: string;
      submit: string;
      validationTitle: string;
      validationName: string;
      validationBirthDate: string;
      validationBirthDateFormat: string;
      permissionTitle: string;
      permissionMessage: string;
        saveFailedTitle: string;
        saveFailedMessage: string;
        stepNameTitle: string;
        stepBirthDateTitle: string;
        stepPhotoTitle: string;
        stepFeedingSetupTitle: string;
        next: string;
        ageConfirmTitle: string;
        ageConfirmMessage: string;
        ageConfirmCancel: string;
        ageConfirmContinue: string;
        stagePrep: string;
        stageInitial: string;
        stageMiddle: string;
        stageLate: string;
        stageComplete: string;
        mealsOne: string;
        mealsTwo: string;
        mealsThree: string;
        methodTopping: string;
        methodTraditional: string;
        methodBlwMixed: string;
      };
  };
  explore: {
    overline: string;
    title: string;
    body: string;
    colorTone: string;
    principles: string;
    principleQuickCaptureTitle: string;
    principleQuickCaptureBody: string;
    principlePatternFirstTitle: string;
    principlePatternFirstBody: string;
    principleCalmClearTitle: string;
    principleCalmClearBody: string;
  };
  placeholders: {
    mealPlanTitle: string;
    mealPlanBody: string;
    ingredientsTitle: string;
    ingredientsBody: string;
    journeyTitle: string;
    journeyBody: string;
    profileTitle: string;
    profileBody: string;
  };
  profileScreen: {
    title: string;
    cardTitle: string;
    heroSuffix: string;
    babyName: string;
    birthDate: string;
    age: string;
    feedingStartDate: string;
    feedingStage: string;
    mealsPerDay: string;
    feedingMethod: string;
    noProfileTitle: string;
    noProfileBody: string;
    createProfile: string;
    menuTitle: string;
    editProfile: string;
    notificationSettings: string;
    appSettings: string;
    dataManagement: string;
    appInfoTitle: string;
    appVersion: string;
    openSourceLicense: string;
    openSourceLicenseBody: string;
    termsOfService: string;
    termsOfServiceBody: string;
    privacyPolicy: string;
    privacyPolicyBody: string;
    contactDeveloper: string;
    contactDeveloperBody: string;
    buyCoffee: string;
    buyCoffeeBody: string;
    contactDeveloperSubject: string;
    contactDeveloperBodyTemplate: string;
    comingSoon: string;
  };
  profileEditorScreen: {
    title: string;
    subtitle: string;
    birthDateHint: string;
    feedingStartDateHint: string;
    photoHint: string;
    saveButton: string;
    saveSuccess: string;
    validationStartDateFormat: string;
  };
  openSourceScreen: {
    title: string;
    subtitle: string;
    directDependencyNotice: string;
    versionLabel: string;
    licenseLabel: string;
  };
  termsScreen: {
    title: string;
    subtitle: string;
  };
  privacyScreen: {
    title: string;
    subtitle: string;
  };
  notificationSettingsScreen: {
    title: string;
    subtitle: string;
    sectionActivity: string;
    mealPlanMorningTitle: string;
    mealPlanMorningBody: string;
    feedingRecordReminderTitle: string;
    feedingRecordReminderBody: string;
    sectionSafety: string;
    cautionReactionAlertTitle: string;
    cautionReactionAlertBody: string;
    newIngredientObservationTitle: string;
    newIngredientObservationBody: string;
    mealPlanMorningToast: string;
    feedingRecordReminderToast: string;
    cautionReactionAlertToast: string;
    newIngredientObservationToast: string;
    sectionMessage: string;
    emailUpdatesTitle: string;
    emailUpdatesBody: string;
    sectionQuiet: string;
    quietHoursTitle: string;
    quietHoursBody: string;
    footer: string;
  };
  moreScreen: {
    title: string;
    subtitle: string;
    settingsTitle: string;
    settingsBody: string;
    weaningStartGuide: string;
    weaningStartGuideBody: string;
    weaningStartGuideAction: string;
    appInfoTitle: string;
    mealPreferences: string;
    weeklyInsights: string;
  };
  mealPlanPreferencesScreen: {
    title: string;
    subtitle: string;
    stageTitle: string;
    stageBody: string;
    mealsTitle: string;
    mealsBody: string;
    methodTitle: string;
    methodBody: string;
    proteinTitle: string;
    proteinBody: string;
    proteinStarted: string;
    proteinNotStarted: string;
    textureTitle: string;
    textureBody: string;
    textureThin: string;
    textureMash: string;
    textureChunk: string;
    textureFinger: string;
    goalTitle: string;
    goalBody: string;
    goalVariety: string;
    goalEasy: string;
    goalFreezer: string;
    blockedTitle: string;
    blockedBody: string;
    preferredTitle: string;
    preferredBody: string;
    dislikedTitle: string;
    dislikedBody: string;
    refusedTitle: string;
    refusedBody: string;
    saveButton: string;
    saveSuccess: string;
  };
  dataManagementScreen: {
    title: string;
    subtitle: string;
    exportTitle: string;
    exportBody: string;
    exportButton: string;
    exportSuccess: string;
    exportFailed: string;
    importTitle: string;
    importBody: string;
    importButton: string;
    importSuccess: string;
    importFailed: string;
  };
  weeklyInsightsScreen: {
    title: string;
    subtitle: string;
    recordsTitle: string;
    recordsUnit: string;
    newIngredientsTitle: string;
    topIngredientTitle: string;
    cautionTitle: string;
    completionTitle: string;
    itemsUnit: string;
    timesUnit: string;
    emptyValue: string;
  };
  splashScreen: {
    eyebrow: string;
    title: string;
    subtitle: string;
    status: string;
  };
  starterGuideScreen: {
    eyebrow: string;
    title: string;
    subtitle: string;
    checklistTitle: string;
    readinessEyebrow: string;
    readinessTitle: string;
    readinessChecklistTitle: string;
    suppliesChecklistTitle: string;
    suppliesChecklistBody: string;
    readinessBody: string;
    readinessSummaryBody: string;
    readinessStatusReadyTitle: string;
    readinessStatusReadyBody: string;
    readinessStatusAlmostTitle: string;
    readinessStatusAlmostBody: string;
    readinessStatusWaitTitle: string;
    readinessStatusWaitBody: string;
    readinessStatusUnknownTitle: string;
    readinessStatusUnknownBody: string;
    readinessSignalsLabel: string;
    readinessAgeKnown: string;
    readinessAgeUnknown: string;
    readinessProfileAction: string;
    readinessOpenAction: string;
    readinessReopenAction: string;
    readinessCompleteToastTitle: string;
    readinessCompleteToastBody: string;
    referenceOpenFailed: string;
    suppliesOpenAction: string;
    suppliesReopenAction: string;
    suppliesProgressLabel: string;
    readinessManualBadge: string;
    readinessAutoBadge: string;
    readinessReferenceLabel: string;
    readinessAgeTitle: string;
    readinessAgeBody: string;
    readinessPostureTitle: string;
    readinessPostureBody: string;
    readinessCoordinationTitle: string;
    readinessCoordinationBody: string;
    readinessSwallowTitle: string;
    readinessSwallowBody: string;
    readinessInterestTitle: string;
    readinessInterestBody: string;
    suppliesSpoonTitle: string;
    suppliesSpoonBody: string;
    suppliesBibTitle: string;
    suppliesBibBody: string;
    suppliesSeatTitle: string;
    suppliesSeatBody: string;
    suppliesIngredientTitle: string;
    suppliesIngredientBody: string;
    suppliesRecordTitle: string;
    suppliesRecordBody: string;
    readinessCautionTitle: string;
    readinessCautionBody: string;
    referenceTitle: string;
    referenceBody: string;
    referenceOpenAction: string;
    referenceWhoSummary: string;
    referenceCdcSummary: string;
    referenceNhsSummary: string;
    referenceAapSummary: string;
    loadingBody: string;
    progressTitle: string;
    progressBody: string;
    progressBadge: string;
    readCountLabel: string;
    bookmarkCountLabel: string;
    partCountLabel: string;
    bookmarkTitle: string;
    bookmarkBody: string;
    bookmarkEmptyTitle: string;
    bookmarkEmptyBody: string;
    partTitle: string;
    partBody: string;
    partChipMeta: string;
    faqTitle: string;
    faqBody: string;
    recommendedTitle: string;
    recommendedBody: string;
    faqCategoryTitle: string;
    faqCategoryGettingStarted: string;
    faqCategoryTools: string;
    faqCategoryIntake: string;
    faqCategorySchedule: string;
    faqCategoryReaction: string;
    faqStartAgeTitle: string;
    faqStartAgeBody: string;
    faqMethodChoiceTitle: string;
    faqMethodChoiceBody: string;
    faqUtensilsTitle: string;
    faqUtensilsBody: string;
    faqIronStartTitle: string;
    faqIronStartBody: string;
    faqSpitOutTitle: string;
    faqSpitOutBody: string;
    faqTextureRefusalTitle: string;
    faqTextureRefusalBody: string;
    faqMealCountTitle: string;
    faqMealCountBody: string;
    faqProteinStartTitle: string;
    faqProteinStartBody: string;
    faqRashWhatTitle: string;
    faqRashWhatBody: string;
    faqVomitWhatTitle: string;
    faqVomitWhatBody: string;
    faqPoopChangeTitle: string;
    faqPoopChangeBody: string;
    faqHospitalWhenTitle: string;
    faqHospitalWhenBody: string;
    faqSearchPlaceholder: string;
    faqSearchEmpty: string;
    chapterIndex: string;
    chapterDetailEyebrow: string;
    chapterPointsTitle: string;
    noteTitle: string;
    markRead: string;
    markUnread: string;
    nextChapter: string;
    partPrepTitle: string;
    partPrepDescription: string;
    prepSignalsTitle: string;
    prepSignalsSummary: string;
    prepSignalsBullet1: string;
    prepSignalsBullet2: string;
    prepSignalsBullet3: string;
    prepSignalsBullet4: string;
    prepSignalsNote: string;
    prepTimingTitle: string;
    prepTimingSummary: string;
    prepTimingBullet1: string;
    prepTimingBullet2: string;
    prepTimingBullet3: string;
    prepTimingBullet4: string;
    prepTimingNote: string;
    prepToolsTitle: string;
    prepToolsSummary: string;
    prepToolsBullet1: string;
    prepToolsBullet2: string;
    prepToolsBullet3: string;
    prepToolsBullet4: string;
    prepToolsNote: string;
    partFirstFoodTitle: string;
    partFirstFoodDescription: string;
    foodFirstMenuTitle: string;
    foodFirstMenuSummary: string;
    foodFirstMenuBullet1: string;
    foodFirstMenuBullet2: string;
    foodFirstMenuBullet3: string;
    foodFirstMenuBullet4: string;
    foodFirstMenuNote: string;
    foodPortionTitle: string;
    foodPortionSummary: string;
    foodPortionBullet1: string;
    foodPortionBullet2: string;
    foodPortionBullet3: string;
    foodPortionBullet4: string;
    foodPortionNote: string;
    foodThreeDayTitle: string;
    foodThreeDaySummary: string;
    foodThreeDayBullet1: string;
    foodThreeDayBullet2: string;
    foodThreeDayBullet3: string;
    foodThreeDayBullet4: string;
    foodThreeDayNote: string;
    partObserveTitle: string;
    partObserveDescription: string;
    observeReactionTitle: string;
    observeReactionSummary: string;
    observeReactionBullet1: string;
    observeReactionBullet2: string;
    observeReactionBullet3: string;
    observeReactionBullet4: string;
    observeReactionNote: string;
    observeRefusalTitle: string;
    observeRefusalSummary: string;
    observeRefusalBullet1: string;
    observeRefusalBullet2: string;
    observeRefusalBullet3: string;
    observeRefusalBullet4: string;
    observeRefusalNote: string;
    observeRecordsTitle: string;
    observeRecordsSummary: string;
    observeRecordsBullet1: string;
    observeRecordsBullet2: string;
    observeRecordsBullet3: string;
    observeRecordsBullet4: string;
    observeRecordsNote: string;
    partFaqTitle: string;
    partFaqDescription: string;
    faqLowIntakeTitle: string;
    faqLowIntakeShortBody: string;
    faqLowIntakeSummary: string;
    faqLowIntakeBullet1: string;
    faqLowIntakeBullet2: string;
    faqLowIntakeBullet3: string;
    faqLowIntakeBullet4: string;
    faqLowIntakeNote: string;
    faqRepeatTitle: string;
    faqRepeatShortBody: string;
    faqRepeatSummary: string;
    faqRepeatBullet1: string;
    faqRepeatBullet2: string;
    faqRepeatBullet3: string;
    faqRepeatBullet4: string;
    faqRepeatNote: string;
    faqAllergyTitle: string;
    faqAllergyShortBody: string;
    faqAllergySummary: string;
    faqAllergyBullet1: string;
    faqAllergyBullet2: string;
    faqAllergyBullet3: string;
    faqAllergyBullet4: string;
    faqAllergyNote: string;
    faqFirstDayTimeTitle: string;
    faqFirstDayTimeBody: string;
    faqWaterTitle: string;
    faqWaterBody: string;
    faqConstipationTitle: string;
    faqConstipationBody: string;
    faqSkipDayTitle: string;
    faqSkipDayBody: string;
    faqStorageTitle: string;
    faqStorageBody: string;
    adBadge: string;
    adTitle: string;
    adBody: string;
    adPlaceholder: string;
  };
  mealPlanScreen: {
    title: string;
    weekMode: string;
    monthMode: string;
    babyStatusEyebrow: string;
    todayEyebrow: string;
    selectedDayEyebrow: string;
    subtitle: string;
    todayTitle: string;
    todayGuideTitle: string;
    todayHint: string;
    todayEmpty: string;
    babyInfoTitle: string;
    profileFallback: string;
    summaryAge: string;
    summaryFeedingWeek: string;
    summaryStage: string;
    summaryMeals: string;
    summaryMethod: string;
    summaryBlocked: string;
    summaryBlockedNone: string;
    startDateSetupTitle: string;
    startDateSetupBody: string;
    startDateInputLabel: string;
    startDateInputPlaceholder: string;
    startDateSaveButton: string;
    startDateSaveSuccess: string;
    startDateValidation: string;
    weekPlanTitle: string;
    insightTitle: string;
    reasonFeedingWeek: string;
    reasonMealCount: string;
    reasonBlocked: string;
    reasonObservation: string;
    reasonRefusal: string;
    reasonFavorite: string;
    switchToRecordButton: string;
    fedButton: string;
    expandButton: string;
    foldButton: string;
    monthOverviewHint: string;
    weekEditHint: string;
    switchToWeekForEditButton: string;
    newIngredientBadge: string;
    noteLabel: string;
    noneLabel: string;
    noteObserveNew: string;
    noteExcludeCaution: string;
    preferencesButton: string;
    preferencesCtaTitle: string;
    preferencesCtaBody: string;
    observationHint: string;
    stagePrep: string;
    stageInitial: string;
    stageMiddle: string;
    stageLate: string;
    stageComplete: string;
    methodTopping: string;
    methodTraditional: string;
    methodBlwMixed: string;
    mealCountFormat: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    comingSoon: string;
  };
  journeyScreen: {
    title: string;
    subtitle: string;
    addButton: string;
    draftBanner: string;
    emptyTitle: string;
    emptyBody: string;
    emptyAction: string;
    dateLabel: string;
    timeLabel: string;
    ingredientsLabel: string;
    ingredientsHint: string;
    ingredientSearchPlaceholder: string;
    recentIngredientsTitle: string;
    amountLabel: string;
    amountTypeGram: string;
    amountTypeLevel: string;
    amountGramPlaceholder: string;
    amountLevelHigh: string;
    amountLevelMedium: string;
    amountLevelLow: string;
    reactionLabel: string;
    reactionTypeNone: string;
    reactionTypeNormal: string;
    reactionTypeFussy: string;
    reactionTypeVomit: string;
    reactionTypeRash: string;
    photoLabel: string;
    photoAddButton: string;
    photoChangeButton: string;
    noteLabel: string;
    notePlaceholder: string;
    saveButton: string;
    updateButton: string;
    deleteButton: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    deleteConfirmAction: string;
    cancel: string;
    listTitle: string;
    detailTitle: string;
    editButton: string;
    noPhoto: string;
    validationIngredient: string;
    validationDate: string;
    validationTime: string;
    saveSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    photoPermissionTitle: string;
    photoPermissionMessage: string;
    photoOptionalHint: string;
    seededFromPlan: string;
    amountSummaryNone: string;
    todayLabel: string;
    recordCount: string;
  };
  ingredientsScreen: {
    title: string;
    items: string[];
  };
  ingredientScreen: {
    searchPlaceholder: string;
    addButton: string;
    addTitle: string;
    addNameLabel: string;
    addCategoryLabel: string;
    addSave: string;
    addCancel: string;
    detailTitle: string;
    category: string;
    status: string;
    firstTriedDate: string;
    notSet: string;
    firstTriedPending: string;
    filterAll: string;
    filterTried: string;
    filterNotTried: string;
    filterRisk: string;
    filterRetry: string;
    emptyTitle: string;
    emptyBody: string;
    duplicateNameError: string;
    nameRequiredError: string;
    statusNotTried: string;
    statusTried: string;
    statusCaution: string;
    statusAllergy: string;
    actionSetTried: string;
    actionSetCaution: string;
    actionSetAllergy: string;
    actionReset: string;
    actionToggleFavorite: string;
    reactionsTitle: string;
    reactionsEmpty: string;
    reactionAddTitle: string;
    memoTitle: string;
    memoSaveButton: string;
    reactionTypeNone: string;
    reactionTypeCaution: string;
    reactionTypeAllergy: string;
    reactionTypeOther: string;
    reactionNotePlaceholder: string;
    reactionAddButton: string;
    recordsTitle: string;
    recordsEmpty: string;
    savedMessage: string;
    saveFailedMessage: string;
    retrySuggested: string;
  };
};

const messages: Record<Locale, Messages> = {
  ko: {
    common: {
      seeAll: '전체보기',
      today: '오늘',
      save: '저장',
      loading: '불러오는 중...',
      optional: '선택',
    },
    tabs: {
      home: '홈',
      explore: '탐색',
      mealPlan: '식단',
      journey: '기록',
      ingredients: '식재료',
      profile: '프로필',
      more: '더보기',
    },
    home: {
      weekdays: ['일', '월', '화', '수', '목', '금', '토'],
      greeting: '안녕하세요, 이유식 다이어리',
      welcomeSuffix: '오늘 이유식 기록을 시작해볼까요?',
      todayMealCardTitle: '오늘 식단 카드',
      todayRecordStatusTitle: '오늘 기록 현황',
      todayRecordStatusBody: '아직 오늘 이유식 기록이 없어요. 첫 기록을 남겨보세요.',
      todayRecordStatusEmptyTitle: '오늘 이유식 기록이 아직 없어요',
      todayRecordStatusEmptyAction: '이유식 기록 추가',
      todayRecordStatusDone: '오늘 {{count}}개의 이유식 기록이 있어요',
      todayRecordStatusLatest: '{{time}}에 {{ingredients}} 기록을 남겼어요.',
      todayRecordStatusView: '오늘 기록 보기',
      cautionAlertTitle: '주의 반응 알림',
      cautionAlertBody: '최근 기록 기준 주의가 필요한 반응을 확인하세요.',
      cautionAlertFallback: '최근 메모나 첫 시도일을 확인해보세요.',
      myJournal: '오늘의 기록',
      quickJournal: '빠른 기록',
      profileRequiredTitle: '아기 프로필을 먼저 입력해주세요',
      profileRequiredBody: '홈 맞춤 메시지와 기록 기능을 사용하려면 프로필 입력이 필요해요.',
      profileRequiredAction: '아기 프로필 입력하기',
      heroTitle: '오늘 먹일 식단',
      heroBody: '오늘 추천 식단과 도입할 재료를 확인해보세요.',
      sideLabel: '저녁',
      editProfile: '프로필 수정',
      cards: {
        morningReactionTitle: '아침 반응 체크',
        morningReactionBody: '오늘 아침 이유식 반응은 어땠나요?',
        morningReactionChip: '반응',
        newIngredientTitle: '새 식재료 기록',
        newIngredientBody: '처음 도전한 식재료를 남겨주세요.',
        newIngredientChip: '식재료',
        eveningSleepTitle: '저녁 수면 메모',
        eveningSleepBody: '섭취 후 수면 패턴을 간단히 적어두세요.',
        eveningSleepChip: '수면',
      },
      actions: {
        observationTitle: '새 식재료 관찰 중이에요',
        observationBody: '{{ingredients}} 반응을 오늘 한 번 더 살펴보세요.',
        observationChip: '관찰',
        riskTitle: '어제 반응을 다시 확인해보세요',
        riskBody: '어제 {{count}}건의 주의 기록이 있어요. 오늘 식단 전 메모를 먼저 봐주세요.',
        riskChip: '주의',
        recordTitle: '오늘 기록이 아직 없어요',
        recordBody: '먹인 뒤 바로 기록하면 다음 식단 추천이 더 정확해져요.',
        recordChip: '기록',
        defaultTitle: '오늘도 차분하게 이어가볼까요?',
        defaultBody: '기록과 식단이 잘 이어지고 있어요. 오늘 추천만 가볍게 확인해보세요.',
        defaultChip: '안내',
        noneFallback: '새 식재료',
      },
      profileForm: {
        overline: '초기 설정',
        title: '아기 프로필 설정',
        subtitle: '입력한 정보로 홈 화면을 맞춤 제공해요.',
        babyNameLabel: '아기 이름 / 태명 / 별명',
        babyNamePlaceholder: '예: 서아, 꼬물이',
        birthDateLabel: '생년월일',
        birthDatePlaceholder: '예: 20250928',
        feedingStartDateLabel: '이유식 시작일',
        feedingStartDatePlaceholder: '예: 20260301',
        feedingStageLabel: '현재 이유식 단계',
        mealsPerDayLabel: '하루 식사 횟수',
        feedingMethodLabel: '진행 방식',
        photoLabel: '프로필 사진',
        photoButton: '사진 업로드',
        photoEditButton: '사진 수정',
        photoSelected: '사진 선택됨',
        submit: '프로필 저장',
        validationTitle: '입력 정보를 확인해주세요',
        validationName: '아기 이름(또는 태명/별명)을 입력해주세요.',
        validationBirthDate: '생년월일을 입력해주세요.',
        validationBirthDateFormat: '생년월일은 숫자 8자리(YYYYMMDD)로 입력해주세요.',
        permissionTitle: '권한 필요',
        permissionMessage: '사진 업로드를 위해 갤러리 접근 권한이 필요합니다.',
        saveFailedTitle: '저장 실패',
        saveFailedMessage: '프로필 저장에 실패했습니다. 다시 시도해주세요.',
        stepNameTitle: '먼저 아기를 어떻게 부를지 알려주세요',
        stepBirthDateTitle: '생년월일을 입력해주세요',
        stepPhotoTitle: '마지막으로 사진을 선택할까요?',
        stepFeedingSetupTitle: '식단 추천 기준도 함께 알려주세요',
        next: '다음',
        ageConfirmTitle: '생년월일 확인',
        ageConfirmMessage: '입력한 생년월일 기준으로 24개월 이상입니다. 잘 입력했는지 확인해주세요.',
        ageConfirmCancel: '수정할게요',
        ageConfirmContinue: '맞게 입력했어요',
        stagePrep: '준비기',
        stageInitial: '초기',
        stageMiddle: '중기',
        stageLate: '후기',
        stageComplete: '완료기',
        mealsOne: '1회',
        mealsTwo: '2회',
        mealsThree: '3회',
        methodTopping: '토핑 이유식',
        methodTraditional: '전통 이유식',
        methodBlwMixed: 'BLW 혼합',
      },
    },
    explore: {
      overline: '디자인 방향',
      title: '이유식 다이어리\n시각 기준 v1',
      body: '기능 개발 전에 톤, 위계, 정보 밀도를 먼저 고정합니다.',
      colorTone: '컬러 톤',
      principles: '디자인 원칙',
      principleQuickCaptureTitle: '빠른 기록',
      principleQuickCaptureBody: '기록 입력은 30초 이내. 필수 필드만 먼저 노출합니다.',
      principlePatternFirstTitle: '패턴 우선',
      principlePatternFirstBody: '식재료와 반응의 연결을 빠르게 확인할 수 있게 구성합니다.',
      principleCalmClearTitle: '차분하지만 명확하게',
      principleCalmClearBody: '불안을 키우는 경고 UX를 피하고, 중요한 변화만 강조합니다.',
    },
    placeholders: {
      mealPlanTitle: '식단',
      mealPlanBody: '주간 식단 구성과 식재료 계획 화면이 들어갈 자리입니다.',
      ingredientsTitle: '식재료',
      ingredientsBody: '식재료 등록/관리 및 반응 연동 화면이 들어갈 자리입니다.',
      journeyTitle: '기록',
      journeyBody: '주간/월간 기록 요약 화면이 들어갈 자리입니다.',
      profileTitle: '프로필',
      profileBody: '보호자 정보, 앱 설정, 알림 설정을 구성할 자리입니다.',
    },
    profileScreen: {
      title: '프로필',
      cardTitle: '아기 프로필',
      heroSuffix: '의 다이어리를 예쁘게 정리해보세요.',
      babyName: '아기 이름',
      birthDate: '생년월일',
      age: '성장 정보',
      feedingStartDate: '이유식 시작일',
      feedingStage: '이유식 단계',
      mealsPerDay: '하루 식사 수',
      feedingMethod: '진행 방식',
      noProfileTitle: '아기 프로필을 먼저 입력해주세요',
      noProfileBody: '프로필을 입력하면 홈 메시지와 기록 화면이 맞춤으로 제공됩니다.',
      createProfile: '아기 프로필 입력하기',
      menuTitle: '설정 메뉴',
      editProfile: '프로필 수정',
      notificationSettings: '알림 설정',
      appSettings: '앱 설정',
      dataManagement: '데이터 관리',
      appInfoTitle: '앱 정보',
      appVersion: '앱 버전',
      openSourceLicense: '오픈소스 라이선스',
      openSourceLicenseBody: '이 앱은 오픈소스 라이브러리를 사용하며, 각 패키지의 라이선스 고지를 따릅니다.',
      termsOfService: '서비스 이용약관',
      termsOfServiceBody: '서비스 이용 조건과 이용자 책임, 면책 사항을 확인할 수 있어요.',
      privacyPolicy: '개인정보 처리방침',
      privacyPolicyBody: '수집 항목, 저장 방식, 이용 목적과 삭제 기준을 확인할 수 있어요.',
      contactDeveloper: '문의 및 건의 보내기',
      contactDeveloperBody: '메일 앱에서 문의 제목과 내용을 바로 작성할 수 있어요.',
      buyCoffee: '개발자 커피 사주기',
      buyCoffeeBody: 'Buy Me a Coffee 페이지에서 개발자를 후원할 수 있어요.',
      contactDeveloperSubject: '[Weaning Diary] 문의 및 건의',
      contactDeveloperBodyTemplate:
        '안녕하세요.\n\n문의 또는 건의 내용을 아래에 작성해주세요.\n\n- 사용 기기:\n- 앱 버전:\n- 문의 내용:\n',
      comingSoon: '준비 중인 기능입니다.',
    },
    profileEditorScreen: {
      title: '프로필 수정',
      subtitle: '아이 정보를 예쁘게 정리해둘 수 있어요.',
      birthDateHint: '숫자 8자리로 입력해주세요. 예: 20250928',
      feedingStartDateHint: '선택 입력이에요. 예: 20260301',
      photoHint: '사진은 선택 항목이에요.',
      saveButton: '프로필 저장',
      saveSuccess: '프로필을 저장했어요.',
      validationStartDateFormat: '이유식 시작일은 숫자 8자리(YYYYMMDD)로 입력해주세요.',
    },
    openSourceScreen: {
      title: '오픈소스 라이선스',
      subtitle: '앱에서 직접 사용하는 주요 패키지와 라이선스를 확인할 수 있어요.',
      directDependencyNotice: '현재 화면은 앱의 직접 의존성 기준 오픈소스 패키지와 라이선스를 안내합니다.',
      versionLabel: '버전',
      licenseLabel: '라이선스',
    },
    termsScreen: {
      title: '서비스 이용약관',
      subtitle: '앱 이용 조건과 책임 범위를 간단히 확인할 수 있어요.',
    },
    privacyScreen: {
      title: '개인정보 처리방침',
      subtitle: '앱에서 다루는 개인정보와 저장 방식을 안내해요.',
    },
    notificationSettingsScreen: {
      title: '알림 설정',
      subtitle: '기록 리마인드와 안전 알림을 우리 아기 흐름에 맞게 조정해요.',
      sectionActivity: '기록/식단 알림',
      mealPlanMorningTitle: '오늘 식단 알림',
      mealPlanMorningBody: '아침에 오늘 식단을 미리 확인할 수 있게 알려드려요.',
      feedingRecordReminderTitle: '이유식 기록 리마인드',
      feedingRecordReminderBody: '먹인 뒤 기록을 놓치지 않도록 가볍게 알려드려요.',
      sectionSafety: '안전/관찰 알림',
      cautionReactionAlertTitle: '주의 반응 다시 보기',
      cautionReactionAlertBody: '토함, 발진, 보챔 같은 반응 기록을 다시 확인할 수 있게 알려드려요.',
      newIngredientObservationTitle: '신규 식재료 관찰 체크',
      newIngredientObservationBody: '새 식재료를 시작한 뒤 3일 관찰 일정을 챙겨드려요.',
      mealPlanMorningToast: '오늘 첫 식단은 {{meal}}로 준비해봤어요.',
      feedingRecordReminderToast: '오늘 먹인 내용이 있다면 가볍게 기록해보세요.',
      cautionReactionAlertToast: '어제 주의 반응 {{count}}건이 있었어요. 오늘 식단 전에 다시 확인해보세요.',
      newIngredientObservationToast: '지금 {{count}}개의 신규 식재료를 관찰 중이에요.',
      sectionMessage: '문자/이메일',
      emailUpdatesTitle: '이메일 소식 받기',
      emailUpdatesBody: '새 기능, 업데이트, 작은 서비스 소식을 이메일로 받아볼 수 있어요.',
      sectionQuiet: '야간 알림',
      quietHoursTitle: '야간 알림 묶기',
      quietHoursBody: '오후 9시부터 오전 8시까지는 알림을 조용히 보관해요.',
      footer: '핵심 기록과 안전 관련 알림은 설정 상태와 별도로 중요 시점에 안내될 수 있어요.',
    },
    moreScreen: {
      title: '더보기',
      subtitle: '프로필, 앱 정보, 문서를 한 곳에서 볼 수 있어요.',
      settingsTitle: '설정 메뉴',
      settingsBody: '프로필 수정과 앱 관련 설정을 여기서 관리할 수 있어요.',
      weaningStartGuide: '이유식 시작하기',
      weaningStartGuideBody: '처음 이유식을 시작할 때 필요한 기초 상식과 자주 묻는 질문을 한 번에 볼 수 있어요.',
      weaningStartGuideAction: '가이드 보러가기',
      appInfoTitle: '앱 정보',
      mealPreferences: '식단 기준 설정',
      weeklyInsights: '주간 기록 요약',
    },
    mealPlanPreferencesScreen: {
      title: '식단 기준 설정',
      subtitle: '추천 식단이 우리 아기 상황에 더 가깝게 맞춰지도록 기준을 정리해요.',
      stageTitle: '현재 단계',
      stageBody: '지금 가장 가까운 이유식 단계를 골라주세요.',
      mealsTitle: '하루 식사 수',
      mealsBody: '현재 실제로 진행하는 식사 수를 선택해주세요.',
      methodTitle: '진행 방식',
      methodBody: '토핑, 전통, 혼합 중 지금 쓰는 방식을 반영해요.',
      proteinTitle: '단백질 도입 여부',
      proteinBody: '단백질을 이미 시작했다면 후보군에 함께 반영해요.',
      proteinStarted: '이미 시작했어요',
      proteinNotStarted: '아직 시작 전이에요',
      textureTitle: '입자감 단계',
      textureBody: '현재 가장 편하게 먹는 질감을 골라주세요.',
      textureThin: '묽은 미음',
      textureMash: '부드러운 으깨기',
      textureChunk: '부드러운 입자',
      textureFinger: '손에 쥐는 형태',
      goalTitle: '보호자 목표',
      goalBody: '이번 주 식단에서 무엇을 더 우선할지 정해주세요.',
      goalVariety: '다양성 우선',
      goalEasy: '간편함 우선',
      goalFreezer: '냉동큐브 우선',
      blockedTitle: '제외 식재료',
      blockedBody: '추천에서 아예 빼고 싶은 재료예요.',
      preferredTitle: '잘 먹는 식재료',
      preferredBody: '자주 넣어도 좋은 재료를 선택해주세요.',
      dislikedTitle: '비선호 식재료',
      dislikedBody: '우선순위를 낮추고 싶은 재료예요.',
      refusedTitle: '최근 거부한 식재료',
      refusedBody: '며칠 쉬었다가 다시 시도하고 싶은 재료를 표시해요.',
      saveButton: '식단 기준 저장',
      saveSuccess: '식단 기준을 저장했어요.',
    },
    dataManagementScreen: {
      title: '데이터 관리',
      subtitle: '기록과 식재료, 가이드 진행 상태를 파일로 백업하거나 다시 불러올 수 있어요.',
      exportTitle: '백업 내보내기',
      exportBody: '현재 앱 데이터를 JSON 파일로 내보내고 공유할 수 있어요.',
      exportButton: '백업 파일 만들기',
      exportSuccess: '백업 파일을 준비했어요.',
      exportFailed: '백업 파일을 만들지 못했어요.',
      importTitle: '백업 가져오기',
      importBody: '기존 파일을 선택하면 현재 데이터를 덮어쓰고 복원해요.',
      importButton: '백업 파일 가져오기',
      importSuccess: '백업 데이터를 복원했어요.',
      importFailed: '백업 파일을 불러오지 못했어요.',
    },
    weeklyInsightsScreen: {
      title: '주간 기록 요약',
      subtitle: '지난 7일 기록을 한 장으로 다시 볼 수 있어요.',
      recordsTitle: '기록 수',
      recordsUnit: '건',
      newIngredientsTitle: '새로 도입한 재료',
      topIngredientTitle: '가장 자주 먹은 재료',
      cautionTitle: '주의 반응',
      completionTitle: '기록 완성도',
      itemsUnit: '개',
      timesUnit: '회',
      emptyValue: '아직 없어요',
    },
    splashScreen: {
      eyebrow: '기록 준비 중',
      title: '이유식 다이어리',
      subtitle: '한입부터 반응까지 차분하게 남겨요',
      status: '오늘 기록 여는 중',
    },
    starterGuideScreen: {
      eyebrow: '처음 시작해요',
      title: '이유식 시작하기',
      subtitle: '파트와 챕터를 눌러 필요한 내용만 빠르게 보고, 읽음과 책갈피도 함께 관리할 수 있어요.',
      checklistTitle: '체크리스트',
      readinessEyebrow: '시작 전 확인',
      readinessTitle: '이유식 시작 신호 체크리스트',
      readinessChecklistTitle: '시작 신호 체크리스트',
      suppliesChecklistTitle: '준비물 체크리스트',
      suppliesChecklistBody: '첫날을 조금 더 차분하게 준비할 수 있도록 필요한 것만 먼저 점검해보세요.',
      readinessBody: '월령과 준비 신호를 같이 보면서, 지금 이유식을 시작해도 괜찮은지 차분하게 확인해보세요.',
      readinessSummaryBody: '체크 항목과 참고 자료는 별도 화면에서 차근차근 볼 수 있어요.',
      readinessStatusReadyTitle: '시작을 검토할 수 있어요',
      readinessStatusReadyBody: '프로필 기준 월령과 핵심 준비 신호가 모두 맞아 있어요. 첫 재료는 단순하게 시작해보세요.',
      readinessStatusAlmostTitle: '거의 준비됐어요',
      readinessStatusAlmostBody: '핵심 신호가 대부분 보이지만 몇 가지를 더 확인하면 더 안심하고 시작할 수 있어요.',
      readinessStatusWaitTitle: '조금 더 기다려보세요',
      readinessStatusWaitBody: '아직 시작 신호가 덜 모였어요. 며칠 더 지켜본 뒤 다시 확인해보는 편이 좋아요.',
      readinessStatusUnknownTitle: '프로필을 먼저 확인해보세요',
      readinessStatusUnknownBody: '생년월일이 없어서 월령 자동 확인이 비어 있어요. 프로필을 입력하면 더 정확하게 볼 수 있어요.',
      readinessSignalsLabel: '준비 신호 {{count}} / {{total}}',
      readinessAgeKnown: '프로필 기준 {{months}}개월',
      readinessAgeUnknown: '프로필이 없어서 월령 자동 확인이 비어 있어요.',
      readinessProfileAction: '아기 프로필 입력',
      readinessOpenAction: '체크리스트 열기',
      readinessReopenAction: '체크리스트 다시 보기',
      readinessCompleteToastTitle: '이제 이유식을 시작할 수 있어요',
      readinessCompleteToastBody: '다음 챕터로 이어서 이동할게요.',
      referenceOpenFailed: '원문을 열지 못했어요.',
      suppliesOpenAction: '준비물 체크하기',
      suppliesReopenAction: '준비물 다시 보기',
      suppliesProgressLabel: '준비물 {{count}} / {{total}}',
      readinessManualBadge: '보호자 체크',
      readinessAutoBadge: '자동 확인',
      readinessReferenceLabel: '참고',
      readinessAgeTitle: '생후 6개월 전후예요',
      readinessAgeBody: 'WHO와 CDC, NHS는 이유식 시작 시점을 대체로 생후 6개월 전후로 안내해요.',
      readinessPostureTitle: '앉힌 자세에서 고개를 안정적으로 가눠요',
      readinessPostureBody: '목과 상체가 어느 정도 안정돼야 숟가락과 음식에 더 안전하게 적응할 수 있어요.',
      readinessCoordinationTitle: '눈, 손, 입을 함께 써서 음식에 반응해요',
      readinessCoordinationBody: '음식을 보며 손이나 입으로 가져가려는 협응이 보이면 시작 신호로 볼 수 있어요.',
      readinessSwallowTitle: '혀로 밀어내기보다 삼키려고 해요',
      readinessSwallowBody: '음식을 계속 밖으로 밀어내면 아직은 시작 시점이 아닐 수 있어요.',
      readinessInterestTitle: '먹는 모습에 관심을 보이고 입을 열어요',
      readinessInterestBody: '보호자가 먹는 것을 보며 따라오거나 숟가락에 반응하면 시작 준비 신호에 가까워요.',
      suppliesSpoonTitle: '부드러운 스푼과 작은 볼이 준비되어 있어요',
      suppliesSpoonBody: '처음은 많이 먹이는 날이 아니라 적응하는 날이니, 작은 도구면 충분해요.',
      suppliesBibTitle: '턱받이와 닦을 수 있는 수건을 가까이에 두었어요',
      suppliesBibBody: '첫날은 양보다 정리 흐름이 중요해서, 닦기 쉬운 준비가 되어 있으면 훨씬 편해요.',
      suppliesSeatTitle: '안전하게 앉힐 자리나 의자를 정해두었어요',
      suppliesSeatBody: '안정된 자세로 시작해야 관찰도 쉽고 보호자도 덜 불안해져요.',
      suppliesIngredientTitle: '첫 재료와 첫 끼 시간대를 미리 정해두었어요',
      suppliesIngredientBody: '오전이나 낮처럼 관찰하기 쉬운 시간과 단순한 첫 재료를 미리 정해두세요.',
      suppliesRecordTitle: '먹인 뒤 기록할 흐름을 준비해두었어요',
      suppliesRecordBody: '사진, 메모, 반응 기록을 바로 남길 준비를 해두면 첫날이 훨씬 차분해져요.',
      readinessCautionTitle: '이 점은 함께 기억해두세요',
      readinessCautionBody: '밤에 자주 깨거나 주먹을 빠는 것만으로는 준비 신호라고 보기 어려워요. 미숙아거나 건강 걱정이 있으면 소아청소년과와 먼저 상의해주세요.',
      referenceTitle: '어디를 참고했나요?',
      referenceBody: 'WHO, CDC, NHS, AAP 자료에서 공통으로 반복되는 시작 신호만 추려서 정리했어요.',
      referenceOpenAction: '원문 보기',
      referenceWhoSummary: '생후 6개월 무렵부터 적절하고 안전한 보충식을 시작하도록 안내하는 WHO 가이드라인이에요.',
      referenceCdcSummary: '생후 6개월 무렵과 함께, 앉은 자세·머리 가누기·삼킴 같은 발달 준비 신호를 구체적으로 설명해요.',
      referenceNhsSummary: '앉은 자세, 눈-손-입 협응, 삼킴을 대표적인 시작 신호로 설명하고, 헷갈리기 쉬운 가짜 신호도 함께 안내해요.',
      referenceAapSummary: '미국소아과학회 보호자 가이드로, 관심 표현과 자세 안정 같은 실제 관찰 포인트를 이해하기 쉽게 풀어줘요.',
      loadingBody: '읽은 챕터와 책갈피를 불러오고 있어요.',
      progressTitle: '학습 현황',
      progressBody: '{{total}}개 챕터 중 {{read}}개를 읽었어요.',
      progressBadge: '완료 {{percent}}%',
      readCountLabel: '읽은 챕터',
      bookmarkCountLabel: '책갈피',
      partCountLabel: '파트 수',
      bookmarkTitle: '책갈피 모아보기',
      bookmarkBody: '중요한 챕터만 따로 모아두고 다시 바로 들어갈 수 있어요.',
      bookmarkEmptyTitle: '아직 저장한 챕터가 없어요',
      bookmarkEmptyBody: '챕터를 읽다가 책갈피를 눌러두면 여기서 다시 빠르게 이어볼 수 있어요.',
      partTitle: '파트 선택',
      partBody: '중요한 전환점 기준으로 파트를 나눠 필요한 챕터를 빠르게 찾아가세요.',
      partChipMeta: '{{read}} / {{total}} 챕터',
      faqTitle: 'FAQ',
      faqBody: '자주 묻는 질문만 먼저 모아 빠르게 볼 수 있어요.',
      recommendedTitle: '지금 보면 좋은 챕터',
      recommendedBody: '{{part}} 흐름에서 먼저 보면 좋은 챕터예요.',
      faqCategoryTitle: '카테고리',
      faqCategoryGettingStarted: '시작 준비',
      faqCategoryTools: '준비물과 보관',
      faqCategoryIntake: '먹는 양과 거부',
      faqCategorySchedule: '리듬과 확장',
      faqCategoryReaction: '반응과 관찰',
      faqStartAgeTitle: '정확히 몇 개월부터 시작하면 될까요?',
      faqStartAgeBody: '월령만 보지 말고 앉기, 목 가누기, 음식 관심 같은 준비 신호를 함께 보고 시작하는 편이 더 안전해요.',
      faqMethodChoiceTitle: '토핑 이유식으로 시작해도 괜찮을까요?',
      faqMethodChoiceBody: '보호자가 꾸준히 기록하고 관찰할 수 있다면 토핑 이유식으로 시작해도 괜찮아요. 중요한 건 방식보다 반복 가능한 흐름이에요.',
      faqUtensilsTitle: '처음부터 준비물이 많이 필요할까요?',
      faqUtensilsBody: '작은 볼, 부드러운 스푼, 턱받이 정도면 충분해요. 시작 전부터 과하게 준비할 필요는 없어요.',
      faqIronStartTitle: '처음부터 철분 식재료를 꼭 넣어야 하나요?',
      faqIronStartBody: '처음 며칠은 한 가지 재료에 익숙해지는 흐름이 먼저예요. 단백질이나 철분 식재료는 단계에 맞춰 천천히 넓혀가면 돼요.',
      faqSpitOutTitle: '먹자마자 뱉어내면 안 맞는 걸까요?',
      faqSpitOutBody: '처음엔 혀로 밀어내거나 낯선 질감을 뱉는 일이 흔해요. 바로 실패로 보지 말고 같은 재료를 차분히 다시 시도해보세요.',
      faqTextureRefusalTitle: '묽기나 입자감이 갑자기 싫은가 봐요',
      faqTextureRefusalBody: '같은 재료라도 농도, 온도, 덩어리감에 따라 반응이 달라질 수 있어요. 재료보다 질감 변화부터 천천히 조정해보세요.',
      faqMealCountTitle: '하루 몇 끼로 늘려야 할지 모르겠어요',
      faqMealCountBody: '잘 먹는 날이 며칠 이어지고 리듬이 안정될 때 다음 끼니를 늘리는 편이 좋아요. 달력보다 적응 속도를 먼저 보세요.',
      faqProteinStartTitle: '단백질은 언제부터 시작하는 게 좋을까요?',
      faqProteinStartBody: '기본 재료 몇 가지가 안정적으로 맞는 흐름이 잡힌 뒤에 시작하면 관찰이 더 쉬워요. 급하게 넣기보다 기록 가능한 타이밍이 중요해요.',
      faqRashWhatTitle: '먹고 나서 빨갛게 올라오면 어떻게 해야 하나요?',
      faqRashWhatBody: '사진과 시간을 먼저 남기고 다음 식단에서는 그 재료를 빼두세요. 퍼지거나 심해지면 전문가 상담이 먼저예요.',
      faqVomitWhatTitle: '토했을 때 바로 알레르기로 봐야 하나요?',
      faqVomitWhatBody: '한 번의 토함만으로 단정하긴 어려워요. 먹은 양, 시간, 다른 반응을 함께 기록하고 반복되는지 확인해야 해요.',
      faqPoopChangeTitle: '변 색이나 냄새가 달라졌어요',
      faqPoopChangeBody: '이유식을 시작하면 변 상태가 달라질 수 있어요. 다만 통증, 피, 심한 변비처럼 눈에 띄는 변화는 기록 후 상담을 고려하세요.',
      faqHospitalWhenTitle: '어느 정도면 병원을 바로 가야 하나요?',
      faqHospitalWhenBody: '숨쉬기 불편함, 입술이나 얼굴 붓기, 축 처짐처럼 강한 반응은 기록보다 즉시 진료가 먼저예요.',
      faqSearchPlaceholder: '궁금한 내용을 검색해보세요',
      faqSearchEmpty: '조건에 맞는 FAQ가 아직 없어요.',
      chapterIndex: '챕터 {{index}}',
      chapterDetailEyebrow: '지금 읽는 챕터',
      chapterPointsTitle: '세부 포인트',
      noteTitle: '기억해두기',
      markRead: '읽었어요',
      markUnread: '읽음 해제',
      nextChapter: '다음 챕터',
      partPrepTitle: '초기 토핑 이유식',
      partPrepDescription: '처음 시작하는 단계예요. 시작 신호, 첫 재료, 첫 양처럼 가장 기본이 되는 흐름부터 잡아요.',
      prepSignalsTitle: '초기 시작 신호 읽기',
      prepSignalsSummary: '초기 토핑 이유식은 월령보다 아기의 준비 신호를 먼저 보고 출발하는 편이 좋아요.',
      prepSignalsBullet1: '목을 어느 정도 가누고 앉았을 때 상체가 비교적 안정적인지 봐주세요.',
      prepSignalsBullet2: '음식을 바라보거나 입을 따라 움직이는 등 관심 표현이 있는지 함께 살펴보세요.',
      prepSignalsBullet3: '하루 컨디션이 좋고 감기나 예방접종 직후가 아닌 날을 고르는 편이 좋아요.',
      prepSignalsBullet4: '혀로 심하게 밀어내는 반응이 계속 강하면 며칠 더 지켜본 뒤 다시 시도해도 괜찮아요.',
      prepSignalsNote: '시작 시점은 빠른 것보다 아기 상태에 맞는지가 더 중요해요.',
      prepTimingTitle: '첫날 타이밍 잡기',
      prepTimingSummary: '처음 먹이는 시간과 분위기를 잘 고르면 보호자도 훨씬 덜 불안해져요.',
      prepTimingBullet1: '오전이나 낮처럼 병원 문의가 쉬운 시간대를 첫 시도로 잡아두세요.',
      prepTimingBullet2: '배가 너무 고프거나 너무 졸린 시간은 피하고, 평소보다 여유 있는 끼니로 잡아요.',
      prepTimingBullet3: '첫날은 일정 없는 날로 잡아 관찰 시간을 넉넉히 확보하는 것이 좋아요.',
      prepTimingBullet4: '보호자가 혼자 너무 바쁜 시간보다 사진, 메모, 반응을 남길 수 있는 여유 시간을 고르는 편이 좋아요.',
      prepTimingNote: '첫날은 양보다 관찰 여유가 있는 시간대를 선택하는 것이 핵심이에요.',
      prepToolsTitle: '처음 필요한 준비물',
      prepToolsSummary: '많이 사기보다 당장 필요한 기본 도구만 있어도 충분히 시작할 수 있어요.',
      prepToolsBullet1: '부드러운 스푼, 작은 볼, 턱받이, 닦을 수 있는 가벼운 매트 정도면 시작이 가능해요.',
      prepToolsBullet2: '식재료보다 기록 준비도 중요해서 사진과 메모를 남길 수 있는 흐름을 같이 만들어두세요.',
      prepToolsBullet3: '도구는 예쁜 것보다 세척이 쉽고 매일 부담 없이 꺼낼 수 있는지가 더 중요해요.',
      prepToolsBullet4: '냉동 용기나 큐브 트레이는 바로 사지 않아도 괜찮고, 실제로 남기는 양이 생긴 뒤 준비해도 늦지 않아요.',
      prepToolsNote: '준비물은 최소한으로 시작하고, 반복하면서 필요한 것만 추가해도 늦지 않아요.',
      partFirstFoodTitle: '중기 토핑 이유식',
      partFirstFoodDescription: '중기부터는 재료 수와 조합이 조금씩 넓어져요. 3일 관찰과 반응 기록이 더 중요해져요.',
      foodFirstMenuTitle: '초기 첫 재료 고르기',
      foodFirstMenuSummary: '초기 토핑 이유식은 단일 재료 위주로 가볍게 시작해야 반응을 구분하기 쉬워요.',
      foodFirstMenuBullet1: '쌀, 감자, 단호박처럼 비교적 단순한 재료 하나로 출발하면 관찰이 쉬워요.',
      foodFirstMenuBullet2: '두 가지 이상을 한 번에 시작하면 어떤 재료 때문인지 구분이 어려워질 수 있어요.',
      foodFirstMenuBullet3: '새로운 재료보다 이미 잘 맞는 재료를 섞고 싶어지는 날도 있지만 첫 주는 단순함이 중요해요.',
      foodFirstMenuBullet4: '가족 식단에서 흔히 쓰는 재료를 먼저 고르면 이후 반복 노출과 장보기 흐름도 더 편해져요.',
      foodFirstMenuNote: '처음 메뉴는 영양 밸런스보다 반응을 읽기 쉬운 구조가 우선이에요.',
      foodPortionTitle: '초기 첫 양은 어느 정도?',
      foodPortionSummary: '초기에는 몇 숟가락만 먹어도 괜찮아요. 양보다 적응과 리듬이 먼저예요.',
      foodPortionBullet1: '한두 숟가락만 먹고 끝나도 정상으로 받아들이는 것이 보호자에게도 도움이 돼요.',
      foodPortionBullet2: '다 먹이기보다 표정, 삼킴, 거부 신호를 천천히 보는 것이 더 중요해요.',
      foodPortionBullet3: '먹는 양이 적더라도 반복 노출로 익숙해질 수 있으니 첫날 반응만으로 판단하지 마세요.',
      foodPortionBullet4: '다음 끼니에 양을 바로 두 배로 늘리기보다 같은 정도를 유지하며 편안함이 생기는지 먼저 보는 편이 좋아요.',
      foodPortionNote: '첫 주의 핵심은 완식이 아니라 경험과 적응이에요.',
      foodThreeDayTitle: '중기 3일 관찰 루틴',
      foodThreeDaySummary: '중기 토핑 이유식은 재료가 늘어나는 만큼 같은 재료를 짧게 반복하며 반응을 보는 흐름이 중요해요.',
      foodThreeDayBullet1: '새 재료를 먹인 날과 그 다음 이틀 정도는 같은 재료를 중심으로 반응을 확인해보세요.',
      foodThreeDayBullet2: '관찰 기간에는 새로운 재료를 계속 추가하기보다 반응이 안정적인지 보는 데 집중해요.',
      foodThreeDayBullet3: '식단 앱에서 같은 재료 기록을 이어 남기면 패턴을 나중에 되짚기 쉬워져요.',
      foodThreeDayBullet4: '관찰 중 이상 반응이 있으면 다음 식단에서 바로 제외하고 메모를 남겨두는 습관이 중요해요.',
      foodThreeDayNote: '새 재료를 빨리 늘리는 것보다 관찰 패턴을 만드는 것이 장기적으로 더 편해져요.',
      partObserveTitle: '후기 토핑 이유식',
      partObserveDescription: '후기에는 입자감과 조합이 더 넓어져요. 거부 대응, 반복 노출, 알레르기 걱정을 정리해요.',
      observeReactionTitle: '중기 반응은 무엇을 볼까?',
      observeReactionSummary: '중기에는 먹는 양뿐 아니라 피부, 표정, 배앓이, 잠투정 같은 변화를 함께 살펴보세요.',
      observeReactionBullet1: '발진, 토함, 심한 보챔처럼 보호자가 바로 알아차릴 수 있는 반응을 먼저 기록해두세요.',
      observeReactionBullet2: '평소와 다르게 잠을 설치거나 변 상태가 달라지는 경우도 메모해두면 도움이 돼요.',
      observeReactionBullet3: '확실하지 않은 변화라도 날짜와 재료를 함께 남기면 나중에 비교가 쉬워져요.',
      observeReactionBullet4: '반응이 애매한 날일수록 사진 한 장과 짧은 메모가 나중에 식단을 조정할 때 큰 도움이 돼요.',
      observeReactionNote: '기록은 정확한 진단보다 패턴을 남긴다는 목적에 더 가깝게 보면 좋아요.',
      observeRefusalTitle: '후기 거부했을 때 대처',
      observeRefusalSummary: '후기에는 선호와 비선호가 더 분명해질 수 있어요. 거부를 실패보다 적응 과정으로 보는 편이 좋아요.',
      observeRefusalBullet1: '입을 다물거나 몸을 돌리면 그날은 거기서 마무리하고 억지로 먹이지 않는 편이 좋아요.',
      observeRefusalBullet2: '며칠 쉬었다가 농도, 온도, 조합을 조금 바꿔 다시 시도해볼 수 있어요.',
      observeRefusalBullet3: '거부한 날도 기록해두면 어떤 상황에서 거부가 잦은지 보기 쉬워져요.',
      observeRefusalBullet4: '같은 재료를 완전히 끊기보다 익숙한 재료 옆에 소량으로 다시 붙여보는 방식이 더 부드러울 수 있어요.',
      observeRefusalNote: '거부는 재료의 문제일 수도 있지만 컨디션이나 타이밍 때문일 수도 있어요.',
      observeRecordsTitle: '중기 기록은 어떻게 남길까?',
      observeRecordsSummary: '중기부터는 조합이 다양해져서 짧아도 꾸준한 기록이 다음 식단을 훨씬 쉽게 해줘요.',
      observeRecordsBullet1: '날짜, 시간, 식재료, 먹은 양, 반응만 남겨도 다음 시도에 큰 도움이 돼요.',
      observeRecordsBullet2: '사진이나 한 줄 메모를 함께 남기면 보호자 기억에만 의존하지 않아도 돼요.',
      observeRecordsBullet3: '처음엔 완벽하게 쓰기보다 같은 형식으로 빠르게 남기는 흐름을 만드는 것이 중요해요.',
      observeRecordsBullet4: '잘 먹은 날과 힘들었던 날을 함께 남겨야 보호자가 식단 흐름을 더 정확히 읽을 수 있어요.',
      observeRecordsNote: '기록은 길게 쓰는 것보다 같은 기준으로 쌓이는 것이 더 중요해요.',
      partFaqTitle: '많이 묻는 상황',
      partFaqDescription: '시작 초기에 가장 자주 나오는 불안과 고민을 짧은 챕터로 정리했어요.',
      faqLowIntakeTitle: '후기인데도 너무 조금 먹어요',
      faqLowIntakeShortBody: '양보다 며칠 단위의 흐름과 컨디션을 함께 봐주세요.',
      faqLowIntakeSummary: '후기에도 먹는 양은 날마다 달라질 수 있어요. 컨디션과 거부 패턴을 함께 봐야 해요.',
      faqLowIntakeBullet1: '몇 숟가락만 먹고 끝나도 처음에는 자연스러운 반응일 수 있어요.',
      faqLowIntakeBullet2: '며칠 단위로 봤을 때 점차 표정이 편해지고 받아들이는 속도가 늘어나는지 보세요.',
      faqLowIntakeBullet3: '먹는 양이 적더라도 컨디션이 괜찮다면 너무 급하게 양을 늘리려 하지 않아도 돼요.',
      faqLowIntakeBullet4: '수유와 이유식 간격이 너무 짧지 않은지도 함께 확인하면 양이 적은 이유를 찾는 데 도움이 돼요.',
      faqLowIntakeNote: '잘 안 먹는 날의 기록도 남겨야 다음 시도를 덜 흔들리며 할 수 있어요.',
      faqRepeatTitle: '후기엔 같은 재료를 또 줘도 될까?',
      faqRepeatShortBody: '반복은 여전히 도움이 되고, 조합만 조금 바꿔도 충분해요.',
      faqRepeatSummary: '후기에도 반복은 여전히 도움이 돼요. 다만 조합과 형태를 조금씩 바꿔주는 식으로 접근하면 좋아요.',
      faqRepeatBullet1: '새 재료 관찰 기간에는 같은 재료가 반복되는 편이 반응 구분에 더 유리해요.',
      faqRepeatBullet2: '잘 먹던 재료는 보호자에게도 안전한 기본 식재료가 되어 식단 짜기가 쉬워져요.',
      faqRepeatBullet3: '반복이 길어질 때는 조금씩 조합만 바꿔 익숙함과 새로움을 함께 가져가면 좋아요.',
      faqRepeatBullet4: '반복 자체를 지루함으로만 보지 말고, 아기가 편안하게 먹는 기반을 만드는 과정으로 보는 편이 좋아요.',
      faqRepeatNote: '초기엔 다양성보다 안정감이 먼저라는 점을 기억해두세요.',
      faqAllergyTitle: '후기에도 알레르기가 걱정될 때',
      faqAllergyShortBody: '좋은 컨디션, 소량, 기록 세 가지를 먼저 지켜주세요.',
      faqAllergySummary: '후기에는 재료 종류가 넓어지는 만큼 소량, 좋은 컨디션, 기록 남기기 세 가지가 더 중요해져요.',
      faqAllergyBullet1: '새 재료는 아이 컨디션이 좋은 날 소량부터 시작하고 반응을 차분히 보세요.',
      faqAllergyBullet2: '이상 반응이 보이면 사진과 메모를 남기고 다음 식단에서는 즉시 제외해두는 편이 좋아요.',
      faqAllergyBullet3: '숨 가쁨, 얼굴 붓기처럼 심한 반응은 기록보다 즉시 전문가 도움을 우선해야 해요.',
      faqAllergyBullet4: '한 번에 여러 새 재료를 겹치지 않으면 어떤 재료를 조심해야 하는지 훨씬 빨리 정리할 수 있어요.',
      faqAllergyNote: '앱 기록은 전문가 상담 전 상황을 정리하는 데 도움을 줄 수 있어요.',
      faqFirstDayTimeTitle: '첫날은 언제 먹여보는 게 좋을까요?',
      faqFirstDayTimeBody: '오전이나 낮처럼 반응을 여유 있게 볼 수 있는 시간대가 가장 무난해요.',
      faqWaterTitle: '이유식 시작하면 물도 같이 줘야 하나요?',
      faqWaterBody: '처음부터 많이 줄 필요는 없고, 단계에 맞게 소량씩 천천히 익숙해지면 충분해요.',
      faqConstipationTitle: '이유식 시작 후 변비처럼 보여요',
      faqConstipationBody: '갑자기 양을 늘리기보다 식재료와 양, 반응 기록을 함께 보며 천천히 조절해보세요.',
      faqSkipDayTitle: '하루 쉬었다가 다시 먹여도 괜찮을까요?',
      faqSkipDayBody: '컨디션이 좋지 않거나 일정이 흔들린 날은 쉬었다가 다시 시작해도 괜찮아요.',
      faqStorageTitle: '만든 이유식은 어떻게 보관하면 좋을까요?',
      faqStorageBody: '처음엔 소량으로 만들고, 남기는 양이 생기면 냉장·냉동 흐름을 그때 맞춰 정리해도 늦지 않아요.',
      adBadge: '광고',
      adTitle: '구글 광고 영역',
      adBody: '챕터 사이에는 AdMob 네이티브 광고를 넣어도 화면 흐름이 깨지지 않도록 카드형 슬롯으로 설계했어요.',
      adPlaceholder: 'Google Ad Slot',
    },
    mealPlanScreen: {
      title: '식단',
      weekMode: '주간',
      monthMode: '월간',
      babyStatusEyebrow: '아이 상태',
      todayEyebrow: '오늘 추천',
      selectedDayEyebrow: '선택한 날',
      subtitle: '우리 아기 상태에 맞춘 오늘 추천과 이번 주 계획을 확인하세요.',
      todayTitle: '오늘의 식단',
      todayGuideTitle: '오늘은 이렇게 먹여보세요',
      todayHint: '이유식 주차, 도입 이력, 주의 식재료를 반영해 구성했어요.',
      todayEmpty: '추천 식단이 아직 없어요.',
      babyInfoTitle: '아이 정보',
      profileFallback: '이유식 시작일과 단계가 없으면 기본 규칙으로 계산해요.',
      summaryAge: '생후',
      summaryFeedingWeek: '이유식 주차',
      summaryStage: '현재 단계',
      summaryMeals: '하루 식사 수',
      summaryMethod: '진행 방식',
      summaryBlocked: '제외 식재료',
      summaryBlockedNone: '없음',
      startDateSetupTitle: '이유식 시작일을 먼저 입력해주세요',
      startDateSetupBody: '식단은 이유식 시작일을 기준으로 주차를 계산해 보여줘요.',
      startDateInputLabel: '이유식 시작(예정)일',
      startDateInputPlaceholder: '예: 20260315',
      startDateSaveButton: '식단 기준 저장',
      startDateSaveSuccess: '이유식 시작일을 저장했어요.',
      startDateValidation: '이유식 시작일은 숫자 8자리(YYYYMMDD)로 입력해주세요.',
      weekPlanTitle: '이번 주 계획',
      insightTitle: '추천 기준',
      reasonFeedingWeek: '이유식 주차 기준으로 식단을 구성했어요.',
      reasonMealCount: '현재 식사 횟수에 맞는 끼니 수만 보여줘요.',
      reasonBlocked: '주의/알러지 또는 제외 식재료는 자동 제외했어요.',
      reasonObservation: '관찰 중인 식재료를 우선 이어가도록 조정했어요.',
      reasonRefusal: '최근 거부하거나 비선호한 재료는 뒤로 미뤘어요.',
      reasonFavorite: '잘 먹는 식재료를 먼저 섞어 넣었어요.',
      switchToRecordButton: '기록 전환',
      fedButton: '먹였어요',
      expandButton: '펼쳐보기',
      foldButton: '접기',
      monthOverviewHint: '월간은 전체 계획/빈 날짜/패턴 확인에 집중합니다.',
      weekEditHint: '주간에서 실제 식단 편집과 조정을 진행하세요.',
      switchToWeekForEditButton: '주간으로 전환해 편집',
      newIngredientBadge: '신규',
      noteLabel: '메모',
      noneLabel: '없음',
      noteObserveNew: '신규 식재료는 같은 재료를 3일 관찰해보세요.',
      noteExcludeCaution: '주의 식재료는 이번 추천에서 제외했어요.',
      preferencesButton: '식단 기준 수정',
      preferencesCtaTitle: '추천 기준을 조금 더 채워주세요',
      preferencesCtaBody: '단계, 식사 수, 입자감, 제외 재료를 채우면 식단이 더 정확해져요.',
      observationHint: '{{ingredients}}는 아직 관찰 중이라 새로운 재료보다 먼저 이어서 추천했어요.',
      stagePrep: '준비기',
      stageInitial: '초기',
      stageMiddle: '중기',
      stageLate: '후기',
      stageComplete: '완료기',
      methodTopping: '토핑 이유식',
      methodTraditional: '전통 이유식',
      methodBlwMixed: 'BLW 혼합',
      mealCountFormat: '{{count}}식',
      breakfast: '아침 이유식',
      lunch: '점심 이유식',
      dinner: '저녁 이유식',
      snack: '간식',
      comingSoon: '준비 중인 기능입니다.',
    },
    journeyScreen: {
      title: '기록',
      subtitle: '먹은 시간, 식재료, 반응을 날짜별로 남겨보세요.',
      addButton: '기록 추가',
      draftBanner: '식단에서 가져온 초안이 있어요.',
      emptyTitle: '아직 이유식 기록이 없어요',
      emptyBody: '첫 이유식 기록을 남기면 날짜별로 차분히 모아볼 수 있어요.',
      emptyAction: '첫 기록 만들기',
      dateLabel: '날짜',
      timeLabel: '시간',
      ingredientsLabel: '식재료',
      ingredientsHint: '여러 식재료를 함께 선택할 수 있어요.',
      ingredientSearchPlaceholder: '식재료를 검색해보세요',
      ingredientSearchEmpty: '검색 결과가 없어요.',
      editorHeaderCount: '개 선택됨',
      editorHeaderEmpty: '오늘 먹은 식재료와 반응을 차분히 남겨보세요.',
      amountLabel: '섭취량',
      amountTypeGram: '그램',
      amountTypeLevel: '단계',
      amountGramPlaceholder: '예: 80',
      amountLevelHigh: '많이 먹음',
      amountLevelMedium: '보통',
      amountLevelLow: '조금 먹음',
      reactionLabel: '반응',
      reactionTypeNone: '잘 먹었어요',
      reactionTypeNormal: '무난했어요',
      reactionTypeFussy: '거부했어요',
      reactionTypeVomit: '토했어요',
      reactionTypeRash: '발진 있었어요',
      photoLabel: '사진 (선택)',
      photoAddButton: '사진 첨부',
      photoChangeButton: '사진 변경',
      noteLabel: '메모 (선택)',
      notePlaceholder: '예: 새로운 음식 시도',
      saveButton: '기록 저장',
      updateButton: '기록 수정',
      deleteButton: '기록 삭제',
      deleteConfirmTitle: '기록을 삭제할까요?',
      deleteConfirmMessage: '삭제한 기록은 다시 복구할 수 없어요.',
      deleteConfirmAction: '삭제',
      cancel: '취소',
      listTitle: '날짜별 기록',
      detailTitle: '기록 상세',
      editButton: '수정하기',
      noPhoto: '첨부한 사진이 없어요.',
      validationIngredient: '식재료를 1개 이상 선택해주세요.',
      validationDate: '날짜를 YYYY-MM-DD 형식으로 입력해주세요.',
      validationTime: '시간을 HH:MM 형식으로 입력해주세요.',
      saveSuccess: '기록이 저장되었습니다.',
      updateSuccess: '기록이 수정되었습니다.',
      deleteSuccess: '기록이 삭제되었습니다.',
      pickerDone: '선택 완료',
      pickerAmPm: '오전/오후',
      pickerAm: '오전',
      pickerPm: '오후',
      pickerHour: '시간',
      pickerMinute: '분',
      photoPermissionTitle: '권한 필요',
      photoPermissionMessage: '사진 첨부를 위해 갤러리 접근 권한이 필요합니다.',
      photoOptionalHint: '사진 업로드에 실패해도 기록은 저장할 수 있어요.',
      seededFromPlan: '식단 정보가 자동으로 채워졌어요.',
      amountSummaryNone: '섭취량 없음',
      todayLabel: '오늘',
      recordCount: '{{count}}개의 기록',
    },
    ingredientsScreen: {
      title: '식재료',
      items: ['식재료 사전', '도전 여부', '알러지 이력', '단계별 관리'],
    },
    ingredientScreen: {
      searchPlaceholder: '식재료 검색',
      addButton: '추가',
      addTitle: '식재료 추가',
      addNameLabel: '식재료 이름',
      addCategoryLabel: '카테고리',
      addSave: '저장',
      addCancel: '취소',
      detailTitle: '식재료 상세',
      category: '카테고리',
      status: '상태',
      firstTriedDate: '첫 시도일',
      notSet: '없음',
      firstTriedPending: '미시도',
      filterAll: '전체',
      filterTried: '먹어봄',
      filterNotTried: '미도전',
      filterRisk: '주의/알러지',
      filterRetry: '재시도',
      emptyTitle: '검색 결과가 없어요',
      emptyBody: '새 식재료를 추가해보세요.',
      duplicateNameError: '동일한 이름의 식재료가 이미 있어요.',
      nameRequiredError: '식재료 이름을 입력해주세요.',
      statusNotTried: '아직 안먹어봄',
      statusTried: '먹어봄',
      statusCaution: '주의',
      statusAllergy: '알러지',
      actionSetTried: '먹어봄 표시',
      actionSetCaution: '주의 반응 표시',
      actionSetAllergy: '알러지 표시',
      actionReset: '상태 초기화',
      actionToggleFavorite: '좋아요 표시',
      reactionsTitle: '반응 기록',
      reactionsEmpty: '반응 기록이 없어요.',
      reactionAddTitle: '반응 기록 추가',
      memoTitle: '메모',
      memoSaveButton: '메모 저장',
      reactionTypeNone: '문제 없음',
      reactionTypeCaution: '주의',
      reactionTypeAllergy: '알러지',
      reactionTypeOther: '기타',
      reactionNotePlaceholder: '예: 섭취 후 30분 뒤 보챔',
      reactionAddButton: '반응 저장',
      recordsTitle: '관련 이유식 기록',
      recordsEmpty: '관련 기록이 없어요.',
      savedMessage: '저장되었습니다.',
      saveFailedMessage: '저장에 실패했어요. 다시 시도해주세요.',
      retrySuggested: '다시 시도해볼 시점이에요',
    },
  },
  en: {
    common: {
      seeAll: 'See all',
      today: 'Today',
      save: 'Save',
      loading: 'Loading...',
      optional: 'Optional',
    },
    tabs: {
      home: 'Home',
      explore: 'Explore',
      mealPlan: 'Meals',
      journey: 'Journey',
      ingredients: 'Ingredients',
      profile: 'Profile',
      more: 'More',
    },
    home: {
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      greeting: 'Hi, Weaning Diary',
      welcomeSuffix: 'Shall we start today\'s weaning log?',
      todayMealCardTitle: 'Today meal card',
      todayRecordStatusTitle: 'Today record status',
      todayRecordStatusBody: 'No feeding record yet today. Add the first one.',
      todayRecordStatusEmptyTitle: 'No feeding record for today yet',
      todayRecordStatusEmptyAction: 'Add feeding record',
      todayRecordStatusDone: '{{count}} feeding records today',
      todayRecordStatusLatest: 'Logged {{ingredients}} at {{time}}.',
      todayRecordStatusView: 'View today records',
      cautionAlertTitle: 'Caution reaction alerts',
      cautionAlertBody: 'Review reactions that may need attention from recent records.',
      cautionAlertFallback: 'Check the latest memo or first tried date.',
      myJournal: 'My Journal',
      quickJournal: 'Quick Journal',
      profileRequiredTitle: 'Please set up baby profile first',
      profileRequiredBody: 'Baby profile is required to personalize home and use logging features.',
      profileRequiredAction: 'Set baby profile',
      heroTitle: 'Today meal plan',
      heroBody: 'Check today suggestions and ingredients to introduce.',
      sideLabel: 'Evening',
      editProfile: 'Edit profile',
      cards: {
        morningReactionTitle: 'Morning reaction',
        morningReactionBody: 'How was the morning feeding response?',
        morningReactionChip: 'Reaction',
        newIngredientTitle: 'New ingredient',
        newIngredientBody: 'Log any ingredient introduced for the first time.',
        newIngredientChip: 'Ingredient',
        eveningSleepTitle: 'Sleep note',
        eveningSleepBody: 'Capture sleep pattern after feeding.',
        eveningSleepChip: 'Sleep',
      },
      actions: {
        observationTitle: 'Observation in progress',
        observationBody: 'Check {{ingredients}} once more today.',
        observationChip: 'Observe',
        riskTitle: 'Recheck yesterday reactions',
        riskBody: '{{count}} caution records came up yesterday. Review them before today meals.',
        riskChip: 'Caution',
        recordTitle: 'No record for today yet',
        recordBody: 'Logging right after feeding makes the next recommendation sharper.',
        recordChip: 'Record',
        defaultTitle: 'Ready for another calm day?',
        defaultBody: 'Things are flowing well. A quick look at today suggestions is enough.',
        defaultChip: 'Guide',
        noneFallback: 'new ingredients',
      },
      profileForm: {
        overline: 'Setup',
        title: 'Set baby profile',
        subtitle: 'We will personalize the home screen with this info.',
        babyNameLabel: 'Baby name / nickname',
        babyNamePlaceholder: 'e.g. Roy, Bean',
        birthDateLabel: 'Birth date',
        birthDatePlaceholder: 'YYYYMMDD',
        feedingStartDateLabel: 'Feeding start date',
        feedingStartDatePlaceholder: 'YYYYMMDD',
        feedingStageLabel: 'Current feeding stage',
        mealsPerDayLabel: 'Meals per day',
        feedingMethodLabel: 'Feeding method',
        photoLabel: 'Profile photo',
        photoButton: 'Upload photo',
        photoEditButton: 'Edit photo',
        photoSelected: 'Photo selected',
        submit: 'Save profile',
        validationTitle: 'Please check your input',
        validationName: 'Please enter baby name or nickname.',
        validationBirthDate: 'Please enter birth date.',
        validationBirthDateFormat: 'Birth date must be 8 digits (YYYYMMDD).',
        permissionTitle: 'Permission required',
        permissionMessage: 'Gallery access is required to upload a photo.',
        saveFailedTitle: 'Save failed',
        saveFailedMessage: 'Could not save profile. Please try again.',
        stepNameTitle: 'How should we call your baby?',
        stepBirthDateTitle: 'Enter birth date',
        stepPhotoTitle: 'Would you like to add a photo?',
        stepFeedingSetupTitle: 'Add meal planning basics too',
        next: 'Next',
        ageConfirmTitle: 'Confirm birth date',
        ageConfirmMessage: 'This birth date indicates the baby is 24 months or older. Please confirm.',
        ageConfirmCancel: 'Edit',
        ageConfirmContinue: 'Looks correct',
        stagePrep: 'Prep',
        stageInitial: 'Initial',
        stageMiddle: 'Middle',
        stageLate: 'Late',
        stageComplete: 'Complete',
        mealsOne: '1 meal',
        mealsTwo: '2 meals',
        mealsThree: '3 meals',
        methodTopping: 'Topping',
        methodTraditional: 'Traditional',
        methodBlwMixed: 'BLW mixed',
      },
    },
    explore: {
      overline: 'Design Direction',
      title: 'Weaning Diary\nVisual Guide v1',
      body: 'Fix tone, hierarchy, and density before feature expansion.',
      colorTone: 'Color Tone',
      principles: 'Design Principles',
      principleQuickCaptureTitle: 'Quick Capture',
      principleQuickCaptureBody: 'Keep input under 30 seconds with progressive disclosure.',
      principlePatternFirstTitle: 'Pattern First',
      principlePatternFirstBody: 'Prioritize food-to-reaction pattern readability.',
      principleCalmClearTitle: 'Calm but Clear',
      principleCalmClearBody: 'Avoid anxiety-heavy alerts and highlight only meaningful changes.',
    },
    placeholders: {
      mealPlanTitle: 'Meals',
      mealPlanBody: 'Weekly meal planning and ingredients screen placeholder.',
      ingredientsTitle: 'Ingredients',
      ingredientsBody: 'Ingredients registry/management and reaction linkage placeholder.',
      journeyTitle: 'Journey',
      journeyBody: 'Weekly/monthly summary screen placeholder.',
      profileTitle: 'Profile',
      profileBody: 'Caregiver profile, app settings, and notifications placeholder.',
    },
    profileScreen: {
      title: 'Profile',
      cardTitle: 'Baby Profile',
      heroSuffix: '\'s diary, all in one lovely place.',
      babyName: 'Baby name',
      birthDate: 'Birth date',
      age: 'Age',
      feedingStartDate: 'Feeding start date',
      feedingStage: 'Feeding stage',
      mealsPerDay: 'Meals per day',
      feedingMethod: 'Method',
      noProfileTitle: 'Please set up baby profile first',
      noProfileBody: 'Set profile to personalize home message and logging screens.',
      createProfile: 'Set baby profile',
      menuTitle: 'Settings',
      editProfile: 'Edit profile',
      notificationSettings: 'Notifications',
      appSettings: 'App settings',
      dataManagement: 'Data management',
      appInfoTitle: 'App info',
      appVersion: 'App version',
      openSourceLicense: 'Open-source license',
      openSourceLicenseBody: 'This app uses open-source libraries and follows each package license notice.',
      termsOfService: 'Terms of service',
      termsOfServiceBody: 'Review service conditions, user responsibilities, and disclaimers.',
      privacyPolicy: 'Privacy policy',
      privacyPolicyBody: 'Review what data is stored, why it is used, and how it can be deleted.',
      contactDeveloper: 'Contact developer',
      contactDeveloperBody: 'Open the mail app with a prefilled subject and message.',
      buyCoffee: 'Buy me a coffee',
      buyCoffeeBody: 'Support the developer on Buy Me a Coffee.',
      contactDeveloperSubject: '[Weaning Diary] Feedback',
      contactDeveloperBodyTemplate:
        'Hello,\n\nPlease write your feedback or question below.\n\n- Device:\n- App version:\n- Message:\n',
      comingSoon: 'Coming soon.',
    },
    profileEditorScreen: {
      title: 'Edit profile',
      subtitle: 'Keep your baby information neatly updated.',
      birthDateHint: 'Enter 8 digits. e.g. 20250928',
      feedingStartDateHint: 'Optional. e.g. 20260301',
      photoHint: 'Photo is optional.',
      saveButton: 'Save profile',
      saveSuccess: 'Profile saved.',
      validationStartDateFormat: 'Feeding start date must be 8 digits (YYYYMMDD).',
    },
    openSourceScreen: {
      title: 'Open-source licenses',
      subtitle: 'Review major packages directly used by the app and their licenses.',
      directDependencyNotice: 'This screen currently lists direct app dependencies and their licenses.',
      versionLabel: 'Version',
      licenseLabel: 'License',
    },
    termsScreen: {
      title: 'Terms of service',
      subtitle: 'Review the main service conditions and scope of responsibility.',
    },
    privacyScreen: {
      title: 'Privacy policy',
      subtitle: 'Review what personal information the app stores and how it is handled.',
    },
    notificationSettingsScreen: {
      title: 'Notifications',
      subtitle: 'Adjust reminders and safety alerts to match your baby care flow.',
      sectionActivity: 'Records and meals',
      mealPlanMorningTitle: 'Today meal reminder',
      mealPlanMorningBody: 'Get a gentle morning reminder to check today’s meal plan.',
      feedingRecordReminderTitle: 'Feeding record reminder',
      feedingRecordReminderBody: 'Get a light reminder so you do not forget to log a feeding.',
      sectionSafety: 'Safety and observation',
      cautionReactionAlertTitle: 'Recheck caution reactions',
      cautionReactionAlertBody: 'Review records like vomiting, rash, or fussiness again when needed.',
      newIngredientObservationTitle: 'New ingredient observation',
      newIngredientObservationBody: 'Keep track of the 3-day observation window after a new ingredient starts.',
      mealPlanMorningToast: 'Today’s first meal is planned as {{meal}}.',
      feedingRecordReminderToast: 'If you fed today, take a moment to log it.',
      cautionReactionAlertToast: 'There were {{count}} caution records yesterday. Review them before today meals.',
      newIngredientObservationToast: 'You are still observing {{count}} new ingredients.',
      sectionMessage: 'Messages and email',
      emailUpdatesTitle: 'Email updates',
      emailUpdatesBody: 'Receive product updates and small service news by email.',
      sectionQuiet: 'Quiet hours',
      quietHoursTitle: 'Bundle late-night alerts',
      quietHoursBody: 'Keep alerts quiet from 9 PM to 8 AM.',
      footer: 'Important record or safety notices may still be highlighted at key moments.',
    },
    moreScreen: {
      title: 'More',
      subtitle: 'Find profile, app info, and documents in one place.',
      settingsTitle: 'Settings',
      settingsBody: 'Manage profile editing and app-related settings here.',
      weaningStartGuide: 'Start weaning',
      weaningStartGuideBody: 'Browse the basics and common questions caregivers need when starting weaning for the first time.',
      weaningStartGuideAction: 'Open guide',
      appInfoTitle: 'App info',
      mealPreferences: 'Meal preferences',
      weeklyInsights: 'Weekly insights',
    },
    mealPlanPreferencesScreen: {
      title: 'Meal preferences',
      subtitle: 'Set the details that make meal recommendations feel closer to your baby’s real rhythm.',
      stageTitle: 'Current stage',
      stageBody: 'Pick the stage that feels the closest right now.',
      mealsTitle: 'Meals per day',
      mealsBody: 'Choose the number of meals you actually run each day.',
      methodTitle: 'Method',
      methodBody: 'Reflect the method you are following right now.',
      proteinTitle: 'Protein introduction',
      proteinBody: 'If protein has already started, it can be considered in the plan.',
      proteinStarted: 'Already started',
      proteinNotStarted: 'Not yet',
      textureTitle: 'Texture level',
      textureBody: 'Pick the texture your baby currently handles best.',
      textureThin: 'Thin porridge',
      textureMash: 'Soft mash',
      textureChunk: 'Soft chunks',
      textureFinger: 'Finger food',
      goalTitle: 'Caregiver goal',
      goalBody: 'Choose what matters most for this week plan.',
      goalVariety: 'Variety first',
      goalEasy: 'Keep it easy',
      goalFreezer: 'Use freezer cubes',
      blockedTitle: 'Excluded foods',
      blockedBody: 'These ingredients should stay out of recommendations.',
      preferredTitle: 'Well-liked foods',
      preferredBody: 'Use these a little more often when possible.',
      dislikedTitle: 'Less preferred foods',
      dislikedBody: 'Lower their priority for now.',
      refusedTitle: 'Recently refused foods',
      refusedBody: 'Mark foods you want to pause and retry later.',
      saveButton: 'Save meal preferences',
      saveSuccess: 'Meal preferences saved.',
    },
    dataManagementScreen: {
      title: 'Data management',
      subtitle: 'Back up records, ingredients, and guide progress to a file, then restore them later.',
      exportTitle: 'Export backup',
      exportBody: 'Create a JSON backup of the current app data and share it out.',
      exportButton: 'Create backup file',
      exportSuccess: 'Backup file is ready.',
      exportFailed: 'Could not create the backup file.',
      importTitle: 'Import backup',
      importBody: 'Choose a backup file to overwrite the current local data.',
      importButton: 'Import backup file',
      importSuccess: 'Backup restored.',
      importFailed: 'Could not import the backup file.',
    },
    weeklyInsightsScreen: {
      title: 'Weekly insights',
      subtitle: 'Review the last 7 days in one calm summary.',
      recordsTitle: 'Records',
      recordsUnit: '',
      newIngredientsTitle: 'New ingredients',
      topIngredientTitle: 'Most frequent ingredient',
      cautionTitle: 'Caution reactions',
      completionTitle: 'Completion',
      itemsUnit: '',
      timesUnit: ' times',
      emptyValue: 'No data yet',
    },
    splashScreen: {
      eyebrow: 'Getting ready',
      title: 'Weaning Diary',
      subtitle: 'Track each bite and reaction',
      status: 'Opening today’s log',
    },
    starterGuideScreen: {
      eyebrow: 'Starting out',
      title: 'Start weaning',
      subtitle: 'Move through key parts and chapters, then keep track of what you read and bookmark.',
      checklistTitle: 'Checklists',
      readinessEyebrow: 'Before you start',
      readinessTitle: 'Weaning readiness checklist',
      readinessChecklistTitle: 'Readiness checklist',
      suppliesChecklistTitle: 'Supplies checklist',
      suppliesChecklistBody: 'Review only the essentials you need to make the first day feel calmer and easier.',
      readinessBody: 'Review age and readiness signs together to see whether this is a good time to begin solids.',
      readinessSummaryBody: 'Open a dedicated screen to go through the full checklist and the supporting references.',
      readinessStatusReadyTitle: 'You can consider starting now',
      readinessStatusReadyBody: 'The age check and key readiness signs are aligned. Start with simple first foods and observe closely.',
      readinessStatusAlmostTitle: 'Almost ready',
      readinessStatusAlmostBody: 'Most core signs are there, but checking one or two more signals can make the first start feel safer.',
      readinessStatusWaitTitle: 'Wait a little longer',
      readinessStatusWaitBody: 'The core readiness signs are not all there yet. It is better to watch a bit longer and check again soon.',
      readinessStatusUnknownTitle: 'Set the profile first',
      readinessStatusUnknownBody: 'Birth date is missing, so the age check cannot run yet. Add the baby profile for a more reliable view.',
      readinessSignalsLabel: 'Readiness signs {{count}} / {{total}}',
      readinessAgeKnown: 'Profile says {{months}} months',
      readinessAgeUnknown: 'Age check is empty because the baby profile is missing.',
      readinessProfileAction: 'Set baby profile',
      readinessOpenAction: 'Open checklist',
      readinessReopenAction: 'Review checklist',
      readinessCompleteToastTitle: 'You are ready to start weaning',
      readinessCompleteToastBody: 'Moving to the next chapter.',
      referenceOpenFailed: 'Could not open the source.',
      suppliesOpenAction: 'Check supplies',
      suppliesReopenAction: 'Review supplies',
      suppliesProgressLabel: 'Supplies {{count}} / {{total}}',
      readinessManualBadge: 'Caregiver check',
      readinessAutoBadge: 'Auto check',
      readinessReferenceLabel: 'Based on',
      readinessAgeTitle: 'Baby is around 6 months old',
      readinessAgeBody: 'WHO, CDC, and NHS all place the starting window for solids around 6 months of age.',
      readinessPostureTitle: 'Baby can hold the head steady in a supported sitting position',
      readinessPostureBody: 'Stable head and upper-body control makes spoon-feeding and early practice safer.',
      readinessCoordinationTitle: 'Baby uses eyes, hands, and mouth together around food',
      readinessCoordinationBody: 'Watching food and trying to bring it toward the mouth is a common readiness sign.',
      readinessSwallowTitle: 'Baby tries to swallow instead of pushing food back out',
      readinessSwallowBody: 'If food is still pushed out with the tongue every time, it may be too early to begin.',
      readinessInterestTitle: 'Baby shows interest in food and opens the mouth',
      readinessInterestBody: 'Watching others eat, leaning in, or opening for the spoon can all support readiness.',
      suppliesSpoonTitle: 'A soft spoon and a small bowl are ready',
      suppliesSpoonBody: 'The first few feeds are about getting used to the routine, so simple tools are enough.',
      suppliesBibTitle: 'A bib and wipes are nearby',
      suppliesBibBody: 'Cleanup gets easier when the basics are already within reach.',
      suppliesSeatTitle: 'A safe seat or feeding spot is ready',
      suppliesSeatBody: 'A stable posture makes the first tries calmer and easier to observe.',
      suppliesIngredientTitle: 'The first ingredient and mealtime are already decided',
      suppliesIngredientBody: 'Pick a simple first ingredient and a daytime slot that gives you room to observe.',
      suppliesRecordTitle: 'A quick recording flow is ready after feeding',
      suppliesRecordBody: 'Having photos, notes, and reaction logs ready helps the first day feel much calmer.',
      readinessCautionTitle: 'Keep this in mind too',
      readinessCautionBody: 'Night waking or chewing on fists alone does not confirm readiness. If your baby was premature or has health concerns, talk with your pediatric clinician first.',
      referenceTitle: 'Where does this come from?',
      referenceBody: 'This checklist only uses readiness signs that overlap across WHO, CDC, NHS, and AAP guidance. Each card can open the original source.',
      referenceOpenAction: 'Open source',
      referenceWhoSummary: 'WHO guidance that places complementary feeding around 6 months and emphasizes timely, safe, and adequate feeding.',
      referenceCdcSummary: 'CDC guidance that lists developmental readiness signs such as sitting support, head control, and swallowing.',
      referenceNhsSummary: 'NHS guidance that highlights three key readiness signs together and warns against common false signals.',
      referenceAapSummary: 'AAP caregiver guidance that helps parents interpret real-world signs like posture stability and food interest.',
      loadingBody: 'Loading your read history and bookmarks.',
      progressTitle: 'Learning progress',
      progressBody: 'You have read {{read}} out of {{total}} chapters.',
      progressBadge: '{{percent}}% complete',
      readCountLabel: 'Read',
      bookmarkCountLabel: 'Bookmarks',
      partCountLabel: 'Parts',
      bookmarkTitle: 'Bookmarked chapters',
      bookmarkBody: 'Save the chapters you want to revisit quickly.',
      bookmarkEmptyTitle: 'No saved chapters yet',
      bookmarkEmptyBody: 'Use bookmarks while reading and they will appear here for quick access.',
      partTitle: 'Choose a part',
      partBody: 'The guide is split by key turning points so you can jump straight to what you need.',
      partChipMeta: '{{read}} / {{total}} chapters',
      faqTitle: 'FAQ',
      faqBody: 'Start with the most common questions in one quick list.',
      recommendedTitle: 'Good chapters for right now',
      recommendedBody: 'These chapters fit the current {{part}} flow best.',
      faqCategoryTitle: 'Categories',
      faqCategoryGettingStarted: 'Getting started',
      faqCategoryTools: 'Tools and storage',
      faqCategoryIntake: 'Intake and refusal',
      faqCategorySchedule: 'Routine and expansion',
      faqCategoryReaction: 'Reactions and observation',
      faqStartAgeTitle: 'What age is the right time to begin?',
      faqStartAgeBody: 'Age matters, but head control, sitting support, and food interest are usually better signals to watch together.',
      faqMethodChoiceTitle: 'Is topping-style weaning okay for the first start?',
      faqMethodChoiceBody: 'Yes, if the caregiver can repeat the routine calmly and keep records. The method matters less than a stable flow.',
      faqUtensilsTitle: 'Do I need a lot of tools from the start?',
      faqUtensilsBody: 'Not really. A small bowl, a soft spoon, and a bib are enough for the first few days.',
      faqIronStartTitle: 'Do iron-rich foods need to be included right away?',
      faqIronStartBody: 'The first few days are more about getting used to one simple ingredient. Iron-rich foods can be added gradually by stage.',
      faqSpitOutTitle: 'My baby spits it right back out. Is that a bad sign?',
      faqSpitOutBody: 'Not always. Many babies push food out at first because the texture is unfamiliar. Try the same ingredient again calmly.',
      faqTextureRefusalTitle: 'The baby suddenly dislikes the texture',
      faqTextureRefusalBody: 'The same ingredient can feel very different depending on thickness, temperature, or lumpiness. Adjust texture before changing foods.',
      faqMealCountTitle: 'How do I know when to increase meal count?',
      faqMealCountBody: 'Increase only after the current rhythm feels stable for several days. Adaptation matters more than the calendar alone.',
      faqProteinStartTitle: 'When is a good time to start protein foods?',
      faqProteinStartBody: 'After a few basic ingredients feel stable, protein is easier to observe and log. Timing should support clear records.',
      faqRashWhatTitle: 'What should I do if a rash appears after eating?',
      faqRashWhatBody: 'Take a photo, note the time, and pause that ingredient for now. If it spreads or worsens, seek professional advice.',
      faqVomitWhatTitle: 'Does vomiting always mean an allergy?',
      faqVomitWhatBody: 'Not necessarily. One episode is not enough to conclude that. Log the amount, timing, and any other reactions together.',
      faqPoopChangeTitle: 'Stool color or smell changed after solids',
      faqPoopChangeBody: 'Changes can happen after solids begin. But pain, blood, or severe constipation should be logged and reviewed more carefully.',
      faqHospitalWhenTitle: 'When should I go to the hospital right away?',
      faqHospitalWhenBody: 'Breathing trouble, swelling of the lips or face, or unusual limpness should be treated as urgent, before logging anything else.',
      faqSearchPlaceholder: 'Search what you are wondering about',
      faqSearchEmpty: 'No FAQ matches that search yet.',
      chapterIndex: 'Chapter {{index}}',
      chapterDetailEyebrow: 'Current chapter',
      chapterPointsTitle: 'Key points',
      noteTitle: 'Keep in mind',
      markRead: 'Mark as read',
      markUnread: 'Mark unread',
      nextChapter: 'Next chapter',
      partPrepTitle: 'Getting ready',
      partPrepDescription: 'Decide when to start, what day to choose, and what basics to prepare.',
      prepSignalsTitle: 'Reading readiness signals',
      prepSignalsSummary: 'Look at body readiness and food interest, not only the baby’s age in months.',
      prepSignalsBullet1: 'Notice whether head and upper body control look steadier when sitting with support.',
      prepSignalsBullet2: 'Watch for food interest such as looking at meals or opening the mouth when others eat.',
      prepSignalsBullet3: 'Pick a day when your baby feels well and is not recovering from vaccines or illness.',
      prepSignalsBullet4: 'If strong tongue-thrusting still shows up often, it can be reasonable to wait a few more days and check again.',
      prepSignalsNote: 'The best start date is the one that matches your baby’s readiness, not the fastest one.',
      prepTimingTitle: 'Picking the first day',
      prepTimingSummary: 'Good timing lowers stress for both the baby and the caregiver.',
      prepTimingBullet1: 'Choose morning or midday so help and observation are easier if needed.',
      prepTimingBullet2: 'Avoid times when your baby is overly hungry or sleepy.',
      prepTimingBullet3: 'Try the first meal on a day with fewer outside plans so you can observe calmly.',
      prepTimingBullet4: 'Choose a time when the caregiver can also take a quick photo or note without feeling rushed.',
      prepTimingNote: 'Observation time matters more than finishing the meal.',
      prepToolsTitle: 'What to prepare first',
      prepToolsSummary: 'You only need a few practical tools to begin.',
      prepToolsBullet1: 'A soft spoon, a small bowl, a bib, and a wipeable mat are enough to start.',
      prepToolsBullet2: 'Prepare your logging flow too, because notes and photos matter as much as the food itself.',
      prepToolsBullet3: 'Choose tools that are easy to wash and easy to use every day.',
      prepToolsBullet4: 'There is no need to buy freezer tools first. Add them later only if leftovers actually start to appear.',
      prepToolsNote: 'Start simple and add items only when the routine shows you need them.',
      partFirstFoodTitle: 'First foods',
      partFirstFoodDescription: 'Learn what to offer first, how much to give, and how to use a 3-day routine.',
      foodFirstMenuTitle: 'Choosing the first ingredient',
      foodFirstMenuSummary: 'Simple single-ingredient foods make reactions easier to read.',
      foodFirstMenuBullet1: 'Start with something simple such as rice, potato, or pumpkin.',
      foodFirstMenuBullet2: 'Introducing multiple new ingredients at once makes reactions harder to interpret.',
      foodFirstMenuBullet3: 'The first week works best when you keep the menu very simple.',
      foodFirstMenuBullet4: 'Choosing a food the family already uses often can make repetition and shopping easier later on.',
      foodFirstMenuNote: 'Early menus are about clarity and comfort more than variety.',
      foodPortionTitle: 'How much at first?',
      foodPortionSummary: 'A few spoonfuls can be enough in the early stage.',
      foodPortionBullet1: 'It is normal if your baby only takes one or two spoonfuls at first.',
      foodPortionBullet2: 'Focus on swallowing, expression, and comfort rather than on volume.',
      foodPortionBullet3: 'Do not judge progress from one day alone; repeated exposure matters.',
      foodPortionBullet4: 'Instead of doubling the amount quickly, keep it similar for a few days and watch whether comfort improves.',
      foodPortionNote: 'The first week is about practice, not full meals.',
      foodThreeDayTitle: 'The 3-day routine',
      foodThreeDaySummary: 'Staying with the same new ingredient for a few days makes patterns easier to see.',
      foodThreeDayBullet1: 'After starting a new ingredient, keep it in focus for about 2 to 3 days.',
      foodThreeDayBullet2: 'During that window, avoid adding many other new foods.',
      foodThreeDayBullet3: 'Consistent logging makes the pattern much easier to review later.',
      foodThreeDayBullet4: 'If something feels off, pause that ingredient in the next meal and write down what changed right away.',
      foodThreeDayNote: 'Growing slowly but clearly is often easier than moving fast.',
      partObserveTitle: 'Late topping weaning',
      partObserveDescription: 'As textures and combinations expand, focus on refusal, repeated exposure, and allergy concerns.',
      observeReactionTitle: 'What to watch in the middle stage',
      observeReactionSummary: 'Track more than intake volume. Skin, tummy, mood, and sleep all matter.',
      observeReactionBullet1: 'Write down clear signs first, such as rash, vomiting, or unusual fussiness.',
      observeReactionBullet2: 'Also note changes in stool, sleep, or overall mood when they stand out.',
      observeReactionBullet3: 'Even uncertain changes become useful when tied to a date and ingredient.',
      observeReactionBullet4: 'A quick photo and a short note are often enough to make later comparison much easier.',
      observeReactionNote: 'Logging is mainly about finding patterns, not making a diagnosis.',
      observeRefusalTitle: 'When refusal shows up in the late stage',
      observeRefusalSummary: 'In the late stage, preferences become stronger. Refusal should still be treated as part of adaptation, not failure.',
      observeRefusalBullet1: 'If your baby turns away or closes the mouth, it is okay to stop for that meal.',
      observeRefusalBullet2: 'You can try again later with a different texture, temperature, or pairing.',
      observeRefusalBullet3: 'Refusal logs help you notice whether timing or condition plays a role.',
      observeRefusalBullet4: 'Instead of removing the ingredient completely, try bringing it back in a small amount beside a familiar food.',
      observeRefusalNote: 'Sometimes refusal is about timing or mood more than the ingredient itself.',
      observeRecordsTitle: 'How to log in the middle stage',
      observeRecordsSummary: 'As combinations grow, short but steady records make the next choice much easier.',
      observeRecordsBullet1: 'Date, time, ingredient, intake, and reaction are enough to start.',
      observeRecordsBullet2: 'Photos or a short note help when memory becomes fuzzy.',
      observeRecordsBullet3: 'Consistency matters more than long, detailed writing.',
      observeRecordsBullet4: 'Log good days and difficult days together so the overall pattern stays balanced.',
      observeRecordsNote: 'A repeatable format is more valuable than a perfect log.',
      partFaqTitle: 'Common worries',
      partFaqDescription: 'Quick answers to the questions caregivers ask most often at the start.',
      faqLowIntakeTitle: 'My baby still eats very little in the late stage',
      faqLowIntakeShortBody: 'Look at the pattern over several days, not just one meal.',
      faqLowIntakeSummary: 'Even in the late stage, intake can vary day by day. Look at condition and refusal patterns together.',
      faqLowIntakeBullet1: 'A tiny amount can still count as a meaningful first experience.',
      faqLowIntakeBullet2: 'Look for gradual comfort and acceptance over several days.',
      faqLowIntakeBullet3: 'If your baby feels well overall, avoid pushing volume too quickly.',
      faqLowIntakeBullet4: 'Check whether milk and solids are too close together, because timing alone can affect intake.',
      faqLowIntakeNote: 'Record low-intake days too so the pattern stays clear.',
      faqRepeatTitle: 'Can I still repeat ingredients in the late stage?',
      faqRepeatShortBody: 'Repetition still helps, even if you only change the pairing a little.',
      faqRepeatSummary: 'Repetition still helps later on, especially when you vary texture or pairing instead of everything at once.',
      faqRepeatBullet1: 'Repeating the same ingredient supports a cleaner observation window.',
      faqRepeatBullet2: 'Safe familiar foods become a strong base for future meal planning.',
      faqRepeatBullet3: 'Later, you can add variety by changing pairings instead of everything at once.',
      faqRepeatBullet4: 'Repetition can be seen as building comfort, not as doing something wrong.',
      faqRepeatNote: 'Early stability often matters more than early variety.',
      faqAllergyTitle: 'What if I still worry about allergies in the late stage?',
      faqAllergyShortBody: 'Start with a small amount, on a good day, and keep a clear record.',
      faqAllergySummary: 'As ingredient variety expands, small amounts, a good day, and clear logging become even more important.',
      faqAllergyBullet1: 'Introduce concerning ingredients on a calm day in a very small amount.',
      faqAllergyBullet2: 'If something feels off, log it right away and pause that ingredient.',
      faqAllergyBullet3: 'For severe symptoms, seek professional help first and use the log as context.',
      faqAllergyBullet4: 'Avoid stacking several new foods at once if you want the reaction history to stay clear.',
      faqAllergyNote: 'The app can support your notes, but urgent reactions always come first.',
      faqFirstDayTimeTitle: 'What time works best for the first day?',
      faqFirstDayTimeBody: 'Morning or midday is usually best because you have more time to observe calmly.',
      faqWaterTitle: 'Should I offer water when solids begin?',
      faqWaterBody: 'There is no need to rush. Small amounts can be introduced gradually as the routine settles.',
      faqConstipationTitle: 'The baby looks constipated after starting solids',
      faqConstipationBody: 'Instead of increasing the amount quickly, review the ingredient, amount, and record together first.',
      faqSkipDayTitle: 'Is it okay to skip a day and try again?',
      faqSkipDayBody: 'Yes. If the day feels off, it is okay to pause and restart when the baby feels steadier.',
      faqStorageTitle: 'How should I store homemade baby food?',
      faqStorageBody: 'Start with very small batches and only build a storage routine once leftovers actually appear.',
      adBadge: 'Ad',
      adTitle: 'Google ad slot',
      adBody: 'This slot is designed so AdMob native ads can fit between chapters without breaking the reading flow.',
      adPlaceholder: 'Google Ad Slot',
    },
    mealPlanScreen: {
      title: 'Meals',
      weekMode: 'Week',
      monthMode: 'Month',
      babyStatusEyebrow: 'Baby status',
      todayEyebrow: 'Today',
      selectedDayEyebrow: 'Selected day',
      subtitle: 'Review today suggestions and this week plan tailored to your baby.',
      todayTitle: 'Today meals',
      todayGuideTitle: 'What to feed today',
      todayHint: 'Built from feeding week, introduced foods, and blocked ingredients.',
      todayEmpty: 'No recommendation yet.',
      babyInfoTitle: 'Baby info',
      profileFallback: 'If feeding start date and stage are missing, default rules are used.',
      summaryAge: 'Age',
      summaryFeedingWeek: 'Feeding week',
      summaryStage: 'Stage',
      summaryMeals: 'Meals per day',
      summaryMethod: 'Method',
      summaryBlocked: 'Blocked',
      summaryBlockedNone: 'None',
      startDateSetupTitle: 'Add feeding start date first',
      startDateSetupBody: 'Meal plans use the feeding start date to calculate feeding week.',
      startDateInputLabel: 'Feeding start date',
      startDateInputPlaceholder: 'YYYYMMDD',
      startDateSaveButton: 'Save planning base',
      startDateSaveSuccess: 'Feeding start date saved.',
      startDateValidation: 'Enter 8 digits for the feeding start date (YYYYMMDD).',
      weekPlanTitle: 'This week',
      insightTitle: 'Why this plan',
      reasonFeedingWeek: 'Built from the current feeding week.',
      reasonMealCount: 'Only meals matching the daily meal count are shown.',
      reasonBlocked: 'Blocked, caution, and allergy ingredients are excluded automatically.',
      reasonObservation: 'Observation foods are kept in front until the window ends.',
      reasonRefusal: 'Recently refused or disliked foods were pushed back.',
      reasonFavorite: 'Well-liked ingredients were pulled forward first.',
      switchToRecordButton: 'Go to records',
      fedButton: 'Fed now',
      expandButton: 'Expand',
      foldButton: 'Collapse',
      monthOverviewHint: 'Monthly view is for plan overview, empty dates, and repeating patterns.',
      weekEditHint: 'Use weekly view for editing and day-to-day adjustments.',
      switchToWeekForEditButton: 'Switch to weekly edit',
      newIngredientBadge: 'New',
      noteLabel: 'Note',
      noneLabel: 'None',
      noteObserveNew: 'Observe the same new ingredient for 3 days.',
      noteExcludeCaution: 'Caution ingredients were excluded from this plan.',
      preferencesButton: 'Edit meal preferences',
      preferencesCtaTitle: 'Add a bit more planning detail',
      preferencesCtaBody: 'Stage, meal count, texture, and excluded foods make the plan much more accurate.',
      observationHint: '{{ingredients}} are still under observation, so they stay ahead of other new foods.',
      stagePrep: 'Prep',
      stageInitial: 'Initial',
      stageMiddle: 'Middle',
      stageLate: 'Late',
      stageComplete: 'Complete',
      methodTopping: 'Topping',
      methodTraditional: 'Traditional',
      methodBlwMixed: 'BLW mixed',
      mealCountFormat: '{{count}} meals',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
      comingSoon: 'Coming soon.',
    },
    journeyScreen: {
      title: 'Records',
      subtitle: 'Log time, ingredients, and reactions by date.',
      addButton: 'Add record',
      draftBanner: 'A draft from meal plan is ready.',
      emptyTitle: 'No feeding records yet',
      emptyBody: 'Your first feeding record will appear here by date.',
      emptyAction: 'Create first record',
      dateLabel: 'Date',
      timeLabel: 'Time',
      ingredientsLabel: 'Ingredients',
      ingredientsHint: 'You can select multiple ingredients.',
      ingredientSearchPlaceholder: 'Search ingredients',
      ingredientSearchEmpty: 'No matching ingredient found.',
      editorHeaderCount: ' selected',
      editorHeaderEmpty: 'Record today’s ingredients and reactions.',
      amountLabel: 'Intake',
      amountTypeGram: 'Gram',
      amountTypeLevel: 'Level',
      amountGramPlaceholder: 'e.g. 80',
      amountLevelHigh: 'Ate a lot',
      amountLevelMedium: 'Average',
      amountLevelLow: 'Ate a little',
      reactionLabel: 'Reaction',
      reactionTypeNone: 'Ate well',
      reactionTypeNormal: 'Was okay',
      reactionTypeFussy: 'Refused it',
      reactionTypeVomit: 'Vomited',
      reactionTypeRash: 'Had a rash',
      photoLabel: 'Photo (Optional)',
      photoAddButton: 'Attach photo',
      photoChangeButton: 'Change photo',
      noteLabel: 'Note (Optional)',
      notePlaceholder: 'e.g. Tried a new ingredient',
      saveButton: 'Save record',
      updateButton: 'Update record',
      deleteButton: 'Delete record',
      deleteConfirmTitle: 'Delete this record?',
      deleteConfirmMessage: 'This action cannot be undone.',
      deleteConfirmAction: 'Delete',
      cancel: 'Cancel',
      listTitle: 'Records by date',
      detailTitle: 'Record detail',
      editButton: 'Edit',
      noPhoto: 'No photo attached.',
      validationIngredient: 'Select at least one ingredient.',
      validationDate: 'Enter the date in YYYY-MM-DD format.',
      validationTime: 'Enter the time in HH:MM format.',
      saveSuccess: 'Record saved.',
      updateSuccess: 'Record updated.',
      deleteSuccess: 'Record deleted.',
      pickerDone: 'Done',
      pickerAmPm: 'AM/PM',
      pickerAm: 'AM',
      pickerPm: 'PM',
      pickerHour: 'Hour',
      pickerMinute: 'Minute',
      photoPermissionTitle: 'Permission required',
      photoPermissionMessage: 'Gallery access is required to attach a photo.',
      photoOptionalHint: 'The record can still be saved if photo upload fails.',
      seededFromPlan: 'Meal plan details were prefilled.',
      amountSummaryNone: 'No intake recorded',
      todayLabel: 'Today',
      recordCount: '{{count}} records',
    },
    ingredientsScreen: {
      title: 'Ingredients',
      items: ['Ingredients dictionary', 'Challenge status', 'Allergy history', 'Stage-based management'],
    },
    ingredientScreen: {
      searchPlaceholder: 'Search ingredients',
      addButton: 'Add',
      addTitle: 'Add ingredient',
      addNameLabel: 'Ingredient name',
      addCategoryLabel: 'Category',
      addSave: 'Save',
      addCancel: 'Cancel',
      detailTitle: 'Ingredient detail',
      category: 'Category',
      status: 'Status',
      firstTriedDate: 'First tried date',
      notSet: 'Not set',
      firstTriedPending: 'Not tried yet',
      filterAll: 'All',
      filterTried: 'Tried',
      filterNotTried: 'Not tried',
      filterRisk: 'Caution/Allergy',
      filterRetry: 'Retry',
      emptyTitle: 'No search results',
      emptyBody: 'Try adding a new ingredient.',
      duplicateNameError: 'Ingredient with the same name already exists.',
      nameRequiredError: 'Please enter ingredient name.',
      statusNotTried: 'Not tried',
      statusTried: 'Tried',
      statusCaution: 'Caution',
      statusAllergy: 'Allergy',
      actionSetTried: 'Mark as tried',
      actionSetCaution: 'Mark caution',
      actionSetAllergy: 'Mark allergy',
      actionReset: 'Reset status',
      actionToggleFavorite: 'Toggle favorite',
      reactionsTitle: 'Reaction history',
      reactionsEmpty: 'No reactions yet.',
      reactionAddTitle: 'Add reaction',
      memoTitle: 'Memo',
      memoSaveButton: 'Save memo',
      reactionTypeNone: 'No issue',
      reactionTypeCaution: 'Caution',
      reactionTypeAllergy: 'Allergy',
      reactionTypeOther: 'Other',
      reactionNotePlaceholder: 'e.g. Fussy 30 minutes after intake',
      reactionAddButton: 'Save reaction',
      recordsTitle: 'Related meal records',
      recordsEmpty: 'No related records.',
      savedMessage: 'Saved.',
      saveFailedMessage: 'Saving failed. Please try again.',
      retrySuggested: 'Good time to retry',
    },
  },
};

const DEFAULT_LOCALE: Locale = 'ko';

function resolvePath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object' || !(key in acc)) {
      return undefined;
    }
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

export function getLocale(): Locale {
  const forced = process.env.EXPO_PUBLIC_APP_LOCALE?.toLowerCase();

  if (forced?.startsWith('en')) return 'en';
  if (forced?.startsWith('ko')) return 'ko';

  return DEFAULT_LOCALE;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

export function t(path: string, params?: Record<string, string | number>): string {
  const locale = getLocale();
  const localized = resolvePath(messages[locale], path);

  if (typeof localized === 'string') {
    return interpolate(localized, params);
  }

  const fallback = resolvePath(messages[DEFAULT_LOCALE], path);
  if (typeof fallback === 'string') {
    return interpolate(fallback, params);
  }

  return path;
}

export function tList(path: string): string[] {
  const locale = getLocale();
  const localized = resolvePath(messages[locale], path);

  if (Array.isArray(localized) && localized.every((value) => typeof value === 'string')) {
    return localized as string[];
  }

  const fallback = resolvePath(messages[DEFAULT_LOCALE], path);
  if (Array.isArray(fallback) && fallback.every((value) => typeof value === 'string')) {
    return fallback as string[];
  }

  return [];
}
