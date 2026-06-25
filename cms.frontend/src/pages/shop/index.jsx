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
    const [searchParams] = useSearchParams();
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
        const fetchShopData = async () => {
            try {
                setLoading(true);
                const [productData, categoryData] = await Promise.all([
                    productService.getAllProducts(),
                    categoryProductService.getAllCategories(),
                ]);

                setProducts(toArray(productData));
                setCategories(toArray(categoryData).filter((item) => item.isActive !== false));
            } catch (error) {
                console.error('Lỗi tải dữ liệu cửa hàng:', error);
                setProducts([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchShopData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [maxPrice, minPrice, searchTerm, selectedCategoryId]);

    const filteredProducts = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        const min = minPrice ? Number(minPrice) : 0;
        const max = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;

        return products.filter((product) => {
            const price = Number(product.price || 0);
            const matchesCategory = Number(selectedCategoryId) === 0
                || Number(product.categoryProductId) === Number(selectedCategoryId);
            const matchesSearch = !keyword
                || String(product.name || '').toLowerCase().includes(keyword)
                || String(product.categoryName || '').toLowerCase().includes(keyword);
            const matchesPrice = price >= min && price <= max;

            return matchesCategory && matchesSearch && matchesPrice;
        });
    }, [maxPrice, minPrice, products, searchTerm, selectedCategoryId]);

    const pagedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * SHOP_PAGE_SIZE;
        return filteredProducts.slice(startIndex, startIndex + SHOP_PAGE_SIZE);
    }, [currentPage, filteredProducts]);

    const handlePageChange = (page) => {
        const totalPages = Math.ceil(filteredProducts.length / SHOP_PAGE_SIZE);
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
    };

    const clearFilters = () => {
        setSelectedCategoryId(0);
        setSearchTerm('');
        setMinPrice('');
        setMaxPrice('');
        setCurrentPage(1);
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
                                resultCount={filteredProducts.length}
                                onSearchChange={setSearchTerm}
                                onClearFilters={clearFilters}
                            />

                            <LoadingOrEmpty
                                loading={loading}
                                isEmpty={filteredProducts.length === 0}
                                emptyTitle="Không tìm thấy sản phẩm"
                                emptyText="Thử đổi danh mục, khoảng giá hoặc từ khóa tìm kiếm."
                            >
                                <>
                                    <ProductList products={pagedProducts} />
                                    <Pagination
                                        currentPage={currentPage}
                                        totalItems={filteredProducts.length}
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
