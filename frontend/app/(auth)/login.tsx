import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CicatriaLogo from '@/scr/components/cicatriaLogo';
import { theme } from '@/scr/constants/theme';
import { useAuth } from '@/scr/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    setError('');

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Nao foi possivel entrar agora.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <View style={styles.auraTop} />
          <View style={styles.auraBottom} />
          <View style={styles.glow} />

          <View style={styles.card}>
            <View style={styles.header}>
              <CicatriaLogo />
              <Text style={styles.subtitle}>Acompanhe suas fotos diarias com calma e clareza.</Text>
            </View>

            <View style={styles.form}>
              <View>
                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.inputAdornment}>@</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="seu@email.com"
                    placeholderTextColor={theme.colors.textLight}
                    style={styles.inputWithIcon}
                    value={email}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    onChangeText={setPassword}
                    placeholder="Digite sua senha"
                    placeholderTextColor={theme.colors.textLight}
                    secureTextEntry={!showPassword}
                    style={styles.inputWithIcon}
                    value={password}
                  />
                  <Pressable onPress={() => setShowPassword((value) => !value)}>
                    <Text style={styles.inputToggle}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                  </Pressable>
                </View>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                disabled={isLoading}
                onPress={handleLogin}>
                <Text style={styles.buttonText}>{isLoading ? 'Entrando...' : 'Entrar'}</Text>
              </TouchableOpacity>

              <View style={styles.links}>
                <TouchableOpacity onPress={() => router.push('/(auth)/recuperar_senha')}>
                  <Text style={styles.link}>Esqueceu a senha?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
                  <Text style={styles.link}>Criar conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    overflow: 'visible',
    paddingHorizontal: 20,
  },
  auraTop: {
    backgroundColor: '#B8F4E1',
    borderRadius: 999,
    height: 230,
    position: 'absolute',
    right: -44,
    top: 0,
    width: 230,
  },
  auraBottom: {
    backgroundColor: '#BCEFFF',
    borderRadius: 999,
    bottom: -34,
    height: 270,
    left: -72,
    position: 'absolute',
    width: 270,
  },
  glow: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 999,
    height: 160,
    left: 46,
    position: 'absolute',
    top: 104,
    width: 160,
  },
  card: {
    backgroundColor: theme.colors.surfaceGlass,
    borderColor: 'rgba(255,255,255,0.92)',
    borderRadius: 28,
    borderWidth: 1,
    elevation: 8,
    paddingHorizontal: 24,
    paddingVertical: 30,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: 14,
  },
  inputAdornment: {
    color: theme.colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
  },
  inputWithIcon: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  inputToggle: {
    color: theme.colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    marginTop: 6,
    paddingVertical: 15,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  link: {
    color: theme.colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
