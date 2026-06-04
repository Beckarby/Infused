import { create } from 'zustand';

interface ProfileState {
  name: string;
  handle: string;
  description: string;
  updateProfile: (profile: { name: string; handle: string; description: string }) => void;
  resetProfile: () => void;
}

const INITIAL_PROFILE = {
  name: 'Jane Doe',
  handle: '@janedoe',
  description: 'Bartender and Professional Mixer',
};

export const useProfileStore = create<ProfileState>((set) => ({
  ...INITIAL_PROFILE,
  updateProfile: (profile) => set(profile),
  resetProfile: () => set(INITIAL_PROFILE),
}));