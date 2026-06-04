import { create } from 'zustand';

type CollectionItem = {
  id: string;
  name: string;
};

interface CollectionState {
  collections: CollectionItem[];
  addCollection: (name: string) => void;
  deleteCollection: (collectionId: string) => void;
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

const buildCollectionId = (name: string) => {
  const normalizedName = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return normalizedName || `collection-${Date.now()}`;
};

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: INITIAL_COLLECTIONS,

  addCollection: (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const id = buildCollectionId(trimmedName);

    set((state) => ({
      collections: [...state.collections, { id, name: trimmedName }],
    }));
  },

  deleteCollection: (collectionId) => {
    set((state) => ({
      collections: state.collections.filter((collection) => collection.id !== collectionId),
    }));
  },

  resetCollections: () => {
    set({ collections: INITIAL_COLLECTIONS });
  },
}));