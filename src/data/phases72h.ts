import { FastingPhase } from '../types';

export const PHASES_72H: FastingPhase[] = [
  {
    id: 'phase-1',
    order: 1,
    startHour: 0,
    endHour: 12,
    title: 'Transición inicial',
    shortDescription: 'Tu cuerpo usa la glucosa de tu última comida.',
    fullContent:
      'Después de comer, el cuerpo digiere y utiliza la glucosa como combustible principal. La insulina permanece elevada mientras procesas los nutrientes. Es el inicio natural del ayuno.',
    commonFeelings: ['Saciedad inicial', 'Primeras señales de hambre', 'Normalidad general'],
    tips: ['Bebe agua con regularidad', 'Evita picotear', 'Mantén actividades ligeras'],
    icon: '🍽️',
    color: '#6366F1',
  },
  {
    id: 'phase-2',
    order: 2,
    startHour: 12,
    endHour: 18,
    title: 'Reservas de glucógeno',
    shortDescription: 'El hígado libera glucógeno almacenado como reserva.',
    fullContent:
      'Cuando la glucosa de la comida se agota, el hígado libera glucógeno almacenado. Es la transición hacia el uso de reservas internas. Muchas personas alcanzan aquí su ayuno intermitente habitual.',
    commonFeelings: ['Hambre más notable', 'Posible irritabilidad leve', 'Menos energía'],
    tips: ['Añade una pizca de sal al agua', 'Camina suave si te distrae', 'Recuerda tu objetivo'],
    icon: '🔋',
    color: '#8B5CF6',
  },
  {
    id: 'phase-3',
    order: 3,
    startHour: 18,
    endHour: 24,
    title: 'Transición metabólica',
    shortDescription: 'El cuerpo fabrica glucosa a partir de otras fuentes.',
    fullContent:
      'Entra la gluconeogénesis: el cuerpo produce glucosa a partir de aminoácidos y otros sustratos. Es una fase de adaptación donde muchos sienten el "pico de hambre" más intenso del ayuno.',
    commonFeelings: ['Pico de hambre', 'Antojos', 'Cabeza ligera ocasional'],
    tips: ['Este pico suele pasar en 1-2 horas', 'Té o café sin azúcar está bien', 'Descansa si lo necesitas'],
    icon: '⚡',
    color: '#A855F7',
  },
  {
    id: 'phase-4',
    order: 4,
    startHour: 24,
    endHour: 36,
    title: 'Entrada en cetosis',
    shortDescription: 'Tu cuerpo empieza a producir cetonas como combustible.',
    fullContent:
      'Tras ~24 horas, la producción de cetonas aumenta. El cerebro y el cuerpo empiezan a usar grasa y cetonas como fuente principal de energía. Para muchos, el hambre disminuye notablemente aquí.',
    commonFeelings: ['Menos hambre', 'Mayor claridad mental', 'Energía más estable'],
    tips: ['Mantén electrolitos', 'Duerme bien', 'Evita ejercicio intenso'],
    icon: '🔥',
    color: '#EC4899',
  },
  {
    id: 'phase-5',
    order: 5,
    startHour: 36,
    endHour: 48,
    title: 'Cetosis estable',
    shortDescription: 'La grasa es ahora tu combustible principal.',
    fullContent:
      'El metabolismo se ha adaptado: la quema de grasa y las cetonas dominan. Es una fase de mayor estabilidad metabólica. Tu cuerpo opera de forma eficiente con reservas internas.',
    commonFeelings: ['Hambre mínima', 'Calma mental', 'Posible aliento cetónico leve'],
    tips: ['Agua y electrolitos constantes', 'Actividad ligera está bien', 'Escucha a tu cuerpo'],
    icon: '💪',
    color: '#F97316',
  },
  {
    id: 'phase-6',
    order: 6,
    startHour: 48,
    endHour: 60,
    title: 'Autofagia profunda',
    shortDescription: 'Procesos de limpieza y renovación celular intensificados.',
    fullContent:
      'A partir de las 48 horas, los procesos de autofagia — reciclaje celular — se intensifican según la literatura sobre ayuno prolongado. Es una de las fases más valoradas del ayuno extendido.',
    commonFeelings: ['Energía variable', 'Sensación de logro', 'Posible cansancio'],
    tips: ['No fuerces el cuerpo', 'Prioriza el descanso', 'Mantén hidratación'],
    icon: '✨',
    color: '#EAB308',
  },
  {
    id: 'phase-7',
    order: 7,
    startHour: 60,
    endHour: 72,
    title: 'Cierre del ayuno profundo',
    shortDescription: 'Te acercas a la meta. Prepara tu ruptura del ayuno.',
    fullContent:
      'Estás en la recta final. Tu cuerpo ha completado un profundo reset metabólico. Es momento de planificar cómo romper el ayuno de forma segura y gradual.',
    commonFeelings: ['Anticipación de comida', 'Orgullo por el logro', 'Impaciencia'],
    tips: ['Planifica tu refeed', 'No comas en exceso al terminar', 'Empieza con caldo o verduras'],
    icon: '🏁',
    color: '#22C55E',
  },
];

export function getCurrentPhase(elapsedHours: number): FastingPhase {
  const phase = PHASES_72H.find(
    (p) => elapsedHours >= p.startHour && elapsedHours < p.endHour
  );
  return phase ?? PHASES_72H[PHASES_72H.length - 1];
}

export function getNextPhase(current: FastingPhase): FastingPhase | null {
  return PHASES_72H.find((p) => p.order === current.order + 1) ?? null;
}
