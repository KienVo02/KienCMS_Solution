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

    getLatestProducts: (take = 3) => {
        return axiosClient.get('/Products/latest', { params: { take } });
    },

    getBestSellerProducts: (take = 3) => {
        return axiosClient.get('/Products/best-sellers', { params: { take } });
    },

    searchProducts: (params = {}) => {
        return axiosClient.get('/Products/search', { params });
    },
};

export default productService;
