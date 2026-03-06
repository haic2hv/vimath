'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có tối thiểu 6 ký tự.');
            return;
        }

        setLoading(true);

        const { error, needsConfirmation } = await signUp(email, password);

        if (error) {
            setError('Không thể tạo tài khoản. Vui lòng thử lại.');
            setLoading(false);
        } else if (needsConfirmation) {
            setSuccess('Đã gửi email xác nhận! Vui lòng kiểm tra hộp thư của bạn.');
            setLoading(false);
        } else {
            router.push('/');
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Tạo tài khoản</h1>
                <p className="auth-subtitle">Đăng ký để truy cập đề thi và lời giải</p>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Tối thiểu 6 ký tự"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirm-password">Xác nhận mật khẩu</label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="form-input"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="auth-footer">
                    Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}
