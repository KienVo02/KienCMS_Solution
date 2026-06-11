import axios from 'axios';

// Kh?i t?o m?t th?c th? axios v?i c?u h?nh base chung
const axiosClient = axios.create({
    baseURL: 'https://localhost:7204/api', // Ð?i l?i ðúng c?ng Port Backend c?a máy các em
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Th?i gian t?i ða ch? ph?n h?i t? server (10 giây)
});

// Gi?i thích: Interceptor giúp chúng ta can thi?p vào d? li?u trý?c khi tr? v? cho component
axiosClient.interceptors.response.use(
    (response) => {
        // N?u ph?n h?i thành công, bóc tách l?y th?ng c?c data bên trong d? li?u JSON
        return response.data;
    },
    (error) => {
        // X? l? l?i t?p trung t?i ðây (Ví d?: Server s?p, l?i 404, l?i 500)
        console.error('L?i k?t n?i API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;