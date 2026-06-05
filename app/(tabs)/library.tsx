import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRecipeStore } from '@/store/UseRecipeStore';

export default function LibraryScreen() {
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  const recipes = useRecipeStore((state) => state.recipes);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);

  const pageBackground = isDark ? Colors.dark.background : Colors.light.background;
  const cardBackground = isDark ? Colors.dark.neutral : Colors.light.neutral;
  const mutedBackground = isDark ? Colors.dark.tertiary : Colors.light.tertiary;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const subtleTextColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const borderColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';

  return (
    <ScrollView style={[styles.container, { backgroundColor: pageBackground }]} contentContainerStyle={styles.content}>

      <ThemedView style={[styles.introCard, { backgroundColor: cardBackground, borderColor }]}> 
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>My Recipes</ThemedText>
        <ThemedText style={[styles.description, { color: subtleTextColor }]}>Manage every recipe you own. Open a recipe, edit it, or delete it from your library.</ThemedText>
      </ThemedView>

      <View style={styles.list}>
        {recipes.map((recipe) => (
          <ThemedView key={recipe.id} style={[styles.card, { backgroundColor: cardBackground, borderColor }]}> 
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/recipes/${recipe.id}`)}
              style={({ pressed }) => [styles.cardBody, pressed && styles.pressed]}>
              <ThemedText type="subtitle" style={[styles.recipeName, { color: textColor }]}>{recipe.name}</ThemedText>
              <ThemedText style={[styles.meta, { color: subtleTextColor }]}>by {recipe.creatorName}</ThemedText>
              <ThemedText style={[styles.meta, { color: subtleTextColor }]}>{recipe.difficulty} · {recipe.cookingTime} · {recipe.servings} servings</ThemedText>
              <ThemedText style={[styles.summary, { color: textColor }]} numberOfLines={2}>{recipe.description}</ThemedText>
            </Pressable>

            <View style={styles.buttonRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/createRecipe', params: { id: recipe.id } })}
                style={({ pressed }) => [styles.editButton, { borderColor }, pressed && styles.pressed]}>
                <ThemedText type="defaultSemiBold" style={[styles.buttonText, { color: textColor }]}>Edit</ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Delete ${recipe.name}`}
                onPress={() => {
                  Alert.alert('Delete recipe', `Delete ${recipe.name} from your library?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => deleteRecipe(recipe.id),
                    },
                  ]);
                }}
                style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
                <ThemedText type="defaultSemiBold" style={styles.deleteButtonText}>Delete</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
    paddingTop: 30,
  },
  introCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    gap: 8,
  },
  title: {
    fontFamily: Fonts.headline,
    fontStyle: 'italic',
  },
  description: {
    lineHeight: 22,
  },
  list: {
    marginTop: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardBody: {
    padding: 16,
    gap: 6,
  },
  recipeName: {
    fontFamily: Fonts.headline,
    fontStyle: 'italic',
  },
  meta: {
    fontSize: 13,
  },
  summary: {
    lineHeight: 22,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  editButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#540212',
  },
  buttonText: {
    fontFamily: Fonts.label,
  },
  deleteButtonText: {
    color: Colors.light.background,
    fontFamily: Fonts.label,
  },
  pressed: {
    opacity: 0.85,
  },
});