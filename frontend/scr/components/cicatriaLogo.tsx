import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/scr/constants/theme';

type CicatriaLogoProps = {
  compact?: boolean;
};

export default function CicatriaLogo({ compact = false }: CicatriaLogoProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.mark, compact ? styles.markCompact : null]}>
        <View style={[styles.aqua, compact ? styles.aquaCompact : null]} />
        <View style={[styles.leaf, compact ? styles.leafCompact : null]} />
        <View style={styles.sparkle} />
        <View style={[styles.crossVertical, compact ? styles.crossVerticalCompact : null]} />
        <View style={[styles.crossHorizontal, compact ? styles.crossHorizontalCompact : null]} />
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
    backgroundColor: '#DDF8FF',
    borderColor: theme.colors.white,
    borderRadius: 24,
    borderWidth: 2,
    height: 78,
    justifyContent: 'center',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    width: 78,
  },
  markCompact: {
    borderRadius: 18,
    height: 58,
    width: 58,
  },
  aqua: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 999,
    height: 50,
    opacity: 0.86,
    position: 'absolute',
    width: 50,
  },
  aquaCompact: {
    height: 38,
    width: 38,
  },
  leaf: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 38,
    opacity: 0.92,
    position: 'absolute',
    right: 12,
    top: 14,
    width: 38,
  },
  leafCompact: {
    height: 29,
    right: 9,
    top: 10,
    width: 29,
  },
  sparkle: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    height: 14,
    left: 23,
    position: 'absolute',
    top: 17,
    width: 14,
  },
  crossVertical: {
    backgroundColor: theme.colors.white,
    borderRadius: 999,
    height: 28,
    position: 'absolute',
    width: 8,
  },
  crossVerticalCompact: {
    height: 22,
    width: 6,
  },
  crossHorizontal: {
    backgroundColor: theme.colors.white,
    borderRadius: 999,
    height: 8,
    position: 'absolute',
    width: 28,
  },
  crossHorizontalCompact: {
    height: 6,
    width: 22,
  },
  wordmark: {
    color: theme.colors.primaryDark,
    fontSize: 34,
    fontWeight: '800',
  },
  wordmarkCompact: {
    fontSize: 28,
  },
});
