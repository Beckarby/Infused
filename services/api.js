import axios from 'axios';
import router from 'expo-router';

const API_URL = 'https://infused.kaucrow.com/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
)

const retriedRequests = new WeakMap();

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !retriedRequests.get(originalRequest)) {
            retriedRequests.set(originalRequest, true);
            router.push('/login');
        }
        return Promise.reject(error);
    }
)

export default {
    get: (endpoint, config = {}) => api.get(endpoint, config),
    post: (endpoint, data, config = {}) => api.post(endpoint, data, config),
    put: (endpoint, data, config = {}) => api.put(endpoint, data, config),
    delete: (endpoint, config = {}) => api.delete(endpoint, config), 
}