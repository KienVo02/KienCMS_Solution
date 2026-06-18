import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        return axiosClient.get('/Products');
    },

    getProductById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    },

    getProductsByCategory: (categoryProductId) => {
        return axiosClient.get(`/Products/category/${categoryProductId}`);
    },
};

export default productService;
