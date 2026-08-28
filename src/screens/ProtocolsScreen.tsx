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
import { PROTOCOLS } from '../data/protocols';
import { useFasting } from '../context/FastingContext';
import { colors } from '../theme/colors';
import { Protocol } from '../types';
import { ExtendedProtocolId, RootStackParamList } from '../navigation/types';
import { navigateToStartFast } from '../navigation/navigate';

export function ProtocolsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeSession } = useFasting();

  const handleSelect = (protocol: Protocol) => {
    if (activeSession) {
      Alert.alert('Ayuno activo', 'Termina el ayuno actual antes de iniciar uno nuevo.');
      return;
    }

    if (protocol.isExtended) {
      navigation.navigate('PreparationExtended', {
        protocolId: protocol.id as ExtendedProtocolId,
      });
      return;
    }

    navigateToStartFast(navigation, { protocolId: protocol.id });
  };

  const intermittent = PROTOCOLS.filter((p) => !p.isExtended);
  const extended = PROTOCOLS.filter((p) => p.isExtended);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Ayuno intermitente</Text>
      {intermittent.map((protocol) => (
        <ProtocolCard key={protocol.id} protocol={protocol} onPress={() => handleSelect(protocol)} />
      ))}

      <Text style={[styles.sectionTitle, styles.sectionGap]}>Ayuno extendido</Text>
      {extended.map((protocol) => (
        <ProtocolCard key={protocol.id} protocol={protocol} onPress={() => handleSelect(protocol)} featured />
      ))}
    </ScrollView>
  );
}

function ProtocolCard({
  protocol,
  onPress,
  featured = false,
}: {
  protocol: Protocol;
  onPress: () => void;
  featured?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, featured && styles.cardFeatured]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{protocol.name}</Text>
        {protocol.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{protocol.badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardHours}>{protocol.targetHours} horas</Text>
      <Text style={styles.cardDesc}>{protocol.description}</Text>
      {featured && (
        <Text style={styles.featuredHint}>
          Incluye guía didáctica por fases metabólicas y advertencias de seguridad →
        </Text>
      )}
    </TouchableOpacity>
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
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionGap: {
    marginTop: 28,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardFeatured: {
    borderColor: colors.accent,
    backgroundColor: '#1A1525',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardHours: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDesc: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  featuredHint: {
    color: colors.accent,
    fontSize: 13,
    marginTop: 12,
    fontWeight: '500',
  },
});
