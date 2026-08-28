export type ProtocolId = '16:8' | '18:6' | '20:4' | 'omad' | '48h' | '72h' | 'custom';

export type SessionStatus = 'active' | 'completed' | 'broken';

export interface Protocol {
  id: ProtocolId;
  name: string;
  targetHours: number;
  description: string;
  badge?: string;
  isExtended?: boolean;
}

export interface FastingPhase {
  id: string;
  order: number;
  startHour: number;
  endHour: number;
  title: string;
  shortDescription: string;
  fullContent: string;
  commonFeelings: string[];
  tips: string[];
  icon: string;
  color: string;
}

export interface FastingSession {
  id: string;
  protocolId: ProtocolId;
  targetHours: number;
  startedAt: string;
  endedAt?: string;
  status: SessionStatus;
  preparationAcceptedAt?: string;
}

export interface UserSettings {
  defaultProtocol: ProtocolId;
  notificationsEnabled: boolean;
}

export interface UserProfile {
  heightCm: number | null;
}

export interface WeightEntry {
  id: string;
  weightKg: number;
  recordedAt: string;
  note?: string;
}

export interface SymptomLog {
  hour: number;
  note: string;
  loggedAt: string;
}
