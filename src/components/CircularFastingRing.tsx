import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FastingPhase } from '../types';
import { colors } from '../theme/colors';

const SIZE = 280;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RingMarker {
  position: number;
  icon: string;
  color: string;
  active: boolean;
}

interface CircularFastingRingProps {
  progress: number;
  elapsedMain: string;
  elapsedSeconds: string;
  remainingLabel: string;
  phaseIcon?: string;
  markers?: RingMarker[];
}

export function CircularFastingRing({
  progress,
  elapsedMain,
  elapsedSeconds,
  remainingLabel,
  phaseIcon = '🔥',
  markers = [],
}: CircularFastingRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = CIRCUMFERENCE * (1 - clamped);

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" />
            <Stop offset="50%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#EC4899" />
          </LinearGradient>
        </Defs>

        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
          fill="none"
        />

        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="url(#ringGradient)"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${CENTER}, ${CENTER}`}
        />
      </Svg>

      {markers.map((marker) => {
        const angle = marker.position * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = CENTER + (RADIUS + 4) * Math.cos(rad) - 14;
        const y = CENTER + (RADIUS + 4) * Math.sin(rad) - 14;
        return (
          <View
            key={`${marker.icon}-${marker.position}`}
            style={[
              styles.marker,
              { left: x, top: y },
              marker.active && styles.markerActive,
            ]}
          >
            <Text style={styles.markerIcon}>{marker.icon}</Text>
          </View>
        );
      })}

      <View style={styles.centerContent}>
        <Text style={styles.phaseEmoji}>{phaseIcon}</Text>
        <Text style={styles.elapsedLabel}>Ayunando</Text>
        <Text style={styles.elapsedMain}>{elapsedMain}</Text>
        <Text style={styles.elapsedSeconds}>{elapsedSeconds}</Text>
        <View style={styles.divider} />
        <Text style={styles.remainingLabel}>Restante</Text>
        <Text style={styles.remainingValue}>{remainingLabel}</Text>
      </View>
    </View>
  );
}

export function buildPhaseMarkers(
  phases: FastingPhase[],
  elapsedHours: number,
  targetHours: number
): RingMarker[] {
  return phases.map((phase) => {
    const midpoint = (phase.startHour + phase.endHour) / 2;
    const position = midpoint / targetHours;
    const isActive = elapsedHours >= phase.startHour && elapsedHours < phase.endHour;
    const isPast = elapsedHours >= phase.endHour;
    return {
      position,
      icon: phase.icon,
      color: phase.color,
      active: isActive || isPast,
    };
  });
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    marginVertical: 8,
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  phaseEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  elapsedLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 2,
  },
  elapsedMain: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  elapsedSeconds: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: -2,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  remainingLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  remainingValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  marker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.45,
  },
  markerActive: {
    opacity: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.surfaceLight,
  },
  markerIcon: {
    fontSize: 13,
  },
});
