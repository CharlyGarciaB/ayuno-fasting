import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFasting } from '../context/FastingContext';
import { getProtocol } from '../data/protocols';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { requestNotificationPermissions } from '../services/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'Preparation72h'>;

const CHECKLIST = [
  'He leído los riesgos y contraindicaciones del ayuno prolongado',
  'No tengo diabetes, embarazo, trastornos alimentarios ni tomo medicación que lo desaconseje',
  'Tengo agua y electrolitos disponibles',
  'Sé cómo romper el ayuno de forma gradual y segura',
  'Confirmo que es mi decisión informada',
];

const CONTRAINDICATIONS = [
  'Diabetes o hipoglucemia',
  'Embarazo o lactancia',
  'Trastornos alimentarios',
  'Medicación que requiere comida',
  'Enfermedad cardiovascular grave',
  'Menores de 18 años',
];

export function Preparation72hScreen({ navigation, route }: Props) {
  const { setNotificationsEnabled } = useFasting();
  const protocol = getProtocol(route.params.protocolId);
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.map(() => false));

  const allChecked = checked.every(Boolean);

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const handleStart = async () => {
    if (!protocol) return;

    const granted = await requestNotificationPermissions();
    if (granted) {
      await setNotificationsEnabled(true);
    } else if (Platform.OS !== 'web') {
      Alert.alert(
        'Notificaciones desactivadas',
        'Puedes activarlas después en Ajustes. Te avisaremos en cada fase del ayuno de 72h.',
        [{ text: 'Entendido' }]
      );
    }

    navigation.navigate('StartFast', { protocolId: '72h', preparationAccepted: true });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Preparación para ayuno 72h</Text>
      <Text style={styles.subtitle}>
        El ayuno más potente requiere preparación. Lee con atención antes de comenzar.
      </Text>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>⚠️ No apto si tienes:</Text>
        {CONTRAINDICATIONS.map((item) => (
          <Text key={item} style={styles.warningItem}>• {item}</Text>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🔔 Notificaciones por fase</Text>
        <Text style={styles.infoText}>
          Al iniciar, te pediremos permiso para avisarte al entrar en cada una de las 7 fases
          metabólicas y al completar las 72 horas.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Checklist de preparación</Text>
      {CHECKLIST.map((item, index) => (
        <Button
          key={item}
          title={`${checked[index] ? '✓ ' : '○ '}${item}`}
          onPress={() => toggle(index)}
          variant={checked[index] ? 'primary' : 'secondary'}
          style={styles.checkItem}
        />
      ))}

      <Button
        title="Iniciar ayuno de 72 horas"
        onPress={handleStart}
        disabled={!allChecked}
        style={styles.startButton}
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
  warningBox: {
    backgroundColor: '#2D1B1B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.danger + '44',
  },
  warningTitle: {
    color: colors.warning,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  warningItem: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#1A1F2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary + '44',
  },
  infoTitle: {
    color: colors.primaryLight,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  checkItem: {
    marginBottom: 8,
  },
  startButton: {
    marginTop: 16,
    marginBottom: 8,
  },
});
