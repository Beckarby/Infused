import { create } from 'zustand';
import type { UserData } from '@/store/UseAuthStore';

interface ProfileState {
  name: string;
  handle: string;
  description: string;
  updateProfile: (profile: { name: string; handle: string; description: string }) => void;
  resetProfile: () => void;
  initializeFromUserData: (userData: UserData) => void;
}

const DEFAULT_PROFILE = {
  name: '',
  handle: '',
  description: '',
};

export const useProfileStore = create<ProfileState>((set) => ({
  ...DEFAULT_PROFILE,
  updateProfile: (profile) => set(profile),
  resetProfile: () => set(DEFAULT_PROFILE),
  initializeFromUserData: (userData) =>
    set({
      name: `${userData.users_first_name} ${userData.users_last_name}`,
      handle: `@${userData.users_name}`,
      description: userData.users_description ?? '',
    }),
}));