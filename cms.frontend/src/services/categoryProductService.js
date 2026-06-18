import axiosClient from '../api/axiosClient';

const categoryProductService = {
    getAllCategories: () => {
        return axiosClient.get('/CategoriesProducts');
    },
};

export default categoryProductService;
