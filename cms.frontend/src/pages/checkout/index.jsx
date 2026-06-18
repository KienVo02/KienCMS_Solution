import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import orderService from '../../services/orderService';
import { clearCart, getCartItems } from '../../utils/cart';
import { formatCurrency } from '../../utils/formatters';

const getCustomer = () => {
    try {
        const stored = window.localStorage.getItem('customer');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

function Checkout() {
    const navigate = useNavigate();
    const customer = getCustomer();
    const [items, setItems] = useState(getCartItems());
    const [form, setForm] = useState({
        receiverName: customer?.fullName || customer?.FullName || '',
        phone: customer?.phone || customer?.Phone || '',
        address: customer?.address || customer?.Address || '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const total = useMemo(() => (
        items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
    ), [items]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!customer) {
            navigate('/login?redirect=/checkout');
            return;
        }

        if (items.length === 0) {
            setMessage('Giỏ hàng đang trống.');
            return;
        }

        try {
            setSubmitting(true);
            setMessage('');

            const payload = {
                customerId: customer.id || customer.Id || customer.customerId,
                notes: [
                    `Người nhận: ${form.receiverName}`,
                    `SĐT: ${form.phone}`,
                    `Địa chỉ: ${form.address}`,
                    form.notes ? `Ghi chú: ${form.notes}` : '',
                ].filter(Boolean).join(' | '),
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: Number(item.quantity || 1),
                })),
            };

            const result = await orderService.createOrder(payload);
            clearCart();
            setItems([]);
            setMessage(result?.message || 'Đặt hàng thành công!');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setMessage(apiMessage || 'Không thể đặt hàng. Vui lòng kiểm tra API Orders.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!customer) {
        return (
            <div className="snack-page">
                <Header />
                <main className="page-shell">
                    <div className="container">
                        <div className="empty-state">
                            <strong>Bạn cần đăng nhập trước khi thanh toán</strong>
                            <p>Tài khoản khách hàng giúp hệ thống ghi nhận đơn hàng chính xác.</p>
                            <Link to="/login?redirect=/checkout" className="snack-btn snack-btn-primary">Đăng nhập</Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="snack-page">
            <Header />
            <main className="page-shell">
                <div className="container">
                    <div className="page-title-row">
                        <div>
                            <span className="eyebrow dark">Thanh toán</span>
                            <h1>Xác nhận đặt món</h1>
                        </div>
                        <p>Tổng đơn hàng: <strong>{formatCurrency(total)}</strong></p>
                    </div>

                    <div className="checkout-layout">
                        <form className="checkout-form" onSubmit={handleSubmit}>
                            <label>
                                Người nhận
                                <input name="receiverName" value={form.receiverName} onChange={handleChange} required />
                            </label>
                            <label>
                                Số điện thoại
                                <input name="phone" value={form.phone} onChange={handleChange} required />
                            </label>
                            <label>
                                Địa chỉ giao hàng
                                <textarea name="address" value={form.address} onChange={handleChange} required rows="3" />
                            </label>
                            <label>
                                Ghi chú
                                <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder="Ví dụ: giao giờ hành chính" />
                            </label>
                            <button type="submit" className="snack-btn snack-btn-primary" disabled={submitting || items.length === 0}>
                                {submitting ? 'Đang gửi đơn...' : 'Xác nhận đặt hàng'}
                            </button>
                            {message && <p className="form-message">{message}</p>}
                        </form>

                        <aside className="checkout-summary">
                            <h2>Đơn của bạn</h2>
                            {items.length === 0 ? (
                                <p>Giỏ hàng đã được làm sạch.</p>
                            ) : (
                                items.map((item) => (
                                    <div className="checkout-item" key={item.id}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <strong>{formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</strong>
                                    </div>
                                ))
                            )}
                            <div className="summary-total">
                                <span>Tổng cộng</span>
                                <strong>{formatCurrency(total)}</strong>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Checkout;
