import { create } from 'zustand';

import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
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
  isSyncing: boolean;
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

async function imageToBase64(image: MockRecipe['image'] | string): Promise<string | null> {
  if (!image) return null;
  if (typeof image === 'string') return image;
  if (typeof image !== 'object' || Array.isArray(image)) return null;
  const uri = (image as { uri?: string }).uri;
  if (typeof uri !== 'string' || uri.startsWith('http')) return null;
  try {
    return await readAsStringAsync(uri, { encoding: EncodingType.Base64 });
  } catch {
    return null;
  }
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  isLoading: false,
  isSyncing: false,

  fetchRecipes: async () => {
    if (get().isLoading) return;
    
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
      const imageBase64 = await imageToBase64(recipe.image);
      await toProcessService.createRecipe([{
        name: recipe.name,
        description: recipe.description || '',
        image: imageBase64,
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
            const base64 = await imageToBase64(raw as MockRecipe['image']);
            if (base64 !== null) {
              await toProcessService.updateRecipe([{ option, value: base64, id: recipeId }]);
            }
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