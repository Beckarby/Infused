import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCollectionStore } from '@/store/UseCollectionStore';
import { useRecipeStore } from '@/store/UseRecipeStore';

export default function CollectionScreen() {
  const params = useLocalSearchParams<{ collectionId?: string | string[] }>();
  const collectionId = useMemo(() => {
    const value = params.collectionId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.collectionId]);

  const collection = useCollectionStore((state) =>
    state.collections.find((c) => c.id === collectionId),
  );
  const collectionRecipeIds = useCollectionStore(
    (state) => state.collectionRecipes[collectionId ?? ''] ?? [],
  );
  const updateCollectionName = useCollectionStore((state) => state.updateCollectionName);
  const removeRecipeFromCollection = useCollectionStore(
    (state) => state.removeRecipeFromCollection,
  );
  const allRecipes = useRecipeStore((state) => state.recipes);

  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  const pageBackground = isDark ? Colors.dark.background : Colors.light.background;
  const cardBackground = isDark ? Colors.dark.tertiary : Colors.light.neutral;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const subtleTextColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const accentColor = isDark ? Colors.dark.tint : Colors.light.tint;
  const borderColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';
  const inputBackground = isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF';
  const recipeBackground = isDark ? 'rgba(217, 197, 178, 0.08)' : 'rgba(74, 55, 40, 0.06)';

  const [draftName, setDraftName] = useState(collection?.name ?? '');
  const [isEditingName, setIsEditingName] = useState(false);

  const visibleRecipes = useMemo(
    () => allRecipes.filter((recipe) => collectionRecipeIds.includes(recipe.id)),
    [allRecipes, collectionRecipeIds],
  );

  const beginEditName = () => {
    setDraftName(collection?.name ?? '');
    setIsEditingName(true);
  };

  const saveName = () => {
    const nextName = draftName.trim();
    if (nextName && collectionId) {
      updateCollectionName(collectionId, nextName);
    }
    setIsEditingName(false);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (!collectionId) return;
    removeRecipeFromCollection(collectionId, recipeId);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: pageBackground }]} contentContainerStyle={styles.content}>
      <AppHeader title="Collection" onReturnPress={() => router.back()} />
      <ThemedView style={[styles.card, { backgroundColor: cardBackground, borderColor }]}> 
        <View style={styles.titleRow}>
          {isEditingName ? (
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              style={[
                styles.nameInput,
                {
                  color: textColor,
                  backgroundColor: inputBackground,
                  borderColor,
                },
              ]}
              autoFocus
              placeholder="Collection name"
              placeholderTextColor={subtleTextColor}
              returnKeyType="done"
              onSubmitEditing={saveName}
            />
          ) : (
            <ThemedText type="title" style={[styles.collectionName, { color: textColor }]}> 
              {collection?.name}
            </ThemedText>
          )}

          {!isEditingName ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit collection name"
              onPress={beginEditName}
              style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
              <IconSymbol name="pencil" size={18} color={accentColor} />
            </Pressable>
          ) : null}
        </View>

        {isEditingName ? (
          <Pressable
            accessibilityRole="button"
            onPress={saveName}
            style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}>
            <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
              Save
            </ThemedText>
          </Pressable>
        ) : null}

        <ThemedText style={[styles.helperText, { color: subtleTextColor }]}>Tap the pencil to rename this collection.</ThemedText>
        <ThemedText style={[styles.metaText, { color: subtleTextColor }]}>Collection {collectionId}</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.cardRecipes]}> 
        <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>Recipes</ThemedText>

        <View style={styles.recipeList}>
          {visibleRecipes.length > 0 ? (
            visibleRecipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                accessibilityRole="button"
                onPress={() => router.push(`/recipes/${recipe.id}`)}
                style={({ pressed }) => [
                  styles.recipeItem,
                  { borderColor, backgroundColor: recipeBackground },
                  pressed && styles.recipeItemPressed,
                ]}>
                <ThemedText type="defaultSemiBold" style={[styles.recipeName, { color: textColor }]}> 
                  {recipe.name}
                </ThemedText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${recipe.name}`}
                  onPress={(event) => {
                    event.stopPropagation();
                    Alert.alert('Delete recipe', `Remove ${recipe.name} from this collection?`, [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => handleDeleteRecipe(recipe.id),
                      },
                    ]);
                  }}
                  style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
                  <IconSymbol name="trash" size={18} color={accentColor} />
                </Pressable>
              </Pressable>
            ))
          ) : (
            <ThemedView style={[styles.emptyState, { backgroundColor: recipeBackground, borderColor }]}> 
              <ThemedText style={[styles.emptyStateText, { color: subtleTextColor }]}>No recipes saved in this collection yet.</ThemedText>
            </ThemedView>
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    gap: 14,
    borderWidth: 1,
  },
  cardRecipes: {
    borderRadius: 24,
    padding: 15,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  collectionName: {
    flex: 1,
    fontFamily: Fonts.headline,
    fontStyle: 'italic',
  },
  nameInput: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.body,
    fontSize: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#540212',
  },
  saveButtonText: {
    color: Colors.light.background,
    fontFamily: Fonts.label,
  },
  helperText: {
    lineHeight: 20,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.8,
  },
  sectionTitle: {
    fontFamily: Fonts.label,
    fontSize: 18,
  },
  recipeList: {
    gap: 10,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  recipeItemPressed: {
    opacity: 0.85,
  },
  recipeName: {
    flex: 1,
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  emptyStateText: {
    lineHeight: 22,
  },
  backButton: {
    alignSelf: 'center',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#540212',
  },
  backButtonText: {
    color: Colors.light.background,
    fontFamily: Fonts.label,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});