import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Refeed'>;

const REFEED_STEPS = [
  {
    hours: '0–2 h',
    title: 'Primeros sorbos',
    content: 'Empieza con caldo vegetal, agua con electrolitos o té suave. Porciones muy pequeñas.',
  },
  {
    hours: '2–6 h',
    title: 'Alimentos blandos',
    content: 'Verduras cocidas, caldo con proteína ligera (huevo pochado), aguacate en poca cantidad.',
  },
  {
    hours: '6–24 h',
    title: 'Comidas normales, porciones moderadas',
    content: 'Evita azúcar refinada, frituras y comidas enormes. Mastica bien y come despacio.',
  },
];

export function RefeedScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>¡72 horas completadas!</Text>
      <Text style={styles.subtitle}>
        Rompe el ayuno de forma gradual. Tu sistema digestivo necesita tiempo para readaptarse.
      </Text>

      {REFEED_STEPS.map((step) => (
        <View key={step.hours} style={styles.step}>
          <Text style={styles.stepHours}>{step.hours}</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepContent}>{step.content}</Text>
        </View>
      ))}

      <View style={styles.avoidBox}>
        <Text style={styles.avoidTitle}>Evita en las primeras 24h:</Text>
        <Text style={styles.avoidItem}>• Comida ultraprocesada y azúcar en exceso</Text>
        <Text style={styles.avoidItem}>• Comidas muy grandes de golpe</Text>
        <Text style={styles.avoidItem}>• Alcohol</Text>
      </View>

      <Button
        title="Entendido"
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  step: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  stepHours: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  stepTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  stepContent: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  avoidBox: {
    backgroundColor: '#2D1B1B',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  avoidTitle: {
    color: colors.warning,
    fontWeight: '600',
    marginBottom: 8,
  },
  avoidItem: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
});
