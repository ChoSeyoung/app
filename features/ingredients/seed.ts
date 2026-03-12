import type { MasterIngredient } from './model';

const seedCreatedAt = '2026-03-10T00:00:00.000Z';

export const SEED_INGREDIENTS: MasterIngredient[] = [
  { id: 'seed-rice', name: '쌀', category: 'GRAIN', source: 'seed', aliases: ['쌀미음'], isCommon: true, sortOrder: 1, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-oatmeal', name: '오트밀', category: 'GRAIN', source: 'seed', isCommon: true, sortOrder: 2, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-barley', name: '보리', category: 'GRAIN', source: 'seed', sortOrder: 3, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-sweet-potato', name: '고구마', category: 'VEGETABLE', source: 'seed', isCommon: true, sortOrder: 10, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-pumpkin', name: '단호박', category: 'VEGETABLE', source: 'seed', aliases: ['호박'], isCommon: true, sortOrder: 11, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-potato', name: '감자', category: 'VEGETABLE', source: 'seed', isCommon: true, sortOrder: 12, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-carrot', name: '당근', category: 'VEGETABLE', source: 'seed', isCommon: true, sortOrder: 13, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-broccoli', name: '브로콜리', category: 'VEGETABLE', source: 'seed', isCommon: true, sortOrder: 14, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-cauliflower', name: '콜리플라워', category: 'VEGETABLE', source: 'seed', sortOrder: 15, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-zucchini', name: '애호박', category: 'VEGETABLE', source: 'seed', isCommon: true, sortOrder: 16, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-spinach', name: '시금치', category: 'VEGETABLE', source: 'seed', sortOrder: 17, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-cabbage', name: '양배추', category: 'VEGETABLE', source: 'seed', sortOrder: 18, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-onion', name: '양파', category: 'VEGETABLE', source: 'seed', sortOrder: 19, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-apple', name: '사과', category: 'FRUIT', source: 'seed', isCommon: true, sortOrder: 30, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-pear', name: '배', category: 'FRUIT', source: 'seed', isCommon: true, sortOrder: 31, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-banana', name: '바나나', category: 'FRUIT', source: 'seed', isCommon: true, sortOrder: 32, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-avocado', name: '아보카도', category: 'FRUIT', source: 'seed', sortOrder: 33, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-chicken', name: '닭고기', category: 'PROTEIN', source: 'seed', isCommon: true, sortOrder: 40, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-beef', name: '소고기', category: 'PROTEIN', source: 'seed', aliases: ['쇠고기'], isCommon: true, sortOrder: 41, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-tofu', name: '두부', category: 'PROTEIN', source: 'seed', isCommon: true, sortOrder: 42, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-egg-yolk', name: '달걀노른자', category: 'PROTEIN', source: 'seed', aliases: ['계란노른자'], sortOrder: 43, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-white-fish', name: '흰살생선', category: 'PROTEIN', source: 'seed', sortOrder: 44, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-yogurt', name: '요거트', category: 'DAIRY', source: 'seed', sortOrder: 50, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
  { id: 'seed-cheese', name: '치즈', category: 'DAIRY', source: 'seed', sortOrder: 51, createdAt: seedCreatedAt, updatedAt: seedCreatedAt },
];
