import { Platform, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppHeader } from '@/components/app-header';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  return (
    <ParallaxScrollView>
      <AppHeader title="Infused" />
      <ThemedView style={styles.titleContainer  }>
        <ThemedText 
          type="title"
          lightColor={Colors.light.primary}
          darkColor={Colors.dark.primary}
          >
            Find your
          </ThemedText>
        <ThemedText type="title" 
          style={styles.title}
          lightColor={Colors.light.primary}
          darkColor={Colors.dark.primary}
          >
            Newest Pour
        </ThemedText>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  stepContainer: {
    gap: 15,
    marginBottom: 15,
  },
  title: {
    fontStyle: 'italic',

  },
});
