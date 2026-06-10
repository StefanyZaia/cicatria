import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/scr/constants/theme';
import { useAcompanhamentos } from '@/scr/contexts/AcompanhamentoContext';
import { useAuth } from '@/scr/contexts/AuthContext';

function formatarData(data?: string) {
  if (!data) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${data}T12:00:00`));
}

function corDaDor(dor?: number) {
  if (!dor) {
    return theme.colors.textLight;
  }

  if (dor >= 7) {
    return '#E05252';
  }

  if (dor >= 4) {
    return '#E09B3D';
  }

  return theme.colors.success;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    acompanhamentos,
    totalAtivos,
    ultimoRegistro,
    totalComAtencao,
    proximoRetorno,
  } = useAcompanhamentos();

  const acompanhamentosAtivos = acompanhamentos.filter((item) => item.status === 'ativo');
  const precisaAtencao = totalComAtencao > 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Cicatria</Text>
            <Text style={styles.title}>Olá, {user?.nome ?? 'Paciente'}</Text>
          </View>

          <TouchableOpacity
            accessibilityLabel="Criar novo acompanhamento"
            style={styles.iconButton}
            onPress={() => router.push('/acompanhamento/novo')}>
            <MaterialIcons name="add-a-photo" size={22} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={[styles.notice, precisaAtencao ? styles.noticeWarning : styles.noticeCalm]}>
          <View style={styles.noticeIcon}>
            <MaterialIcons
              name={precisaAtencao ? 'priority-high' : 'check'}
              size={20}
              color={precisaAtencao ? '#A75B00' : theme.colors.primaryDark}
            />
          </View>
          <View style={styles.noticeText}>
            <Text style={styles.noticeTitle}>
              {precisaAtencao ? 'Há acompanhamento pedindo atenção' : 'Tudo está estável hoje'}
            </Text>
            <Text style={styles.noticeBody}>
              {precisaAtencao
                ? 'Revise os registros recentes e mantenha o acompanhamento diário.'
                : 'Continue registrando uma foto por dia para manter a evolução organizada.'}
            </Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalAtivos}</Text>
            <Text style={styles.metricLabel}>ativos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, totalComAtencao > 0 && styles.metricAlert]}>
              {totalComAtencao}
            </Text>
            <Text style={styles.metricLabel}>atenção</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatarData(proximoRetorno)}</Text>
            <Text style={styles.metricLabel}>retorno</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registro mais recente</Text>
          <TouchableOpacity onPress={() => router.push('/acompanhamento')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.latestCard}>
          <View style={styles.photoPlaceholder}>
            <MaterialIcons name="image-search" size={28} color={theme.colors.primaryDark} />
          </View>
          <View style={styles.latestContent}>
            <Text style={styles.latestDate}>{formatarData(ultimoRegistro?.data)}</Text>
            <Text style={styles.latestTitle}>
              Dor em{' '}
              <Text style={{ color: corDaDor(ultimoRegistro?.dor) }}>
                {ultimoRegistro?.dor ?? 0}/10
              </Text>
            </Text>
            <Text style={styles.latestMeta}>
              Vermelhidão {ultimoRegistro?.vermelhidao ?? 'não informada'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acompanhamentos</Text>
          <TouchableOpacity onPress={() => router.push('/acompanhamento/novo')}>
            <Text style={styles.sectionLink}>Novo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {acompanhamentosAtivos.map((item) => {
            const ultimo = [...item.registros].sort(
              (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
            )[0];

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.followCard}
                onPress={() => router.push(`/acompanhamento/${item.id}`)}>
                <View style={styles.followIcon}>
                  <MaterialIcons
                    name={item.precisaAtencao ? 'healing' : 'health-and-safety'}
                    size={23}
                    color={item.precisaAtencao ? '#C06B00' : theme.colors.primaryDark}
                  />
                </View>
                <View style={styles.followContent}>
                  <Text style={styles.followTitle}>{item.titulo}</Text>
                  <Text style={styles.followMeta}>
                    {item.local} · último registro {formatarData(ultimo?.data)}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kicker: {
    color: theme.colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    height: 48,
    justifyContent: 'center',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    width: 48,
  },
  notice: {
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    padding: 16,
  },
  noticeCalm: {
    backgroundColor: '#DDF9EE',
  },
  noticeWarning: {
    backgroundColor: '#FFF0D8',
  },
  noticeIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  noticeBody: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: theme.colors.surfaceGlass,
    borderColor: 'rgba(255,255,255,0.86)',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  metricAlert: {
    color: '#C06B00',
  },
  metricLabel: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionLink: {
    color: theme.colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  latestCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
    padding: 14,
  },
  photoPlaceholder: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 18,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  latestContent: {
    flex: 1,
  },
  latestDate: {
    color: theme.colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  latestTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  latestMeta: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  list: {
    gap: 10,
  },
  followCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  followIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 15,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  followContent: {
    flex: 1,
  },
  followTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  followMeta: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
});
