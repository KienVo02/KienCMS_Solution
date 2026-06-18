import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { toArray } from '../../utils/data';

function ProductGrid({ categoryId, categoryName }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(toArray(data));
            } catch (error) {
                console.error('Lỗi tải sản phẩm:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const visibleProducts = useMemo(() => {
        const filtered = Number(categoryId) === 0
            ? products
            : products.filter((item) => Number(item.categoryProductId) === Number(categoryId));

        return filtered.slice(0, 6);
    }, [categoryId, products]);

    return (
        <section className="product-showcase" id="home-products">
            <div className="container">
                <div className="section-heading-row">
                    <div className="section-title">
                        <span>Sản phẩm nổi bật</span>
                        <h2>{categoryName}</h2>
                    </div>
                    <Link to="/shop" className="text-link">
                        Xem toàn bộ cửa hàng
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p>Đang tải sản phẩm...</p>
                    </div>
                ) : visibleProducts.length === 0 ? (
                    <div className="empty-state">Chưa có sản phẩm trong danh mục này.</div>
                ) : (
                    <div className="product-grid">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProductGrid;
