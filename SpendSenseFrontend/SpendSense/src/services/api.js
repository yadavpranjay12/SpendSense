import axios from 'axios';

// Create an Axios instance pointing to your Spring Boot backend
const api = axios.create({
    baseURL: 'http://localhost:8082/api/v1',
});

// Add an interceptor to automatically attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;