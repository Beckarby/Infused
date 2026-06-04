import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getMockRecipeById, MOCK_COLLECTION_NAMES } from '@/constants/mock-recipes';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RecipeScreen() {
	const params = useLocalSearchParams<{ id?: string | string[] }>();
	const recipe = useMemo(() => getMockRecipeById(params.id), [params.id]);

	const theme = useColorScheme() ?? 'light';
	const isDark = theme === 'dark';

	const pageBackground = isDark ? Colors.dark.background : Colors.light.background;
	const cardBackground = isDark ? Colors.dark.neutral : Colors.light.neutral;
	const sectionBackground = isDark ? Colors.dark.tertiary : Colors.light.tertiary;
	const textColor = isDark ? Colors.dark.text : Colors.light.text;
	const subtleTextColor = isDark ? Colors.dark.primary : Colors.light.primary;
	const borderColor = isDark ? 'rgba(249, 247, 242, 0.18)' : 'rgba(74, 55, 40, 0.14)';

	if (!recipe) {
		return (
			<ThemedView style={[styles.screen, { backgroundColor: pageBackground }]}>
				<ThemedView style={[styles.card, { backgroundColor: cardBackground, borderColor }]}> 
					<ThemedText type="title" style={[styles.title, { color: textColor }]}>Recipe not found</ThemedText>
					<ThemedText style={[styles.body, { color: subtleTextColor }]}>We could not find a mock recipe for this id yet.</ThemedText>

					<Pressable
						accessibilityRole="button"
						onPress={() => router.back()}
						style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
						<ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>Go back</ThemedText>
					</Pressable>
				</ThemedView>
			</ThemedView>
		);
	}

	return (
        <ScrollView style={[styles.container, { backgroundColor: pageBackground }]} contentContainerStyle={styles.content}>
            <AppHeader title="Infused"  onReturnPress={router.back}/>
			<ThemedView style={[styles.heroCard, { backgroundColor: cardBackground, borderColor }]}>
				{recipe.image ? <Image source={recipe.image} style={styles.heroImage} resizeMode="cover" /> : null}

				<View style={styles.heroText}>
					<ThemedText type="title" style={[styles.title, { color: textColor }]}>{recipe.name}</ThemedText>
					<ThemedText style={[styles.body, { color: subtleTextColor }]}>{recipe.description}</ThemedText>

					<View style={styles.metaRow}>
						<ThemedView style={[styles.metaChip, { backgroundColor: sectionBackground }]}>
							<ThemedText type="defaultSemiBold" style={[styles.metaText, { color: textColor }]}>{recipe.difficulty}</ThemedText>
						</ThemedView>
						<ThemedView style={[styles.metaChip, { backgroundColor: sectionBackground }]}>
							<ThemedText type="defaultSemiBold" style={[styles.metaText, { color: textColor }]}>{recipe.cookingTime}</ThemedText>
						</ThemedView>
						<ThemedView style={[styles.metaChip, { backgroundColor: sectionBackground }]}>
							<ThemedText type="defaultSemiBold" style={[styles.metaText, { color: textColor }]}>{recipe.servings} servings</ThemedText>
						</ThemedView>
					</View>

					<ThemedText style={[styles.creatorText, { color: subtleTextColor }]}>Created by {recipe.creatorName}</ThemedText>
				</View>
			</ThemedView>

			<ThemedView style={[styles.card, { backgroundColor: cardBackground, borderColor }]}> 
				<ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>Ingredients</ThemedText>
				<View style={styles.list}>
					{recipe.ingredients.map((ingredient) => (
						<ThemedView key={ingredient} style={[styles.listItem, { backgroundColor: sectionBackground }]}>
							<ThemedText style={[styles.listItemText, { color: textColor }]}>{ingredient}</ThemedText>
						</ThemedView>
					))}
				</View>
			</ThemedView>

			<ThemedView style={[styles.card, { backgroundColor: cardBackground, borderColor }]}> 
				<ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>Steps</ThemedText>
				<View style={styles.list}>
					{recipe.steps.map((step, index) => (
						<ThemedView key={`${recipe.id}-step-${index}`} style={[styles.stepItem, { backgroundColor: sectionBackground }]}>
							<ThemedText type="defaultSemiBold" style={[styles.stepNumber, { color: textColor }]}>{index + 1}</ThemedText>
							<ThemedText style={[styles.listItemText, { color: textColor }]}>{step}</ThemedText>
						</ThemedView>
					))}
				</View>
			</ThemedView>

			<Pressable
				accessibilityRole="button"
				onPress={() => {
					Alert.alert(
						'Add to collection',
						'Choose a collection to save this recipe into.',
						[
							{ text: 'Cancel', style: 'cancel' },
							...MOCK_COLLECTION_NAMES.map((collectionName) => ({
								text: collectionName,
								onPress: () => {
									Alert.alert('Saved', `${recipe.name} was added to ${collectionName}.`);
								},
							})),
						],
					);
				}}
				style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
				<ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>Add to collection</ThemedText>
			</Pressable>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 16,
		gap: 14,
	},
	screen: {
		flex: 1,
		padding: 16,
	},
	heroCard: {
		borderRadius: 28,
		borderWidth: 1,
		overflow: 'hidden',
	},
	heroImage: {
		width: '100%',
		height: 240,
	},
	heroText: {
		padding: 18,
		gap: 15,
	},
	title: {
		fontFamily: Fonts.headline,
		fontStyle: 'italic',
	},
	body: {
		lineHeight: 22,
	},
	metaRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 9,
        textAlign: 'center',
        justifyContent: 'center',
	},
	metaChip: {
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	metaText: {
		fontSize: 13,
	},
	creatorText: {
		fontSize: 13,
        textAlign: 'right',
        justifyContent: 'center',
	},
	card: {
		borderRadius: 24,
		padding: 18,
		borderWidth: 1,
		gap: 14,
	},
	sectionTitle: {
		fontFamily: Fonts.label,
		fontSize: 18,
	},
	list: {
		gap: 10,
	},
	listItem: {
		borderRadius: 18,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	listItemText: {
		lineHeight: 22,
	},
	stepItem: {
		borderRadius: 18,
		paddingHorizontal: 14,
		paddingVertical: 12,
		gap: 8,
	},
	stepNumber: {
		fontFamily: Fonts.headline,
		fontSize: 16,
	},
	primaryButton: {
		borderRadius: 18,
		paddingVertical: 15,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#540212',
	},
	primaryButtonText: {
		color: Colors.light.background,
		fontFamily: Fonts.label,
	},
	secondaryButton: {
		borderRadius: 18,
		paddingVertical: 15,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'rgba(74, 55, 40, 0.14)',
	},
	secondaryButtonText: {
		fontFamily: Fonts.label,
	},
	pressed: {
		opacity: 0.85,
	},
});
