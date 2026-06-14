import React, { useEffect, useState } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ selectedCategoryId, onSelectCategory, onShowAll }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryProductService.getAllCategories();

                console.log("Dữ liệu danh mục sản phẩm:", data);

                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (data && Array.isArray(data.$values)) {
                    setCategories(data.$values);
                } else if (data && Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="hotfood-category-bar">
            <div className="hotfood-category-menu">
                <button type="button" className="category-main-btn">
                    <i className="fa-solid fa-layer-group mr-2"></i>
                    Danh mục sản phẩm
                    <i className="fa-solid fa-angle-down ml-2"></i>
                </button>

                <div className="category-dropdown-menu">
                    <button
                        type="button"
                        className={selectedCategoryId === 0 ? 'category-dropdown-item active' : 'category-dropdown-item'}
                        onClick={onShowAll}
                    >
                        Tất cả sản phẩm
                    </button>

                    {categories.length === 0 ? (
                        <div className="category-empty">
                            Chưa tải được danh mục
                        </div>
                    ) : (
                        categories.map((category) => (
                            <button
                                type="button"
                                key={category.id}
                                className={selectedCategoryId === category.id ? 'category-dropdown-item active' : 'category-dropdown-item'}
                                onClick={() => onSelectCategory(category)}
                            >
                                {category.name}
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="category-note">
                Rê chuột vào danh mục để chọn nhóm sản phẩm
            </div>
        </div>
    );
};

export default CategoryProductList;