'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ArrowLeft, Copy, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
    const { user, isPremium, loading } = useAuth();
    const router = useRouter();
    const [orderData, setOrderData] = useState<any>(null);
    const [creating, setCreating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (!loading && isPremium) {
            router.push('/profile');
        }
    }, [user, loading, isPremium]);

    async function createOrder() {
        if (!user) return;
        setCreating(true);
        setError('');

        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: '12months',
                    userId: user.id,
                    email: user.email,
                }),
            });

            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setOrderData(data);
            }
        } catch {
            setError('Không thể tạo đơn hàng. Vui lòng thử lại.');
        } finally {
            setCreating(false);
        }
    }

    function copyContent() {
        if (orderData?.paymentContent) {
            navigator.clipboard.writeText(orderData.paymentContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    if (loading) {
        return <div className="checkout-page"><p style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Đang tải...</p></div>;
    }

    return (
        <div className="checkout-page">
            <Link href="/pricing" className="exam-back-link">
                <ArrowLeft size={16} />
                Quay lại bảng giá
            </Link>

            <div className="checkout-card">
                <div className="checkout-header">
                    <Crown size={28} color="#f59e0b" />
                    <h1>Đăng ký Thành viên</h1>
                    <p>Mở khóa toàn bộ nội dung trong 1 năm</p>
                </div>

                {/* Order Summary */}
                <div className="checkout-summary">
                    <div className="checkout-row">
                        <span>Gói Thành viên (12 tháng)</span>
                        <span className="checkout-price">59.000đ</span>
                    </div>
                    <div className="checkout-row checkout-total">
                        <span>Tổng thanh toán</span>
                        <span className="checkout-price">59.000đ</span>
                    </div>
                </div>

                {!orderData ? (
                    <>
                        {error && <p className="checkout-error">{error}</p>}
                        <button
                            onClick={createOrder}
                            className="btn-primary checkout-btn"
                            disabled={creating}
                        >
                            {creating ? 'Đang xử lý...' : 'Thanh toán ngay'}
                        </button>
                    </>
                ) : (
                    <div className="checkout-payment">
                        <h3>📱 Chuyển khoản để hoàn tất</h3>

                        {orderData.qrUrl && (
                            <div className="checkout-qr">
                                <img src={orderData.qrUrl} alt="QR thanh toán" />
                                <p>Quét mã QR bằng app ngân hàng</p>
                            </div>
                        )}

                        <div className="checkout-info">
                            <div className="checkout-info-row">
                                <span className="label">Số tiền</span>
                                <span className="value">5.000đ</span>
                            </div>
                            <div className="checkout-info-row">
                                <span className="label">Mã đơn hàng</span>
                                <span className="value mono">{orderData.orderCode}</span>
                            </div>
                        </div>

                        <div className="checkout-content-box">
                            <div className="label">⚠️ NỘI DUNG CHUYỂN KHOẢN (bắt buộc)</div>
                            <div className="code-row">
                                <span className="code">{orderData.paymentContent}</span>
                                <button onClick={copyContent} className="copy-btn">
                                    {copied ? <CheckCircle size={16} color="#059669" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <p className="checkout-note">
                            Sau khi chuyển khoản đúng nội dung, hệ thống sẽ tự động kích hoạt
                            tài khoản Thành viên cho bạn trong vài phút.
                        </p>

                        <Link href="/" className="btn-secondary" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                            Về trang chủ
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
