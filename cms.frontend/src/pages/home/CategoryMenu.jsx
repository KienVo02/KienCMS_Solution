import React, { useEffect, useState } from 'react';
import categoryProductService from '../../services/categoryProductService';
import { toArray } from '../../utils/data';

function CategoryMenu({ selectedCategoryId, onSelectCategory, onShowAll }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryProductService.getAllCategories();
                setCategories(toArray(data).filter((item) => item.isActive !== false));
            } catch (error) {
                console.error('Lỗi tải danh mục sản phẩm:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="category-band">
            <div className="container">
                <div className="section-title">
                    <span>Danh mục từ API</span>
                    <h2>Chọn nhanh món ăn vặt</h2>
                </div>

                <div className="category-scroll">
                    <button
                        type="button"
                        className={Number(selectedCategoryId) === 0 ? 'category-pill active' : 'category-pill'}
                        onClick={onShowAll}
                    >
                        Tất cả
                    </button>

                    {loading ? (
                        <span className="soft-status">Đang tải danh mục...</span>
                    ) : categories.length === 0 ? (
                        <span className="soft-status">Chưa có danh mục</span>
                    ) : (
                        categories.map((category) => (
                            <button
                                type="button"
                                key={category.id}
                                className={Number(selectedCategoryId) === Number(category.id) ? 'category-pill active' : 'category-pill'}
                                onClick={() => onSelectCategory({ id: category.id, name: category.name })}
                            >
                                {category.name}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
