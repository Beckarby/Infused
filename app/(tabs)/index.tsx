import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppHeader } from '@/components/app-header';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { RecipeList } from '@/components/recipe-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MOCK_RECIPES } from '@/constants/mock-recipes';
import { Colors } from '@/constants/theme';

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
        <RecipeList
          recipes={MOCK_RECIPES}
          onRecipePress={(recipe) => {
            router.push(`/recipes/${recipe.id}`);
          }}
        />
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
