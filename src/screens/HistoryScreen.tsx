import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFasting } from '../context/FastingContext';
import { getProtocol } from '../data/protocols';
import { colors } from '../theme/colors';
import { formatDuration } from '../utils/time';

export function HistoryScreen() {
  const { history } = useFasting();

  if (history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>Sin historial</Text>
        <Text style={styles.emptyText}>Tus ayunos completados aparecerán aquí.</Text>
      </View>
    );
  }

  const completed = history.filter((s) => s.status === 'completed').length;
  const totalHours = history.reduce((acc, s) => {
    if (!s.endedAt) return acc;
    const seconds =
      (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000;
    return acc + seconds / 3600;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{completed}</Text>
          <Text style={styles.statLabel}>Completados</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{Math.round(totalHours)}h</Text>
          <Text style={styles.statLabel}>Horas ayunadas</Text>
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const protocol = getProtocol(item.protocolId);
          const duration = item.endedAt
            ? Math.floor(
                (new Date(item.endedAt).getTime() - new Date(item.startedAt).getTime()) / 1000
              )
            : 0;
          const date = new Date(item.startedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{protocol?.name ?? item.protocolId}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'completed' ? styles.statusDone : styles.statusBroken,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.status === 'completed' ? 'Completado' : 'Interrumpido'}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>{date} · {formatDuration(duration)}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stats: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDone: {
    backgroundColor: colors.success + '33',
  },
  statusBroken: {
    backgroundColor: colors.danger + '33',
  },
  statusText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  empty: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
