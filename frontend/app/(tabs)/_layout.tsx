import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AcompanhamentoProvider } from '@/src/contexts/AcompanhamentoContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { theme } from '@/src/constants/theme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isBootstrapping } = useAuth();
  const palette = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];
  const tabBottom = Math.max(insets.bottom, 12);

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <AcompanhamentoProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.tabIconSelected,
          tabBarInactiveTintColor: palette.tabIconDefault,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: palette.card,
            borderColor: 'rgba(255,255,255,0.82)',
            borderRadius: 26,
            borderTopColor: palette.border,
            borderWidth: 1,
            bottom: tabBottom,
            elevation: 12,
            height: 68,
            marginHorizontal: 10,
            paddingBottom: 9,
            paddingTop: 8,
            position: 'absolute',
            shadowColor: theme.colors.primaryDark,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 18,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            href: '/(tabs)',
            title: 'Home',
            tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Guia',
            tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="drop.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="acompanhamento"
          listeners={({ navigation }) => ({
            tabPress: () => {
              navigation.navigate('acompanhamento', { screen: 'index' });
            },
          })}
          options={{
            href: '/(tabs)/acompanhamento',
            title: 'Acompanhamentos',
            tabBarIcon: ({ color }: { color: string }) => (
              <IconSymbol size={28} name="list.bullet.clipboard.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="novo-registro"
          options={{
            title: 'Novo',
            tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }: { color: string }) => (
              <IconSymbol size={28} name="person.crop.circle.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </AcompanhamentoProvider>
  );
}
