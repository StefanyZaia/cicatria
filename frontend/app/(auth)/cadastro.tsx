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

import CicatriaLogo from '@/scr/components/cicatriaLogo';
import Input from '@/scr/components/Input';
import { theme } from '@/scr/constants/theme';
import { useAuth } from '@/scr/contexts/AuthContext';

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
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Não foi possível criar a conta.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.auraTop} />
            <View style={styles.auraBottom} />

            <View style={styles.card}>
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

                <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
                  <Text style={styles.linkText}>Já tenho conta</Text>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  auraTop: {
    backgroundColor: '#B8F4E1',
    borderRadius: 999,
    height: 230,
    position: 'absolute',
    right: -70,
    top: -45,
    width: 230,
  },
  auraBottom: {
    backgroundColor: '#BCEFFF',
    borderRadius: 999,
    bottom: -85,
    height: 270,
    left: -100,
    position: 'absolute',
    width: 270,
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
    marginBottom: 24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    marginTop: 8,
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
  link: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: theme.colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
