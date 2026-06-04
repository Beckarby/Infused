import type { ImageSourcePropType } from 'react-native';

export type MockRecipe = {
  id: string;
  name: string;
  creatorName: string;
  description: string;
  image?: ImageSourcePropType;
  ingredients: string[];
  steps: string[];
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: string;
};

export const MOCK_RECIPES: MockRecipe[] = [
  {
    id: 'negroni',
    name: 'Negroni',
    creatorName: 'Jane Doe',
    description: 'A bitter, citrus-forward classic with a clean finish and a deep ruby color.',
    image: require('../assets/images/SpicyMargaritas.jpg'),
    ingredients: ['1 oz gin', '1 oz sweet vermouth', '1 oz Campari', 'Orange peel for garnish'],
    steps: [
      'Add gin, vermouth, and Campari to a mixing glass filled with ice.',
      'Stir until well chilled and slightly diluted.',
      'Strain over a large ice cube and garnish with orange peel.',
    ],
    cookingTime: '5 min',
    difficulty: 'Medium',
    servings: '1',
  },
  {
    id: 'espresso-martini',
    name: 'Espresso Martini',
    creatorName: 'Alex Stone',
    description: 'Silky, rich, and built for late nights with a sharp espresso kick.',
    ingredients: ['2 oz vodka', '1 oz coffee liqueur', '1 oz fresh espresso', 'Coffee beans for garnish'],
    steps: [
      'Add all ingredients to a shaker with ice.',
      'Shake hard until frothy and chilled.',
      'Double strain into a chilled coupe and garnish with coffee beans.',
    ],
    cookingTime: '7 min',
    difficulty: 'Hard',
    servings: '1',
  },
  {
    id: 'aperol-spritz',
    name: 'Aperol Spritz',
    creatorName: 'Maria Lopez',
    description: 'Bright, sparkling, and easy to build with a crisp bittersweet finish.',
    ingredients: ['3 oz prosecco', '2 oz Aperol', '1 oz soda water', 'Orange slice for garnish'],
    steps: [
      'Fill a wine glass with ice.',
      'Pour in prosecco, Aperol, and soda water.',
      'Stir gently and garnish with orange slice.',
    ],
    cookingTime: '3 min',
    difficulty: 'Easy',
    servings: '1',
  },
  {
    id: 'margarita',
    name: 'Margarita',
    creatorName: 'Taylor Reed',
    description: 'Sharp citrus, salt, and tequila balanced into a crowd-pleasing classic.',
    image: require('../assets/images/SpicyMargaritas.jpg'),
    ingredients: ['2 oz tequila', '1 oz triple sec', '1 oz lime juice', 'Salt rim and lime wheel'],
    steps: [
      'Rim the glass with salt if desired.',
      'Shake tequila, triple sec, and lime juice with ice.',
      'Strain into the glass over fresh ice and garnish with lime.',
    ],
    cookingTime: '5 min',
    difficulty: 'Medium',
    servings: '1',
  },
];

export const COLLECTION_RECIPES = [
  { id: 'negroni', name: 'Negroni' },
  { id: 'espresso-martini', name: 'Espresso Martini' },
  { id: 'aperol-spritz', name: 'Aperol Spritz' },
];

export const MOCK_COLLECTION_NAMES = [
  'Summer Cocktails',
  'Dinner Favorites',
  'Weekend Brunch',
];

export function getMockRecipeById(recipeId?: string | string[]) {
  const normalizedId = Array.isArray(recipeId) ? recipeId[0] : recipeId;

  if (!normalizedId) {
    return undefined;
  }

  return MOCK_RECIPES.find((recipe) => recipe.id === normalizedId);
}