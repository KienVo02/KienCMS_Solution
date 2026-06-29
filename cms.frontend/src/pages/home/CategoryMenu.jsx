import React, { useEffect, useState } from 'react';
import categoryProductService from '../../services/categoryProductService';
import { toArray } from '../../utils/data';
import { getProductImageUrl } from '../../utils/media';

function CategoryMenu({ selectedCategoryId, onSelectCategory, onShowAll }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryProductService.getAllCategories();
                setCategories(toArray(data).filter((item) => item.isActive !== false));
            } catch {
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

                <div className="category-card-grid">
                    <button
                        type="button"
                        className={Number(selectedCategoryId) === 0 ? 'category-card active' : 'category-card'}
                        onClick={onShowAll}
                    >
                        <span className="category-card-image">
                            <img src="/assets/snack-feature.jpg" alt="Tất cả sản phẩm" />
                        </span>
                        <strong>Tất cả</strong>
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
                                className={Number(selectedCategoryId) === Number(category.id) ? 'category-card active' : 'category-card'}
                                onClick={() => onSelectCategory({ id: category.id, name: category.name })}
                            >
                                <span className="category-card-image">
                                    <img src={getProductImageUrl(category.imageUrl)} alt={category.name} />
                                </span>
                                <strong>{category.name}</strong>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
