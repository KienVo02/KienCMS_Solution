import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: (payload) => {
        return axiosClient.post('/Orders', payload);
    },

    getOrdersByCustomer: (customerId) => {
        return axiosClient.get(`/Orders/customer/${customerId}`);
    },
};

export default orderService;
