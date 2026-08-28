import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFasting } from '../context/FastingContext';
import { useFastingTimer } from '../hooks/useFastingTimer';
import { getProtocol } from '../data/protocols';
import { getCurrentPhase, getNextPhase, PHASES_72H } from '../data/phases72h';
import { TimerDisplay } from '../components/TimerDisplay';
import { ProgressBar } from '../components/ProgressBar';
import { PhaseTimeline } from '../components/PhaseTimeline';
import { PhaseCard } from '../components/PhaseCard';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { formatHoursMinutes, formatRelativeStart } from '../utils/time';
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

  const handleEnd = (status: 'completed' | 'broken') => {
    const title = status === 'completed' ? '¿Completar ayuno?' : '¿Interrumpir ayuno?';
    const message =
      status === 'completed'
        ? 'Has alcanzado tu meta. ¡Felicidades!'
        : '¿Seguro que quieres interrumpir el ayuno?';

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
        <LinearGradient colors={['#6366F1', '#EC4899']} style={styles.heroIcon}>
          <Text style={styles.heroEmoji}>⏳</Text>
        </LinearGradient>
        <Text style={styles.emptyTitle}>Sin ayuno activo</Text>
        <Text style={styles.emptySubtitle}>
          Elige un protocolo para comenzar tu ayuno intermitente o el ayuno profundo de 72 horas.
        </Text>
        <Button
          title="Elegir protocolo"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Protocols' } as never)}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {protocol?.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{protocol.badge}</Text>
          </View>
        )}
        <Text style={styles.protocolName}>{protocol?.name ?? 'Ayuno'}</Text>
        {activeSession && (
          <Text style={styles.startedAt}>
            Inicio: {formatRelativeStart(activeSession.startedAt)}
          </Text>
        )}
      </View>

      <ProgressBar
        progress={timer.progress}
        color={is72h && currentPhase ? currentPhase.color : colors.primary}
        height={10}
      />
      <Text style={styles.progressLabel}>
        {Math.round(timer.progress * 100)}% · {Math.floor(timer.elapsedHours)}h / {targetHours}h
      </Text>

      <TimerDisplay
        elapsedSeconds={timer.elapsedSeconds}
        remainingSeconds={timer.remainingSeconds}
        targetHours={targetHours}
      />

      {is72h && currentPhase && (
        <>
          <PhaseTimeline
            phases={PHASES_72H}
            elapsedHours={timer.elapsedHours}
            targetHours={targetHours}
          />

          <PhaseCard phase={currentPhase} expanded={expanded} />

          {nextPhase && (
            <Text style={styles.nextMilestone}>
              Próximo hito: {nextPhase.title} en{' '}
              {formatHoursMinutes((nextPhase.startHour - timer.elapsedHours) * 3600)}
            </Text>
          )}

          <Button
            title={expanded ? 'Ver menos' : 'Saber más sobre esta fase'}
            onPress={() => setExpanded(!expanded)}
            variant="ghost"
          />
        </>
      )}

      <View style={styles.actions}>
        <Button
          title="Corregir fecha de inicio"
          onPress={() => {
            if (!activeSession) return;
            navigateToStartFast(navigation, {
              protocolId: activeSession.protocolId,
              editMode: true,
            });
          }}
          variant="secondary"
        />
        {timer.isComplete ? (
          <Button title="Completar ayuno" onPress={() => handleEnd('completed')} />
        ) : (
          <>
            <Button title="Terminar ayuno" onPress={() => handleEnd('broken')} variant="danger" />
          </>
        )}
      </View>

      {is72h && (
        <Text style={styles.disclaimer}>
          El ayuno prolongado no sustituye consejo médico. Consulta a un profesional si tienes condiciones de salud.
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  protocolName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  startedAt: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 6,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  nextMilestone: {
    color: colors.primaryLight,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  actions: {
    marginTop: 24,
    gap: 12,
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
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
});
