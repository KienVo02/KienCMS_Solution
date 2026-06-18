import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import authService from '../../services/authService';

function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (form.password.length < 6) {
            setMessage('Mật khẩu nên có ít nhất 6 ký tự.');
            return;
        }

        try {
            setSubmitting(true);
            setMessage('');
            const data = await authService.register(form);
            const customer = {
                id: data.customerId,
                fullName: data.fullName || form.fullName,
                email: data.email || form.email,
                phone: data.phone || form.phone,
                address: data.address || form.address,
            };

            window.localStorage.setItem('customer', JSON.stringify(customer));
            window.dispatchEvent(new Event('snackfood-auth-updated'));
            navigate(redirect);
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setMessage(apiMessage || 'Không thể đăng ký tài khoản.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="snack-page">
            <Header />
            <main className="auth-shell">
                <form className="auth-card" onSubmit={handleSubmit}>
                    <span className="eyebrow dark">Khách hàng mới</span>
                    <h1>Đăng ký</h1>
                    <label>
                        Họ tên
                        <input name="fullName" value={form.fullName} onChange={handleChange} required />
                    </label>
                    <label>
                        Email
                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Số điện thoại
                        <input name="phone" value={form.phone} onChange={handleChange} required />
                    </label>
                    <label>
                        Địa chỉ
                        <textarea name="address" value={form.address} onChange={handleChange} required rows="3" />
                    </label>
                    <label>
                        Mật khẩu
                        <input type="password" name="password" value={form.password} onChange={handleChange} required />
                    </label>
                    <button type="submit" className="snack-btn snack-btn-primary full-width" disabled={submitting}>
                        {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </button>
                    {message && <p className="form-message">{message}</p>}
                    <p className="auth-switch">
                        Đã có tài khoản? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}>Đăng nhập</Link>
                    </p>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default Register;
