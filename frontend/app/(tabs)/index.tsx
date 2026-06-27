import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import JellyfishScene from '@/src/components/JellyfishScene';
import { theme } from '@/src/constants/theme';
import { useAcompanhamentos } from '@/src/contexts/AcompanhamentoContext';
import { useAuth } from '@/src/contexts/AuthContext';

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
    return theme.colors.error;
  }

  if (dor >= 4) {
    return theme.colors.warning;
  }

  return theme.colors.success;
}

function formatarVermelhidao(vermelhidao?: string) {
  return vermelhidao ?? 'não informada';
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    acompanhamentos,
    totalAtivos,
    ultimoRegistro,
    ultimoRegistroAcompanhamentoId,
    totalComAtencao,
    proximoRetorno,
  } = useAcompanhamentos();

  const acompanhamentosAtivos = acompanhamentos.filter((item) => item.status === 'ativo');
  const precisaAtencao = totalComAtencao > 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 118, 142), paddingTop: insets.top + 18 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroBlob} />
          <View style={styles.heroTextWrap}>
            <Text style={styles.kicker}>Cicatria</Text>
            <Text style={styles.title}>Olá, {user?.nome ?? 'Paciente'}</Text>
            <Text style={styles.heroBody}>Sua rotina de cuidado visual esta organizada.</Text>
          </View>
          <JellyfishScene compact />
          <TouchableOpacity
            accessibilityLabel="Criar novo acompanhamento"
            style={styles.floatingButton}
            onPress={() => router.push('/(tabs)/acompanhamento/novo')}>
            <MaterialIcons name="add-a-photo" size={22} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={[styles.notice, precisaAtencao ? styles.noticeWarning : styles.noticeCalm]}>
          <View style={styles.noticeIcon}>
            <MaterialIcons
              name={precisaAtencao ? 'priority-high' : 'water-drop'}
              size={20}
              color={precisaAtencao ? theme.colors.warning : theme.colors.primary}
            />
          </View>
          <View style={styles.noticeText}>
            <Text style={styles.noticeTitle}>
              {precisaAtencao ? 'Acompanhamento pedindo atenção' : 'Tudo estável hoje'}
            </Text>
            <Text style={styles.noticeBody}>
              {precisaAtencao
                ? 'Revise os registros recentes e mantenha o acompanhamento diário.'
                : 'Continue registrando uma foto por dia para ver a evolução.'}
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
          <Text style={styles.sectionTitle}>Registro recente</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/acompanhamento')}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.84}
          disabled={!ultimoRegistroAcompanhamentoId}
          style={styles.latestCard}
          onPress={() => {
            if (ultimoRegistroAcompanhamentoId) {
              router.push(`/(tabs)/acompanhamento/${ultimoRegistroAcompanhamentoId}`);
            }
          }}>
          <View style={styles.photoPlaceholder}>
            <MaterialIcons name="image-search" size={28} color={theme.colors.primary} />
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
              Vermelhidão {formatarVermelhidao(ultimoRegistro?.vermelhidao)}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Acompanhamentos</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/acompanhamento/novo')}>
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
                onPress={() => router.push(`/(tabs)/acompanhamento/${item.id}`)}>
                <View style={styles.followIcon}>
                  <MaterialIcons
                    name={item.precisaAtencao ? 'healing' : 'health-and-safety'}
                    size={23}
                    color={item.precisaAtencao ? theme.colors.warning : theme.colors.primary}
                  />
                </View>
                <View style={styles.followContent}>
                  <Text style={styles.followTitle}>{item.titulo}</Text>
                  <Text style={styles.followMeta}>
                    {item.local} - ultimo registro {formatarData(ultimo?.data)}
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
    backgroundColor: theme.colors.backgroundDeep,
  },
  content: {
    paddingHorizontal: 18,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    minHeight: 178,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 18,
    shadowColor: '#16454A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
  },
  heroBlob: {
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 999,
    height: 180,
    position: 'absolute',
    right: -58,
    top: -46,
    width: 180,
  },
  heroTextWrap: {
    maxWidth: 220,
    zIndex: 2,
  },
  kicker: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: theme.colors.text,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: 4,
  },
  heroBody: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
  },
  floatingButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    bottom: 16,
    height: 48,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    width: 48,
  },
  notice: {
    borderRadius: 22,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    padding: 15,
  },
  noticeCalm: {
    backgroundColor: '#E8FFF7',
  },
  noticeWarning: {
    backgroundColor: '#FFF1DD',
  },
  noticeIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  noticeBody: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  metricCard: {
    backgroundColor: 'rgba(248,255,252,0.92)',
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  metricAlert: {
    color: theme.colors.warning,
  },
  metricLabel: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '900',
  },
  sectionLink: {
    color: '#E8FFF7',
    fontSize: 14,
    fontWeight: '900',
  },
  latestCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 22,
    padding: 14,
  },
  photoPlaceholder: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 22,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  latestContent: {
    flex: 1,
  },
  latestDate: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
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
    fontWeight: '700',
    marginTop: 4,
  },
  list: {
    gap: 10,
  },
  followCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 23,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  followIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 18,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  followContent: {
    flex: 1,
  },
  followTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  followMeta: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
});
