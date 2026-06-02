import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export type TimelineStep = {
  number: number;
  title: string;
  subtitle: string;
};

type RecipeTimelineProps = {
  steps: TimelineStep[];
  currentStep: number;
  onStepPress?: (step: number) => void;
};

export function RecipeTimeline({ steps, currentStep, onStepPress }: RecipeTimelineProps) {
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  const activeColor = isDark ? Colors.dark.tertiary : Colors.light.tertiary;
  const inactiveColor = isDark ? Colors.dark.icon : Colors.light.icon;
  const lineColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <View key={step.number} style={styles.stepWrap}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Go to ${step.title}`}
              onPress={() => onStepPress?.(step.number)}
              style={({ pressed }) => [styles.stepButton, pressed && styles.stepPressed]}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: isActive ? activeColor : 'transparent',
                    borderColor: isActive || isCompleted ? activeColor : inactiveColor,
                  },
                ]}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[
                    styles.stepNumber,
                    {
                      color: isActive ? Colors.light.background : isDark ? Colors.dark.text : Colors.light.text,
                    },
                  ]}>
                  {step.number}
                </ThemedText>
              </View>

              <View style={styles.stepTextBlock}>
                <ThemedText type="defaultSemiBold" style={[styles.stepTitle, { color: textColor }]}> 
                  {step.title}
                </ThemedText>
                <ThemedText style={[styles.stepSubtitle, { color: isDark ? Colors.dark.primary : Colors.light.primary }]}> 
                  {step.subtitle}
                </ThemedText>
              </View>
            </Pressable>

            {index < steps.length - 1 ? <View style={[styles.connector, { backgroundColor: lineColor }]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  stepWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepButton: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: Fonts.label,
    fontSize: 15,
  },
  stepTextBlock: {
    alignItems: 'center',
    gap: 2,
  },
  stepTitle: {
    fontFamily: Fonts.label,
    fontSize: 13,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  connector: {
    width: 1,
    alignSelf: 'stretch',
    borderRadius: 999,
  },
  stepPressed: {
    opacity: 0.8,
  },
});