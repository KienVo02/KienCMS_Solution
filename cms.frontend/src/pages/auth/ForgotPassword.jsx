import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import authService from '../../services/authService';

function ForgotPassword() {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSendCode = async (event) => {
        event.preventDefault();

        if (!email.trim()) {
            setMessage('Vui lòng nhập email đã đăng ký.');
            return;
        }

        try {
            setSubmitting(true);
            setMessage('');
            const result = await authService.forgotPassword({ email: email.trim() });
            const sent = result?.emailSent !== false;
            setEmailSent(sent);
            setMessage(sent
                ? (result?.message || 'Mã xác nhận gồm 6 số đã được gửi đến email của bạn.')
                : 'Gmail SMTP chưa gửi được mã. Mã demo đã được lưu tại CMS.Backend/wwwroot/email-outbox.');
            setStep('code');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setEmailSent(null);
            setMessage(apiMessage || 'Không thể gửi mã xác nhận lúc này.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyCode = async (event) => {
        event.preventDefault();

        if (!/^\d{6}$/.test(code.trim())) {
            setMessage('Vui lòng nhập mã xác nhận gồm đúng 6 số.');
            return;
        }

        try {
            setSubmitting(true);
            setMessage('');
            const result = await authService.verifyResetCode({
                email: email.trim(),
                code: code.trim(),
            });
            setMessage(result?.message || 'Mã xác nhận chính xác. Vui lòng nhập mật khẩu mới.');
            setStep('reset');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setMessage(apiMessage || 'Mã xác nhận không đúng hoặc đã hết hạn.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (newPassword.length < 6) {
            setMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            setSubmitting(true);
            setMessage('');
            const result = await authService.resetPassword({
                email: email.trim(),
                code: code.trim(),
                newPassword,
                confirmPassword,
            });
            setMessage(result?.message || 'Đặt lại mật khẩu thành công.');
            setStep('done');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const apiMessage = error?.response?.data?.message;
            setMessage(apiMessage || 'Không thể đặt lại mật khẩu lúc này.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStep = () => {
        if (step === 'code') {
            return (
                <form className="auth-card" onSubmit={handleVerifyCode}>
                    <span className="eyebrow dark">Xác nhận email</span>
                    <h1>Nhập mã 6 số</h1>
                    <p className="auth-helper">
                        {emailSent === false
                            ? `Gmail chưa nhận được mã vì SMTP đang bị từ chối. Kiểm tra file mới nhất trong CMS.Backend/wwwroot/email-outbox cho ${email.trim()}.`
                            : `Mã xác nhận đã được gửi tới ${email.trim()}.`}
                    </p>
                    <label>
                        Mã xác nhận
                        <input
                            className="code-input"
                            inputMode="numeric"
                            maxLength="6"
                            value={code}
                            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            required
                        />
                    </label>
                    <button type="submit" className="snack-btn snack-btn-primary full-width" disabled={submitting}>
                        {submitting ? 'Đang kiểm tra...' : 'Xác nhận mã'}
                    </button>
                    <button
                        type="button"
                        className="auth-link-button"
                        onClick={handleSendCode}
                        disabled={submitting}
                    >
                        Gửi lại mã
                    </button>
                    {message && <p className="form-message">{message}</p>}
                </form>
            );
        }

        if (step === 'reset') {
            return (
                <form className="auth-card" onSubmit={handleResetPassword}>
                    <span className="eyebrow dark">Tạo mật khẩu mới</span>
                    <h1>Reset password</h1>
                    <label>
                        Mật khẩu mới
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Xác nhận mật khẩu mới
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" className="snack-btn snack-btn-primary full-width" disabled={submitting}>
                        {submitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                    {message && <p className="form-message">{message}</p>}
                </form>
            );
        }

        if (step === 'done') {
            return (
                <div className="auth-card">
                    <span className="eyebrow dark">Hoàn tất</span>
                    <h1>Đổi mật khẩu thành công</h1>
                    {message && <p className="form-message">{message}</p>}
                    <Link to="/login" className="snack-btn snack-btn-primary full-width">
                        Đăng nhập
                    </Link>
                </div>
            );
        }

        return (
            <form className="auth-card" onSubmit={handleSendCode}>
                <span className="eyebrow dark">Khôi phục tài khoản</span>
                <h1>Quên mật khẩu</h1>
                <label>
                    Email đã đăng ký
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>
                <button type="submit" className="snack-btn snack-btn-primary full-width" disabled={submitting}>
                    {submitting ? 'Đang gửi mã...' : 'Gửi mã xác nhận'}
                </button>
                {message && <p className="form-message">{message}</p>}
                <p className="auth-switch">
                    Nhớ mật khẩu? <Link to="/login">Đăng nhập</Link>
                </p>
            </form>
        );
    };

    return (
        <div className="snack-page">
            <Header />
            <main className="auth-shell">
                {renderStep()}
            </main>
            <Footer />
        </div>
    );
}

export default ForgotPassword;
