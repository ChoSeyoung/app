import { useCallback, useEffect, useState } from 'react';

import { BABY_PROFILE_STORAGE_KEY, type BabyProfile } from '@/constants/baby-profile';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

type UseBabyProfileResult = {
  profile: BabyProfile | null;
  isLoading: boolean;
  saveProfile: (next: BabyProfile) => Promise<void>;
};

type ProfileListener = (next: BabyProfile | null) => void;

let profileCache: BabyProfile | null | undefined;
const listeners = new Set<ProfileListener>();

function isValidProfile(value: unknown): value is BabyProfile {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<BabyProfile>;
  return (
    typeof candidate.babyName === 'string' &&
    typeof candidate.birthDate === 'string' &&
    (candidate.blockedIngredientIds === undefined ||
      (Array.isArray(candidate.blockedIngredientIds) &&
        candidate.blockedIngredientIds.every((item) => typeof item === 'string'))) &&
    (candidate.preferredIngredientIds === undefined ||
      (Array.isArray(candidate.preferredIngredientIds) &&
        candidate.preferredIngredientIds.every((item) => typeof item === 'string'))) &&
    (candidate.dislikedIngredientIds === undefined ||
      (Array.isArray(candidate.dislikedIngredientIds) &&
        candidate.dislikedIngredientIds.every((item) => typeof item === 'string'))) &&
    (candidate.recentRefusedIngredientIds === undefined ||
      (Array.isArray(candidate.recentRefusedIngredientIds) &&
        candidate.recentRefusedIngredientIds.every((item) => typeof item === 'string')))
  );
}

function publishProfile(next: BabyProfile | null): void {
  profileCache = next;
  listeners.forEach((listener) => {
    listener(next);
  });
}

export function useBabyProfile(): UseBabyProfileResult {
  const [profile, setProfile] = useState<BabyProfile | null>(profileCache ?? null);
  const [isLoading, setIsLoading] = useState(profileCache === undefined);

  useEffect(() => {
    let isMounted = true;
    const listener: ProfileListener = (next) => {
      if (isMounted) {
        setProfile(next);
      }
    };
    listeners.add(listener);

    const load = async () => {
      if (profileCache !== undefined) {
        if (isMounted) {
          setProfile(profileCache);
          setIsLoading(false);
        }
        return;
      }

      try {
        const raw = await safeGetItem(BABY_PROFILE_STORAGE_KEY);
        if (!raw) {
          publishProfile(null);
          return;
        }

        const parsed = JSON.parse(raw) as unknown;
        publishProfile(isValidProfile(parsed) ? parsed : null);
      } catch {
        publishProfile(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
      listeners.delete(listener);
    };
  }, []);

  const saveProfile = useCallback(async (next: BabyProfile) => {
    await safeSetItem(BABY_PROFILE_STORAGE_KEY, JSON.stringify(next));
    publishProfile(next);
  }, []);

  return {
    profile,
    isLoading,
    saveProfile,
  };
}
