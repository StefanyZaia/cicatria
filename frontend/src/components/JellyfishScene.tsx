import React from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/src/constants/theme';

type JellyfishSceneProps = {
  compact?: boolean;
};

type JellyfishProps = {
  scale?: number;
  x: number;
  y: number;
  opacity?: number;
  rotate?: string;
  accent?: string;
};

function Jellyfish({
  scale = 1,
  x,
  y,
  opacity = 1,
  rotate = '0deg',
  accent = theme.colors.coral,
}: JellyfishProps) {
  const size = 112 * scale;

  return (
    <View
      style={[
        styles.jellyfish,
        {
          height: 150 * scale,
          left: x,
          opacity,
          top: y,
          transform: [{ rotate }],
          width: size,
        },
      ]}>
      <View
        style={[
          styles.outerGlow,
          {
            height: 104 * scale,
            width: 104 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.bell,
          {
            borderBottomLeftRadius: 24 * scale,
            borderBottomRightRadius: 24 * scale,
            borderTopLeftRadius: 54 * scale,
            borderTopRightRadius: 54 * scale,
            height: 72 * scale,
            width: 96 * scale,
          },
        ]}>
        <View
          style={[
            styles.bellHighlight,
            {
              height: 28 * scale,
              left: 18 * scale,
              top: 12 * scale,
              width: 28 * scale,
            },
          ]}
        />
        <View
          style={[
            styles.core,
            {
              backgroundColor: accent,
              height: 28 * scale,
              width: 28 * scale,
            },
          ]}
        />
      </View>

      {[0, 1, 2, 3, 4].map((item) => (
        <View
          key={item}
          style={[
            styles.tentacle,
            {
              height: (58 + item * 5) * scale,
              left: (24 + item * 12) * scale,
              top: 66 * scale,
              transform: [{ rotate: `${item % 2 === 0 ? -8 : 8}deg` }],
              width: 5 * scale,
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function JellyfishScene({ compact = false }: JellyfishSceneProps) {
  if (compact) {
    return (
      <View pointerEvents="none" style={styles.compactScene}>
        <View style={styles.compactBubbleA} />
        <View style={styles.compactBubbleB} />
        <Jellyfish x={12} y={2} scale={0.72} opacity={0.94} rotate="-8deg" />
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={styles.scene}>
      <View style={styles.currentA} />
      <View style={styles.currentB} />
      <View style={styles.bubbleA} />
      <View style={styles.bubbleB} />
      <View style={styles.bubbleC} />
      <Jellyfish x={118} y={170} scale={1.28} opacity={0.98} rotate="-4deg" />
      <Jellyfish x={18} y={88} scale={0.72} opacity={0.78} rotate="10deg" accent="#D9F0FF" />
      <Jellyfish x={238} y={82} scale={0.58} opacity={0.7} rotate="-13deg" accent="#8DE8FF" />
      <Jellyfish x={38} y={360} scale={0.46} opacity={0.58} rotate="-16deg" accent="#FFB7C4" />
      <Jellyfish x={258} y={382} scale={0.5} opacity={0.62} rotate="12deg" accent="#D9F0FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryDark,
    overflow: 'hidden',
  },
  compactScene: {
    height: 132,
    overflow: 'hidden',
    position: 'absolute',
    right: -2,
    top: 16,
    width: 132,
  },
  currentA: {
    backgroundColor: 'rgba(141,232,255,0.18)',
    borderRadius: 999,
    height: 420,
    left: -170,
    position: 'absolute',
    top: 110,
    transform: [{ rotate: '-18deg' }],
    width: 520,
  },
  currentB: {
    backgroundColor: 'rgba(122,223,210,0.18)',
    borderRadius: 999,
    bottom: -160,
    height: 360,
    position: 'absolute',
    right: -110,
    transform: [{ rotate: '14deg' }],
    width: 430,
  },
  bubbleA: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    height: 68,
    left: 38,
    position: 'absolute',
    top: 214,
    width: 68,
  },
  bubbleB: {
    backgroundColor: 'rgba(255,143,163,0.24)',
    borderRadius: 999,
    height: 82,
    position: 'absolute',
    right: 48,
    top: 232,
    width: 82,
  },
  bubbleC: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 999,
    bottom: 118,
    height: 116,
    left: 104,
    position: 'absolute',
    width: 116,
  },
  compactBubbleA: {
    backgroundColor: 'rgba(141,232,255,0.42)',
    borderRadius: 999,
    height: 94,
    position: 'absolute',
    right: -28,
    top: 2,
    width: 94,
  },
  compactBubbleB: {
    backgroundColor: 'rgba(255,143,163,0.2)',
    borderRadius: 999,
    bottom: 6,
    height: 58,
    left: 12,
    position: 'absolute',
    width: 58,
  },
  jellyfish: {
    alignItems: 'center',
    position: 'absolute',
  },
  outerGlow: {
    backgroundColor: 'rgba(141,232,255,0.2)',
    borderRadius: 999,
    position: 'absolute',
    top: -6,
  },
  bell: {
    alignItems: 'center',
    backgroundColor: 'rgba(122,223,210,0.82)',
    borderColor: 'rgba(255,255,255,0.52)',
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bellHighlight: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 999,
    position: 'absolute',
  },
  core: {
    borderRadius: 999,
    opacity: 0.8,
  },
  tentacle: {
    backgroundColor: 'rgba(229,250,255,0.62)',
    borderRadius: 999,
    position: 'absolute',
  },
});
