import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { theme } from '@/src/constants/theme';

type InputProps = TextInputProps & {
  error?: string;
  label?: string;
};

export default function Input({ error, label, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textLight}
        style={[styles.input, error ? styles.inputError : null, style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7,
  },
  label: {
    color: theme.colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    backgroundColor: theme.colors.surfaceTint,
    borderColor: '#D9EEE9',
    borderRadius: 999,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
});
