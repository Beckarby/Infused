import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { AppHeader } from '@/components/app-header';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { RecipeList } from '@/components/recipe-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useRecipeStore } from '@/store/UseRecipeStore';

export default function HomeScreen() {
  const recipes = useRecipeStore((state) => state.recipes);
  const sortedRecipes = useMemo(
    () => [...recipes].sort((a, b) => a.name.localeCompare(b.name)),
    [recipes],
  );

  return (
    <ParallaxScrollView>
      <AppHeader title="Infused" />
      <ThemedView style={styles.titleContainer  }>
        <ThemedText 
          type="title"
          lightColor={Colors.light.primary}
          darkColor={Colors.dark.primary}
          style={styles.title}
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
          recipes={sortedRecipes}
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
    gap: 5,
    marginBottom: 10,
  },
  stepContainer: {
    gap: 15,
    marginBottom: 15,
  },
  title: {
    fontStyle: 'italic',
    alignItems: 'center',
    paddingLeft: 16,
  },
});
