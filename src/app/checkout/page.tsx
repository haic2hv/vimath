'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Coins, ArrowLeft, Copy, CheckCircle } from 'lucide-react';

const TOKEN_PACKAGES: Record<number, string> = {
    20: '20.000đ',
    50: '50.000đ',
    100: '100.000đ',
    200: '200.000đ',
    500: '500.000đ',
};

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="checkout-page"><p style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Đang tải...</p></div>}>
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderData, setOrderData] = useState<any>(null);
    const [creating, setCreating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const tokensParam = Number(searchParams.get('tokens') || 0);
    const isValidPackage = tokensParam > 0 && TOKEN_PACKAGES[tokensParam];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading]);

    async function createOrder() {
        if (!user || !isValidPackage) return;
        setCreating(true);
        setError('');

        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenPackage: tokensParam,
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

    if (!isValidPackage) {
        return (
            <div className="checkout-page">
                <div className="checkout-card">
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>Gói token không hợp lệ.</p>
                    <Link href="/pricing" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        Chọn gói nạp
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <Link href="/pricing" className="exam-back-link">
                <ArrowLeft size={16} />
                Quay lại chọn gói
            </Link>

            <div className="checkout-card">
                <div className="checkout-header">
                    <Coins size={28} color="#f59e0b" />
                    <h1>Nạp {tokensParam} Token</h1>
                    <p>Nạp token để sử dụng trên HMath</p>
                </div>

                {/* Order Summary */}
                <div className="checkout-summary">
                    <div className="checkout-row">
                        <span>Gói {tokensParam} token</span>
                        <span className="checkout-price">{TOKEN_PACKAGES[tokensParam]}</span>
                    </div>
                    <div className="checkout-row checkout-total">
                        <span>Tổng thanh toán</span>
                        <span className="checkout-price">{TOKEN_PACKAGES[tokensParam]}</span>
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
                                <span className="value">{orderData.formatAmount}</span>
                            </div>
                            <div className="checkout-info-row">
                                <span className="label">Token nhận được</span>
                                <span className="value">{orderData.tokenAmount} token</span>
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
                            Sau khi chuyển khoản đúng nội dung, hệ thống sẽ tự động nạp
                            token vào tài khoản của bạn trong vài phút.
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
