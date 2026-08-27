import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PHASES_72H } from '../data/phases72h';
import { FastingSession } from '../types';

const ANDROID_CHANNEL_ID = 'fasting-phases';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function notificationId(sessionId: string, phaseId: string): string {
  return `fasting-${sessionId}-${phaseId}`;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Fases del ayuno',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#6366F1',
  });
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

export async function schedule72hPhaseNotifications(session: FastingSession): Promise<number> {
  if (Platform.OS === 'web') return 0;

  const granted = await getNotificationPermissionStatus();
  if (!granted) return 0;

  await cancelFastingNotifications();
  await ensureAndroidChannel();

  const startedAt = new Date(session.startedAt).getTime();
  const now = Date.now();
  let scheduled = 0;

  for (const phase of PHASES_72H) {
    const triggerMs = startedAt + phase.startHour * 60 * 60 * 1000;
    if (triggerMs <= now) continue;

    const secondsUntil = Math.max(1, Math.round((triggerMs - now) / 1000));

    await Notifications.scheduleNotificationAsync({
      identifier: notificationId(session.id, phase.id),
      content: {
        title: `${phase.icon} Fase ${phase.order}: ${phase.title}`,
        body: phase.shortDescription,
        data: { phaseId: phase.id, sessionId: session.id, type: 'phase' },
        ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil,
      },
    });
    scheduled += 1;
  }

  const completeMs = startedAt + session.targetHours * 60 * 60 * 1000;
  if (completeMs > now) {
    const secondsUntilComplete = Math.max(1, Math.round((completeMs - now) / 1000));
    await Notifications.scheduleNotificationAsync({
      identifier: notificationId(session.id, 'complete'),
      content: {
        title: '🏁 ¡72 horas completadas!',
        body: 'Has alcanzado tu meta. Abre la app para ver la guía de refeed.',
        data: { sessionId: session.id, type: 'complete' },
        ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilComplete,
      },
    });
    scheduled += 1;
  }

  return scheduled;
}

export async function syncNotificationsForSession(
  session: FastingSession | null,
  enabled: boolean
): Promise<void> {
  if (!enabled || !session || session.protocolId !== '72h') {
    await cancelFastingNotifications();
    return;
  }
  await schedule72hPhaseNotifications(session);
}

export function getUpcomingPhaseNotifications(session: FastingSession): { phaseTitle: string; at: Date }[] {
  const startedAt = new Date(session.startedAt).getTime();
  const now = Date.now();
  const elapsedHours = (now - startedAt) / (60 * 60 * 1000);

  return PHASES_72H.filter((phase) => phase.startHour > elapsedHours).map((phase) => ({
    phaseTitle: phase.title,
    at: new Date(startedAt + phase.startHour * 60 * 60 * 1000),
  }));
}
