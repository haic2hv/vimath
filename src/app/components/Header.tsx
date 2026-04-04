'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { BookOpen, Coins } from 'lucide-react';

const ADMIN_EMAILS = ['pdanghai@gmail.com', 'pdanghai.mmo@gmail.com'];

export default function Header() {
    const { user, loading, tokenBalance, signInWithGoogle } = useAuth();
    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    return (
        <header className="site-header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    <span className="logo-icon">
                        <BookOpen size={18} />
                    </span>
                    HMath
                </Link>

                <nav>
                    <Link href="/" className="nav-link">Trang chủ</Link>
                    {!isAdmin && (
                        <Link href="/pricing" className="nav-link">Nạp Token</Link>
                    )}
                    {isAdmin && (
                        <Link href="/admin" className="nav-link">Admin</Link>
                    )}
                </nav>

                <div className="user-menu">
                    {loading ? null : user ? (
                        <div className="user-menu-inner">
                            <Link href="/pricing" className="token-badge" title="Số dư token">
                                <Coins size={14} />
                                <span>{tokenBalance}</span>
                            </Link>
                            <Link href="/profile" className="user-avatar">
                                {user.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt=""
                                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                                    />
                                ) : (
                                    user.email?.charAt(0).toUpperCase()
                                )}
                            </Link>
                        </div>
                    ) : (
                        <button onClick={() => signInWithGoogle()} className="btn-signup">
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
