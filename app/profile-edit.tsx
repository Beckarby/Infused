import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/services/auth';
import { useProfileStore } from '@/store/UseProfileStore';
import { useCollectionStore } from '@/store/UseCollectionStore';
import { useAuthStore } from '@/store/UseAuthStore';

export default function ProfileEditScreen() {
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';
  const name = useProfileStore((state) => state.name);
  const handle = useProfileStore((state) => state.handle);
  const description = useProfileStore((state) => state.description);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const resetProfile = useProfileStore((state) => state.resetProfile);
  const resetCollections = useCollectionStore((state) => state.resetCollections);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

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

  const saveProfile = async () => {
    const newName = draftName.trim() || name;
    const newHandle = draftHandle.trim() || handle;
    const newDescription = draftDescription.trim() || description;

    updateProfile({
      name: newName,
      handle: newHandle,
      description: newDescription,
    });

    try {
      // update description (option 4)
      if (newDescription !== description) {
        await authService.updateUser(4, newDescription);
      }
      // update username (option 0) — strip @ prefix
      const newUsername = newHandle.replace('@', '');
      const oldUsername = handle.replace('@', '');
      if (newUsername !== oldUsername) {
        await authService.updateUser(0, newUsername);
      }
      // update first/last name from full name (option 2 / 3)
      const nameParts = newName.split(' ');
      const newFirstName = nameParts[0] || '';
      const newLastName = nameParts.slice(1).join(' ') || '';
      if (newFirstName !== (user?.users_first_name ?? '')) {
        await authService.updateUser(2, newFirstName);
      }
      if (newLastName !== (user?.users_last_name ?? '')) {
        await authService.updateUser(3, newLastName);
      }
    } catch {
      // local state already updated; API failure is non-blocking
    }

    router.back();
  };

  const deleteProfile = () => {
    Alert.alert('Delete profile', 'This will remove your profile data and sign you out. Do you want to continue?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              resetProfile();
              resetCollections();
              logout();
              router.replace('/login');
            },
          },
        ]);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete profile"
        onPress={deleteProfile}
        style={({ pressed }) => [styles.deleteProfileButton, pressed && styles.buttonPressed]}>
        <ThemedText type="defaultSemiBold" style={styles.deleteProfileButtonText}>
          Delete profile
        </ThemedText>
      </Pressable>
    </ScrollView>
    </KeyboardAvoidingView>
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
  deleteProfileButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#540212',
  },
  deleteProfileButtonText: {
    color: Colors.light.background,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});