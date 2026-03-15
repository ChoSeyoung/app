/**
 * 이유식 레시피 즐겨찾기 훅.
 *
 * 역할:
 * - 고정 레시피 데이터에 사용자의 즐겨찾기 상태를 덮어씌워 목록/상세 화면에서 같은 상태를 보게 한다.
 * - 레시피 즐겨찾기를 로컬 저장소에 유지해 앱 재시작 뒤에도 이어지게 만든다.
 *
 * 유지보수 포인트:
 * - 레시피 원본 데이터는 constants에 두고, 사용자 상태만 여기서 관리하는 구조를 유지한다.
 * - 다른 화면에서 즐겨찾기 상태를 바꿔도 focus 시 다시 읽어오도록 유지해야 상태 불일치가 줄어든다.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { listWeaningRecipes, type WeaningRecipe } from '@/constants/weaning-recipes';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

const RECIPE_FAVORITES_STORAGE_KEY = '@weaning-diary/recipe-favorites';

type FavoriteState = Record<string, boolean>;

type UseWeaningRecipesResult = {
  recipes: WeaningRecipe[];
  isLoading: boolean;
  toggleFavorite: (recipeId: string) => Promise<boolean>;
};

function mergeFavorites(favorites: FavoriteState): WeaningRecipe[] {
  return listWeaningRecipes().map((recipe) => ({
    ...recipe,
    isFavorite: Boolean(favorites[recipe.id]),
  }));
}

async function readFavorites(): Promise<FavoriteState> {
  const raw = await safeGetItem(RECIPE_FAVORITES_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as FavoriteState;
  } catch {
    return {};
  }
}

export function useWeaningRecipes(): UseWeaningRecipesResult {
  const [recipes, setRecipes] = useState<WeaningRecipe[]>(() => listWeaningRecipes());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const favorites = await readFavorites();
    setRecipes(mergeFavorites(favorites));
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const toggleFavorite = useCallback(async (recipeId: string) => {
    const favorites = await readFavorites();
    const nextValue = !favorites[recipeId];
    const nextFavorites = {
      ...favorites,
      [recipeId]: nextValue,
    };

    await safeSetItem(RECIPE_FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
    setRecipes(mergeFavorites(nextFavorites));
    return nextValue;
  }, []);

  return {
    recipes,
    isLoading,
    toggleFavorite,
  };
}
