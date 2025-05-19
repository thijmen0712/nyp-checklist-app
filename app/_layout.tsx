import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

function SplashScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111d16' }}>
      <StatusBar style="light" />
      <Image
        source={require('./logo.png')}
        style={{ width: 400, height: 120 }}
        accessibilityLabel="Logo"
      />
      <Text style={{ color: 'white', fontSize: 24, marginTop: 32 }}>Welkom thijmen!</Text>
    </GestureHandlerRootView>
  );
}


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Na 2 seconden de splash verbergen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
