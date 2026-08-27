import React from 'react';
import { View, Text, StyleSheet, Switch, Alert, Platform } from 'react-native';
import { useFasting } from '../context/FastingContext';
import { getProtocol } from '../data/protocols';
import { colors } from '../theme/colors';
import {
  requestNotificationPermissions,
  getUpcomingNotifications,
} from '../services/notifications';

export function SettingsScreen() {
  const { settings, setNotificationsEnabled, activeSession } = useFasting();
  const upcoming =
    activeSession && settings.notificationsEnabled
      ? getUpcomingNotifications(activeSession)
      : [];
  const activeProtocol = activeSession ? getProtocol(activeSession.protocolId) : null;

  const handleToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permisos necesarios',
          Platform.OS === 'web'
            ? 'Las notificaciones no están disponibles en web. Usa Expo Go en tu móvil.'
            : 'Activa las notificaciones en los ajustes del sistema para recibir avisos de ayuno.'
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
            <Text style={styles.title}>Notificaciones</Text>
            <Text style={styles.subtitle}>
              Aviso al completar tu meta en protocolos cortos (16:8, 18:6, OMAD…). En el ayuno
              de 72h, también al entrar en cada fase metabólica.
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

      {activeSession && settings.notificationsEnabled && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Próximas notificaciones · {activeProtocol?.name ?? 'Ayuno activo'}
          </Text>
          {upcoming.length === 0 ? (
            <Text style={styles.empty}>No quedan avisos pendientes.</Text>
          ) : (
            upcoming.slice(0, 6).map((item) => (
              <View key={`${item.title}-${item.at.toISOString()}`} style={styles.upcomingRow}>
                <Text style={styles.upcomingTitle}>{item.title}</Text>
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
    paddingRight: 8,
  },
  upcomingTime: {
    color: colors.primaryLight,
    fontSize: 13,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 14,
  },
  footer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});
