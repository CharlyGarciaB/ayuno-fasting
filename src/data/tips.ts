export const FASTING_TIPS = [
  {
    id: 'hydration',
    icon: '💧',
    title: 'Mantente hidratado',
    text: 'Bebe agua durante el ayuno para reducir el hambre y la fatiga.',
  },
  {
    id: 'electrolytes',
    icon: '🧂',
    title: 'Electrolitos',
    text: 'Una pizca de sal en el agua ayuda en ayunos de más de 16 horas.',
  },
  {
    id: 'rest',
    icon: '😴',
    title: 'Descansa bien',
    text: 'El sueño de calidad facilita cumplir tu ventana de ayuno.',
  },
  {
    id: 'light-activity',
    icon: '🚶',
    title: 'Actividad ligera',
    text: 'Caminar suave puede distraer el hambre sin forzar el cuerpo.',
  },
];

export function getTipForPhase(phaseIcon?: string): (typeof FASTING_TIPS)[0] {
  if (phaseIcon === '🔥') {
    return {
      id: 'ketosis',
      icon: '🔥',
      title: 'Zona de cetosis',
      text: 'Tu cuerpo empieza a usar grasa como combustible principal.',
    };
  }
  if (phaseIcon === '✨') {
    return {
      id: 'autophagy',
      icon: '✨',
      title: 'Autofagia profunda',
      text: 'Procesos de renovación celular más intensos en esta fase.',
    };
  }
  return FASTING_TIPS[Math.floor(Date.now() / 86400000) % FASTING_TIPS.length];
}
