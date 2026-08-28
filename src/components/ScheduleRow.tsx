import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface ScheduleRowProps {
  startLabel: string;
  endLabel: string;
  onEditStart: () => void;
  onEditProtocol: () => void;
}

export function ScheduleRow({ startLabel, endLabel, onEditStart, onEditProtocol }: ScheduleRowProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.column} onPress={onEditStart} activeOpacity={0.7}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Inicio</Text>
          <Text style={styles.editIcon}>✎</Text>
        </View>
        <Text style={styles.value}>{startLabel}</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity style={styles.column} onPress={onEditProtocol} activeOpacity={0.7}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Fin estimado</Text>
          <Text style={styles.editIcon}>✎</Text>
        </View>
        <Text style={styles.value}>{endLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  column: {
    flex: 1,
  },
  separator: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
  },
  editIcon: {
    color: colors.primaryLight,
    fontSize: 12,
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
