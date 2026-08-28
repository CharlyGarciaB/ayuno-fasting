export function calculateBmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function formatBmi(bmi: number): string {
  return bmi.toFixed(1);
}

export function getBmiCategory(bmi: number): string {
  if (bmi <= 0) return '—';
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidad';
}

export function formatWeight(weightKg: number): string {
  return `${weightKg.toFixed(1)} kg`;
}

export function formatHeight(heightCm: number): string {
  if (heightCm >= 100) {
    const meters = Math.floor(heightCm / 100);
    const cm = Math.round(heightCm % 100);
    return `${meters} m ${cm} cm`;
  }
  return `${heightCm} cm`;
}

export function parseDecimalInput(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}
