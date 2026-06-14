// Họ và tên: Vo Trung Kien - MSSV: 2123110044
// Chức năng: Trang chủ HOTFOOD - E-Commerce + CMS Blog - Buổi 8

import React, { useState } from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import './App.css';

function App() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [selectedCategoryName, setSelectedCategoryName] = useState('Tất cả sản phẩm');

    const handleSelectCategory = (category) => {
        setSelectedCategoryId(category.id);
        setSelectedCategoryName(category.name);
    };

    const handleShowAllProducts = () => {
        setSelectedCategoryId(0);
        setSelectedCategoryName('Tất cả sản phẩm');
    };

    return (
        <div className="hotfood-store">
            {/* NAVBAR */}
            <nav className="hotfood-navbar shadow-sm">
                <div className="container d-flex align-items-center justify-content-between">
                    <a className="hotfood-logo" href="/">
                        🍔 HOTFOOD - Đồ Ăn Vặt Online
                    </a>

                    <form className="hotfood-search d-none d-md-flex">
                        <input
                            type="search"
                            placeholder="Tìm bánh tráng, trà sữa, gà rán, snack..."
                        />
                        <button type="submit">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>

                    <div className="hotfood-actions">
                        <a href="/cart" className="cart-link">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span>0</span>
                        </a>

                        <div className="user-box">
                            <i className="fa-solid fa-circle-user"></i>
                            <strong>Vo Trung Kien</strong>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="hotfood-hero">
                <div className="hotfood-hero-overlay"></div>

                <div className="container hero-content">
                    <span className="hero-badge">
                        Đồ ăn vặt hot trend mỗi ngày
                    </span>

                    <h1>
                        Ăn Vặt Cực Đã, Giao Hàng Cực Nhanh
                    </h1>

                    <p>
                        HOTFOOD chuyên cung cấp bánh tráng, snack, trà sữa,
                        gà rán, xiên que, đồ chiên và các món ăn vặt được giới trẻ yêu thích.
                    </p>

                    <a href="#products-section" className="hero-btn">
                        <i className="fa-solid fa-utensils mr-2"></i>
                        Xem món ngon ngay
                    </a>
                </div>
            </section>

            {/* DANH MỤC SẢN PHẨM Ở PHÍA TRÊN */}
            <div className="container">
                <CategoryProductList
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={handleSelectCategory}
                    onShowAll={handleShowAllProducts}
                />
            </div>

            {/* SẢN PHẨM */}
            <main className="container" id="products-section">
                <section className="hotfood-section">
                    <div className="section-heading">
                        <div>
                            <span className="section-small-title">
                                Sản phẩm từ API
                            </span>

                            <h2>
                                🔥 {selectedCategoryName}
                            </h2>
                        </div>

                        <p>
                            Hiển thị sản phẩm theo danh mục đã chọn
                        </p>
                    </div>

                    <ProductList
                        categoryId={selectedCategoryId}
                        categoryName={selectedCategoryName}
                    />
                </section>

                {/* TIN TỨC */}
                <section className="hotfood-section mt-5">
                    <div className="section-heading">
                        <div>
                            <span className="section-small-title">
                                CMS Tin tức
                            </span>

                            <h2>
                                📰 Tin tức & mẹo ăn vặt
                            </h2>
                        </div>

                        <p>
                            3 bài viết mới nhất từ hệ thống quản trị
                        </p>
                    </div>

                    <PostList limit={3} />
                </section>
            </main>

            {/* FOOTER */}
            <footer className="hotfood-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <h5>🍟 HOTFOOD STORE</h5>
                            <p>
                                Website bán đồ ăn vặt online tích hợp ASP.NET Core Web API
                                và ReactJS. Hệ thống hỗ trợ danh mục, sản phẩm và tin tức CMS.
                            </p>
                        </div>

                        <div className="col-md-4 mb-4">
                            <h5>📞 Liên hệ</h5>
                            <p>Sinh viên: Vo Trung Kien</p>
                            <p>MSSV: 2123110044</p>
                            <p>Chuyên đề ASP.NET Core + ReactJS</p>
                        </div>

                        <div className="col-md-4 mb-4">
                            <h5>📬 Nhận ưu đãi</h5>

                            <div className="footer-email">
                                <input type="text" placeholder="Nhập email của bạn..." />
                                <button>Gửi</button>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        © 2026 HOTFOOD Store. Đồ án thực hành ReactJS gọi dữ liệu từ ASP.NET Core Web API.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;