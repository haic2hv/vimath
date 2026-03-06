'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

type Props = {
    isFree: boolean;
    children: ReactNode;
};

export default function SolutionGate({ isFree, children }: Props) {
    const { user, isPremium, loading } = useAuth();

    if (loading) {
        return null;
    }

    const showSolution = isFree || isPremium;

    if (showSolution) {
        return <>{children}</>;
    }

    return (
        <section className="premium-lock">
            <div className="premium-lock-content">
                <div className="premium-lock-icon">
                    <Lock size={28} color="white" />
                </div>
                <h2>Đã khóa lời giải</h2>
                <p>
                    Đây là đề thi dành riêng cho thành viên Premium.
                    Vui lòng nâng cấp tài khoản để xem toàn bộ lời giải chi tiết.
                </p>
                <div className="premium-lock-actions">
                    <Link href="/pricing" className="lock-btn-primary">
                        Nâng cấp Premium
                    </Link>
                    {!user && (
                        <Link href="/login" className="lock-btn-secondary">
                            Đăng nhập →
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
