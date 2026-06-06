import { create } from 'zustand';

type CollectionItem = {
  id: string;
  name: string;
};

interface CollectionState {
  collections: CollectionItem[];
  collectionRecipes: Record<string, string[]>;
  addCollection: (name: string) => void;
  deleteCollection: (collectionId: string) => void;
  updateCollectionName: (collectionId: string, name: string) => void;
  addRecipeToCollection: (collectionId: string, recipeId: string) => void;
  removeRecipeFromCollection: (collectionId: string, recipeId: string) => void;
  resetCollections: () => void;
}

const INITIAL_COLLECTIONS: CollectionItem[] = [
  { id: '1', name: 'Summer Cocktails' },
  { id: '2', name: 'Dinner Favorites' },
  { id: '3', name: 'Weekend Brunch' },
  { id: '4', name: 'Mocktails' },
  { id: '5', name: 'Holiday Drinks' },
  { id: '6', name: 'After Dinner' },
];

const INITIAL_COLLECTION_RECIPES: Record<string, string[]> = {
  '1': ['negroni', 'aperol-spritz'],
  '2': ['espresso-martini', 'margarita'],
  '3': ['aperol-spritz'],
};

const buildCollectionId = (name: string) => {
  const normalizedName = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return normalizedName || `collection-${Date.now()}`;
};

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: INITIAL_COLLECTIONS,
  collectionRecipes: INITIAL_COLLECTION_RECIPES,

  addCollection: (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const id = buildCollectionId(trimmedName);

    set((state) => ({
      collections: [...state.collections, { id, name: trimmedName }],
      collectionRecipes: { ...state.collectionRecipes, [id]: [] },
    }));
  },

  deleteCollection: (collectionId) => {
    set((state) => {
      const { [collectionId]: _, ...remaining } = state.collectionRecipes;
      return {
        collections: state.collections.filter((collection) => collection.id !== collectionId),
        collectionRecipes: remaining,
      };
    });
  },

  updateCollectionName: (collectionId, name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === collectionId ? { ...collection, name: trimmedName } : collection,
      ),
    }));
  },

  addRecipeToCollection: (collectionId, recipeId) => {
    set((state) => {
      const current = state.collectionRecipes[collectionId] ?? [];
      if (current.includes(recipeId)) return state;
      return {
        collectionRecipes: {
          ...state.collectionRecipes,
          [collectionId]: [...current, recipeId],
        },
      };
    });
  },

  removeRecipeFromCollection: (collectionId, recipeId) => {
    set((state) => {
      const current = state.collectionRecipes[collectionId] ?? [];
      return {
        collectionRecipes: {
          ...state.collectionRecipes,
          [collectionId]: current.filter((id) => id !== recipeId),
        },
      };
    });
  },

  resetCollections: () => {
    set({ collections: INITIAL_COLLECTIONS, collectionRecipes: INITIAL_COLLECTION_RECIPES });
  },
}));