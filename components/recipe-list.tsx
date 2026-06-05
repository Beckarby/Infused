import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type RecipeListItem = {
  id: string;
  name: string;
  creatorName: string;
  difficulty: string;
  image?: ImageSourcePropType;
};

type RecipeListProps = {
  recipes: RecipeListItem[];
  onRecipePress?: (recipe: RecipeListItem) => void;
};

export function RecipeList({ recipes, onRecipePress }: RecipeListProps) {
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';
  const cardBackground = isDark ? Colors.dark.neutral : Colors.light.neutral;
  const borderColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const subtleTextColor = isDark ? Colors.dark.primary : Colors.light.primary;

  return (
    <View style={styles.list}>
      {recipes.map((recipe) => {
        const Card = onRecipePress ? Pressable : View;

        return (
          <Card
            key={recipe.id}
            accessibilityRole={onRecipePress ? 'button' : undefined}
            onPress={onRecipePress ? () => onRecipePress(recipe) : undefined}
            style={({ pressed }: { pressed?: boolean }) =>
              [styles.card, pressed && onRecipePress ? styles.cardPressed : null] as const
            }>
            <ThemedView style={[styles.cardInner, { backgroundColor: cardBackground, borderColor }]}> 
              <View style={styles.cardBody}>
                <ThemedText type="subtitle" style={[styles.recipeName, { color: textColor }]}> 
                  {recipe.name}
                </ThemedText>

                <View style={styles.metaRow}>
                  <ThemedText style={[styles.metaLabel, { color: subtleTextColor }]}>Creator</ThemedText>
                  <ThemedText type="defaultSemiBold" style={[styles.metaValue, { color: textColor }]}> 
                    {recipe.creatorName}
                  </ThemedText>
                </View>

                <View style={styles.metaRow}>
                  <ThemedText style={[styles.metaLabel, { color: subtleTextColor }]}>Difficulty</ThemedText>
                  <ThemedText type="defaultSemiBold" style={[styles.metaValue, { color: textColor }]}> 
                    {recipe.difficulty}
                  </ThemedText>
                </View>
              </View>

              {recipe.image ? (
                <Image source={recipe.image} style={styles.thumbnail} />
              ) : null}
            </ThemedView>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 22,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardInner: {
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardBody: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  thumbnail: {
    width: 165,
    height: 165,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
  },
  recipeName: {
    fontFamily: Fonts.headline,
    fontStyle: 'italic',
  },
  metaRow: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: Fonts.label,
  },
  metaValue: {
    fontSize: 16,
  },
});