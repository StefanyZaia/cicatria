import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import JellyfishScene from '@/src/components/JellyfishScene';
import { theme } from '@/src/constants/theme';
import { useAcompanhamentos } from '@/src/contexts/AcompanhamentoContext';

function formatarData(data?: string) {
  if (!data) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${data}T12:00:00`));
}

function formatarVermelhidao(vermelhidao?: string) {
  return vermelhidao ?? 'n/a';
}

export default function AcompanhamentosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { acompanhamentos, totalAtivos, totalComAtencao } = useAcompanhamentos();

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 118, 142), paddingTop: insets.top + 18 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <JellyfishScene compact />
          <Text style={styles.kicker}>Diário visual</Text>
          <Text style={styles.title}>Acompanhamentos</Text>
          <Text style={styles.subtitle}>Veja cada ferida monitorada e registre a evolução.</Text>

          <View style={styles.headerStats}>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{totalAtivos}</Text>
              <Text style={styles.statLabel}>ativos</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={[styles.statValue, totalComAtencao > 0 && styles.warningText]}>
                {totalComAtencao}
              </Text>
              <Text style={styles.statLabel}>atenção</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryAction} onPress={() => router.push('/(tabs)/acompanhamento/novo')}>
          <MaterialIcons name="add-a-photo" size={22} color={theme.colors.white} />
          <Text style={styles.primaryActionText}>Novo acompanhamento</Text>
        </TouchableOpacity>

        <View style={styles.list}>
          {acompanhamentos.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="water-drop" size={34} color={theme.colors.primary} />
              <Text style={styles.emptyTitle}>Nenhum acompanhamento ainda</Text>
              <Text style={styles.emptyText}>Crie o primeiro registro para iniciar seu histórico.</Text>
            </View>
          ) : (
            acompanhamentos.map((item) => {
              const ultimo = [...item.registros].sort(
                (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
              )[0];

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => router.push(`/(tabs)/acompanhamento/${item.id}`)}>
                  <View style={styles.cardIcon}>
                    <MaterialIcons
                      name={item.precisaAtencao ? 'healing' : 'health-and-safety'}
                      size={24}
                      color={item.precisaAtencao ? theme.colors.warning : theme.colors.primary}
                    />
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>{item.titulo}</Text>
                      <View style={[styles.statusDot, item.status === 'finalizado' && styles.statusDone]} />
                    </View>
                    <Text style={styles.cardMeta}>
                      {item.local} - último registro {formatarData(ultimo?.data)}
                    </Text>
                    <View style={styles.badges}>
                      <Text style={styles.badge}>Dor {ultimo?.dor ?? 0}/10</Text>
                      <Text style={styles.badge}>Vermelhidão {formatarVermelhidao(ultimo?.vermelhidao)}</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
                </TouchableOpacity>
              );
            })
          )}
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
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    marginBottom: 14,
    minHeight: 184,
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
  headerStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  statPill: {
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  warningText: {
    color: theme.colors.warning,
  },
  statLabel: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '800',
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 58,
  },
  primaryActionText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  list: {
    gap: 12,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    padding: 26,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: 'rgba(255,255,255,0.78)',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  cardIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 19,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  cardBody: {
    flex: 1,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cardTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  statusDot: {
    backgroundColor: theme.colors.success,
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  statusDone: {
    backgroundColor: theme.colors.textLight,
  },
  cardMeta: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 9,
  },
  badge: {
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 999,
    color: theme.colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
});
