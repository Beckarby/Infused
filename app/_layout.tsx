import 'react-native-reanimated';

import { ThemeProvider, type Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


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
      <Stack screenOptions={{ animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{  headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="profile-edit" options={{ headerShown: false, gestureEnabled: true }} />
        <Stack.Screen name="collections/[collectionId]" options={{ headerShown: false, gestureEnabled: true }} />
        <Stack.Screen name="recipes/[id]" options={{ headerShown: false, gestureEnabled: true }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
