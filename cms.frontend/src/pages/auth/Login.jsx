import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import authService from '../../services/authService';

function normalizeCustomer(data) {
    const customer = data?.customer || data;
    return {
        id: customer?.id || customer?.Id || customer?.customerId,
        fullName: customer?.fullName || customer?.FullName || 'Khách hàng',
        email: customer?.email || customer?.Email,
        phone: customer?.phone || customer?.Phone,
        address: customer?.address || customer?.Address,
    };
}

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.email || !form.password) {
            setMessage('Vui lòng nhập email và mật khẩu.');
            return;
        }

        try {
            setSubmitting(true);
            setMessage('');
            const data = await authService.login(form);
            window.localStorage.setItem('customer', JSON.stringify(normalizeCustomer(data)));
            window.dispatchEvent(new Event('snackfood-auth-updated'));
            navigate(redirect);
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setMessage(apiMessage || 'Email hoặc mật khẩu không đúng.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="snack-page">
            <Header />
            <main className="auth-shell">
                <form className="auth-card" onSubmit={handleSubmit}>
                    <span className="eyebrow dark">Tài khoản khách hàng</span>
                    <h1>Đăng nhập</h1>
                    <label>
                        Email
                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Mật khẩu
                        <input type="password" name="password" value={form.password} onChange={handleChange} required />
                    </label>
                    <Link to="/forgot-password" className="auth-forgot-link">
                        Quên mật khẩu?
                    </Link>
                    <button type="submit" className="snack-btn snack-btn-primary full-width" disabled={submitting}>
                        {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    {message && <p className="form-message">{message}</p>}
                    <p className="auth-switch">
                        Chưa có tài khoản? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>Đăng ký</Link>
                    </p>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default Login;
