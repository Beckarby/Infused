import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { RecipeTimeline, type TimelineStep } from '@/components/recipe-timeline';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useRecipeStore } from '@/store/UseRecipeStore';

type EditableItem = {
  id: string;
  value: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    number: 1,
    title: 'Basic info',
    subtitle: 'Title, description and image',
  },
  {
    number: 2,
    title: 'Ingredients',
    subtitle: 'Ingredients and recipe steps',
  },
  // {
  //   number: 3,
  //   title: 'Details',
  //   subtitle: 'Time, difficulty and servings',
  // },
];

const initialIngredients: EditableItem[] = [
  { id: 'ingredient-1', value: '' },
];

const initialSteps: EditableItem[] = [
  { id: 'step-1', value: '' },
];

export default function CreateRecipeScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';
  const recipes = useRecipeStore((state) => state.recipes);
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const updateRecipe = useRecipeStore((state) => state.updateRecipe);

  const editingRecipeId = useMemo(() => {
    const value = params.id;
    return Array.isArray(value) ? value[0] : value;
  }, [params.id]);

  const editingRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === editingRecipeId),
    [editingRecipeId, recipes],
  );

  const pageBackground = isDark ? Colors.dark.background : Colors.light.background;
  const sectionBackground = isDark ? Colors.dark.neutral : Colors.light.neutral;
  const fieldBackground = isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const subtleTextColor = isDark ? Colors.dark.primary : Colors.light.primary;

  const [currentStep, setCurrentStep] = useState(1);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeImage, setRecipeImage] = useState<ImageSourcePropType | null>(null);
  const [recipeImageBase64, setRecipeImageBase64] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [recipeSteps, setRecipeSteps] = useState(initialSteps);
  const [stepError, setStepError] = useState('');

  const canGoBack = currentStep > 1;
  const canGoForward = currentStep < 2;

  const validateStep = (step: number): boolean => {
    setStepError('');
    if (step === 1 && !recipeTitle.trim()) {
      setStepError('Recipe title is required');
      return false;
    }
    if (step === 2) {
      const hasIngredient = ingredients.some((i) => i.value.trim());
      const hasStep = recipeSteps.some((s) => s.value.trim());
      if (!hasIngredient && !hasStep) {
        setStepError('Add at least one ingredient and one step');
        return false;
      }
      if (!hasIngredient) {
        setStepError('Add at least one ingredient');
        return false;
      }
      if (!hasStep) {
        setStepError('Add at least one step');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((value) => Math.min(3, value + 1));
  };
  const previousStep = () => setCurrentStep((value) => Math.max(1, value - 1));

  const updateIngredient = (id: string, value: string) => {
    setIngredients((currentIngredients) =>
      currentIngredients.map((ingredient) => (ingredient.id === id ? { ...ingredient, value } : ingredient)),
    );
  };

  const addIngredient = () => {
    setIngredients((currentIngredients) => [
      ...currentIngredients,
      { id: `ingredient-${currentIngredients.length + 1}`, value: '' },
    ]);
  };

  const updateStep = (id: string, value: string) => {
    setRecipeSteps((currentSteps) =>
      currentSteps.map((step) => (step.id === id ? { ...step, value } : step)),
    );
  };

  const addRecipeStep = () => {
    setRecipeSteps((currentSteps) => [
      ...currentSteps,
      { id: `step-${currentSteps.length + 1}`, value: '' },
    ]);
  };

  const pickRecipeImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    setRecipeImage({ uri: asset.uri });
    setRecipeImageBase64(asset.base64 ?? null);
  };

  const takeRecipeImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera permission is required to take a recipe photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    setRecipeImage({ uri: asset.uri });
    setRecipeImageBase64(asset.base64 ?? null);
  };

  const uploadRecipe = async () => {
    if (!validateStep(1) || !validateStep(2)) return;
    const imageBase64 = recipeImageBase64;
    const payload = {
      creatorName: editingRecipe?.creatorName ?? 'You',
      name: recipeTitle.trim(),
      description: recipeDescription.trim(),
      image: (imageBase64 ?? undefined) as unknown as ImageSourcePropType,
      ingredients: ingredients.map((ingredient) => ingredient.value).filter(Boolean),
      steps: recipeSteps.map((step) => step.value).filter(Boolean),
    };

    if (editingRecipe) {
      await updateRecipe(editingRecipe.id, payload);
    } else {
      await addRecipe(payload);
    }

    resetForm();
    router.back();
  };

  const resetForm = () => {
    setRecipeTitle('');
    setRecipeDescription('');
    setRecipeImage(null);
    setRecipeImageBase64(null);
    setIngredients(initialIngredients);
    setRecipeSteps(initialSteps);
    setCurrentStep(1);
    setStepError('');
  };

  const titleMaxLength = useMemo(() => 40, []);
  const populatedForId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (editingRecipe && populatedForId.current !== editingRecipeId) {
      setRecipeTitle(editingRecipe.name);
      setRecipeDescription(editingRecipe.description);
      setRecipeImage(editingRecipe.image ?? null);
      setRecipeImageBase64(null);
      setIngredients(
        editingRecipe.ingredients.map((value, index) => ({
          id: `ingredient-${index + 1}`,
          value,
        })),
      );
      setRecipeSteps(
        editingRecipe.steps.map((value, index) => ({
          id: `step-${index + 1}`,
          value,
        })),
      );
      setCurrentStep(1);
      populatedForId.current = editingRecipeId;
      setStepError('');
      return;
    }

    if (!editingRecipeId) {
      populatedForId.current = undefined;
      resetForm();
    }
  }, [editingRecipeId, editingRecipe]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
    <ScrollView style={[styles.container, { backgroundColor: pageBackground }]} contentContainerStyle={styles.content}>

      <ThemedView style={[styles.timelineCard, { backgroundColor: sectionBackground, borderColor }]}> 
        <RecipeTimeline steps={TIMELINE_STEPS} currentStep={currentStep} onStepPress={setCurrentStep} />
      </ThemedView>

      {currentStep === 1 ? (
        <ThemedView style={[styles.card, { backgroundColor: sectionBackground, borderColor }]}> 

          <View style={styles.fieldGroup}>
            <ThemedText style={[styles.fieldLabel, { color: subtleTextColor }]}>Recipe title</ThemedText>
            <TextInput
              value={recipeTitle}
              onChangeText={(text) => {
                setRecipeTitle(text);
                if (stepError) setStepError('');
              }}
              maxLength={titleMaxLength}
              placeholder="Enter recipe title"
              placeholderTextColor={subtleTextColor}
              style={[
                styles.input,
                {
                  backgroundColor: fieldBackground,
                  borderColor,
                  color: textColor,
                },
              ]}
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={[styles.fieldLabel, { color: subtleTextColor }]}>Recipe description</ThemedText>
            <TextInput
              value={recipeDescription}
              onChangeText={setRecipeDescription}
              placeholder="Write a short description"
              placeholderTextColor={subtleTextColor}
              multiline
              textAlignVertical="top"
              style={[
                styles.textArea,
                {
                  backgroundColor: fieldBackground,
                  borderColor,
                  color: textColor,
                },
              ]}
            />
          </View>

          {stepError ? <ThemedText style={styles.errorText}>{stepError}</ThemedText> : null}

          <View style={styles.fieldGroup}>
            <ThemedText style={[styles.fieldLabel, { color: subtleTextColor }]}>Recipe image</ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add a recipe image"
              onPress={pickRecipeImage}
              style={({ pressed }) => [styles.imagePicker, { borderColor }, pressed && styles.pressed]}>
              {recipeImage ? (
                <Image source={recipeImage} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholderContent}>
                  <ThemedText style={[styles.imagePickerText, { color: subtleTextColor }]}>Add a recipe image</ThemedText>

                  <View style={styles.imageIconRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Choose a photo from library"
                      onPress={pickRecipeImage}
                      style={({ pressed }) => [styles.iconActionButton, { borderColor }, pressed && styles.pressed]}>
                      <IconSymbol name="photo.on.rectangle" size={24} color={textColor} />
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Take a photo"
                      onPress={takeRecipeImage}
                      style={({ pressed }) => [styles.iconActionButton, { borderColor }, pressed && styles.pressed]}>
                      <IconSymbol name="camera.fill" size={24} color={textColor} />
                    </Pressable>
                  </View>
                </View>
              )}
            </Pressable>
          </View>
        </ThemedView>
      ) : null}

      {currentStep === 2 ? (
        <ThemedView style={[styles.card, { backgroundColor: sectionBackground, borderColor }]}> 

          <View style={styles.fieldGroup}>
            <ThemedText style={[styles.fieldLabel, { color: subtleTextColor }]}>Ingredients</ThemedText>
            <View style={styles.listGroup}>
              {ingredients.map((ingredient, index) => (
                <TextInput
                  key={ingredient.id}
                  value={ingredient.value}
                  onChangeText={(value) => updateIngredient(ingredient.id, value)}
                  placeholder={`Ingredient ${index + 1}`}
                  placeholderTextColor={subtleTextColor}
                  style={[
                    styles.input,
                    {
                      backgroundColor: fieldBackground,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                />
              ))}

              <Pressable
                accessibilityRole="button"
                onPress={addIngredient}
                style={({ pressed }) => [styles.secondaryButton, { borderColor }, pressed && styles.pressed]}>
                <ThemedText type="defaultSemiBold" style={[styles.secondaryButtonText, { color: textColor }]}>Add ingredient</ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={[styles.fieldLabel, { color: subtleTextColor }]}>Recipe steps</ThemedText>
            <View style={styles.listGroup}>
              {recipeSteps.map((step, index) => (
                <View key={step.id} style={styles.stepRow}>
                  <ThemedText type="defaultSemiBold" style={[styles.stepNumber, { color: textColor }]}>{index + 1}.</ThemedText>
                  <TextInput
                    value={step.value}
                    onChangeText={(value) => updateStep(step.id, value)}
                    placeholder={`Describe step ${index + 1}`}
                    placeholderTextColor={subtleTextColor}
                    multiline
                    textAlignVertical="top"
                    style={[
                      styles.stepInput,
                      {
                        backgroundColor: fieldBackground,
                        borderColor,
                        color: textColor,
                      },
                    ]}
                  />
                </View>
              ))}

              <Pressable
                accessibilityRole="button"
                onPress={addRecipeStep}
                style={({ pressed }) => [styles.secondaryButton, { borderColor }, pressed && styles.pressed]}>
                <ThemedText type="defaultSemiBold" style={[styles.secondaryButtonText, { color: textColor }]}>Add new step</ThemedText>
              </Pressable>
            </View>
          </View>

          {stepError ? <ThemedText style={styles.errorText}>{stepError}</ThemedText> : null}
        </ThemedView>
      ) : null}

      {/* Step 3 (Details) removed */}

      <View style={styles.actionsRow}>
        {canGoBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={previousStep}
            style={({ pressed }) => [styles.navButton, { borderColor }, pressed && styles.pressed]}>
            <ThemedText type="defaultSemiBold" style={[styles.navButtonText, { color: textColor }]}>Back</ThemedText>
          </Pressable>
        ) : (
          <View style={styles.navPlaceholder} />
        )}

        {canGoForward ? (
          <Pressable
            accessibilityRole="button"
            onPress={nextStep}
            style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
            <ThemedText type="defaultSemiBold" style={styles.primaryActionText}>Next</ThemedText>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={uploadRecipe}
            style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
            <ThemedText type="defaultSemiBold" style={styles.primaryActionText}>{editingRecipe ? 'Save changes' : 'Upload recipe'}</ThemedText>
          </Pressable>
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 28,
    paddingTop: 30,
  },
  timelineCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.headline,
    textAlign: 'center',
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: Fonts.label,
    fontSize: 14,
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
    minHeight: 112,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.body,
    fontSize: 16,
  },
  imagePicker: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  imageIconRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    fontFamily: Fonts.label,
  },
  iconActionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  previewImage: {
    width: '100%',
    height: 250,
  },
  listGroup: {
    gap: 10,
  },
  stepRow: {
    gap: 8,
  },
  stepNumber: {
    fontFamily: Fonts.label,
  },
  stepInput: {
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 88,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.body,
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: Fonts.label,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 18,
  },
  navButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  navButtonText: {
    fontFamily: Fonts.label,
  },
  navPlaceholder: {
    flex: 1,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#540212',
  },
  primaryActionText: {
    color: Colors.light.background,
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
  difficultyContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});