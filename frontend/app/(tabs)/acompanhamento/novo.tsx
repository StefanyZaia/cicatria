import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/src/constants/theme';
import { useAcompanhamentos } from '@/src/contexts/AcompanhamentoContext';

const niveis = ['sem', 'leve', 'moderada', 'intensa'] as const;
const labelsVermelhidao = {
  sem: 'não',
  leve: 'leve',
  moderada: 'moderada',
  intensa: 'intensa',
} as const;
const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function formatarDataDigitada(texto: string) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  const partes = [numeros.slice(0, 2), numeros.slice(2, 4), numeros.slice(4, 8)].filter(Boolean);

  return partes.join('/');
}

function dataBrasileiraParaIso(data: string) {
  if (!data.trim()) {
    return undefined;
  }

  const match = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, dia, mes, ano] = match;
  const dataValidada = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const dataExiste =
    dataValidada.getFullYear() === Number(ano) &&
    dataValidada.getMonth() === Number(mes) - 1 &&
    dataValidada.getDate() === Number(dia);

  return dataExiste ? `${ano}-${mes}-${dia}` : null;
}

function dataParaTextoBrasileiro(data: Date) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function dataDigitadaParaDate(data: string) {
  const iso = dataBrasileiraParaIso(data);

  if (!iso) {
    return new Date();
  }

  return new Date(`${iso}T12:00:00`);
}

