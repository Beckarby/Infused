import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProfileStore } from '@/store/UseProfileStore';

export default function ProfileEditScreen() {
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';
  const name = useProfileStore((state) => state.name);
  const handle = useProfileStore((state) => state.handle);
  const description = useProfileStore((state) => state.description);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [draftName, setDraftName] = useState(name);
  const [draftHandle, setDraftHandle] = useState(handle);
  const [draftDescription, setDraftDescription] = useState(description);

  const pageBackground = isDark ? Colors.dark.background : Colors.light.background;
  const cardBackground = isDark ? Colors.dark.neutral : Colors.light.neutral;
  const fieldBackground = isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const subtleTextColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const borderColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';

  useEffect(() => {
    setDraftName(name);
    setDraftHandle(handle);
    setDraftDescription(description);
  }, [name, handle, description]);

  const saveProfile = () => {
    updateProfile({
      name: draftName.trim() || name,
      handle: draftHandle.trim() || handle,
      description: draftDescription.trim() || description,
    });

    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: pageBackground }]} contentContainerStyle={styles.content}>
      <AppHeader title="Edit profile" onReturnPress={() => router.back()} />

      <ThemedView style={[styles.card, { backgroundColor: cardBackground, borderColor }]}> 
        <View style={styles.fieldGroup}>
          <ThemedText style={[styles.label, { color: subtleTextColor }]}>Name</ThemedText>
          <TextInput
            value={draftName}
            onChangeText={setDraftName}
            placeholder="Jane Doe"
            placeholderTextColor={subtleTextColor}
            style={[styles.input, { backgroundColor: fieldBackground, borderColor, color: textColor }]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={[styles.label, { color: subtleTextColor }]}>Handle</ThemedText>
          <TextInput
            value={draftHandle}
            onChangeText={setDraftHandle}
            placeholder="@janedoe"
            placeholderTextColor={subtleTextColor}
            style={[styles.input, { backgroundColor: fieldBackground, borderColor, color: textColor }]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText style={[styles.label, { color: subtleTextColor }]}>Description</ThemedText>
          <TextInput
            value={draftDescription}
            onChangeText={setDraftDescription}
            placeholder="Bartender and Professional Mixer"
            placeholderTextColor={subtleTextColor}
            multiline
            textAlignVertical="top"
            style={[styles.textArea, { backgroundColor: fieldBackground, borderColor, color: textColor }]}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={saveProfile}
          style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
          <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
            Save changes
          </ThemedText>
        </Pressable>
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
    paddingBottom: 24,
  },
  card: {
    margin: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 16,
  },
  fieldGroup: {
    gap: 15,
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
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.body,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#540212',
  },
  saveButtonText: {
    color: Colors.light.background,
    fontFamily: Fonts.label,
  },
  pressed: {
    opacity: 0.85,
  },
});