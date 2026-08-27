import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FastingSession, ProtocolId, UserSettings } from '../types';

const SESSION_KEY = '@fasting/active_session';
const HISTORY_KEY = '@fasting/history';
const SETTINGS_KEY = '@fasting/settings';

interface FastingContextValue {
  activeSession: FastingSession | null;
  history: FastingSession[];
  settings: UserSettings;
  loading: boolean;
  startFast: (protocolId: ProtocolId, targetHours: number, preparationAccepted?: boolean) => Promise<void>;
  endFast: (status: 'completed' | 'broken') => Promise<void>;
  setDefaultProtocol: (id: ProtocolId) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  defaultProtocol: '16:8',
  notificationsEnabled: false,
};

const FastingContext = createContext<FastingContextValue | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function FastingProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<FastingSession | null>(null);
  const [history, setHistory] = useState<FastingSession[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [sessionRaw, historyRaw, settingsRaw] = await Promise.all([
        AsyncStorage.getItem(SESSION_KEY),
        AsyncStorage.getItem(HISTORY_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
      ]);

      if (sessionRaw) setActiveSession(JSON.parse(sessionRaw));
      if (historyRaw) setHistory(JSON.parse(historyRaw));
      if (settingsRaw) setSettings(JSON.parse(settingsRaw));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startFast = useCallback(
    async (protocolId: ProtocolId, targetHours: number, preparationAccepted = false) => {
      const session: FastingSession = {
        id: generateId(),
        protocolId,
        targetHours,
        startedAt: new Date().toISOString(),
        status: 'active',
        ...(preparationAccepted ? { preparationAcceptedAt: new Date().toISOString() } : {}),
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setActiveSession(session);
    },
    []
  );

  const endFast = useCallback(
    async (status: 'completed' | 'broken') => {
      if (!activeSession) return;
      const finished: FastingSession = {
        ...activeSession,
        endedAt: new Date().toISOString(),
        status,
      };
      const updatedHistory = [finished, ...history];
      await Promise.all([
        AsyncStorage.removeItem(SESSION_KEY),
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory)),
      ]);
      setActiveSession(null);
      setHistory(updatedHistory);
    },
    [activeSession, history]
  );

  const setDefaultProtocol = useCallback(async (id: ProtocolId) => {
    const updated = { ...settings, defaultProtocol: id };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    setSettings(updated);
  }, [settings]);

  return (
    <FastingContext.Provider
      value={{
        activeSession,
        history,
        settings,
        loading,
        startFast,
        endFast,
        setDefaultProtocol,
        refresh: load,
      }}
    >
      {children}
    </FastingContext.Provider>
  );
}

export function useFasting() {
  const ctx = useContext(FastingContext);
  if (!ctx) throw new Error('useFasting must be used within FastingProvider');
  return ctx;
}
