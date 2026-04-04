'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Check, Coins, Zap, Star, Crown, Sparkles, Diamond } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TOKEN_PACKAGES = [
    { tokens: 20, price: 20000, label: '20.000đ', icon: Coins, color: '#64748b' },
    { tokens: 50, price: 50000, label: '50.000đ', icon: Zap, color: '#3b82f6' },
    { tokens: 100, price: 100000, label: '100.000đ', icon: Star, color: '#8b5cf6', popular: true },
    { tokens: 200, price: 200000, label: '200.000đ', icon: Crown, color: '#f59e0b' },
    { tokens: 500, price: 500000, label: '500.000đ', icon: Diamond, color: '#ec4899' },
];

export default function PricingPage() {
    const { user, tokenBalance, signInWithGoogle } = useAuth();
    const router = useRouter();

    function handleBuyTokens(tokens: number) {
        if (!user) {
            signInWithGoogle();
            return;
        }
        router.push(`/checkout?tokens=${tokens}`);
    }

    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <h1>Nạp Token</h1>
                <p>Nạp token để truy cập đề thi và khóa học trả phí</p>
                {user && (
                    <div className="pricing-current-balance">
                        <Coins size={20} />
                        <span>Số dư hiện tại: <strong>{tokenBalance} token</strong></span>
                    </div>
                )}
            </div>

            <div className="token-info-bar">
                <div className="token-info-item">
                    <Check size={16} className="icon-check" />
                    1 token = 1.000đ
                </div>
                <div className="token-info-item">
                    <Check size={16} className="icon-check" />
                    Thanh toán chuyển khoản
                </div>
                <div className="token-info-item">
                    <Check size={16} className="icon-check" />
                    Tự động nạp trong vài phút
                </div>
            </div>

            <div className="token-packages-grid">
                {TOKEN_PACKAGES.map((pkg) => {
                    const Icon = pkg.icon;
                    return (
                        <div
                            key={pkg.tokens}
                            className={`token-package-card ${pkg.popular ? 'popular' : ''}`}
                        >
                            {pkg.popular && <div className="pricing-badge">Phổ biến</div>}
                            <div className="token-package-icon" style={{ color: pkg.color }}>
                                <Icon size={32} />
                            </div>
                            <div className="token-package-amount">{pkg.tokens} token</div>
                            <div className="token-package-price">{pkg.label}</div>
                            <button
                                onClick={() => handleBuyTokens(pkg.tokens)}
                                className={`token-package-btn ${pkg.popular ? 'primary' : 'secondary'}`}
                            >
                                Nạp ngay
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="token-usage-info">
                <h3>Sử dụng token như thế nào?</h3>
                <div className="token-usage-grid">
                    <div className="token-usage-card">
                        <Sparkles size={24} color="#8b5cf6" />
                        <h4>Đề thi</h4>
                        <p>Trả token để xem toàn bộ nội dung và lời giải chi tiết cho mỗi đề thi trả phí.</p>
                    </div>
                    <div className="token-usage-card">
                        <Crown size={24} color="#f59e0b" />
                        <h4>Khóa học</h4>
                        <p>Trả token một lần để truy cập toàn bộ video bài giảng trong khóa học.</p>
                    </div>
                    <div className="token-usage-card">
                        <Coins size={24} color="#059669" />
                        <h4>Vĩnh viễn</h4>
                        <p>Nội dung đã mua sẽ được lưu vĩnh viễn, không giới hạn thời gian xem.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
