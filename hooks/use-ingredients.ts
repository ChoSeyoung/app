import { useCallback, useEffect, useState } from 'react';

import type {
  Ingredient,
  IngredientReaction,
  IngredientReactionType,
  IngredientStatus,
} from '@/features/ingredients/model';
import {
  addIngredientReaction,
  listIngredientReactionsByIngredientId,
  listIngredients,
  toggleIngredientFavorite,
  updateIngredientStatus,
} from '@/features/ingredients/repository';

type UseIngredientsResult = {
  ingredients: Ingredient[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  setStatus: (ingredientId: string, status: IngredientStatus) => Promise<Ingredient>;
  toggleFavorite: (ingredientId: string) => Promise<Ingredient>;
  addReaction: (input: {
    ingredientId: string;
    reactionType: IngredientReactionType;
    note?: string;
    date?: string;
  }) => Promise<IngredientReaction>;
  listReactions: (ingredientId: string) => Promise<IngredientReaction[]>;
};

export function useIngredients(): UseIngredientsResult {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await listIngredients();
    setIngredients(next);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const next = await listIngredients();
        if (isMounted) {
          setIngredients(next);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const setStatus = useCallback(async (ingredientId: string, status: IngredientStatus) => {
    const updated = await updateIngredientStatus(ingredientId, status);
    const next = await listIngredients();
    setIngredients(next);
    return updated;
  }, []);

  const toggleFavorite = useCallback(async (ingredientId: string) => {
    const updated = await toggleIngredientFavorite(ingredientId);
    const next = await listIngredients();
    setIngredients(next);
    return updated;
  }, []);

  const addReaction = useCallback(
    async (input: { ingredientId: string; reactionType: IngredientReactionType; note?: string; date?: string }) => {
      const created = await addIngredientReaction(input);
      return created;
    },
    []
  );

  const listReactions = useCallback(async (ingredientId: string) => {
    return listIngredientReactionsByIngredientId(ingredientId);
  }, []);

  return {
    ingredients,
    isLoading,
    refresh,
    setStatus,
    toggleFavorite,
    addReaction,
    listReactions,
  };
}
