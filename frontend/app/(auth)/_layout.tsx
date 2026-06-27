import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function AuthLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="recuperar_senha" />
    </Stack>
  );
}
