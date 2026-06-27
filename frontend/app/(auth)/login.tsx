import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CicatriaLogo from '@/src/components/cicatriaLogo';
import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

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
      setError(loginError instanceof Error ? loginError.message : 'Não foi possível entrar agora.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.blobLeft} />
            <View style={styles.blobRight} />
            <View style={styles.heroCopy}>
              <Text style={styles.greeting}>Olá!</Text>
              <Text style={styles.heroText}>Vamos cuidar da sua evolução hoje.</Text>
            </View>
          </View>

          <View style={styles.sheet}>
            <View style={styles.logoWrap}>
              <CicatriaLogo compact />
            </View>

            <Text style={styles.subtitle}>Acompanhe feridas, fotos e sinais com calma.</Text>

            <View style={styles.form}>
              <View style={styles.inputRow}>
                <Text style={styles.inputIcon}>@</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="E-mail"
                  placeholderTextColor={theme.colors.textLight}
                  style={styles.input}
                  value={email}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  onChangeText={setPassword}
                  placeholder="Senha"
                  placeholderTextColor={theme.colors.textLight}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                />
                <Pressable hitSlop={8} onPress={() => setShowPassword((value) => !value)}>
                  <Text style={styles.inputToggle}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                </Pressable>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                disabled={isLoading}
                onPress={handleLogin}>
                <Text style={styles.buttonText}>{isLoading ? 'Entrando...' : 'Entrar'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/recuperar_senha')}>
                <Text style={styles.forgot}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Ainda não tem conta?</Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
                  <Text style={styles.footerLink}> Criar conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 44,
    minHeight: 255,
    overflow: 'hidden',
    paddingHorizontal: 28,
    paddingTop: 42,
  },
  blobLeft: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    height: 88,
    left: -22,
    position: 'absolute',
    top: -12,
    width: 88,
  },
  blobRight: {
    backgroundColor: 'rgba(141,232,255,0.32)',
    borderRadius: 999,
    height: 154,
    position: 'absolute',
    right: -58,
    top: 40,
    width: 154,
  },
  heroCopy: {
    marginTop: 18,
    maxWidth: 260,
  },
  greeting: {
    color: theme.colors.white,
    fontSize: 38,
    fontWeight: '900',
  },
  heroText: {
    color: '#DDFDF8',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 4,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopRightRadius: 46,
    flex: 1,
    marginTop: -70,
    minHeight: 470,
    paddingHorizontal: 26,
    paddingTop: 34,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    gap: 14,
    marginTop: 26,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceTint,
    borderColor: '#D9EEE9',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  inputIcon: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginRight: 8,
  },
  input: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  inputToggle: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    marginTop: 8,
    minHeight: 54,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  forgot: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontWeight: '700',
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
});
