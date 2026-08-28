export interface EducationSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: [string, string];
  body: string;
  bullets?: string[];
  visualType?: 'timeline' | 'cell' | 'metabolism' | 'protocols';
}

export interface EducationPhase {
  hour: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bodyProcess: string;
}

export const EDUCATION_INTRO: EducationSection = {
  id: 'intro',
  title: '¿Qué es el ayuno intermitente?',
  subtitle: 'Alternar periodos sin comer con ventanas de alimentación',
  icon: '⏱️',
  color: '#6366F1',
  gradient: ['#2563EB', '#6366F1'],
  body:
    'El ayuno intermitente no es una dieta, sino un patrón de alimentación. Tu cuerpo alterna entre usar glucosa (de la comida) y usar reservas internas (grasa y cetonas). Los protocolos más comunes son 16:8, 18:6 y OMAD.',
  bullets: [
    'No significa comer menos calorías necesariamente',
    'Permite que la insulina baje y el cuerpo acceda a reservas',
    'Muchas personas lo usan por claridad mental y simplicidad',
  ],
};

export const EDUCATION_PHASES: EducationPhase[] = [
  {
    hour: '0–12 h',
    title: 'Glucosa activa',
    description: 'Combustible de la última comida',
    icon: '🍽️',
    color: '#6366F1',
    bodyProcess: 'Insulina elevada · Digestión activa',
  },
  {
    hour: '12–18 h',
    title: 'Glucógeno hepático',
    description: 'Reservas del hígado',
    icon: '🔋',
    color: '#8B5CF6',
    bodyProcess: 'Hígado libera glucógeno almacenado',
  },
  {
    hour: '18–24 h',
    title: 'Gluconeogénesis',
    description: 'Fabricación de glucosa',
    icon: '⚡',
    color: '#A855F7',
    bodyProcess: 'Pico de hambre frecuente · Adaptación',
  },
  {
    hour: '24–36 h',
    title: 'Cetosis temprana',
    description: 'Grasa como combustible',
    icon: '🔥',
    color: '#EC4899',
    bodyProcess: 'Cetonas ↑ · Hambre ↓ · Claridad mental',
  },
  {
    hour: '36–48 h',
    title: 'Cetosis estable',
    description: 'Metabolismo adaptado',
    icon: '💪',
    color: '#F97316',
    bodyProcess: 'Quema de grasa dominante',
  },
  {
    hour: '48–72 h',
    title: 'Autofagia profunda',
    description: 'Limpieza celular',
    icon: '✨',
    color: '#EAB308',
    bodyProcess: 'Reciclaje de componentes dañados',
  },
];

export const EDUCATION_SECTIONS: EducationSection[] = [
  EDUCATION_INTRO,
  {
    id: 'metabolism',
    title: 'Tu metabolismo en ayuno',
    subtitle: 'De glucosa a grasa y cetonas',
    icon: '🔬',
    color: '#EC4899',
    gradient: ['#EC4899', '#F97316'],
    visualType: 'metabolism',
    body:
      'Al comer, la glucosa sube y la insulina la guarda o usa. En ayuno, cuando la glucosa baja, el hígado libera glucógeno. Después, el cuerpo produce cetonas a partir de la grasa: un combustible eficiente para cerebro y músculos.',
    bullets: [
      'Insulina baja → acceso a reservas de grasa',
      'Cetonas alimentan el cerebro sin picos de azúcar',
      'El cambio no es instantáneo: hay fases de transición',
    ],
  },
  {
    id: 'autophagy',
    title: 'Autofagia: limpieza celular',
    subtitle: 'Tu cuerpo recicla lo que ya no sirve',
    icon: '✨',
    color: '#EAB308',
    gradient: ['#EAB308', '#22C55E'],
    visualType: 'cell',
    body:
      'La autofagia (del griego "comerse a sí mismo") es un proceso natural donde la célula degrada componentes dañados o viejos y los recicla. En ayunos prolongados, la literatura sugiere que este proceso se intensifica — como una limpieza profunda interna.',
    bullets: [
      'Las células eliminan proteínas dañadas y organelas viejas',
      'Se activa cuando hay escasez de nutrientes',
      'Es un mecanismo de renovación, no de "autodestrucción"',
    ],
  },
  {
    id: 'protocols',
    title: 'Protocolos populares',
    subtitle: 'Encuentra el ritmo que te funcione',
    icon: '📋',
    color: '#22C55E',
    gradient: ['#16A34A', '#22C55E'],
    visualType: 'protocols',
    body:
      'Cada protocolo equilibra tiempo de ayuno y ventana de comida. Empieza con 16:8 si eres nuevo. Los ayunos de 48h y 72h son extendidos y requieren preparación y, idealmente, supervisión profesional.',
    bullets: [
      '16:8 — 16 h ayuno, 8 h comida (el más popular)',
      '18:6 / 20:4 — ventanas más cortas',
      'OMAD — una comida al día (~23 h)',
      '48h / 72h — reset profundo con guía por fases',
    ],
  },
  {
    id: 'safety',
    title: 'Seguridad y advertencias',
    subtitle: 'Información, no consejo médico',
    icon: '⚠️',
    color: '#EF4444',
    gradient: ['#DC2626', '#EF4444'],
    body:
      'El ayuno prolongado sin guía profesional conlleva riesgos: desequilibrio electrolítico, hipoglucemia, mareos, debilidad. Esta app es educativa. No sustituye a un médico, nutricionista o endocrino.',
    bullets: [
      'No apto: diabetes, embarazo, trastornos alimentarios, menores',
      'Consulta a un profesional antes de ayunos de 48h o más',
      'Rompe el ayuno de forma gradual (caldo, verduras)',
      'Detente si sientes dolor en el pecho, desmayo o confusión',
    ],
  },
];
