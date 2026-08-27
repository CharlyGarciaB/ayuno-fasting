import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FastingPhase } from '../types';
import { colors } from '../theme/colors';

interface PhaseCardProps {
  phase: FastingPhase;
  expanded?: boolean;
}

export function PhaseCard({ phase, expanded = false }: PhaseCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: phase.color }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{phase.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.phaseLabel}>Fase {phase.order}</Text>
          <Text style={styles.title}>{phase.title}</Text>
        </View>
      </View>
      <Text style={styles.short}>{phase.shortDescription}</Text>
      {expanded && (
        <>
          <Text style={styles.full}>{phase.fullContent}</Text>
          <Text style={styles.sectionTitle}>Es normal sentir:</Text>
          {phase.commonFeelings.map((f) => (
            <Text key={f} style={styles.bullet}>• {f}</Text>
          ))}
          <Text style={styles.sectionTitle}>Consejos:</Text>
          {phase.tips.map((t) => (
            <Text key={t} style={styles.bullet}>• {t}</Text>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  phaseLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  short: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  full: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 16,
  },
  sectionTitle: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  bullet: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 4,
  },
});
