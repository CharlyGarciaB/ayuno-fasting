import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../context/ProfileContext';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import {
  calculateBmi,
  formatBmi,
  formatHeight,
  formatWeight,
  getBmiCategory,
} from '../utils/body';
import { RootStackParamList } from '../navigation/types';

export function BodyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, weights, latestWeight, loading, deleteWeight } = useProfile();

  const bmi =
    latestWeight && profile.heightCm
      ? calculateBmi(latestWeight.weightKg, profile.heightCm)
      : null;

  const previousWeight = weights[1] ?? null;
  const weightDelta =
    latestWeight && previousWeight
      ? latestWeight.weightKg - previousWeight.weightKg
      : null;

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar registro', '¿Quieres eliminar este peso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteWeight(id),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mi cuerpo</Text>
      <Text style={styles.subtitle}>Registra tu altura y peso para ver tu progreso.</Text>

      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('HeightForm')}
          activeOpacity={0.8}
        >
          <Text style={styles.statLabel}>Altura ✎</Text>
          <Text style={styles.statValue}>
            {profile.heightCm ? formatHeight(profile.heightCm) : 'Agregar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Peso actual</Text>
          <Text style={styles.statValue}>
            {latestWeight ? formatWeight(latestWeight.weightKg) : '—'}
          </Text>
          {weightDelta !== null && (
            <Text style={[styles.delta, weightDelta <= 0 ? styles.deltaDown : styles.deltaUp]}>
              {weightDelta > 0 ? '+' : ''}
              {weightDelta.toFixed(1)} kg
            </Text>
          )}
        </View>
      </View>

      {bmi !== null && (
        <View style={styles.bmiCard}>
          <Text style={styles.bmiLabel}>Índice de masa corporal (IMC)</Text>
          <Text style={styles.bmiValue}>{formatBmi(bmi)}</Text>
          <Text style={styles.bmiCategory}>{getBmiCategory(bmi)}</Text>
        </View>
      )}

      <Button
        title="Agregar peso"
        onPress={() => navigation.navigate('WeightForm', {})}
        style={styles.addButton}
      />

      <Text style={styles.sectionTitle}>Historial de peso</Text>
      {weights.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aún no hay registros de peso.</Text>
        </View>
      ) : (
        weights.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.weightRow}
            onPress={() => navigation.navigate('WeightForm', { entryId: entry.id })}
            onLongPress={() => handleDelete(entry.id)}
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.weightValue}>{formatWeight(entry.weightKg)}</Text>
              <Text style={styles.weightDate}>
                {new Date(entry.recordedAt).toLocaleString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              {entry.note ? <Text style={styles.weightNote}>{entry.note}</Text> : null}
            </View>
            <Text style={styles.editHint}>Editar ✎</Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.hint}>Mantén presionado un registro para eliminarlo.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  delta: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
  deltaDown: {
    color: colors.success,
  },
  deltaUp: {
    color: colors.warning,
  },
  bmiCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '55',
  },
  bmiLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  bmiValue: {
    color: colors.primaryLight,
    fontSize: 40,
    fontWeight: '700',
    marginVertical: 4,
  },
  bmiCategory: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  addButton: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weightValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  weightDate: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  weightNote: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  editHint: {
    color: colors.primaryLight,
    fontSize: 13,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  muted: {
    color: colors.textMuted,
  },
});
