import { useEffect, useState } from 'react';
import {
  getElapsedSeconds,
  getRemainingSeconds,
  getProgress,
  getElapsedHours,
} from '../utils/time';

export function useFastingTimer(startedAt: string | undefined, targetHours: number) {
  const [, tick] = useState(0);

  useEffect(() => {
    if (!startedAt) return;
    const interval = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  if (!startedAt) {
    return {
      elapsedSeconds: 0,
      remainingSeconds: targetHours * 3600,
      progress: 0,
      elapsedHours: 0,
      isComplete: false,
    };
  }

  const elapsedSeconds = getElapsedSeconds(startedAt);
  const remainingSeconds = getRemainingSeconds(startedAt, targetHours);
  const progress = getProgress(startedAt, targetHours);
  const elapsedHours = getElapsedHours(startedAt);
  const isComplete = progress >= 1;

  return { elapsedSeconds, remainingSeconds, progress, elapsedHours, isComplete };
}
