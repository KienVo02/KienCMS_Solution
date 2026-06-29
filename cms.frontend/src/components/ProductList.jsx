import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import productService from '../services/productService';
import { toArray } from '../utils/data';

const ProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(toArray(data));
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const visibleProducts = useMemo(() => (
        Number(categoryId || 0) === 0
            ? products
            : products.filter((item) => Number(item.categoryProductId) === Number(categoryId))
    ), [categoryId, products]);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner-border text-warning" role="status"></div>
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (visibleProducts.length === 0) {
        return (
            <div className="empty-state illustrated-empty">
                <img src="/assets/snack-feature.jpg" alt="Không tìm thấy sản phẩm" />
                <strong>Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</strong>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
