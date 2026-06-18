import axiosClient from '../api/axiosClient';

const blogService = {
    getAllPosts: () => {
        return axiosClient.get('/Posts');
    },

    getPostById: (id) => {
        return axiosClient.get(`/Posts/${id}`);
    },

    getPostsByCategory: (categoryId) => {
        return axiosClient.get(`/Posts/category/${categoryId}`);
    },

    getBlogCategories: () => {
        return axiosClient.get('/Categories');
    },
};

export default blogService;
