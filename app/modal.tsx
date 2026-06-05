import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCollectionStore } from '@/store/UseCollectionStore';

export default function ModalScreen() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const addCollection = useCollectionStore((state) => state.addCollection);
  const [collectionName, setCollectionName] = useState('');
  const [error, setError] = useState('');

  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  const isCollectionMode = mode === 'create-collection';

  const handleNameChange = (text: string) => {
    setCollectionName(text);
    if (error) setError('');
  };

  const handleCreate = () => {
    if (!collectionName.trim()) {
      setError('Collection name is required');
      return;
    }
    addCollection(collectionName);
    router.back();
  };

  const cardBg = isDark ? Colors.dark.neutral : Colors.light.neutral;
  const inputBg = isDark ? Colors.dark.neutral : Colors.light.neutral;
  const inputTextColor = isDark ? Colors.dark.text : Colors.light.text;
  const placeholderColor = isDark ? 'rgba(249, 247, 242, 0.4)' : 'rgba(74, 55, 40, 0.5)';
  const borderColor = isDark ? 'rgba(249, 247, 242, 0.14)' : 'rgba(74, 55, 40, 0.14)';
  const btnBg = isDark ? Colors.dark.primary : Colors.light.primary;
  const btnText = isDark ? Colors.dark.background : Colors.light.background;

  return (
    <ThemedView style={styles.container}>
      <AppHeader title={'New collection'} onReturnPress={() => router.back()} />

      {isCollectionMode ? (
        <ThemedView style={[styles.card, { backgroundColor: cardBg, borderWidth: 1, borderColor }]}>
          <ThemedText style={styles.label}>Collection name</ThemedText>
          <TextInput
            value={collectionName}
            onChangeText={handleNameChange}
            placeholder="Summer Cocktails"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { backgroundColor: inputBg, color: inputTextColor, borderColor: error ? '#D32F2F' : borderColor }]}
          />
          {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleCreate}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: btnBg }, pressed && styles.pressed]}>
            <ThemedText type="defaultSemiBold" style={[styles.primaryButtonText, { color: btnText }]}>Create collection</ThemedText>
          </Pressable>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  card: {
    gap: 14,
    borderRadius: 24,
    padding: 18,
  },
  label: {
    fontFamily: Fonts.label,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.body,
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts.label,
  },
  errorText: {
    color: '#D32F2F',
    fontFamily: Fonts.label,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.85,
  },
});
