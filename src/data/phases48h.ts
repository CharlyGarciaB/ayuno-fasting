import { FastingPhase } from '../types';

export const PHASES_48H: FastingPhase[] = [
  {
    id: '48-phase-1',
    order: 1,
    startHour: 0,
    endHour: 12,
    title: 'Transición inicial',
    shortDescription: 'Tu cuerpo usa la glucosa de tu última comida.',
    fullContent:
      'Después de comer, el cuerpo digiere y utiliza la glucosa como combustible principal. La insulina permanece elevada mientras procesas los nutrientes. Es el inicio natural del ayuno extendido.',
    commonFeelings: ['Saciedad inicial', 'Primeras señales de hambre', 'Normalidad general'],
    tips: ['Bebe agua con regularidad', 'Evita picotear', 'Mantén actividades ligeras'],
    icon: '🍽️',
    color: '#6366F1',
  },
  {
    id: '48-phase-2',
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
    id: '48-phase-3',
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
    id: '48-phase-4',
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
    id: '48-phase-5',
    order: 5,
    startHour: 36,
    endHour: 48,
    title: 'Cetosis y cierre',
    shortDescription: 'La grasa es tu combustible. Prepara tu ruptura del ayuno.',
    fullContent:
      'El metabolismo se ha adaptado: la quema de grasa y las cetonas dominan. Los procesos de autofagia — reciclaje celular — comienzan a intensificarse. Estás en la recta final: planifica cómo romper el ayuno de forma segura y gradual.',
    commonFeelings: ['Hambre mínima', 'Calma mental', 'Anticipación de comida'],
    tips: ['Agua y electrolitos constantes', 'Planifica tu refeed', 'Empieza con caldo o verduras'],
    icon: '🏁',
    color: '#22C55E',
  },
];
