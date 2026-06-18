import axiosClient from '../api/axiosClient';

const authService = {
    login: (payload) => {
        return axiosClient.post('/Auth/CustomerLogin', payload);
    },

    register: (payload) => {
        return axiosClient.post('/Auth/CustomerRegister', payload);
    },
};

export default authService;
