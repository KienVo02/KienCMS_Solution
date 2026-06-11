import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm l?y toàn b? danh m?c S?N PH?M t? Backend
     * Endpoint này k?t n?i t?i CategoryProductController trong ASP.NET Core
     */
    getAllCategoryProducts: () => {
        // Ðý?ng d?n ð?nh tuy?n kh?p chính xác v?i c?u trúc ð?nh tuy?n [Route("api/[controller]")] c?a Backend
        const url = '/categoriesproducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;
