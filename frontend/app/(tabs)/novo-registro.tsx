import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
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

export default function NovoRegistroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { acompanhamentos, adicionarRegistro } = useAcompanhamentos();
  const acompanhamentoInicial = useMemo(() => {
    const acId = (route.params as any)?.acompanhamentoId as string | undefined;
    return acompanhamentos.find((item) => item.id === acId)?.id ?? acompanhamentos[0]?.id ?? '';
  }, [acompanhamentos, route.params]);
  const [acompanhamentoId, setAcompanhamentoId] = useState(acompanhamentoInicial);
  const [fotoSelecionada, setFotoSelecionada] = useState(false);
  const [dor, setDor] = useState(3);
  const [vermelhidao, setVermelhidao] = useState<Registro['vermelhidao']>('sem');
  const [temSecrecao, setTemSecrecao] = useState(false);
  const [temOdor, setTemOdor] = useState(false);
  const [observacao, setObservacao] = useState('');

  const salvar = () => {
    if (!acompanhamentoId) {
      Alert.alert('Nenhum acompanhamento', 'Crie um acompanhamento antes de adicionar registros.');
      return;
    }

    adicionarRegistro({
      acompanhamentoId,
      fotoUri: fotoSelecionada ? 'foto-local-demo' : undefined,
      dor,
      vermelhidao,
      temSecrecao,
      temOdor,
      observacao,
    });

    Alert.alert('Registro salvo', 'O novo registro foi adicionado ao histórico.');
    router.replace(`/(tabs)/acompanhamento/${acompanhamentoId}`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 118, 142), paddingTop: insets.top + 18 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.kicker}>Registro diário</Text>
          <Text style={styles.title}>Novo registro</Text>
          <Text style={styles.subtitle}>Adicione foto, dor e sintomas percebidos hoje.</Text>
        </View>

        <TouchableOpacity
          style={styles.newFollowButton}
          onPress={() => router.push('/(tabs)/acompanhamento/novo')}>
          <View style={styles.newFollowIcon}>
            <MaterialIcons name="playlist-add" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.newFollowTextWrap}>
            <Text style={styles.newFollowTitle}>Criar novo acompanhamento</Text>
            <Text style={styles.newFollowSubtitle}>Cadastre uma nova ferida ou paciente antes do registro.</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Acompanhamento</Text>
          <View style={styles.selectorList}>
            {acompanhamentos.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.selectorItem, acompanhamentoId === item.id && styles.selectorItemActive]}
                onPress={() => setAcompanhamentoId(item.id)}>
                <Text style={[styles.selectorText, acompanhamentoId === item.id && styles.selectorTextActive]}>
                  {item.titulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {acompanhamentos.length === 0 ? (
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/(tabs)/acompanhamento/novo')}>
              <Text style={styles.createButtonText}>Criar acompanhamento</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Foto</Text>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sintomas</Text>
          <Text style={styles.label}>Dor</Text>
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
            placeholder="Observações"
            placeholderTextColor={theme.colors.textLight}
            style={[styles.input, styles.textArea]}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={salvar}>
          <Text style={styles.saveButtonText}>Salvar registro</Text>
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
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    marginBottom: 14,
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
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 26,
    gap: 12,
    marginBottom: 14,
    padding: 18,
  },
  newFollowButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    padding: 14,
  },
  newFollowIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 18,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  newFollowTextWrap: {
    flex: 1,
  },
  newFollowTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  newFollowSubtitle: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  selectorList: {
    gap: 8,
  },
  selectorItem: {
    backgroundColor: theme.colors.surfaceTint,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectorItemActive: {
    backgroundColor: theme.colors.primary,
  },
  selectorText: {
    color: theme.colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },
  selectorTextActive: {
    color: theme.colors.white,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    minHeight: 48,
    justifyContent: 'center',
  },
  createButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  photoBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderColor: '#D9EEE9',
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    minHeight: 132,
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
    borderRadius: 24,
    minHeight: 58,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
});
