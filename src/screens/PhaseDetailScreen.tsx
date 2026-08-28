import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { getPhasesForProtocol, getPhaseById } from '../data/phases';
import { getProtocol } from '../data/protocols';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhaseDetail'>;

export function PhaseDetailScreen({ route }: Props) {
  const { protocolId, phaseId } = route.params;
  const protocol = getProtocol(protocolId);
  const phases = getPhasesForProtocol(protocolId);
  const phase = phases ? getPhaseById(phases, phaseId) : undefined;

  if (!phase || !phases) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Fase no encontrada</Text>
      </View>
    );
  }

  const isCurrent = route.params.isCurrent ?? false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[phase.color + '33', phase.color + '11']}
        style={styles.hero}
      >
        <Text style={styles.heroIcon}>{phase.icon}</Text>
        <Text style={styles.heroLabel}>
          {protocol?.name} · Fase {phase.order} de {phases.length}
        </Text>
        <Text style={styles.heroTitle}>{phase.title}</Text>
        <Text style={styles.heroHours}>
          Horas {phase.startHour}–{phase.endHour}
        </Text>
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Fase actual</Text>
          </View>
        )}
      </LinearGradient>

      <View style={[styles.card, { borderLeftColor: phase.color }]}>
        <Text style={styles.cardTitle}>¿Qué ocurre en tu cuerpo?</Text>
        <Text style={styles.cardBody}>{phase.fullContent}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen</Text>
        <Text style={styles.summary}>{phase.shortDescription}</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: phase.color }]}>Es normal sentir</Text>
        {phase.commonFeelings.map((feeling) => (
          <View key={feeling} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: phase.color }]} />
            <Text style={styles.bulletText}>{feeling}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { color: colors.primaryLight }]}>Consejos</Text>
        {phase.tips.map((tip) => (
          <View key={tip} style={styles.bulletRow}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.bulletText}>{tip}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.disclaimer}>
        Contenido educativo. No sustituye consejo médico. Consulta a un profesional antes de
        ayunos prolongados.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  muted: {
    color: colors.textMuted,
  },
  hero: {
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  heroLabel: {
    color: colors.textMuted,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroHours: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 8,
  },
  currentBadge: {
    marginTop: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardBody: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  summary: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  bulletText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  tipIcon: {
    fontSize: 14,
    marginTop: 2,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 28,
    lineHeight: 18,
  },
});
