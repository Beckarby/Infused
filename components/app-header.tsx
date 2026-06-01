import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type AppHeaderProps = {
  title?: string;
  onReturnPress?: () => void;
};

export function AppHeader({ title = 'Infused', onReturnPress }: AppHeaderProps) {
  const borderColor = useThemeColor({}, 'secondary');

  return (
    <ThemedView style={[styles.container, { borderBottomColor: borderColor }]}>
      {onReturnPress ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Return"
        onPress={onReturnPress}
        style={({ pressed }) => [
          styles.returnButton,
          pressed && styles.returnButtonPressed,
        ]}>
        <ThemedText type="defaultSemiBold">← Return</ThemedText>
      </Pressable>
      ) : (
        <View style={styles.returnButtonPlaceholder} />
      )}

      <ThemedText
        type="subtitle"
        lightColor={Colors.light.primary}
        darkColor={Colors.dark.primary}
        style={styles.title}>
        {title}
      </ThemedText>
      <View style={styles.sideSpacer} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnButton: {
    minWidth: 96,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  returnButtonPressed: {
    opacity: 0.75,
  },
  returnButtonDisabled: {
    opacity: 0.6,
  },
  returnButtonPlaceholder: {
    width: 96,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontStyle: 'italic',
    // fontWeight: '600',
  },
  sideSpacer: {
    width: 96,
  },
});
