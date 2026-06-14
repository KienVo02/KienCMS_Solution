import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách toàn bộ bài viết
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    },

    // 2. Hàm lấy chi tiết 1 bài viết theo ID
    getPostById: (id) => {
        const url = `/Posts/${id}`;
        return axiosClient.get(url);
    },

    // 3. Hàm lấy danh sách chuyên mục tin tức
    getBlogCategories: () => {
        const url = '/Categories';
        return axiosClient.get(url);
    }
};

export default blogService;