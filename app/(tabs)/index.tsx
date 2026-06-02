import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppHeader } from '@/components/app-header';
import { Colors } from '@/constants/theme';
import { RecipeList } from '@/components/recipe-list';

const RECIPES = [
  { id: '1', name: 'Negroni', creatorName: 'Jane Doe', difficulty: 'Medium' },
  { id: '2', name: 'Espresso Martini', creatorName: 'Alex Stone', difficulty: 'Hard' },
  { id: '3', name: 'Aperol Spritz', creatorName: 'Maria Lopez', difficulty: 'Easy' },
  { id: '4', name: 'Margarita', creatorName: 'Taylor Reed', difficulty: 'Medium' },
];

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
      <ThemedView style={styles.stepContainer}>
        <RecipeList recipes={RECIPES} />
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
