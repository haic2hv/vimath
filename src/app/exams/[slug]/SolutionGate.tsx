'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Lock, Crown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

type Props = {
    isFree: boolean;
    children: ReactNode;
};

export default function SolutionGate({ isFree, children }: Props) {
    const { user, isPremium, loading, signInWithGoogle } = useAuth();

    if (loading) {
        return null;
    }

    // Free articles: everyone can see
    if (isFree) {
        return <>{children}</>;
    }

    // Member articles: only members can see ANYTHING
    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <section className="premium-lock">
            <div className="premium-lock-content">
                <div className="premium-lock-icon">
                    <Lock size={28} color="white" />
                </div>
                <h2>Nội dung dành cho Thành viên</h2>
                <p>
                    Bài viết này dành riêng cho Thành viên HMath.
                    Đăng ký gói Thành viên để xem toàn bộ nội dung và lời giải chi tiết.
                </p>
                <div className="premium-lock-price">
                    <Crown size={16} color="#f59e0b" />
                    Chỉ 199.000đ / năm
                </div>
                <div className="premium-lock-actions">
                    <Link href="/pricing" className="lock-btn-primary">
                        Đăng ký Thành viên
                    </Link>
                    {!user && (
                        <button onClick={() => signInWithGoogle()} className="lock-btn-secondary">
                            Đăng nhập →
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
