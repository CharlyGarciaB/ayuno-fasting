import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

export function CellDiagram() {
  return (
    <View style={styles.wrapper}>
      <Svg width={280} height={200} viewBox="0 0 280 200">
        <Defs>
          <RadialGradient id="cellGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#EAB308" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Membrana celular */}
        <Circle cx={140} cy={100} r={78} fill="url(#cellGlow)" />
        <Circle
          cx={140}
          cy={100}
          r={72}
          fill="#1E293B"
          stroke="#6366F1"
          strokeWidth={3}
        />

        {/* Núcleo */}
        <Circle cx={140} cy={100} r={28} fill="#312E81" stroke="#818CF8" strokeWidth={2} />

        {/* Organelas sanas */}
        <Circle cx={90} cy={80} r={10} fill="#22C55E" opacity={0.8} />
        <Circle cx={185} cy={75} r={8} fill="#22C55E" opacity={0.8} />
        <Circle cx={170} cy={130} r={9} fill="#22C55E" opacity={0.8} />

        {/* Organelas dañadas (autofagia) */}
        <Circle cx={105} cy={130} r={11} fill="#EF4444" opacity={0.7} />
        <Circle cx={175} cy={105} r={7} fill="#EF4444" opacity={0.6} />

        {/* Autófago — vesícula que envuelve lo dañado */}
        <Path
          d="M 95 125 Q 85 115 95 105 Q 105 100 115 108 Q 120 118 110 128 Q 100 132 95 125 Z"
          fill="#EAB308"
          opacity={0.55}
          stroke="#FDE047"
          strokeWidth={1.5}
        />

        {/* Flecha reciclaje */}
        <Path
          d="M 130 55 Q 155 40 175 55"
          fill="none"
          stroke="#22C55E"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <Path d="M 172 50 L 178 56 L 170 58 Z" fill="#22C55E" />
      </Svg>

      <View style={styles.legend}>
        <LegendItem color="#22C55E" label="Componentes sanos" />
        <LegendItem color="#EF4444" label="Dañados / viejos" />
        <LegendItem color="#EAB308" label="Autófago (reciclaje)" />
        <LegendItem color="#818CF8" label="Núcleo celular" />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legend: {
    marginTop: 8,
    gap: 6,
    width: '100%',
    paddingHorizontal: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
