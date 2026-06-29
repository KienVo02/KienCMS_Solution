import axiosClient from '../api/axiosClient';

const authService = {
    login: (payload) => {
        return axiosClient.post('/Auth/CustomerLogin', payload);
    },

    register: (payload) => {
        return axiosClient.post('/Auth/CustomerRegister', payload);
    },

    forgotPassword: (payload) => {
        return axiosClient.post('/Auth/ForgotPassword', payload);
    },

    verifyResetCode: (payload) => {
        return axiosClient.post('/Auth/VerifyResetCode', payload);
    },

    resetPassword: (payload) => {
        return axiosClient.post('/Auth/ResetPassword', payload);
    },
};

export default authService;
