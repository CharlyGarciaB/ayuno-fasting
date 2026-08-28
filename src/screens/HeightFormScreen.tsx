import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useProfile } from '../context/ProfileContext';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { parseDecimalInput } from '../utils/body';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HeightForm'>;

export function HeightFormScreen({ navigation }: Props) {
  const { profile, setHeight } = useProfile();
  const [height, setHeightValue] = useState(
    profile.heightCm ? String(profile.heightCm) : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    const parsed = parseDecimalInput(height);
    if (!parsed || parsed < 100 || parsed > 250) {
      Alert.alert('Altura inválida', 'Ingresa una altura entre 100 y 250 cm.');
      return;
    }

    setSubmitting(true);
    try {
      await setHeight(Math.round(parsed));
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tu altura</Text>
      <Text style={styles.subtitle}>
        La altura se usa para calcular tu IMC junto con el peso.
      </Text>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Altura (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeightValue}
          keyboardType="decimal-pad"
          placeholder="Ej: 175"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={styles.hint}>Ejemplo: 1.75 m → escribe 175</Text>
      </View>

      <Button title="Guardar altura" onPress={handleSave} loading={submitting} />
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
    marginBottom: 24,
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
  hint: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
});
