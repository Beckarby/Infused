import { create } from 'zustand';

import type { MockRecipe } from '@/constants/mock-recipes';
import { toProcessService } from '@/services/toProcess';

type ApiRecipe = {
  recipe_id: string;
  recipe_name: string;
  recipe_description: string;
  recipe_image: string | null;
  author?: string;
  creator?: string;
  recipe_ingredients: string[];
  recipe_steps: string[];
};

type RecipeDraft = Omit<MockRecipe, 'id'> & {
  id?: string;
};

interface RecipeState {
  recipes: MockRecipe[];
  isLoading: boolean;
  fetchRecipes: () => Promise<void>;
  addRecipe: (recipe: RecipeDraft) => Promise<string>;
  updateRecipe: (recipeId: string, updates: Partial<Omit<MockRecipe, 'id'>>) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
}

function mapApiRecipe(api: ApiRecipe): MockRecipe {
  return {
    id: api.recipe_id,
    name: api.recipe_name,
    description: api.recipe_description,
    image: api.recipe_image ? { uri: api.recipe_image } : undefined,
    creatorName: api.creator ?? api.author ?? '',
    ingredients: api.recipe_ingredients,
    steps: api.recipe_steps,
  };
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  isLoading: false,

  fetchRecipes: async () => {
    set({ isLoading: true });
    try {
      const data = await toProcessService.searchRecipes([{ searchTerm: '' }]) as { output?: ApiRecipe[] };
      set({ recipes: (data.output ?? []).map(mapApiRecipe), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addRecipe: async (recipe) => {
    const id = recipe.id ?? `recipe-${Date.now()}`;
    const localRecipe = { ...recipe, id, creatorName: recipe.creatorName ?? 'You' };
    // add locally immediately
    set((state) => ({ recipes: [localRecipe, ...state.recipes] }));
    try {
      await toProcessService.createRecipe([{
        name: recipe.name,
        description: recipe.description || '',
        image: null,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
      }]);
      // refresh from server to get the real server-assigned id
      await useRecipeStore.getState().fetchRecipes();
    } catch {
      // already added locally
    }
    return id;
  },

  updateRecipe: async (recipeId, updates) => {
    // apply locally immediately
    set((state) => ({
      recipes: state.recipes.map((r) => (r.id === recipeId ? { ...r, ...updates, id: recipeId } : r)),
    }));
    try {
      const optionFields: { key: string; option: number }[] = [
        { key: 'name', option: 0 },
        { key: 'description', option: 1 },
        { key: 'image', option: 2 },
        { key: 'ingredients', option: 3 },
        { key: 'steps', option: 4 },
      ];

      for (const { key, option } of optionFields) {
        if (key in updates) {
          const raw = (updates as Record<string, unknown>)[key];
          if (key === 'ingredients' || key === 'steps') {
            await toProcessService.updateRecipe([{ option, value: raw, id: recipeId }]);
          } else if (key === 'image') {
            // skip image for now
          } else {
            await toProcessService.updateRecipe([{ option, value: String(raw ?? ''), id: recipeId }]);
          }
        }
      }

      await useRecipeStore.getState().fetchRecipes();
    } catch {
      // already applied locally
    }
  },

  deleteRecipe: async (recipeId) => {
    // remove locally immediately
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== recipeId),
    }));
    try {
      await toProcessService.deleteRecipe([{ id: recipeId }]);
      await useRecipeStore.getState().fetchRecipes();
    } catch {
      // already removed locally
    }
  },
}));