'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { BookOpen } from 'lucide-react';

export default function Header() {
    const { user, loading, signOut } = useAuth();

    return (
        <header className="site-header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    <span className="logo-icon">
                        <BookOpen size={18} />
                    </span>
                    VinaMath
                </Link>

                <nav>
                    <Link href="/" className="nav-link">Trang chủ</Link>
                    <Link href="/pricing" className="nav-link">Bảng giá</Link>
                </nav>

                <div className="user-menu">
                    {loading ? null : user ? (
                        <>
                            <div className="user-avatar">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <button onClick={() => signOut()} className="btn-logout">
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn-login">Đăng nhập</Link>
                            <Link href="/signup" className="btn-signup">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
