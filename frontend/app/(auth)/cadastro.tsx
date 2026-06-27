import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CicatriaLogo from '@/src/components/cicatriaLogo';
import Input from '@/src/components/Input';
import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { registrar, isLoading } = useAuth();

  const handleCriarConta = async () => {
    setError('');

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await registrar(nome, email, senha);
      router.replace('/(tabs)');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Não foi possível criar a conta.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
            <View style={styles.blobA} />
            <View style={styles.blobB} />
          </View>

          <View style={styles.sheet}>
            <View style={styles.header}>
              <CicatriaLogo compact />
              <Text style={styles.title}>Criar conta</Text>
              <Text style={styles.subtitle}>Comece seu diário visual de cuidado.</Text>
            </View>

            <View style={styles.form}>
              <Input label="Nome completo" placeholder="Seu nome" value={nome} onChangeText={setNome} />
              <Input
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                label="E-mail"
                onChangeText={setEmail}
                placeholder="seu@email.com"
                value={email}
              />
              <Input
                label="Senha"
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                secureTextEntry
                value={senha}
              />
              <Input
                error={error && senha !== confirmarSenha ? error : undefined}
                label="Confirmar senha"
                onChangeText={(text) => {
                  setConfirmarSenha(text);
                  if (error) setError('');
                }}
                placeholder="Confirme sua senha"
                secureTextEntry
                value={confirmarSenha}
              />

              {error && senha === confirmarSenha ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleCriarConta}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={theme.colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Criar conta</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.link} onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.linkText}>Ja tenho conta</Text>
              </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 26,
  },
  hero: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 52,
    minHeight: 180,
    overflow: 'hidden',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    left: 22,
    position: 'absolute',
    top: 28,
    width: 36,
    zIndex: 2,
  },
  backText: {
    color: theme.colors.white,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 32,
  },
  blobA: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    height: 104,
    left: -24,
    position: 'absolute',
    top: -28,
    width: 104,
  },
  blobB: {
    backgroundColor: 'rgba(141,232,255,0.35)',
    borderRadius: 999,
    height: 164,
    position: 'absolute',
    right: -42,
    top: 36,
    width: 164,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopRightRadius: 52,
    flex: 1,
    marginTop: -54,
    minHeight: 610,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: theme.colors.primaryDark,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    marginTop: 8,
    minHeight: 54,
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  link: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },
});
