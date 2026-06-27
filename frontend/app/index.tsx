import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import JellyfishScene from '@/src/components/JellyfishScene';
import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.background}>
      <JellyfishScene />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.scrim} />
        <View style={styles.orbTop} />
        <View style={styles.orbBottom} />

        <View style={styles.content}>
          <View style={styles.copy}>
            <Text style={styles.kicker}>Cicatria</Text>
            <Text style={styles.title}>Cuidado que se regenera</Text>
            <Text style={styles.subtitle}>
              Registre suas fotos diárias e acompanhe a evolução com leveza.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,41,48,0.22)',
  },
  orbTop: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    height: 230,
    left: -88,
    position: 'absolute',
    top: 46,
    width: 230,
  },
  orbBottom: {
    backgroundColor: 'rgba(255,143,163,0.22)',
    borderRadius: 999,
    bottom: -84,
    height: 270,
    position: 'absolute',
    right: -86,
    width: 270,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 34,
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  copy: {
    maxWidth: 300,
  },
  kicker: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
    opacity: 0.92,
  },
  title: {
    color: theme.colors.white,
    fontSize: 43,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 48,
    marginTop: 10,
  },
  subtitle: {
    color: '#E7FFFA',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 14,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.white,
    borderRadius: 22,
    minHeight: 58,
    justifyContent: 'center',
    shadowColor: '#07333A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
  },
  buttonText: {
    color: theme.colors.primaryDark,
    fontSize: 17,
    fontWeight: '900',
  },
});
