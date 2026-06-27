import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import JellyfishScene from '@/src/components/JellyfishScene';
import { theme } from '@/src/constants/theme';

const sinais = [
  {
    icon: 'photo-camera',
    title: 'Foto diária',
    body: 'Tente registrar sempre no mesmo horário e com iluminação parecida.',
  },
  {
    icon: 'warning',
    title: 'Sinais de atenção',
    body: 'Dor alta, odor, secreção ou vermelhidão intensa pedem revisão do registro.',
  },
  {
    icon: 'timeline',
    title: 'Evolução',
    body: 'Compare os registros pelo histórico para perceber mudanças graduais.',
  },
  {
    icon: 'event-available',
    title: 'Retorno',
    body: 'Use a data de retorno para manter o acompanhamento conectado ao cuidado profissional.',
  },
] as const;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.kicker}>Guia Cicatria</Text>
          <Text style={styles.title}>Observe com calma</Text>
          <Text style={styles.subtitle}>
            Pequenos sinais ajudam a contar a historia da recuperacao.
          </Text>
        </View>

        <View style={styles.grid}>
          {sinais.map((sinal) => (
            <View key={sinal.title} style={styles.card}>
              <View style={styles.iconBubble}>
                <MaterialIcons name={sinal.icon} size={23} color={theme.colors.primary} />
              </View>
              <Text style={styles.cardTitle}>{sinal.title}</Text>
              <Text style={styles.cardBody}>{sinal.body}</Text>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <MaterialIcons name="health-and-safety" size={22} color={theme.colors.primary} />
          <Text style={styles.noteText}>
            O app organiza registros, mas não substitui avaliação de um profissional de saúde.
          </Text>
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
  hero: {
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    marginBottom: 16,
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
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: 'rgba(255,255,255,0.78)',
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundBlue,
    borderRadius: 19,
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
    width: 48,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  cardBody: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 6,
  },
  note: {
    alignItems: 'center',
    backgroundColor: '#E8FFF7',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    padding: 15,
  },
  noteText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
});
