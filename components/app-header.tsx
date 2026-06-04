import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

type AppHeaderProps = {
  title?: string;
  onReturnPress?: () => void;
};

export function AppHeader({ title = 'Infused', onReturnPress }: AppHeaderProps) {
  const borderColor = useThemeColor({}, 'secondary');
  const iconColor = useThemeColor({}, 'icon');

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
        <IconSymbol name="chevron.left" size={28} color={iconColor} />
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
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnButton: {
    minWidth: 100,
    paddingVertical: 7,
  },
  returnButtonPressed: {
    opacity: 0.75,
  },
  returnButtonDisabled: {
    opacity: 0.6,
  },
  returnButtonPlaceholder: {
    width: 100,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontStyle: 'italic',
    // fontWeight: '600',
  },
  sideSpacer: {
    width: 100,
  },
});