export default function NovoAcompanhamentoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { criarAcompanhamento } = useAcompanhamentos();
  const [titulo, setTitulo] = useState('');
  const [local, setLocal] = useState('');
  const [proximoRetorno, setProximoRetorno] = useState('');
  const [fotoSelecionada, setFotoSelecionada] = useState(false);
  const [dor, setDor] = useState(3);
  const [vermelhidao, setVermelhidao] = useState<(typeof niveis)[number]>('sem');
  const [temSecrecao, setTemSecrecao] = useState(false);
  const [temOdor, setTemOdor] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [mesCalendario, setMesCalendario] = useState(() => new Date());

  const diasDoMes = (() => {
    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    return [
      ...Array.from({ length: primeiroDia }, () => null),
      ...Array.from({ length: totalDias }, (_, index) => new Date(ano, mes, index + 1)),
    ];
  })();

  const abrirCalendario = () => {
    setMesCalendario(dataDigitadaParaDate(proximoRetorno));
    setCalendarioAberto(true);
  };

  const mudarMes = (incremento: number) => {
    setMesCalendario((dataAtual) => new Date(dataAtual.getFullYear(), dataAtual.getMonth() + incremento, 1));
  };

  const selecionarData = (data: Date) => {
    setProximoRetorno(dataParaTextoBrasileiro(data));
    setCalendarioAberto(false);
  };

  const salvar = () => {
    if (!titulo.trim() || !local.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe um título e o local da ferida.');
      return;
    }

    const proximoRetornoIso = dataBrasileiraParaIso(proximoRetorno);

    if (proximoRetornoIso === null) {
      Alert.alert('Data inválida', 'Informe o próximo retorno no formato dia/mês/ano.');
      return;
    }

    const novo = criarAcompanhamento({
      titulo,
      local,
      proximoRetorno: proximoRetornoIso,
      fotoUri: fotoSelecionada ? 'foto-local-demo' : undefined,
      dor,
      vermelhidao,
      temSecrecao,
      temOdor,
      observacao,
    });

    Alert.alert('Acompanhamento criado', 'O primeiro registro foi salvo.');
    router.replace(`/(tabs)/acompanhamento/${novo.id}`);
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
            <Text style={styles.kicker}>Novo diário</Text>
            <Text style={styles.title}>Criar acompanhamento</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identificação</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Ferida no pé esquerdo"
            placeholderTextColor={theme.colors.textLight}
            style={styles.input}
          />
          <TextInput
            value={local}
            onChangeText={setLocal}
            placeholder="Local do corpo"
            placeholderTextColor={theme.colors.textLight}
            style={styles.input}
          />
          <View style={styles.dateRow}>
            <TextInput
              value={proximoRetorno}
              onChangeText={(texto) => setProximoRetorno(formatarDataDigitada(texto))}
              placeholder="Próximo retorno (dd/mm/aaaa)"
              placeholderTextColor={theme.colors.textLight}
              keyboardType="number-pad"
              maxLength={10}
              style={[styles.input, styles.dateInput]}
            />
            <TouchableOpacity style={styles.calendarButton} onPress={abrirCalendario}>
              <MaterialIcons name="calendar-month" size={24} color={theme.colors.primaryDark} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Primeiro registro</Text>
          <TouchableOpacity
            style={[styles.photoBox, fotoSelecionada && styles.photoBoxActive]}
            onPress={() => setFotoSelecionada((value) => !value)}>
            <MaterialIcons
              name={fotoSelecionada ? 'check-circle' : 'add-a-photo'}
              size={32}
              color={fotoSelecionada ? theme.colors.success : theme.colors.primary}
            />
            <Text style={styles.photoText}>{fotoSelecionada ? 'Foto anexada' : 'Tirar ou enviar foto'}</Text>
          </TouchableOpacity>

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
              <MaterialIcons name="opacity" size={18} color={temSecrecao ? theme.colors.white : theme.colors.primary} />
              <Text style={[styles.toggleText, temSecrecao && styles.toggleTextActive]}>Secreção</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggle, temOdor && styles.toggleActive]}
              onPress={() => setTemOdor((value) => !value)}>
              <MaterialIcons name="air" size={18} color={temOdor ? theme.colors.white : theme.colors.primary} />
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
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={salvar}>
          <Text style={styles.saveButtonText}>Salvar acompanhamento</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={calendarioAberto} animationType="fade" onRequestClose={() => setCalendarioAberto(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.monthButton} onPress={() => mudarMes(-1)}>
                <MaterialIcons name="chevron-left" size={26} color={theme.colors.primaryDark} />
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>
                {meses[mesCalendario.getMonth()]} {mesCalendario.getFullYear()}
              </Text>
              <TouchableOpacity style={styles.monthButton} onPress={() => mudarMes(1)}>
                <MaterialIcons name="chevron-right" size={26} color={theme.colors.primaryDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {diasSemana.map((dia, index) => (
                <Text key={`${dia}-${index}`} style={styles.weekDay}>
                  {dia}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {diasDoMes.map((dia, index) => {
                const selecionado = dia ? dataParaTextoBrasileiro(dia) === proximoRetorno : false;

                return (
                  <TouchableOpacity
                    key={dia?.toISOString() ?? `empty-${index}`}
                    disabled={!dia}
                    style={[styles.dayButton, selecionado && styles.dayButtonActive]}
                    onPress={() => dia && selecionarData(dia)}>
                    <Text style={[styles.dayText, selecionado && styles.dayTextActive]}>{dia?.getDate() ?? ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.closeCalendarButton} onPress={() => setCalendarioAberto(false)}>
              <Text style={styles.closeCalendarText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    maxWidth: '100%',
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
    minWidth: 0,
  },
  kicker: {
    color: '#E8FFF7',
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: theme.colors.white,
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    gap: 12,
    marginBottom: 14,
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
  dateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  dateInput: {
    flex: 1,
  },
  calendarButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderColor: '#D9EEE9',
    borderRadius: 18,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  textArea: {
    minHeight: 96,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  photoBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderColor: '#D9EEE9',
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    minHeight: 128,
    justifyContent: 'center',
  },
  photoBoxActive: {
    backgroundColor: '#E8FFF7',
  },
  photoText: {
    color: theme.colors.primaryDark,
    fontSize: 14,
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
    flexDirection: 'row',
    gap: 8,
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
  saveButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    minHeight: 58,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(18, 61, 67, 0.34)',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  calendarCard: {
    backgroundColor: theme.colors.surface,
    borderColor: 'rgba(255,255,255,0.82)',
    borderRadius: 28,
    borderWidth: 1,
    maxWidth: 380,
    padding: 18,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    width: '100%',
  },
  calendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  calendarTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    color: theme.colors.textLight,
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 7,
  },
  dayButton: {
    alignItems: 'center',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  dayButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  dayTextActive: {
    color: theme.colors.white,
    fontWeight: '900',
  },
  closeCalendarButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 18,
    marginTop: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  closeCalendarText: {
    color: theme.colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },
});
