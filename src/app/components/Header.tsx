'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { BookOpen } from 'lucide-react';

const ADMIN_EMAILS = ['pdanghai@gmail.com', 'pdanghai.mmo@gmail.com'];

export default function Header() {
    const { user, loading, signInWithGoogle } = useAuth();

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
                    <Link href="/pricing" className="nav-link">Bảng giá</Link>
                    {user?.email && ADMIN_EMAILS.includes(user.email) && (
                        <Link href="/admin" className="nav-link">Admin</Link>
                    )}
                </nav>

                <div className="user-menu">
                    {loading ? null : user ? (
                        <>
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
                        </>
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
