import React from 'react';
import { View, Text, StyleSheet, Switch, Alert, Platform } from 'react-native';
import { useFasting } from '../context/FastingContext';
import { colors } from '../theme/colors';
import {
  requestNotificationPermissions,
  getNotificationPermissionStatus,
  getUpcomingPhaseNotifications,
} from '../services/notifications';

export function SettingsScreen() {
  const { settings, setNotificationsEnabled, activeSession } = useFasting();
  const is72hActive = activeSession?.protocolId === '72h';
  const upcoming =
    is72hActive && settings.notificationsEnabled && activeSession
      ? getUpcomingPhaseNotifications(activeSession)
      : [];

  const handleToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permisos necesarios',
          Platform.OS === 'web'
            ? 'Las notificaciones no están disponibles en web. Usa Expo Go en tu móvil.'
            : 'Activa las notificaciones en los ajustes del sistema para recibir avisos por fase.'
        );
        return;
      }
    }
    await setNotificationsEnabled(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.title}>Notificaciones por fase</Text>
            <Text style={styles.subtitle}>
              Avisos al entrar en cada fase del ayuno de 72 horas y al completar la meta.
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {is72hActive && settings.notificationsEnabled && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Próximas notificaciones</Text>
          {upcoming.length === 0 ? (
            <Text style={styles.empty}>No quedan fases pendientes.</Text>
          ) : (
            upcoming.slice(0, 5).map((item) => (
              <View key={item.at.toISOString()} style={styles.upcomingRow}>
                <Text style={styles.upcomingTitle}>{item.phaseTitle}</Text>
                <Text style={styles.upcomingTime}>
                  {item.at.toLocaleString('es-ES', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))
          )}
          <Text style={styles.hint}>
            También recibirás un aviso al completar las 72 horas.
          </Text>
        </View>
      )}

      <Text style={styles.footer}>
        Las notificaciones requieren Expo Go o una build nativa. No funcionan en el navegador web.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  upcomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  upcomingTitle: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
  upcomingTime: {
    color: colors.primaryLight,
    fontSize: 13,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 14,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },
  footer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});
