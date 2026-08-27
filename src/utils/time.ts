export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatHoursMinutes(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function getElapsedSeconds(startedAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
}

export function getElapsedHours(startedAt: string): number {
  return getElapsedSeconds(startedAt) / 3600;
}

export function getRemainingSeconds(startedAt: string, targetHours: number): number {
  const elapsed = getElapsedSeconds(startedAt);
  const target = targetHours * 3600;
  return Math.max(0, target - elapsed);
}

export function getProgress(startedAt: string, targetHours: number): number {
  const elapsed = getElapsedSeconds(startedAt);
  const target = targetHours * 3600;
  return Math.min(1, elapsed / target);
}
