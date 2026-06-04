import { create } from 'zustand';

import { MOCK_RECIPES, type MockRecipe } from '@/constants/mock-recipes';

type RecipeDraft = Omit<MockRecipe, 'id'> & {
  id?: string;
};

interface RecipeState {
  recipes: MockRecipe[];
  addRecipe: (recipe: RecipeDraft) => string;
  updateRecipe: (recipeId: string, updates: Partial<Omit<MockRecipe, 'id'>>) => void;
  deleteRecipe: (recipeId: string) => void;
}

const buildRecipeId = (title: string) => {
  const normalizedTitle = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return normalizedTitle || `recipe-${Date.now()}`;
};

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: MOCK_RECIPES,

  addRecipe: (recipe) => {
    const id = recipe.id ?? buildRecipeId(recipe.name);

    set((state) => ({
      recipes: [
        {
          ...recipe,
          id,
          creatorName: recipe.creatorName ?? 'You',
        },
        ...state.recipes,
      ],
    }));

    return id;
  },

  updateRecipe: (recipeId, updates) => {
    set((state) => ({
      recipes: state.recipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, ...updates, id: recipe.id } : recipe,
      ),
    }));
  },

  deleteRecipe: (recipeId) => {
    set((state) => ({
      recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
    }));
  },
}));