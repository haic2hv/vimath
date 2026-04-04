'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Lock, Coins, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

type Props = {
    tokenPrice: number;
    itemType: 'exam' | 'course';
    itemSlug: string;
    children: ReactNode;
};

export default function ContentGate({ tokenPrice, itemType, itemSlug, children }: Props) {
    const { user, tokenBalance, loading, signInWithGoogle, refreshTokenBalance } = useAuth();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseError, setPurchaseError] = useState('');

    // Check if user has purchased this content
    const checkAccess = async () => {
        if (!user) return;
        setChecking(true);
        try {
            const res = await fetch(`/api/check-access?userId=${user.id}&itemType=${itemType}&itemSlug=${itemSlug}`);
            const data = await res.json();
            setHasAccess(data.hasAccess);
        } catch {
            setHasAccess(false);
        }
        setChecking(false);
    };

    // Check on mount if paid content
    if (tokenPrice > 0 && hasAccess === null && !checking && user && !loading) {
        checkAccess();
    }

    if (loading) {
        return null;
    }

    // Not logged in → require sign up
    if (!user) {
        return (
            <section className="premium-lock">
                <div className="premium-lock-content">
                    <div className="premium-lock-icon">
                        <LogIn size={28} color="white" />
                    </div>
                    <h2>Đăng nhập để xem nội dung</h2>
                    <p>
                        Bạn cần đăng nhập tài khoản HMath để xem bài viết này.
                        Đăng ký hoàn toàn miễn phí!
                    </p>
                    <div className="premium-lock-actions">
                        <button onClick={() => signInWithGoogle()} className="lock-btn-primary">
                            <LogIn size={16} />
                            Đăng nhập / Đăng ký
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Free content → show directly
    if (tokenPrice === 0) {
        return <>{children}</>;
    }

    // Checking access...
    if (hasAccess === null || checking) {
        return (
            <section className="premium-lock">
                <div className="premium-lock-content">
                    <Loader2 size={24} className="spin" />
                    <p>Đang kiểm tra quyền truy cập...</p>
                </div>
            </section>
        );
    }

    // Already purchased → show content
    if (hasAccess) {
        return <>{children}</>;
    }

    // Need to buy with tokens
    const handlePurchase = async () => {
        setPurchasing(true);
        setPurchaseError('');
        try {
            const res = await fetch('/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    itemType,
                    itemSlug,
                    tokenPrice,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setHasAccess(true);
                await refreshTokenBalance();
            } else if (res.status === 402) {
                setPurchaseError(`Bạn không đủ token. Cần ${tokenPrice} token, hiện có ${tokenBalance} token.`);
            } else if (res.status === 409) {
                setHasAccess(true);
            } else {
                setPurchaseError(data.error || 'Có lỗi xảy ra');
            }
        } catch {
            setPurchaseError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
        setPurchasing(false);
    };

    const formattedPrice = new Intl.NumberFormat('vi-VN').format(tokenPrice * 1000) + 'đ';

    return (
        <section className="premium-lock">
            <div className="premium-lock-content">
                <div className="premium-lock-icon">
                    <Lock size={28} color="white" />
                </div>
                <h2>Nội dung trả phí</h2>
                <p>
                    {itemType === 'exam'
                        ? 'Bài viết này yêu cầu trả token để xem toàn bộ nội dung và lời giải chi tiết.'
                        : 'Khóa học này yêu cầu trả token để truy cập toàn bộ bài giảng.'}
                </p>
                <div className="token-price-display">
                    <Coins size={20} />
                    <span className="token-price-amount">{tokenPrice} token</span>
                    <span className="token-price-vnd">({formattedPrice})</span>
                </div>
                <div className="token-balance-info">
                    Số dư hiện tại: <strong>{tokenBalance} token</strong>
                </div>

                {purchaseError && (
                    <div className="purchase-error">{purchaseError}</div>
                )}

                <div className="premium-lock-actions">
                    {tokenBalance >= tokenPrice ? (
                        <button
                            onClick={handlePurchase}
                            className="lock-btn-primary"
                            disabled={purchasing}
                        >
                            {purchasing ? (
                                <><Loader2 size={16} className="spin" /> Đang xử lý...</>
                            ) : (
                                <><Coins size={16} /> Trả {tokenPrice} token để xem</>
                            )}
                        </button>
                    ) : (
                        <Link href="/pricing" className="lock-btn-primary">
                            <Coins size={16} /> Nạp thêm token
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
