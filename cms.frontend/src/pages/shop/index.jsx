import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pagination from '../../components/Pagination';
import categoryProductService from '../../services/categoryProductService';
import productService from '../../services/productService';
import { toArray } from '../../utils/data';
import LoadingOrEmpty from './LoadingOrEmpty';
import ProductList from './ProductList';
import ShopHeader from './ShopHeader';
import ShopSidebar from './ShopSidebar';

const SHOP_PAGE_SIZE = 6;

function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(Number(searchParams.get('category') || 0));
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
        setSelectedCategoryId(Number(searchParams.get('category') || 0));
        setCurrentPage(1);
    }, [searchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await categoryProductService.getAllCategories();
                setCategories(toArray(categoryData).filter((item) => item.isActive !== false));
            } catch {
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        let cancelled = false;

        const timer = window.setTimeout(async () => {
            try {
                setLoading(true);
                const data = await productService.searchProducts({
                    keyword: searchTerm.trim() || undefined,
                    categoryProductId: Number(selectedCategoryId) || undefined,
                    minPrice: minPrice !== '' ? Number(minPrice) : undefined,
                    maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
                });

                if (!cancelled) {
                    setProducts(toArray(data));
                    setCurrentPage(1);
                }
            } catch {
                if (!cancelled) {
                    setProducts([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [maxPrice, minPrice, searchTerm, selectedCategoryId]);

    const pagedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * SHOP_PAGE_SIZE;
        return products.slice(startIndex, startIndex + SHOP_PAGE_SIZE);
    }, [currentPage, products]);

    const handlePageChange = (page) => {
        const totalPages = Math.ceil(products.length / SHOP_PAGE_SIZE) || 1;
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
    };

    const clearFilters = () => {
        setSelectedCategoryId(0);
        setSearchTerm('');
        setMinPrice('');
        setMaxPrice('');
        setCurrentPage(1);
        setSearchParams({});
    };

    return (
        <div className="snack-page">
            <Header />
            <main className="page-shell">
                <div className="container">
                    <div className="page-title-row">
                        <div>
                            <span className="eyebrow dark">Cửa hàng</span>
                            <h1>SnackFood Shop</h1>
                        </div>
                        <p>Lọc món theo danh mục, khoảng giá và từ khóa tìm kiếm.</p>
                    </div>

                    <div className="shop-layout">
                        <ShopSidebar
                            categories={categories}
                            selectedCategoryId={selectedCategoryId}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onCategoryChange={setSelectedCategoryId}
                            onMinPriceChange={setMinPrice}
                            onMaxPriceChange={setMaxPrice}
                            onClearFilters={clearFilters}
                        />

                        <section className="shop-main">
                            <ShopHeader
                                searchTerm={searchTerm}
                                resultCount={products.length}
                                onSearchChange={setSearchTerm}
                                onClearFilters={clearFilters}
                            />

                            <LoadingOrEmpty
                                loading={loading}
                                isEmpty={products.length === 0}
                                emptyTitle="Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn"
                                emptyText="Thử đổi danh mục, khoảng giá hoặc từ khóa tìm kiếm."
                            >
                                <>
                                    <ProductList products={pagedProducts} />
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={products.length}
                                        pageSize={SHOP_PAGE_SIZE}
                                        onPageChange={handlePageChange}
                                        itemLabel="sản phẩm"
                                    />
                                </>
                            </LoadingOrEmpty>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Shop;
