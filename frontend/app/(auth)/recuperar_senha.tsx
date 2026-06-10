import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSend = () => {
    if (!email.trim()) {
      setError('Informe seu e-mail para receber o link.');
      return;
    }

    setError('');
    setSuccess(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.auraTop} />
            <View style={styles.auraBottom} />

            <View style={styles.card}>
              <View style={styles.header}>
                <CicatriaLogo compact />
                <Text style={styles.title}>Recuperar senha</Text>
              </View>

              {!success ? (
                <>
                  <Text style={styles.description}>
                    Informe seu e-mail e enviaremos um link para redefinir seu acesso.
                  </Text>

                  <View style={styles.form}>
                    <Input
                      autoCapitalize="none"
                      autoComplete="email"
                      error={error}
                      keyboardType="email-address"
                      label="E-mail"
                      onChangeText={(text) => {
                        setEmail(text);
                        if (error) setError('');
                      }}
                      placeholder="seu@email.com"
                      value={email}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSend}>
                      <Text style={styles.buttonText}>Enviar link</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Text style={styles.successBadge}>OK</Text>
                  <Text style={styles.successTitle}>E-mail enviado</Text>
                  <Text style={styles.successMessage}>
                    Verifique sua caixa de entrada para seguir com a redefinicao da senha.
                  </Text>

                  <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
                    <Text style={styles.buttonText}>Voltar ao login</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    paddingBottom: 42,
    paddingTop: 34,
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
    marginBottom: 20,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  description: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    marginTop: 8,
    paddingVertical: 15,
    width: '100%',
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  successBadge: {
    backgroundColor: '#DDF9EE',
    borderRadius: 999,
    color: theme.colors.success,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  successTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },
  successMessage: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
});
