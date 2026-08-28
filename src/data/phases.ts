import { FastingPhase, ProtocolId } from '../types';
import { PHASES_48H } from './phases48h';
import { PHASES_72H } from './phases72h';

export type ExtendedProtocolId = '48h' | '72h';

export function isExtendedProtocol(protocolId: ProtocolId): protocolId is ExtendedProtocolId {
  return protocolId === '48h' || protocolId === '72h';
}

export function getPhasesForProtocol(protocolId: ProtocolId): FastingPhase[] | null {
  if (protocolId === '48h') return PHASES_48H;
  if (protocolId === '72h') return PHASES_72H;
  return null;
}

export function getCurrentPhase(phases: FastingPhase[], elapsedHours: number): FastingPhase {
  const phase = phases.find((p) => elapsedHours >= p.startHour && elapsedHours < p.endHour);
  return phase ?? phases[phases.length - 1];
}

export function getNextPhase(phases: FastingPhase[], current: FastingPhase): FastingPhase | null {
  return phases.find((p) => p.order === current.order + 1) ?? null;
}

export function getPhaseById(phases: FastingPhase[], phaseId: string): FastingPhase | undefined {
  return phases.find((p) => p.id === phaseId);
}

export function getTimelineLabels(targetHours: number): string[] {
  if (targetHours <= 48) {
    return ['0h', '12h', '24h', '36h', '48h'];
  }
  return ['0h', '24h', '48h', '72h'];
}
