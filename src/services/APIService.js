import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm5hbWUiOiJBbnVyYWcgS3VtYXIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2OTc0NjQ5OTEsImV4cCI6MTcwNTI0MDk5MX0.UABZ0S9j9WMakIxaQDG2WDU_-CO8s_JRpkV_YnhRWZ4';

const APIService = axios.create({
    baseURL: API_URL,
    headers: {
        'api-key': `${API_TOKEN}`
    }
});

export default APIService;
