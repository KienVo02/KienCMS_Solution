import axiosClient from '../api/axiosClient';

const categoryProductService = {
    getAllCategories: () => {
        const url = '/CategoriesProducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;