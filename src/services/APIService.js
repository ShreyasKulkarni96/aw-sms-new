import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = localStorage.getItem('token');

const APIService = axios.create({
    baseURL: API_URL,
});

export default APIService;