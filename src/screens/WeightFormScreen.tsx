import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useProfile } from '../context/ProfileContext';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { parseDecimalInput } from '../utils/body';
import { formatDateTimeSpanish } from '../utils/time';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WeightForm'>;

export function WeightFormScreen({ navigation, route }: Props) {
  const { weights, addWeight, updateWeight } = useProfile();
  const entry = useMemo(
    () => weights.find((item) => item.id === route.params.entryId),
    [weights, route.params.entryId]
  );
  const isEdit = Boolean(entry);

  const [weight, setWeight] = useState(entry ? String(entry.weightKg) : '');
  const [note, setNote] = useState(entry?.note ?? '');
  const [recordedAt, setRecordedAt] = useState(
    entry ? new Date(entry.recordedAt) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) setRecordedAt(selected);
  };

  const handleSave = async () => {
    const parsed = parseDecimalInput(weight);
    if (!parsed || parsed < 30 || parsed > 300) {
      Alert.alert('Peso inválido', 'Ingresa un peso entre 30 y 300 kg.');
      return;
    }

    if (recordedAt.getTime() > Date.now()) {
      Alert.alert('Fecha inválida', 'La fecha no puede ser en el futuro.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && entry) {
        await updateWeight(entry.id, parsed, recordedAt, note.trim() || undefined);
      } else {
        await addWeight(parsed, recordedAt, note.trim() || undefined);
      }
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEdit ? 'Editar peso' : 'Agregar peso'}</Text>
      <Text style={styles.subtitle}>
        Registra tu peso actual para seguir tu progreso durante el ayuno.
      </Text>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="Ej: 78.5"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Fecha y hora</Text>
        <Text style={styles.dateValue}>{formatDateTimeSpanish(recordedAt.toISOString())}</Text>
        <Button
          title="Cambiar fecha"
          onPress={() => setShowPicker(true)}
          variant="secondary"
          style={styles.dateButton}
        />
        {showPicker && (
          <DateTimePicker
            value={recordedAt}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
            locale="es-ES"
            themeVariant="dark"
          />
        )}
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Nota (opcional)</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Ej: después del ayuno"
          placeholderTextColor={colors.textMuted}
          multiline
        />
      </View>

      <Button
        title={isEdit ? 'Guardar cambios' : 'Guardar peso'}
        onPress={handleSave}
        loading={submitting}
      />
      <Button title="Cancelar" onPress={() => navigation.goBack()} variant="ghost" />
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
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    paddingVertical: 8,
  },
  noteInput: {
    color: colors.text,
    fontSize: 16,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  dateValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateButton: {
    marginTop: 0,
  },
});
