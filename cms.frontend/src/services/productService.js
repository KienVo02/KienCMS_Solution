import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách sản phẩm
    getAllProducts: () => {
        const url = '/Products';
        return axiosClient.get(url);
    },

    // Hàm gọi API lấy chi tiết sản phẩm theo ID
    getProductById: (id) => {
        const url = `/Products/${id}`;
        return axiosClient.get(url);
    }
};

export default productService;