import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFasting } from '../context/FastingContext';
import { useFastingTimer } from '../hooks/useFastingTimer';
import { getProtocol } from '../data/protocols';
import { getCurrentPhase, getNextPhase, PHASES_72H } from '../data/phases72h';
import { getTipForPhase } from '../data/tips';
import { CircularFastingRing, buildPhaseMarkers } from '../components/CircularFastingRing';
import { ScheduleRow } from '../components/ScheduleRow';
import { TipCard } from '../components/TipCard';
import { PhaseCard } from '../components/PhaseCard';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import {
  formatFastingElapsed,
  formatLongDuration,
  formatScheduleDate,
  getEndDateIso,
} from '../utils/time';
import { RootStackParamList } from '../navigation/types';
import { navigateToStartFast } from '../navigation/navigate';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeSession, endFast, loading } = useFasting();
  const [expanded, setExpanded] = useState(false);

  const protocol = activeSession ? getProtocol(activeSession.protocolId) : null;
  const targetHours = activeSession?.targetHours ?? 16;
  const timer = useFastingTimer(activeSession?.startedAt, targetHours);
  const is72h = activeSession?.protocolId === '72h';
  const currentPhase = is72h ? getCurrentPhase(timer.elapsedHours) : null;
  const nextPhase = currentPhase ? getNextPhase(currentPhase) : null;
  const tip = getTipForPhase(currentPhase?.icon);

  const handleEnd = (status: 'completed' | 'broken') => {
    const title = status === 'completed' ? '¿Completar ayuno?' : '¿Terminar ayuno?';
    const message =
      status === 'completed'
        ? 'Has alcanzado tu meta. ¡Felicidades!'
        : '¿Seguro que quieres terminar el ayuno?';

    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: status === 'broken' ? 'destructive' : 'default',
        onPress: async () => {
          await endFast(status);
          if (status === 'completed' && is72h) {
            navigation.navigate('Refeed');
          }
        },
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

  if (!activeSession) {
    return (
      <View style={styles.center}>
        <LinearGradient colors={['#2563EB', '#6366F1']} style={styles.heroRing}>
          <Text style={styles.heroEmoji}>⏳</Text>
        </LinearGradient>
        <Text style={styles.emptyTitle}>Sin ayuno activo</Text>
        <Text style={styles.emptySubtitle}>
          Elige un protocolo y registra cuándo empezaste, incluso si fue ayer.
        </Text>
        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Protocols' } as never)}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#2563EB', '#4F46E5']} style={styles.primaryCtaGradient}>
            <Text style={styles.primaryCtaText}>Comenzar ayuno</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const elapsed = formatFastingElapsed(timer.elapsedSeconds);
  const endIso = getEndDateIso(activeSession.startedAt, targetHours);
  const markers = is72h
    ? buildPhaseMarkers(PHASES_72H, timer.elapsedHours, targetHours)
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>AYUNO</Text>
          {protocol?.badge && <Text style={styles.brandSub}>{protocol.badge}</Text>}
        </View>
        <TouchableOpacity
          style={styles.protocolPill}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Protocols' } as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.protocolPillText}>{protocol?.name ?? 'Ayuno'}</Text>
          <Text style={styles.protocolPillEdit}>✎</Text>
        </TouchableOpacity>
      </View>

      <CircularFastingRing
        progress={timer.progress}
        elapsedMain={elapsed.main}
        elapsedSeconds={elapsed.seconds}
        remainingLabel={formatLongDuration(timer.remainingSeconds)}
        phaseIcon={currentPhase?.icon ?? '🔥'}
        markers={markers}
      />

      <TouchableOpacity
        style={styles.primaryCta}
        onPress={() => handleEnd(timer.isComplete ? 'completed' : 'broken')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={timer.isComplete ? ['#22C55E', '#16A34A'] : ['#2563EB', '#4F46E5']}
          style={styles.primaryCtaGradient}
        >
          <Text style={styles.primaryCtaText}>
            {timer.isComplete ? 'Completar ayuno' : 'Terminar ayuno'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <ScheduleRow
        startLabel={formatScheduleDate(activeSession.startedAt)}
        endLabel={formatScheduleDate(endIso)}
        onEditStart={() =>
          navigateToStartFast(navigation, {
            protocolId: activeSession.protocolId,
            editMode: true,
          })
        }
        onEditProtocol={() => navigation.navigate('MainTabs', { screen: 'Protocols' } as never)}
      />

      {is72h && currentPhase && (
        <View style={styles.phaseSection}>
          <Text style={styles.sectionTitle}>Fase actual · {currentPhase.title}</Text>
          <PhaseCard phase={currentPhase} expanded={expanded} />
          {nextPhase && (
            <Text style={styles.nextMilestone}>
              Próximo hito: {nextPhase.title}
            </Text>
          )}
          <Button
            title={expanded ? 'Ver menos' : 'Saber más sobre esta fase'}
            onPress={() => setExpanded(!expanded)}
            variant="ghost"
          />
        </View>
      )}

      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>💡 Consejo</Text>
        <TipCard icon={tip.icon} title={tip.title} text={tip.text} />
      </View>

      {is72h && (
        <Text style={styles.disclaimer}>
          El ayuno prolongado no sustituye consejo médico. Consulta a un profesional si tienes
          condiciones de salud.
        </Text>
      )}
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
    padding: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brand: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brandSub: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  protocolPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary + '66',
  },
  protocolPillText: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
  },
  protocolPillEdit: {
    color: colors.primaryLight,
    fontSize: 12,
  },
  primaryCta: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryCtaGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  primaryCtaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  phaseSection: {
    marginTop: 20,
  },
  tipsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  nextMilestone: {
    color: colors.primaryLight,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  muted: {
    color: colors.textMuted,
  },
  heroRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
});
