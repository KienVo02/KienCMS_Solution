import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { CART_EVENT, getCartCount } from '../utils/cart';

const getStoredCustomer = () => {
    try {
        const stored = window.localStorage.getItem('customer');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [cartCount, setCartCount] = useState(getCartCount());
    const [customer, setCustomer] = useState(getStoredCustomer());

    useEffect(() => {
        const syncHeader = () => {
            setCartCount(getCartCount());
            setCustomer(getStoredCustomer());
        };

        window.addEventListener(CART_EVENT, syncHeader);
        window.addEventListener('snackfood-auth-updated', syncHeader);
        window.addEventListener('storage', syncHeader);

        return () => {
            window.removeEventListener(CART_EVENT, syncHeader);
            window.removeEventListener('snackfood-auth-updated', syncHeader);
            window.removeEventListener('storage', syncHeader);
        };
    }, []);

    useEffect(() => {
        const keyword = searchTerm.trim();

        if (!keyword) {
            return undefined;
        }

        const timer = window.setTimeout(async () => {
            try {
                await productService.searchProducts({ keyword });
            } catch {
                // UI kết quả ở trang Shop sẽ xử lý trạng thái rỗng nếu API không trả dữ liệu.
            }

            const target = `/shop?search=${encodeURIComponent(keyword)}`;
            if (`${location.pathname}${location.search}` !== target) {
                navigate(target, { replace: location.pathname === '/shop' });
            }
        }, 350);

        return () => window.clearTimeout(timer);
    }, [location.pathname, location.search, navigate, searchTerm]);

    const handleSearch = (event) => {
        event.preventDefault();
        const keyword = searchTerm.trim();
        navigate(keyword ? `/shop?search=${encodeURIComponent(keyword)}` : '/shop');
    };

    const handleLogout = () => {
        window.localStorage.removeItem('customer');
        window.dispatchEvent(new Event('snackfood-auth-updated'));
        navigate('/');
    };

    return (
        <header className="site-header">
            <div className="container header-grid">
                <Link to="/" className="brand-link" aria-label="KienCMS.SnackFood">
                    <span className="brand-mark">KS</span>
                    <span>
                        <strong>KienCMS</strong>
                        <small>.SnackFood</small>
                    </span>
                </Link>

                <nav className="main-nav" aria-label="Điều hướng chính">
                    <NavLink to="/" end>Trang chủ</NavLink>
                    <NavLink to="/shop">Cửa hàng</NavLink>
                    <NavLink to="/blog">Tin tức</NavLink>
                    <NavLink to="/checkout">Thanh toán</NavLink>
                </nav>

                <form className="header-search" onSubmit={handleSearch}>
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        type="search"
                        placeholder="Tìm bánh tráng, snack, nước uống..."
                        aria-label="Tìm kiếm sản phẩm"
                    />
                    <button type="submit" aria-label="Tìm kiếm">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>

                <div className="header-actions">
                    <Link to="/cart" className="cart-button" aria-label="Giỏ hàng">
                        <i className="fa-solid fa-bag-shopping"></i>
                        <span>{cartCount}</span>
                    </Link>

                    {customer ? (
                        <button type="button" className="account-chip" onClick={handleLogout}>
                            <i className="fa-solid fa-circle-user"></i>
                            <span>{customer.fullName || customer.FullName || 'Khách hàng'}</span>
                        </button>
                    ) : (
                        <Link to="/login" className="account-chip">
                            <i className="fa-solid fa-circle-user"></i>
                            <span>Đăng nhập</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
