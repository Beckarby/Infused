import { create } from 'zustand';
import { toProcessService } from '@/services/toProcess';

type CollectionItem = {
  id: string;
  name: string;
};

type ApiGroup = {
  group_id?: string;
  group_name?: string;
  name?: string;
  recipe_group_id: string;
  recipe_group_name: string;
};

interface CollectionState {
  collections: CollectionItem[];
  collectionRecipes: Record<string, string[]>;
  isLoading: boolean;
  fetchCollections: () => Promise<void>;
  addCollection: (name: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  updateCollectionName: (collectionId: string, name: string) => Promise<void>;
  addRecipeToCollection: (collectionId: string, recipeId: string) => Promise<void>;
  removeRecipeFromCollection: (collectionId: string, recipeId: string) => Promise<void>;
  resetCollections: () => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  collectionRecipes: {},
  isLoading: false,

  fetchCollections: async () => {
    set({ isLoading: true });
    try {
      const groupsData = await toProcessService.getAllGroups([{}]) as { output?: ApiGroup[] };
      const groups = groupsData.output ?? [];
      const collectionRecipes: Record<string, string[]> = {};

      const recipeResults = await Promise.allSettled(
        groups.map((g) => toProcessService.getRecipesInGroup([{ groupId: g.group_id ?? g.recipe_group_id }]) as Promise<{ output?: { recipe_id: string }[] }>),
      );

      groups.forEach((g, i) => {
        const id = String(g.group_id ?? g.recipe_group_id);
        if (recipeResults[i].status === 'fulfilled') {
          const recipes = recipeResults[i].value.output ?? [];
          collectionRecipes[id] = recipes.map((r) => r.recipe_id);
        } else {
          collectionRecipes[id] = [];
        }
      });

      set({
        collections: groups.map((g) => ({ id: String(g.group_id ?? g.recipe_group_id), name: g.recipe_group_name ?? g.name ?? g.group_name ?? '' })),
        collectionRecipes,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addCollection: async (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      await toProcessService.createGroup([{ name: trimmedName }]);
      await get().fetchCollections();
    } catch {
      // fallback: add locally
      const id = `group-${Date.now()}`;
      set((state) => ({
        collections: [...state.collections, { id, name: trimmedName }],
        collectionRecipes: { ...state.collectionRecipes, [id]: [] },
      }));
    }
  },

  deleteCollection: async (collectionId) => {
    try {
      await toProcessService.deleteGroup([{ groupId: collectionId }]);
      await get().fetchCollections();
    } catch {
      set((state) => {
        const { [collectionId]: _, ...remaining } = state.collectionRecipes;
        return {
          collections: state.collections.filter((c) => c.id !== collectionId),
          collectionRecipes: remaining,
        };
      });
    }
  },

  updateCollectionName: async (collectionId, name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      await toProcessService.updateGroup([{ groupId: collectionId, name: trimmedName }]);
      await get().fetchCollections();
    } catch {
      set((state) => ({
        collections: state.collections.map((c) =>
          c.id === collectionId ? { ...c, name: trimmedName } : c,
        ),
      }));
    }
  },

  addRecipeToCollection: async (collectionId, recipeId) => {
    const current = get().collectionRecipes[collectionId] ?? [];
    if (current.includes(recipeId)) return;
    // add locally immediately
    set((state) => ({
      collectionRecipes: {
        ...state.collectionRecipes,
        [collectionId]: [...current, recipeId],
      },
    }));
    try {
      await toProcessService.addRecipeToGroup([{ groupId: collectionId, recipeId }]);
    } catch {
      // already added locally
    }
  },

  removeRecipeFromCollection: async (collectionId, recipeId) => {
    // remove locally immediately
    set((state) => ({
      collectionRecipes: {
        ...state.collectionRecipes,
        [collectionId]: (state.collectionRecipes[collectionId] ?? []).filter((id) => id !== recipeId),
      },
    }));
    try {
      await toProcessService.removeRecipeFromGroup([{ groupId: collectionId, recipeId }]);
    } catch {
      // already removed locally
    }
  },

  resetCollections: () => {
    set({ collections: [], collectionRecipes: {} });
  },
}));