import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/src/constants/theme';
import { useAcompanhamentos } from '@/src/contexts/AcompanhamentoContext';
import type { Registro } from '@/src/contexts/AcompanhamentoContext';

const niveis = ['sem', 'leve', 'moderada', 'intensa'] as const;
const labelsVermelhidao = {
  sem: 'não',
  leve: 'leve',
  moderada: 'moderada',
  intensa: 'intensa',
} as const;

function formatarData(data?: string) {
  if (!data) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${data}T12:00:00`));
}

function corDaDor(dor: number) {
  if (dor >= 7) {
    return theme.colors.error;
  }

  if (dor >= 4) {
    return theme.colors.warning;
  }

  return theme.colors.success;
}

export default function DetalheAcompanhamentoScreen() {
  const route = useRoute();
  const id = ((route.params as any)?.id as string | undefined) ?? '';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { acompanhamentos, adicionarRegistro, alternarStatus } = useAcompanhamentos();
  const acompanhamento = acompanhamentos.find((item) => item.id === id);
  const [dor, setDor] = useState(3);
  const [vermelhidao, setVermelhidao] = useState<Registro['vermelhidao']>('sem');
  const [temSecrecao, setTemSecrecao] = useState(false);
  const [temOdor, setTemOdor] = useState(false);
  const [observacao, setObservacao] = useState('');

  if (!acompanhamento) {
    return (
      <View style={styles.screen}>
        <View style={styles.notFound}>
          <MaterialIcons name="search-off" size={38} color={theme.colors.primary} />
          <Text style={styles.notFoundTitle}>Acompanhamento não encontrado</Text>
          <TouchableOpacity style={styles.smallButton} onPress={() => router.replace('/(tabs)/acompanhamento')}>
            <Text style={styles.smallButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const registrosOrdenados = [...acompanhamento.registros].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
  const ultimo = registrosOrdenados[0];

  const salvarRegistro = () => {
    adicionarRegistro({
      acompanhamentoId: acompanhamento.id,
      dor,
      vermelhidao,
      temSecrecao,
      temOdor,
      observacao,
    });
    setDor(3);
    setVermelhidao('sem');
    setTemSecrecao(false);
    setTemOdor(false);
    setObservacao('');
    Alert.alert('Registro salvo', 'A avaliação de hoje foi adicionada ao histórico.');
  };

  const gerarRelatorio = () => {
    Alert.alert('Relatório', 'O relatório será gerado com fotos, sintomas e evolução deste acompanhamento.');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 118, 142), paddingTop: insets.top + 18 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="chevron-left" size={26} color={theme.colors.primaryDark} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>{acompanhamento.status === 'ativo' ? 'Em cuidado' : 'Finalizado'}</Text>
            <Text style={styles.title}>{acompanhamento.titulo}</Text>
            <Text style={styles.subtitle}>{acompanhamento.local}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{ultimo?.dor ?? 0}/10</Text>
            <Text style={styles.summaryLabel}>dor atual</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{registrosOrdenados.length}</Text>
            <Text style={styles.summaryLabel}>registros</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatarData(acompanhamento.proximoRetorno)}</Text>
            <Text style={styles.summaryLabel}>retorno</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.statusButton} onPress={() => alternarStatus(acompanhamento.id)}>
          <MaterialIcons
            name={acompanhamento.status === 'ativo' ? 'check-circle' : 'refresh'}
            size={20}
            color={theme.colors.white}
          />
          <Text style={styles.statusButtonText}>
            {acompanhamento.status === 'ativo' ? 'Finalizar acompanhamento' : 'Reativar acompanhamento'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/(tabs)/novo-registro?acompanhamentoId=${acompanhamento.id}`)}>
            <MaterialIcons name="add-a-photo" size={20} color={theme.colors.primary} />
            <Text style={styles.actionText}>Adicionar novo registro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={gerarRelatorio}>
            <MaterialIcons name="description" size={20} color={theme.colors.primary} />
            <Text style={styles.actionText}>Gerar relatório</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Adicionar registro</Text>
          <Text style={styles.label}>Dor percebida</Text>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepButton} onPress={() => setDor((value) => Math.max(0, value - 1))}>
              <Text style={styles.stepText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.dorValue}>{dor}/10</Text>
            <TouchableOpacity style={styles.stepButton} onPress={() => setDor((value) => Math.min(10, value + 1))}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Vermelhidão</Text>
          <View style={styles.segmented}>
            {niveis.map((nivel) => (
              <TouchableOpacity
                key={nivel}
                style={[styles.segment, vermelhidao === nivel && styles.segmentActive]}
                onPress={() => setVermelhidao(nivel)}>
                <Text style={[styles.segmentText, vermelhidao === nivel && styles.segmentTextActive]}>
                  {labelsVermelhidao[nivel]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.toggles}>
            <TouchableOpacity
              style={[styles.toggle, temSecrecao && styles.toggleActive]}
              onPress={() => setTemSecrecao((value) => !value)}>
              <Text style={[styles.toggleText, temSecrecao && styles.toggleTextActive]}>Secreção</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggle, temOdor && styles.toggleActive]}
              onPress={() => setTemOdor((value) => !value)}>
              <Text style={[styles.toggleText, temOdor && styles.toggleTextActive]}>Odor</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={observacao}
            onChangeText={setObservacao}
            multiline
            placeholder="Observações do dia"
            placeholderTextColor={theme.colors.textLight}
            style={[styles.input, styles.textArea]}
          />

          <TouchableOpacity style={styles.saveButton} onPress={salvarRegistro}>
            <Text style={styles.saveButtonText}>Salvar registro</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.historyTitle}>Histórico</Text>
        <View style={styles.historyList}>
          {registrosOrdenados.map((registro) => (
            <View key={registro.id} style={styles.historyCard}>
              <View style={[styles.timelineDot, { backgroundColor: corDaDor(registro.dor) }]} />
              <View style={styles.photoThumb}>
                <MaterialIcons
                  name={registro.fotoUri ? 'image' : 'image-not-supported'}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.historyBody}>
                <Text style={styles.historyDate}>{formatarData(registro.data)}</Text>
                <Text style={styles.historyMain}>
                  Dor {registro.dor}/10 - vermelhidão {labelsVermelhidao[registro.vermelhidao]}
                </Text>
                <Text style={styles.historyMeta}>
                  {registro.temSecrecao ? 'Com secreção' : 'Sem secreção'} - {registro.temOdor ? 'com odor' : 'sem odor'}
                </Text>
                {registro.observacao ? <Text style={styles.historyNote}>{registro.observacao}</Text> : null}
              </View>
            </View>
          ))}
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerText: {
    flex: 1,
  },
  kicker: {
    color: '#E8FFF7',
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: theme.colors.white,
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: '#E8FFF7',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    padding: 14,
  },
  summaryItem: {
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  summaryLabel: {
    color: theme.colors.textLight,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  statusButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 22,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 14,
    minHeight: 52,
  },
  statusButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    flex: 1,
    gap: 7,
    minHeight: 76,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  actionText: {
    color: theme.colors.primaryDark,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    gap: 12,
    marginBottom: 18,
    padding: 18,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  label: {
    color: theme.colors.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  stepButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  stepText: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  dorValue: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    minWidth: 86,
    textAlign: 'center',
  },
  segmented: {
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 5,
  },
  segment: {
    alignItems: 'center',
    borderRadius: 999,
    flexGrow: 1,
    minWidth: '22%',
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '900',
  },
  segmentTextActive: {
    color: theme.colors.white,
  },
  toggles: {
    flexDirection: 'row',
    gap: 10,
  },
  toggle: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  toggleTextActive: {
    color: theme.colors.white,
  },
  input: {
    backgroundColor: theme.colors.surfaceTint,
    borderColor: '#D9EEE9',
    borderRadius: 19,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  textArea: {
    minHeight: 96,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 22,
    minHeight: 54,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  historyTitle: {
    color: theme.colors.white,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 10,
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  photoThumb: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  timelineDot: {
    borderRadius: 999,
    height: 14,
    marginTop: 4,
    width: 14,
  },
  historyBody: {
    flex: 1,
  },
  historyDate: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  historyMain: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },
  historyMeta: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  historyNote: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 8,
  },
  notFound: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginVertical: 14,
    textAlign: 'center',
  },
  smallButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  smallButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },
});
