import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PHASES_72H } from '../data/phases72h';
import { getProtocol } from '../data/protocols';
import { FastingSession } from '../types';

const ANDROID_CHANNEL_ID = 'fasting-phases';

export interface UpcomingNotification {
  title: string;
  at: Date;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function notificationId(sessionId: string, suffix: string): string {
  return `fasting-${sessionId}-${suffix}`;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Ayuno',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#6366F1',
  });
}

async function prepareNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const granted = await getNotificationPermissionStatus();
  if (!granted) return false;
  await cancelFastingNotifications();
  await ensureAndroidChannel();
  return true;
}

function completionContent(session: FastingSession): { title: string; body: string } {
  const protocol = getProtocol(session.protocolId);
  if (session.protocolId === '72h') {
    return {
      title: '🏁 ¡72 horas completadas!',
      body: 'Has alcanzado tu meta. Abre la app para ver la guía de refeed.',
    };
  }
  return {
    title: `🎉 ¡Meta de ${protocol?.name ?? 'ayuno'} alcanzada!`,
    body: `Completaste ${session.targetHours} horas de ayuno. Ya puedes romper el ayuno con calma.`,
  };
}

async function scheduleAt(
  session: FastingSession,
  suffix: string,
  triggerMs: number,
  content: { title: string; body: string; data?: Record<string, unknown> }
): Promise<boolean> {
  const now = Date.now();
  if (triggerMs <= now) return false;

  const secondsUntil = Math.max(1, Math.round((triggerMs - now) / 1000));

  await Notifications.scheduleNotificationAsync({
    identifier: notificationId(session.id, suffix),
    content: {
      title: content.title,
      body: content.body,
      data: { sessionId: session.id, ...content.data },
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsUntil,
    },
  });
  return true;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function getNotificationPermissionStatus(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function cancelFastingNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleCompletionNotification(session: FastingSession): Promise<boolean> {
  if (!(await prepareNotifications())) return false;

  const startedAt = new Date(session.startedAt).getTime();
  const completeMs = startedAt + session.targetHours * 60 * 60 * 1000;
  const { title, body } = completionContent(session);

  return scheduleAt(session, 'complete', completeMs, {
    title,
    body,
    data: { type: 'complete', protocolId: session.protocolId },
  });
}

export async function schedule72hPhaseNotifications(session: FastingSession): Promise<number> {
  if (!(await prepareNotifications())) return 0;

  const startedAt = new Date(session.startedAt).getTime();
  let scheduled = 0;

  for (const phase of PHASES_72H) {
    const triggerMs = startedAt + phase.startHour * 60 * 60 * 1000;
    const didSchedule = await scheduleAt(session, phase.id, triggerMs, {
      title: `${phase.icon} Fase ${phase.order}: ${phase.title}`,
      body: phase.shortDescription,
      data: { type: 'phase', phaseId: phase.id },
    });
    if (didSchedule) scheduled += 1;
  }

  const { title, body } = completionContent(session);
  const completeMs = startedAt + session.targetHours * 60 * 60 * 1000;
  const didScheduleComplete = await scheduleAt(session, 'complete', completeMs, {
    title,
    body,
    data: { type: 'complete', protocolId: session.protocolId },
  });
  if (didScheduleComplete) scheduled += 1;

  return scheduled;
}

export async function syncNotificationsForSession(
  session: FastingSession | null,
  enabled: boolean
): Promise<void> {
  if (!enabled || !session) {
    await cancelFastingNotifications();
    return;
  }

  if (session.protocolId === '72h') {
    await schedule72hPhaseNotifications(session);
  } else {
    await scheduleCompletionNotification(session);
  }
}

export function getUpcomingNotifications(session: FastingSession): UpcomingNotification[] {
  const startedAt = new Date(session.startedAt).getTime();
  const now = Date.now();
  const elapsedHours = (now - startedAt) / (60 * 60 * 1000);
  const upcoming: UpcomingNotification[] = [];

  if (session.protocolId === '72h') {
    for (const phase of PHASES_72H) {
      if (phase.startHour <= elapsedHours) continue;
      upcoming.push({
        title: `Fase ${phase.order}: ${phase.title}`,
        at: new Date(startedAt + phase.startHour * 60 * 60 * 1000),
      });
    }
  }

  const completeMs = startedAt + session.targetHours * 60 * 60 * 1000;
  if (completeMs > now) {
    const protocol = getProtocol(session.protocolId);
    upcoming.push({
      title:
        session.protocolId === '72h'
          ? '72 horas completadas'
          : `Meta ${protocol?.name ?? session.targetHours + 'h'} alcanzada`,
      at: new Date(completeMs),
    });
  }

  return upcoming.sort((a, b) => a.at.getTime() - b.at.getTime());
}

/** @deprecated Use getUpcomingNotifications */
export function getUpcomingPhaseNotifications(session: FastingSession): UpcomingNotification[] {
  return getUpcomingNotifications(session);
}
