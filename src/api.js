import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    // 2. Use the variable and append the '/api' suffix
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

export default api;