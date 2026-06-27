import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import JellyfishScene from '@/src/components/JellyfishScene';
import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [lembretes, setLembretes] = useState(true);
  const [modoSuave, setModoSuave] = useState(true);
  const [syncFotos, setSyncFotos] = useState(false);

  const sair = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const confirmarSair = () => {
    Alert.alert('Sair da conta', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 118, 142), paddingTop: insets.top + 18 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <JellyfishScene compact />
          <Text style={styles.kicker}>Perfil</Text>
          <Text style={styles.title}>{user?.nome ?? 'Paciente'}</Text>
          <Text style={styles.subtitle}>Dados do usuário e configurações básicas do app.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados do usuário</Text>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <MaterialIcons name="account-circle" size={48} color={theme.colors.primary} />
            </View>
            <View style={styles.avatarText}>
              <Text style={styles.name}>{user?.nome ?? 'Paciente'}</Text>
              <Text style={styles.email}>{user?.email ?? 'email@exemplo.com'}</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoPill}>
              <Text style={styles.infoLabel}>Perfil</Text>
              <Text style={styles.infoValue}>Paciente</Text>
            </View>
            <View style={styles.infoPill}>
              <Text style={styles.infoLabel}>Conta</Text>
              <Text style={styles.infoValue}>Demo</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configuracoes</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Lembrete diário</Text>
              <Text style={styles.settingDescription}>Avisar para registrar uma foto por dia.</Text>
            </View>
            <Switch
              value={lembretes}
              onValueChange={setLembretes}
              thumbColor={theme.colors.white}
              trackColor={{ false: '#CADBD8', true: theme.colors.primarySoft }}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Modo visual suave</Text>
              <Text style={styles.settingDescription}>Manter cores claras e menos contraste.</Text>
            </View>
            <Switch
              value={modoSuave}
              onValueChange={setModoSuave}
              thumbColor={theme.colors.white}
              trackColor={{ false: '#CADBD8', true: theme.colors.primarySoft }}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Sincronizar fotos</Text>
              <Text style={styles.settingDescription}>Preparado para backup quando a API estiver ativa.</Text>
            </View>
            <Switch
              value={syncFotos}
              onValueChange={setSyncFotos}
              thumbColor={theme.colors.white}
              trackColor={{ false: '#CADBD8', true: theme.colors.primarySoft }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Aplicativo</Text>
          <View style={styles.appRow}>
            <MaterialIcons name="water-drop" size={22} color={theme.colors.primary} />
            <View style={styles.appText}>
              <Text style={styles.settingTitle}>Cicatria</Text>
              <Text style={styles.settingDescription}>Versao inicial de acompanhamento visual.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmarSair}>
          <MaterialIcons name="logout" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDeep,
  },
  content: {
    paddingHorizontal: 18,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    marginBottom: 14,
    minHeight: 178,
    overflow: 'hidden',
    padding: 20,
  },
  kicker: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 230,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    gap: 14,
    marginBottom: 14,
    padding: 18,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  avatarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 24,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  avatarText: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  email: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  infoPill: {
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 18,
    flex: 1,
    padding: 12,
  },
  infoLabel: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '800',
  },
  infoValue: {
    color: theme.colors.primaryDark,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
  settingRow: {
    alignItems: 'center',
    borderBottomColor: '#E1F1ED',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 13,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  settingDescription: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
  appRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  appText: {
    flex: 1,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 15,
    fontWeight: '900',
  },
});
