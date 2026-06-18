import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7204/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
