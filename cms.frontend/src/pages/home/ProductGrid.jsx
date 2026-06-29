import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { toArray } from '../../utils/data';

const PRODUCT_PAGE_SIZE = 6;

function ProductGrid({ categoryId, categoryName }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(toArray(data));
                setCurrentPage(1);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [categoryId]);

    const filteredProducts = useMemo(() => (
        Number(categoryId) === 0
            ? products
            : products.filter((item) => Number(item.categoryProductId) === Number(categoryId))
    ), [categoryId, products]);

    const visibleProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCT_PAGE_SIZE;
        return filteredProducts.slice(startIndex, startIndex + PRODUCT_PAGE_SIZE);
    }, [currentPage, filteredProducts]);

    const handlePageChange = (page) => {
        const totalPages = Math.ceil(filteredProducts.length / PRODUCT_PAGE_SIZE);
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
    };

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
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">Chưa có sản phẩm trong danh mục này.</div>
                ) : (
                    <>
                        <div className="product-grid">
                            {visibleProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredProducts.length}
                            pageSize={PRODUCT_PAGE_SIZE}
                            onPageChange={handlePageChange}
                            itemLabel="sản phẩm"
                        />
                    </>
                )}
            </div>
        </section>
    );
}

export default ProductGrid;
