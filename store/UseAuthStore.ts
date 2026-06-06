import { create } from 'zustand';
import { authService } from '@/services/auth';
import { useProfileStore } from '@/store/UseProfileStore';
import { useCollectionStore } from '@/store/UseCollectionStore';

export type UserData = {
  users_name: string;
  users_email: string;
  users_first_name: string;
  users_last_name: string;
  users_description: string | null;
  users_image: string | null;
};

interface AuthState {
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: UserData | null;
    login: (username: string, password: string) => Promise<void>;
    signIn: (username: string, firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

function getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosErr = error as { response?: { data?: { message?: string } } };
        return axiosErr.response?.data?.message ?? 'An error occurred';
    }
    if (error instanceof Error) return error.message;
    return 'An error occurred';
}

function extractUserData(res: Record<string, unknown>): UserData | null {
    const data = (res?.data ?? res) as Record<string, unknown>;
    if (data?.users_first_name && data?.users_last_name && data?.users_name) {
        return data as unknown as UserData;
    }
    return null;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null,

    login: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
            const res = await authService.login(username, password) as Record<string, unknown>;
            const userData = extractUserData(res);
            if (userData) {
                useProfileStore.getState().initializeFromUserData(userData);
                set({ isLoading: false, error: null, isAuthenticated: true, user: userData });
                useCollectionStore.getState().fetchCollections();
            } else {
                // session already active or unexpected format — try to proceed
                set({ isLoading: false, error: null, isAuthenticated: true });
                useCollectionStore.getState().fetchCollections();
            }
        } catch (error) {
            set({ isLoading: false, error: getErrorMessage(error), isAuthenticated: false });
        }
    },

    signIn: async (username, firstName, lastName, email, password) => {
        set({ isLoading: true, error: null });

        try {
            const res = await authService.register(username, firstName, lastName, email, password) as Record<string, unknown>;
            const userData = extractUserData(res);
            if (userData) {
                useProfileStore.getState().initializeFromUserData(userData);
                set({ isLoading: false, error: null, isAuthenticated: true, user: userData });
                useCollectionStore.getState().fetchCollections();
            } else {
                set({ isLoading: false, error: null, isAuthenticated: true });
                useCollectionStore.getState().fetchCollections();
            }
        } catch (error) {
            set({ isLoading: false, error: getErrorMessage(error), isAuthenticated: false });
        }
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch {
            // clear local state regardless of API response
        }
        set({ isLoading: false, error: null, isAuthenticated: false, user: null });
    },
}));