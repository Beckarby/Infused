import api from './api';

export const authService = {
    async login(username, password) {
        try {
            // clear any existing session first
            try { await api.post('/logout'); } catch {}
            const response = await api.post('/login', { user: username, pass: password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            const response = await api.post('/logout');
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    async register(username, firstName, lastName, email, password) {
        try {
            // clear any existing session before registering
            try { await api.post('/logout'); } catch {}
            const response = await api.post('/register', { username, email, password, firstName, lastName });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // option: 0=name, 1=email, 2=first_name, 3=last_name, 4=description, 5=image
    async updateUser(option, value) {
        try {
            const response = await api.post('/update-user', { option, value });
            return response.data;
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    }
}