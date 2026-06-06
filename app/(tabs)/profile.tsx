import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';

import { CollectionsList } from '@/components/collections-list';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
// import { toProcessService } from '@/services/toProcess';
import { useAuthStore } from '@/store/UseAuthStore';
import { useCollectionStore } from '@/store/UseCollectionStore';
import { useProfileStore } from '@/store/UseProfileStore';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const name = useProfileStore((state) => state.name);
  const handle = useProfileStore((state) => state.handle);
  const description = useProfileStore((state) => state.description);
  // const resetProfile = useProfileStore((state) => state.resetProfile);
  const collections = useCollectionStore((state) => state.collections);
  const deleteCollection = useCollectionStore((state) => state.deleteCollection);
  // const resetCollections = useCollectionStore((state) => state.resetCollections);
  const fetchCollections = useCollectionStore((state) => state.fetchCollections);

  // const [recipeCount, setRecipeCount] = useState<number | null>(null);
  // const [followerCount, setFollowerCount] = useState<number | null>(null);

  useEffect(() => {
    fetchCollections();
    // async function fetchStats() {
    //   try {
    //     const [recipesRes, followersRes] = await Promise.all([
    //       toProcessService.getAllRecipesOfUser(),
    //       toProcessService.getFollowers([{}]),
    //     ]);
    //     if (recipesRes?.length !== undefined) setRecipeCount(recipesRes.length);
    //     if (followersRes?.length !== undefined) setFollowerCount(followersRes.length);
    //   } catch {
    //     // API not available yet
    //   }
    // }
    // fetchStats();
  }, [fetchCollections]);

  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;

  return (
    <ParallaxScrollView>

    <ThemedView style={styles.screen}>
      <ThemedView style={styles.headerCard} lightColor={Colors.light.secondary} darkColor={Colors.dark.tertiary}>
        <ThemedView style={styles.avatar} lightColor={Colors.light.neutral} darkColor={Colors.dark.neutral}>
          <ThemedText type="title" style={styles.avatarText}>
            {user
              ? `${user.users_first_name[0]}${user.users_last_name[0]}`.toUpperCase()
              : '?'}
          </ThemedText>
        </ThemedView>

        <View style={styles.nameRow}>
          <ThemedText type="title" style={styles.name}>
            {name}
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            onPress={() => router.push('/profile-edit')}
            style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}>
            <IconSymbol name="pencil" size={18} color={textColor} />
          </Pressable>
        </View>

        <ThemedText style={styles.handle}>{handle}</ThemedText>
        <ThemedText style={styles.italic}>
          "{description}"
        </ThemedText>
      </ThemedView>

      {/* <ThemedView style={styles.statsRow}>
        <ThemedView style={styles.statCard} lightColor={Colors.light.neutral} darkColor={Colors.dark.neutral}>
          <ThemedText type="title" style={styles.statValue}>
            {recipeCount ?? '...'}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Recipes</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard} lightColor={Colors.light.neutral} darkColor={Colors.dark.neutral}>
          <ThemedText type="title" style={styles.statValue}>
            {followerCount ?? '...'}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Followers</ThemedText>
        </ThemedView>
      </ThemedView> */}

      <ThemedView style={styles.section}>
        <CollectionsList
          collections={collections}
          onCollectionPress={(collection) => {
            router.push(`/collections/${collection.id}`);
          }}
          onDeleteCollection={(collection) => {
            Alert.alert(
              'Delete collection',
              `Delete ${collection.name} and all recipes saved inside it?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    deleteCollection(collection.id);
                  },
                },
              ],
            );
          }}
          onCreateCollection={() => {
            router.push('/modal?mode=create-collection');
          }}
        />
      </ThemedView>

      

      <ThemedView style={styles.footerSpacer} />

      <TouchableOpacity
        onPress={() => {
          logout();
          router.replace('/login');
        }}
        style={styles.logoutButton}
        activeOpacity={0.8}>
        <ThemedText type="defaultSemiBold" style={styles.logoutButtonText}>
          Log out
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 15,
    paddingBottom: 24,
    paddingTop: 30,
  },
  headerCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontFamily: Fonts.body,
  },
  name: {
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  handle: {
    opacity: 0.7,
  },
  bio: {
    textAlign: 'center',
    opacity: 0.85,
    lineHeight: 22,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontFamily: Fonts.headline,
  },
  statLabel: {
    opacity: 0.7,
  },
  section: {
    gap: 10,
  },
  footerSpacer: {
    flexGrow: 1,
    minHeight: 40,
  },
  sectionText: {
    lineHeight: 24,
    opacity: 0.85,
  },
  activityItem: {
    borderRadius: 18,
    padding: 16,
    gap: 4,
  },
  activityMeta: {
    opacity: 0.7,
    fontSize: 14,
  },
  italic: {
    fontStyle: 'italic',
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoutButton: {
    marginTop: 'auto',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#540212',
  },
  logoutButtonText: {
    color: Colors.light.background,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
