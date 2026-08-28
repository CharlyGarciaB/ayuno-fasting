import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EDUCATION_PHASES, EDUCATION_SECTIONS } from '../data/education';
import { CellDiagram } from '../components/CellDiagram';
import { MetabolismDiagram } from '../components/MetabolismDiagram';
import { colors } from '../theme/colors';

export function LearnScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient colors={['#2563EB', '#6366F1']} style={styles.hero}>
        <Text style={styles.heroEmoji}>📚</Text>
        <Text style={styles.heroTitle}>Aprende sobre el ayuno</Text>
        <Text style={styles.heroSubtitle}>
          Guía visual de fases metabólicas, autofagia y protocolos
        </Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Línea de tiempo metabólica</Text>
      <Text style={styles.sectionDesc}>
        Cada color representa lo que ocurre en tu cuerpo según las horas de ayuno.
      </Text>

      <View style={styles.timeline}>
        {EDUCATION_PHASES.map((phase, index) => (
          <View key={phase.hour} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: phase.color }]}>
                <Text style={styles.timelineDotIcon}>{phase.icon}</Text>
              </View>
              {index < EDUCATION_PHASES.length - 1 && (
                <View style={[styles.timelineLine, { backgroundColor: phase.color + '55' }]} />
              )}
            </View>
            <View style={[styles.timelineCard, { borderLeftColor: phase.color }]}>
              <Text style={[styles.timelineHour, { color: phase.color }]}>{phase.hour}</Text>
              <Text style={styles.timelineTitle}>{phase.title}</Text>
              <Text style={styles.timelineDesc}>{phase.description}</Text>
              <View style={[styles.processPill, { backgroundColor: phase.color + '22' }]}>
                <Text style={[styles.processText, { color: phase.color }]}>{phase.bodyProcess}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {EDUCATION_SECTIONS.map((section) => (
        <View key={section.id} style={styles.section}>
          <LinearGradient colors={section.gradient} style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderIcon}>{section.icon}</Text>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
              <Text style={styles.sectionHeaderSub}>{section.subtitle}</Text>
            </View>
          </LinearGradient>

          <View style={styles.sectionBody}>
            {section.visualType === 'metabolism' && <MetabolismDiagram />}
            {section.visualType === 'cell' && <CellDiagram />}
            {section.visualType === 'protocols' && <ProtocolGrid />}
            {section.visualType === 'timeline' && null}

            <Text style={styles.bodyText}>{section.body}</Text>

            {section.bullets?.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: section.color }]} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        Contenido educativo basado en literatura general sobre ayuno. No es consejo médico.
        Consulta a un profesional antes de cambiar tu alimentación o practicar ayunos prolongados.
      </Text>
    </ScrollView>
  );
}

function ProtocolGrid() {
  const items = [
    { name: '16:8', hours: '16h', color: '#6366F1', desc: 'Más popular' },
    { name: '18:6', hours: '18h', color: '#8B5CF6', desc: 'Intermedio' },
    { name: 'OMAD', hours: '23h', color: '#EC4899', desc: 'Una comida' },
    { name: '48h', hours: '48h', color: '#F97316', desc: 'Extendido' },
    { name: '72h', hours: '72h', color: '#EAB308', desc: 'Profundo' },
  ];

  return (
    <View style={styles.protocolGrid}>
      {items.map((item) => (
        <View key={item.name} style={[styles.protocolChip, { borderColor: item.color }]}>
          <Text style={[styles.protocolName, { color: item.color }]}>{item.name}</Text>
          <Text style={styles.protocolHours}>{item.hours}</Text>
          <Text style={styles.protocolDesc}>{item.desc}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  sectionDesc: {
    color: colors.textMuted,
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    lineHeight: 20,
  },
  timeline: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineLeft: {
    width: 44,
    alignItems: 'center',
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotIcon: {
    fontSize: 16,
  },
  timelineLine: {
    width: 3,
    flex: 1,
    minHeight: 24,
    marginVertical: 4,
    borderRadius: 2,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginLeft: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  timelineHour: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  timelineTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  timelineDesc: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  processPill: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  processText: {
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  sectionHeaderIcon: {
    fontSize: 28,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionHeaderTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  sectionHeaderSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  sectionBody: {
    backgroundColor: colors.surface,
    padding: 16,
  },
  bodyText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  bulletText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  protocolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  protocolChip: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  protocolName: {
    fontSize: 16,
    fontWeight: '800',
  },
  protocolHours: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  protocolDesc: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 28,
    marginTop: 8,
  },
});
