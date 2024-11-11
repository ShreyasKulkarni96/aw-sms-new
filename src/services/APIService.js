import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const APIService = axios.create({
    baseURL: API_URL,
});

APIService.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        const userRole = JSON.parse(atob(token.split('.')[1])).role;  // Assuming the token payload contains a 'role' field
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['UserRole'] = userRole;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


export default APIService;