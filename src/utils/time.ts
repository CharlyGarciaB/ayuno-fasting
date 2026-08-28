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

export function formatDateTimeSpanish(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatLongDuration(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatFastingElapsed(totalSeconds: number): {
  main: string;
  seconds: string;
} {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return {
    main: `${hours}h ${minutes}m`,
    seconds: `${seconds}s`,
  };
}

export function formatScheduleDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today.getTime() - dateDay.getTime()) / (24 * 60 * 60 * 1000));
  const time = date.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return `Hoy ${time}`;
  if (diffDays === 1) return `Ayer ${time}`;
  if (diffDays === -1) return `Mañana ${time}`;

  const label = date.toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatRelativeStart(iso: string): string {
  const started = new Date(iso);
  const now = new Date();
  const startDay = new Date(started.getFullYear(), started.getMonth(), started.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000));

  const time = started.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return `hoy a las ${time}`;
  if (diffDays === 1) return `ayer a las ${time}`;
  if (diffDays > 1) return `hace ${diffDays} días (${formatDateTimeSpanish(iso)})`;
  return formatDateTimeSpanish(iso);
}

export function getEndDateIso(startedAt: string, targetHours: number): string {
  return new Date(new Date(startedAt).getTime() + targetHours * 3600 * 1000).toISOString();
}
