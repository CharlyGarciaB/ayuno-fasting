import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFasting } from '../context/FastingContext';
import { getProtocol } from '../data/protocols';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { requestNotificationPermissions } from '../services/notifications';
import { formatDateTimeSpanish, formatDuration, getElapsedSeconds } from '../utils/time';

type Props = NativeStackScreenProps<RootStackParamList, 'StartFast'>;

function subtractHours(date: Date, hours: number): Date {
  return new Date(date.getTime() - hours * 60 * 60 * 1000);
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function StartFastScreen({ navigation, route }: Props) {
  const { startFast, settings } = useFasting();
  const { protocolId, preparationAccepted } = route.params;
  const protocol = getProtocol(protocolId);
  const [startDate, setStartDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [submitting, setSubmitting] = useState(false);

  if (!protocol) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Protocolo no encontrado.</Text>
      </View>
    );
  }

  const elapsedSeconds = getElapsedSeconds(startDate.toISOString());
  const isFuture = startDate.getTime() > Date.now();

  const onPickerChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) setStartDate(selected);
  };

  const applyPreset = (date: Date) => {
    if (date.getTime() > Date.now()) {
      Alert.alert('Fecha inválida', 'La hora de inicio no puede ser en el futuro.');
      return;
    }
    setStartDate(date);
  };

  const handleConfirm = async () => {
    if (isFuture) {
      Alert.alert('Fecha inválida', 'La hora de inicio no puede ser en el futuro.');
      return;
    }

    setSubmitting(true);
    try {
      if (settings.notificationsEnabled) {
        await requestNotificationPermissions();
      }
      await startFast(protocol.id, protocol.targetHours, {
        preparationAccepted,
        startedAt: startDate,
      });
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo iniciar el ayuno.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¿Cuándo empezaste?</Text>
      <Text style={styles.subtitle}>
        Indica la fecha y hora en que comenzó tu ayuno {protocol.name}. Puedes registrar uno que
        empezó ayer u otro momento anterior.
      </Text>

      <View style={styles.card}>
        <Text style={styles.protocolName}>{protocol.name}</Text>
        <Text style={styles.protocolMeta}>Meta: {protocol.targetHours} horas</Text>
      </View>

      <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      <View style={styles.presets}>
        <TouchableOpacity style={styles.preset} onPress={() => applyPreset(new Date())}>
          <Text style={styles.presetLabel}>Ahora</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.preset} onPress={() => applyPreset(subtractDays(new Date(), 1))}>
          <Text style={styles.presetLabel}>Ayer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.preset} onPress={() => applyPreset(subtractHours(new Date(), 12))}>
          <Text style={styles.presetLabel}>Hace 12 h</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.preset} onPress={() => applyPreset(subtractHours(new Date(), 24))}>
          <Text style={styles.presetLabel}>Hace 24 h</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Fecha y hora de inicio</Text>
      {Platform.OS === 'android' && (
        <Button title="Elegir fecha y hora" onPress={() => setShowPicker(true)} variant="secondary" />
      )}
      {showPicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPickerChange}
          maximumDate={new Date()}
          locale="es-ES"
          themeVariant="dark"
        />
      )}

      <View style={[styles.summary, isFuture && styles.summaryError]}>
        <Text style={styles.summaryLabel}>Inicio seleccionado</Text>
        <Text style={styles.summaryValue}>{formatDateTimeSpanish(startDate.toISOString())}</Text>
        {!isFuture && (
          <Text style={styles.summaryElapsed}>
            Llevas ayunando: {formatDuration(elapsedSeconds)}
          </Text>
        )}
        {isFuture && (
          <Text style={styles.summaryErrorText}>La fecha no puede ser en el futuro.</Text>
        )}
      </View>

      <Button
        title="Registrar ayuno"
        onPress={handleConfirm}
        disabled={isFuture || submitting}
        loading={submitting}
        style={styles.confirmButton}
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
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.danger,
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  protocolName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  protocolMeta: {
    color: colors.primaryLight,
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  preset: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary + '55',
  },
  summaryError: {
    borderColor: colors.danger + '88',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  summaryElapsed: {
    color: colors.primaryLight,
    fontSize: 15,
    marginTop: 8,
  },
  summaryErrorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 8,
  },
  confirmButton: {
    marginBottom: 8,
  },
});
