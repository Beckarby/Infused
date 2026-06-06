import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';

export type CollectionItem = {
  id: string;
  name: string;
};

type CollectionsListProps = {
  collections?: CollectionItem[];
  onCreateCollection?: () => void;
  onCollectionPress?: (collection: CollectionItem) => void;
  onDeleteCollection?: (collection: CollectionItem) => void;
};

export function CollectionsList({
  collections = [],
  onCreateCollection,
  onCollectionPress,
  onDeleteCollection,
}: CollectionsListProps) {
  const hasCollections = collections.length > 0;

  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';
  const borderColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="subtitle" style={styles.title}>
          Collections
        </ThemedText>

        {hasCollections ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create a new collection"
            onPress={onCreateCollection}
            style={({ pressed }) => [styles.plusButton, pressed && styles.createButtonPressed]}>
            <ThemedText type="defaultSemiBold" style={styles.plusButtonText}>
              +
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {hasCollections ? (
          collections.map((collection, index) => (
            <ThemedView
              key={collection.id || `collection-${index}`}
              style={[styles.collectionCard, { borderColor }]}
              lightColor={Colors.light.neutral}
              darkColor={Colors.dark.neutral}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onCollectionPress?.(collection)}
                style={({ pressed }) => [styles.collectionCardInner, pressed && styles.collectionCardPressed]}>
                <ThemedView style={styles.collectionCardContent}>
                  <ThemedText type="defaultSemiBold" style={styles.collectionName}>
                    {collection.name}
                  </ThemedText>
                </ThemedView>
              </Pressable>

              {onDeleteCollection ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${collection.name}`}
                  onPress={() => onDeleteCollection(collection)}
                  style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}>
                  <IconSymbol name="trash" size={18} color={isDark ? Colors.dark.primary : Colors.light.primary} />
                </Pressable>
              ) : null}
            </ThemedView>
          ))
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={onCreateCollection}
            style={({ pressed }) => [styles.emptyButton, pressed && styles.createButtonPressed]}>
            <ThemedText type="defaultSemiBold" style={styles.createButtonText}>
              Create one
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  createButton: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#540212',
  },
  emptyButton: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#540212',
  },
  createButtonPressed: {
    opacity: 0.85,
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#540212',
  },
  plusButtonText: {
    color: Colors.light.background,
    fontFamily: Fonts.headline,
    fontSize: 22,
    lineHeight: 24,
  },
  createButtonText: {
    color: Colors.light.background,
    fontFamily: Fonts.label,
  },
  list: {
    gap: 10,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    padding: 4,
  },
  collectionCardInner: {
    flex: 1,
    borderRadius: 18,
  },
  collectionCardPressed: {
    opacity: 0.85,
  },
  collectionCardContent: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonPressed: {
    opacity: 0.75,
  },
  collectionName: {
    fontFamily: Fonts.body,
  },
});