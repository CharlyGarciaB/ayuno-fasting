import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

export function MetabolismDiagram() {
  return (
    <View style={styles.wrapper}>
      <Svg width={280} height={160} viewBox="0 0 280 160">
        <Defs>
          <LinearGradient id="glucoseGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#818CF8" />
          </LinearGradient>
          <LinearGradient id="fatGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#EC4899" />
            <Stop offset="100%" stopColor="#F97316" />
          </LinearGradient>
        </Defs>

        {/* Comiendo — glucosa */}
        <Rect x={10} y={20} width={120} height={50} rx={10} fill="url(#glucoseGrad)" opacity={0.9} />
        <Circle cx={40} cy={45} r={8} fill="#fff" opacity={0.3} />
        <Circle cx={70} cy={45} r={6} fill="#fff" opacity={0.25} />
        <Circle cx={100} cy={45} r={7} fill="#fff" opacity={0.3} />

        {/* Ayunando — grasa/cetonas */}
        <Rect x={150} y={20} width={120} height={50} rx={10} fill="url(#fatGrad)" opacity={0.9} />
        <Path
          d="M 175 45 Q 195 30 215 45 Q 235 60 255 45"
          fill="none"
          stroke="#fff"
          strokeWidth={2}
          opacity={0.4}
        />

        {/* Flecha transición */}
        <Path
          d="M 135 45 L 145 45 M 140 40 L 145 45 L 140 50"
          stroke={colors.textMuted}
          strokeWidth={2}
          fill="none"
        />

        {/* Insulina baja */}
        <Rect x={10} y={95} width={260} height={50} rx={10} fill="#1E293B" stroke="#334155" strokeWidth={1} />
        <Path d="M 30 120 L 80 120" stroke="#EF4444" strokeWidth={3} />
        <Path d="M 30 120 L 80 105" stroke="#EF4444" strokeWidth={2} />
        <Path d="M 30 120 L 80 135" stroke="#EF4444" strokeWidth={2} />
        <Path d="M 100 120 L 250 120" stroke="#22C55E" strokeWidth={3} />
        <Path d="M 240 120 L 250 115" stroke="#22C55E" strokeWidth={2} />
        <Path d="M 240 120 L 250 125" stroke="#22C55E" strokeWidth={2} />
      </Svg>

      <View style={styles.labels}>
        <View style={styles.labelCol}>
          <Text style={styles.labelTitle}>🍽️ Al comer</Text>
          <Text style={styles.labelDesc}>Glucosa ↑ · Insulina ↑</Text>
        </View>
        <View style={styles.labelCol}>
          <Text style={styles.labelTitle}>⏳ En ayuno</Text>
          <Text style={styles.labelDesc}>Grasa & cetonas ↑</Text>
        </View>
      </View>
      <Text style={styles.insulinNote}>Insulina baja → el cuerpo accede a reservas de grasa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  labelCol: {
    flex: 1,
  },
  labelTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  labelDesc: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  insulinNote: {
    color: colors.primaryLight,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
