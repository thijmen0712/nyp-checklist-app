import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            height: 100,            // maak de tabbar hoger
            backgroundColor: '#111d16',
            borderTopColor: '#a9a9a9',
            borderTopWidth: 1,
            paddingTop: 20
          },
          default: {
            backgroundColor: '#111d16',
            borderTopColor: '#a9a9a9',
            borderTopWidth: 1,
            paddingTop: 8,
          },
        }),

      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Openen',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="lock.open" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sluiten"
        options={{
          title: 'Sluiten',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="door.right.hand.closed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="kassa"
        options={{
          title: 'Kassa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notities"
        options={{
          title: 'Notities',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clipboard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pauze"
        options={{
          title: 'Pauze',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="pause.circle.fill" color={color} />,
        }}
      />
    </Tabs>


  );
}
