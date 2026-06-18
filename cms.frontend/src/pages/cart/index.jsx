import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { formatCurrency } from '../../utils/formatters';
import { getCartItems, saveCartItems } from '../../utils/cart';
import CartTable from './CartTable';

function Cart() {
    const [items, setItems] = useState(getCartItems());
    const total = useMemo(() => (
        items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
    ), [items]);

    const persist = (nextItems) => {
        setItems(nextItems);
        saveCartItems(nextItems);
    };

    const handleQuantityChange = (productId, nextQuantity) => {
        const nextItems = items.map((item) => {
            if (Number(item.id) !== Number(productId)) {
                return item;
            }

            const stock = Number(item.stockQuantity || 0);
            const quantity = Math.max(1, Math.min(Number(nextQuantity || 1), stock || 1));
            return { ...item, quantity };
        });

        persist(nextItems);
    };

    const handleRemove = (productId) => {
        persist(items.filter((item) => Number(item.id) !== Number(productId)));
    };

    return (
        <div className="snack-page">
            <Header />
            <main className="page-shell">
                <div className="container">
                    <div className="page-title-row">
                        <div>
                            <span className="eyebrow dark">Giỏ hàng</span>
                            <h1>Món bạn đã chọn</h1>
                        </div>
                        <p>Tổng tạm tính: <strong>{formatCurrency(total)}</strong></p>
                    </div>

                    {items.length === 0 ? (
                        <div className="empty-state">
                            <strong>Giỏ hàng đang trống</strong>
                            <p>Chọn vài món ăn vặt yêu thích trước khi thanh toán.</p>
                            <Link to="/shop" className="snack-btn snack-btn-primary">Đến cửa hàng</Link>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            <CartTable
                                items={items}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />

                            <aside className="cart-summary">
                                <h2>Tóm tắt đơn hàng</h2>
                                <div className="summary-line">
                                    <span>Số loại món</span>
                                    <strong>{items.length}</strong>
                                </div>
                                <div className="summary-line">
                                    <span>Tổng số lượng</span>
                                    <strong>{items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</strong>
                                </div>
                                <div className="summary-total">
                                    <span>Tạm tính</span>
                                    <strong>{formatCurrency(total)}</strong>
                                </div>
                                <Link to="/checkout" className="snack-btn snack-btn-primary full-width">
                                    Thanh toán
                                </Link>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Cart;
