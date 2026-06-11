import axiosClient from '../api/axiosClient';

const blogService = {
    // Lấy danh mục bài viết
    getBlogCategories: () => {
        const url = '/Categories';
        return axiosClient.get(url);
    },

    // Lấy danh sách bài viết
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    }
};

export default blogService;