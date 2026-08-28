import { Protocol } from '../types';

export const PROTOCOLS: Protocol[] = [
  {
    id: '16:8',
    name: '16:8',
    targetHours: 16,
    description: '16 horas de ayuno, 8 horas para comer. El más popular.',
  },
  {
    id: '18:6',
    name: '18:6',
    targetHours: 18,
    description: '18 horas de ayuno, 6 horas para comer.',
  },
  {
    id: '20:4',
    name: '20:4',
    targetHours: 20,
    description: '20 horas de ayuno, 4 horas para comer.',
  },
  {
    id: 'omad',
    name: 'OMAD',
    targetHours: 23,
    description: 'Una comida al día. Ayuno de ~23 horas.',
  },
  {
    id: '48h',
    name: 'Ayuno extendido 48h',
    targetHours: 48,
    description: 'Reset metabólico con guía por fases. Requiere preparación y precaución.',
    badge: 'Extendido',
    isExtended: true,
  },
  {
    id: '72h',
    name: 'Ayuno profundo 72h',
    targetHours: 72,
    description: 'El ayuno más potente. Reset metabólico profundo con guía por fases.',
    badge: 'Más potente',
    isExtended: true,
  },
];

export function getProtocol(id: string): Protocol | undefined {
  return PROTOCOLS.find((p) => p.id === id);
}
