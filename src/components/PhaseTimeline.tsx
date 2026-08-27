import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FastingPhase } from '../types';
import { colors } from '../theme/colors';

interface PhaseTimelineProps {
  phases: FastingPhase[];
  elapsedHours: number;
  targetHours: number;
}

export function PhaseTimeline({ phases, elapsedHours, targetHours }: PhaseTimelineProps) {
  const progressPercent = Math.min(100, (elapsedHours / targetHours) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.trackRow}>
        {phases.map((phase, index) => {
          const isActive = elapsedHours >= phase.startHour && elapsedHours < phase.endHour;
          const isPast = elapsedHours >= phase.endHour;
          const flex = phase.endHour - phase.startHour;

          return (
            <View
              key={phase.id}
              style={[
                styles.segment,
                { flex, backgroundColor: phase.color + (isPast || isActive ? 'FF' : '44') },
                index === 0 && styles.segmentFirst,
                index === phases.length - 1 && styles.segmentLast,
              ]}
            />
          );
        })}
        <View style={[styles.marker, { left: `${progressPercent}%` }]} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.labelText}>0h</Text>
        <Text style={styles.labelText}>24h</Text>
        <Text style={styles.labelText}>48h</Text>
        <Text style={styles.labelText}>72h</Text>
      </View>
      <View style={styles.phaseDots}>
        {phases.map((phase) => {
          const isActive = elapsedHours >= phase.startHour && elapsedHours < phase.endHour;
          const isPast = elapsedHours >= phase.endHour;
          return (
            <View key={phase.id} style={styles.dotRow}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: phase.color },
                  (isActive || isPast) && styles.dotFilled,
                  isActive && styles.dotActive,
                ]}
              />
              <Text style={[styles.dotLabel, isActive && styles.dotLabelActive]} numberOfLines={1}>
                {phase.icon} {isActive ? phase.title : `${phase.startHour}h`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  trackRow: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceLight,
  },
  segment: {
    height: '100%',
  },
  segmentFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  marker: {
    position: 'absolute',
    top: -4,
    width: 4,
    height: 20,
    backgroundColor: colors.text,
    borderRadius: 2,
    marginLeft: -2,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  labelText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  phaseDots: {
    marginTop: 16,
    gap: 8,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.4,
  },
  dotFilled: {
    opacity: 1,
  },
  dotActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.text,
  },
  dotLabel: {
    color: colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  dotLabelActive: {
    color: colors.text,
    fontWeight: '600',
  },
});
