import axios from 'axios';

export const fetcher = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
};

// Create axios instance with base configuration
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});
