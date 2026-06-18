import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Shop from './pages/shop';
import ProductDetail from './pages/product-detail';
import Blog from './pages/blog';
import BlogDetail from './pages/blog/BlogDetail';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="container text-center py-5">
                <img src="/assets/snack-feature.jpg" alt="KienCMS.SnackFood" className="not-found-image" />
                <h1>404 - Không tìm thấy trang</h1>
                <p>Đường dẫn bạn truy cập không tồn tại trên KienCMS.SnackFood.</p>
                <Link to="/" className="snack-btn snack-btn-primary">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
}

export default App;
