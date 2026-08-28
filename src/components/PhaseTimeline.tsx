import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FastingPhase, ProtocolId } from '../types';
import { getTimelineLabels } from '../data/phases';
import { colors } from '../theme/colors';

interface PhaseTimelineProps {
  phases: FastingPhase[];
  elapsedHours: number;
  targetHours: number;
  protocolId?: ProtocolId;
  onPhasePress?: (phase: FastingPhase) => void;
}

export function PhaseTimeline({
  phases,
  elapsedHours,
  targetHours,
  onPhasePress,
}: PhaseTimelineProps) {
  const progressPercent = Math.min(100, (elapsedHours / targetHours) * 100);
  const labels = getTimelineLabels(targetHours);

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
        {labels.map((label) => (
          <Text key={label} style={styles.labelText}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.phaseDots}>
        {phases.map((phase) => {
          const isActive = elapsedHours >= phase.startHour && elapsedHours < phase.endHour;
          const isPast = elapsedHours >= phase.endHour;
          const content = (
            <>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: phase.color },
                  (isActive || isPast) && styles.dotFilled,
                  isActive && styles.dotActive,
                ]}
              />
              <View style={styles.dotTextCol}>
                <Text style={[styles.dotLabel, isActive && styles.dotLabelActive]} numberOfLines={1}>
                  {phase.icon} {phase.title}
                </Text>
                <Text style={styles.dotHours}>
                  {phase.startHour}–{phase.endHour}h
                  {isActive ? ' · Ahora' : ''}
                </Text>
              </View>
              {onPhasePress && <Text style={styles.chevron}>›</Text>}
            </>
          );

          if (onPhasePress) {
            return (
              <TouchableOpacity
                key={phase.id}
                style={styles.dotRow}
                onPress={() => onPhasePress(phase)}
                activeOpacity={0.7}
              >
                {content}
              </TouchableOpacity>
            );
          }

          return (
            <View key={phase.id} style={styles.dotRow}>
              {content}
            </View>
          );
        })}
      </View>
      {onPhasePress && (
        <Text style={styles.hint}>Toca cualquier fase para ver su información completa</Text>
      )}
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
    gap: 4,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
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
  dotTextCol: {
    flex: 1,
  },
  dotLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  dotLabelActive: {
    color: colors.text,
    fontWeight: '700',
  },
  dotHours: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  chevron: {
    color: colors.primaryLight,
    fontSize: 22,
    fontWeight: '300',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
