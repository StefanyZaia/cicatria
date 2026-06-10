import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AcompanhamentoProvider } from '@/scr/contexts/AcompanhamentoContext';
import { useAuth } from '@/scr/contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isBootstrapping } = useAuth();
  const palette = Colors[colorScheme ?? 'light'];

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
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
            borderTopColor: palette.border,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            href: '/(tabs)',
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="acompanhamento"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="produtos"
          options={{
            title: 'Produtos',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="configuracoes"
          options={{
            title: 'Configuracoes',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
          }}
        />
      </Tabs>
    </AcompanhamentoProvider>
  );
}
