import { Stack } from 'expo-router';

import { theme } from '@/scr/constants/theme';

export default function AcompanhamentoStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          color: theme.colors.text,
          fontWeight: '700',
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Acompanhamentos' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo registro' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar registro' }} />
    </Stack>
  );
}
