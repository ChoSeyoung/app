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
  };
  starterGuideScreen: {
    eyebrow: string;
    title: string;
    subtitle: string;
    basicsTitle: string;
    basicsBody: string;
    basicsCard1Title: string;
    basicsCard1Body: string;
    basicsCard2Title: string;
    basicsCard2Body: string;
    basicsCard3Title: string;
    basicsCard3Body: string;
    checklistTitle: string;
    checklistBody: string;
    checkItem1: string;
    checkItem2: string;
    checkItem3: string;
    checkItem4: string;
    faqTitle: string;
    faqBody: string;
    faq1Q: string;
    faq1A: string;
    faq2Q: string;
    faq2A: string;
    faq3Q: string;
    faq3A: string;
    faq4Q: string;
    faq4A: string;
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
    },
    starterGuideScreen: {
      eyebrow: '처음 시작해요',
      title: '이유식 시작하기',
      subtitle: '처음 시작하는 보호자가 한 번에 훑어볼 수 있도록 기초 상식과 FAQ를 귀엽고 가볍게 정리했어요.',
      basicsTitle: '먼저 알아둘 기초',
      basicsBody: '이유식은 많이 먹이는 것보다 천천히 관찰하며 익숙해지는 과정에 더 가까워요.',
      basicsCard1Title: '언제 시작하나요?',
      basicsCard1Body: '보통 생후 4~6개월 무렵, 목을 어느 정도 가누고 음식에 관심을 보일 때 시작을 고민해요.',
      basicsCard2Title: '처음엔 얼마나 먹나요?',
      basicsCard2Body: '몇 숟가락만 먹어도 괜찮아요. 초기엔 양보다 반응과 리듬을 보는 것이 더 중요해요.',
      basicsCard3Title: '무엇부터 시작하나요?',
      basicsCard3Body: '곡물이나 단일 채소처럼 단순한 재료로 시작해 2~3일간 반응을 차분히 살펴보세요.',
      checklistTitle: '시작 전 체크리스트',
      checklistBody: '처음 먹이기 전에 아래 항목을 먼저 확인해두면 훨씬 덜 불안해져요.',
      checkItem1: '아이 컨디션이 괜찮은 날, 오전이나 낮 시간대에 시작해요.',
      checkItem2: '새 식재료는 한 번에 하나씩만 도입해 반응을 구분하기 쉽게 해요.',
      checkItem3: '첫 주에는 묽고 단순한 형태로 시작하고, 거부해도 무리해서 먹이지 않아요.',
      checkItem4: '토함, 발진, 심한 보챔이 있으면 기록을 남기고 다음 식단에 바로 반영해요.',
      faqTitle: '자주 묻는 질문',
      faqBody: '처음 시작할 때 많이 헷갈리는 질문만 골라 짧고 분명하게 정리했어요.',
      faq1Q: '아이가 아직 잘 못 먹는데 괜찮을까요?',
      faq1A: '괜찮아요. 초기에는 삼키는 연습과 새로운 감각에 익숙해지는 단계라서 먹는 양이 적어도 자연스러워요.',
      faq2Q: '새 재료는 며칠 동안 봐야 하나요?',
      faq2A: '보통 2~3일 정도 같은 재료를 관찰하면 반응을 구분하기 쉬워요. 앱의 식재료 상태와 기록을 같이 쓰면 더 편해요.',
      faq3Q: '거부한 재료는 다시 주면 안 되나요?',
      faq3A: '바로 포기할 필요는 없어요. 며칠 쉬었다가 입자감이나 조합을 바꿔 천천히 다시 시도해볼 수 있어요.',
      faq4Q: '알레르기가 걱정되면 어떻게 하나요?',
      faq4A: '새 식재료는 아이 컨디션이 좋은 날 소량으로 시작하고, 이상 반응이 보이면 즉시 기록해두세요. 걱정될 정도의 반응은 전문가 상담이 우선이에요.',
      adBadge: '광고',
      adTitle: '구글 광고 영역',
      adBody: '이 위치에는 AdMob 네이티브 광고나 배너 광고를 앱 톤에 맞춰 안전하게 노출할 수 있어요.',
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
    },
    starterGuideScreen: {
      eyebrow: 'Starting out',
      title: 'Start weaning',
      subtitle: 'A gentle starter guide with basics and FAQs for caregivers who are beginning weaning for the first time.',
      basicsTitle: 'Basics first',
      basicsBody: 'Weaning is less about how much the baby eats and more about slowly building comfort and observation.',
      basicsCard1Title: 'When should we start?',
      basicsCard1Body: 'Many families consider starting around 4 to 6 months, when the baby has better head control and shows interest in food.',
      basicsCard2Title: 'How much at first?',
      basicsCard2Body: 'Even a few spoonfuls is fine. At the start, rhythm and reaction matter more than volume.',
      basicsCard3Title: 'What should come first?',
      basicsCard3Body: 'Begin with simple grains or a single vegetable and observe reactions calmly for 2 to 3 days.',
      checklistTitle: 'Before the first meal',
      checklistBody: 'Checking these points first helps the first week feel much less stressful.',
      checkItem1: 'Choose a day when your baby feels well, ideally earlier in the day.',
      checkItem2: 'Introduce only one new ingredient at a time so reactions stay easy to read.',
      checkItem3: 'Keep the first week thin and simple, and do not force intake if the baby refuses.',
      checkItem4: 'If vomiting, rash, or strong fussiness appears, log it and reflect it in the next plan.',
      faqTitle: 'FAQ',
      faqBody: 'Short answers to the questions most caregivers ask at the beginning.',
      faq1Q: 'My baby barely eats yet. Is that okay?',
      faq1A: 'Yes. Early weaning is often about practice and exposure, so small amounts are completely normal.',
      faq2Q: 'How many days should I watch a new ingredient?',
      faq2A: 'Watching the same new ingredient for 2 to 3 days makes reaction patterns easier to notice.',
      faq3Q: 'If a food was refused once, should I stop offering it?',
      faq3A: 'Not necessarily. After a short break, you can try again with a different texture or pairing.',
      faq4Q: 'What if I am worried about allergies?',
      faq4A: 'Start with a very small amount on a good day, log any unusual response, and prioritize professional advice when a reaction feels concerning.',
      adBadge: 'Ad',
      adTitle: 'Google ad slot',
      adBody: 'This area can later host AdMob native ads or banners while keeping the screen structure consistent.',
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
