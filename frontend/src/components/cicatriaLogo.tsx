import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/constants/theme';

type CicatriaLogoProps = {
  compact?: boolean;
};

export default function CicatriaLogo({ compact = false }: CicatriaLogoProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.mark, compact ? styles.markCompact : null]}>
        <View style={[styles.bellGlow, compact ? styles.bellGlowCompact : null]} />
        <View style={[styles.bell, compact ? styles.bellCompact : null]}>
          <View style={styles.core} />
        </View>
        <View style={[styles.tentacle, styles.tentacleLeft, compact ? styles.tentacleCompact : null]} />
        <View style={[styles.tentacle, styles.tentacleMid, compact ? styles.tentacleCompact : null]} />
        <View style={[styles.tentacle, styles.tentacleRight, compact ? styles.tentacleCompact : null]} />
      </View>
      <Text style={[styles.wordmark, compact ? styles.wordmarkCompact : null]}>Cicatria</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: '#E9FFFB',
    borderColor: 'rgba(255,255,255,0.94)',
    borderRadius: 30,
    borderWidth: 2,
    height: 84,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    width: 84,
  },
  markCompact: {
    borderRadius: 23,
    height: 62,
    width: 62,
  },
  bellGlow: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 999,
    height: 58,
    opacity: 0.24,
    position: 'absolute',
    top: 11,
    width: 58,
  },
  bellGlowCompact: {
    height: 42,
    top: 8,
    width: 42,
  },
  bell: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    height: 36,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 20,
    width: 48,
  },
  bellCompact: {
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 28,
    top: 14,
    width: 36,
  },
  core: {
    backgroundColor: theme.colors.coral,
    borderRadius: 999,
    height: 15,
    opacity: 0.78,
    width: 15,
  },
  tentacle: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 31,
    opacity: 0.7,
    position: 'absolute',
    top: 52,
    width: 5,
  },
  tentacleCompact: {
    height: 23,
    top: 39,
    width: 4,
  },
  tentacleLeft: {
    left: 31,
    transform: [{ rotate: '10deg' }],
  },
  tentacleMid: {
    left: 40,
  },
  tentacleRight: {
    right: 31,
    transform: [{ rotate: '-10deg' }],
  },
  wordmark: {
    color: theme.colors.primaryDark,
    fontSize: 34,
    fontWeight: '900',
  },
  wordmarkCompact: {
    fontSize: 26,
  },
});
