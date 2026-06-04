import { ThemeProvider, type Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const navigationTheme: Theme = {
    dark: colorScheme === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.neutral,
      text: colors.text,
      border: colors.secondary,
      notification: colors.secondary,
    },
    fonts: {
      regular: {
        fontFamily: 'Manrope',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'Manrope',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'Manrope',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: 'Manrope',
        fontWeight: '800',
      },
    },
  };

  const [fontsLoaded] = useFonts({
    'EB Garamond': require('../assets/fonts/EB_Garamond/static/EBGaramond-Regular.ttf'),
    'Manrope': require('../assets/fonts/Manrope/static/Manrope-Regular.ttf'),
  })

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="collections/[collectionId]" options={{ headerShown: false }} />
        <Stack.Screen name="recipes/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
