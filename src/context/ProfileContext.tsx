import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WeightEntry } from '../types';

const PROFILE_KEY = '@fasting/profile';
const WEIGHTS_KEY = '@fasting/weights';

interface ProfileContextValue {
  profile: UserProfile;
  weights: WeightEntry[];
  loading: boolean;
  latestWeight: WeightEntry | null;
  setHeight: (heightCm: number) => Promise<void>;
  addWeight: (weightKg: number, recordedAt?: Date, note?: string) => Promise<void>;
  updateWeight: (id: string, weightKg: number, recordedAt?: Date, note?: string) => Promise<void>;
  deleteWeight: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultProfile: UserProfile = { heightCm: null };

const ProfileContext = createContext<ProfileContextValue | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [profileRaw, weightsRaw] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(WEIGHTS_KEY),
      ]);
      if (profileRaw) setProfile(JSON.parse(profileRaw));
      if (weightsRaw) {
        const parsed: WeightEntry[] = JSON.parse(weightsRaw);
        setWeights(parsed.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setHeight = useCallback(async (heightCm: number) => {
    const updated = { heightCm };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    setProfile(updated);
  }, []);

  const persistWeights = useCallback(async (entries: WeightEntry[]) => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
    await AsyncStorage.setItem(WEIGHTS_KEY, JSON.stringify(sorted));
    setWeights(sorted);
  }, []);

  const addWeight = useCallback(
    async (weightKg: number, recordedAt = new Date(), note?: string) => {
      const entry: WeightEntry = {
        id: generateId(),
        weightKg,
        recordedAt: recordedAt.toISOString(),
        ...(note ? { note } : {}),
      };
      await persistWeights([entry, ...weights]);
    },
    [weights, persistWeights]
  );

  const updateWeight = useCallback(
    async (id: string, weightKg: number, recordedAt?: Date, note?: string) => {
      const updated = weights.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              weightKg,
              recordedAt: recordedAt ? recordedAt.toISOString() : entry.recordedAt,
              note: note ?? entry.note,
            }
          : entry
      );
      await persistWeights(updated);
    },
    [weights, persistWeights]
  );

  const deleteWeight = useCallback(
    async (id: string) => {
      await persistWeights(weights.filter((entry) => entry.id !== id));
    },
    [weights, persistWeights]
  );

  const latestWeight = weights[0] ?? null;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        weights,
        loading,
        latestWeight,
        setHeight,
        addWeight,
        updateWeight,
        deleteWeight,
        refresh: load,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
