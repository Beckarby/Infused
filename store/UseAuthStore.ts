import { create } from 'zustand';

interface AuthState {
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signIn: (fullName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (email === 'test@test.com' && password === 'password') {
                set({ isLoading: false, error: null });
            } else {
                throw new Error('Invalid email or password');
            }
        } catch {
            set({ isLoading: false, error: 'Invalid email or password' });
        }
    },

    signIn: async (fullName, email, password) => {
        set({ isLoading: true, error: null });

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (fullName && email && password) {
                set({ isLoading: false, error: null });
            } else {
                throw new Error('Please fill in all fields');
            }
        } catch {
            set({ isLoading: false, error: 'Please fill in all fields' });
        }
    },

    logout: () => {
        set({ isLoading: false, error: null });
    },
}));