import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { formatDuration } from '../utils/time';

interface TimerDisplayProps {
  elapsedSeconds: number;
  remainingSeconds: number;
  targetHours: number;
  label?: string;
}

export function TimerDisplay({
  elapsedSeconds,
  remainingSeconds,
  targetHours,
  label = 'Tiempo transcurrido',
}: TimerDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.elapsed}>{formatDuration(elapsedSeconds)}</Text>
      <Text style={styles.meta}>
        {formatDuration(remainingSeconds)} restantes · meta {targetHours}h
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  elapsed: {
    color: colors.text,
    fontSize: 52,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
});
