import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FastingSession, ProtocolId, UserSettings } from '../types';
import { isExtendedProtocol } from '../data/phases';
import { syncNotificationsForSession } from '../services/notifications';

const SESSION_KEY = '@fasting/active_session';
const HISTORY_KEY = '@fasting/history';
const SETTINGS_KEY = '@fasting/settings';

interface FastingContextValue {
  activeSession: FastingSession | null;
  history: FastingSession[];
  settings: UserSettings;
  loading: boolean;
  startFast: (
    protocolId: ProtocolId,
    targetHours: number,
    options?: { preparationAccepted?: boolean; startedAt?: Date | string }
  ) => Promise<void>;
  endFast: (status: 'completed' | 'broken') => Promise<void>;
  updateSessionStart: (startedAt: Date | string) => Promise<void>;
  setDefaultProtocol: (id: ProtocolId) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  defaultProtocol: '16:8',
  notificationsEnabled: true,
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

  useEffect(() => {
    if (loading) return;
    syncNotificationsForSession(activeSession, settings.notificationsEnabled);
  }, [activeSession, settings.notificationsEnabled, loading]);

  const startFast = useCallback(
    async (
      protocolId: ProtocolId,
      targetHours: number,
      options?: { preparationAccepted?: boolean; startedAt?: Date | string }
    ) => {
      const preparationAccepted = options?.preparationAccepted ?? false;
      const startedAtDate = options?.startedAt ? new Date(options.startedAt) : new Date();

      if (startedAtDate.getTime() > Date.now()) {
        throw new Error('La fecha de inicio no puede ser en el futuro.');
      }

      const session: FastingSession = {
        id: generateId(),
        protocolId,
        targetHours,
        startedAt: startedAtDate.toISOString(),
        status: 'active',
        ...(preparationAccepted ? { preparationAcceptedAt: new Date().toISOString() } : {}),
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setActiveSession(session);
      const shouldNotify =
        settings.notificationsEnabled || (isExtendedProtocol(protocolId) && preparationAccepted);
      if (shouldNotify) {
        await syncNotificationsForSession(session, true);
      }
    },
    [settings.notificationsEnabled]
  );

  const endFast = useCallback(
    async (status: 'completed' | 'broken') => {
      if (!activeSession) return;
      await syncNotificationsForSession(null, false);
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

  const updateSessionStart = useCallback(
    async (startedAt: Date | string) => {
      if (!activeSession) return;
      const startedAtDate = new Date(startedAt);
      if (startedAtDate.getTime() > Date.now()) {
        throw new Error('La fecha de inicio no puede ser en el futuro.');
      }
      const updated: FastingSession = {
        ...activeSession,
        startedAt: startedAtDate.toISOString(),
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setActiveSession(updated);
      if (settings.notificationsEnabled) {
        await syncNotificationsForSession(updated, true);
      }
    },
    [activeSession, settings.notificationsEnabled]
  );

  const setDefaultProtocol = useCallback(async (id: ProtocolId) => {
    const updated = { ...settings, defaultProtocol: id };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    setSettings(updated);
  }, [settings]);

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      const updated = { ...settings, notificationsEnabled: enabled };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      setSettings(updated);
      await syncNotificationsForSession(activeSession, enabled);
    },
    [settings, activeSession]
  );

  return (
    <FastingContext.Provider
      value={{
        activeSession,
        history,
        settings,
        loading,
        startFast,
        endFast,
        updateSessionStart,
        setDefaultProtocol,
        setNotificationsEnabled,
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
