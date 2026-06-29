import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { toArray } from '../../utils/data';

function HomeProductSection({ title, eyebrow, type }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = type === 'best-sellers'
                    ? await productService.getBestSellerProducts(3)
                    : await productService.getLatestProducts(3);
                setProducts(toArray(data).slice(0, 3));
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [type]);

    return (
        <section className="home-product-strip">
            <div className="container">
                <div className="section-heading-row">
                    <div className="section-title">
                        <span>{eyebrow}</span>
                        <h2>{title}</h2>
                    </div>
                    <Link to="/shop" className="text-link">
                        Xem cửa hàng
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border text-warning" role="status"></div>
                        <p>Đang tải sản phẩm...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state compact-empty">
                        <img src="/assets/snack-feature.jpg" alt="Không tìm thấy sản phẩm" />
                        <strong>Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</strong>
                    </div>
                ) : (
                    <div className="product-grid compact three-up">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default HomeProductSection;
