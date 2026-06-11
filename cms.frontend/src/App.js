// Họ và tên: Võ Trung Kiên - MSSV: 2123110044
// Chức năng: Giao diện tổng thể hoàn thiện Buổi 7 - Tích hợp Real-time Sản phẩm và Blog Tin tức
import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList'; // BỔ SUNG: Import component Tin tức vào đây
import './App.css';

function App() {
    return (
        <div className="container mt-5">
            {/* Phần Header của Website */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    🛒 HỆ THỐNG CỬA HÀNG TRỰC TUYẾN - KIENCMS RETAIL
                </span>
            </header>

            <div className="row">
                {/* Cột bên trái (Sidebar): Bộ lọc danh mục sản phẩm */}
                <div className="col-md-3">
                    <CategoryProductList />
                </div>

                {/* Cột bên phải (Main Content): Hiển thị đồng thời Sản phẩm và Xu hướng phối đồ */}
                <div className="col-md-9">
                    {/* KHU VỰC 1: SẢN PHẨM THỜI TRANG */}
                    <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                        <i className="fa-solid fa-shirt text-success mr-2"></i>Bộ sưu tập mới nhất
                    </h4>
                    <ProductList />

                    {/* KHU VỰC 2: BLOG & TIN TỨC (BỔ SUNG ĐỂ HOÀN THÀNH 100% BUỔI 7) */}
                    <PostList />
                </div>
            </div>
        </div>
    );
}

export default App;