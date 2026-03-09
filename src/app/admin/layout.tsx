'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard, Users, Receipt, ShieldAlert, Menu, X } from 'lucide-react';

const ADMIN_EMAILS = ['pdanghai@gmail.com', 'pdanghai.mmo@gmail.com'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return <div className="admin-no-auth"><p>Đang tải...</p></div>;
    }

    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        return (
            <div className="admin-no-auth">
                <div className="admin-no-auth-card">
                    <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                    <h2>Truy cập bị từ chối</h2>
                    <p>Bạn không có quyền truy cập trang quản trị. Vui lòng đăng nhập bằng tài khoản admin.</p>
                    <Link href="/login" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Quản lý Users', icon: Users },
        { href: '/admin/orders', label: 'Giao dịch', icon: Receipt },
    ];

    return (
        <div className="admin-layout">
            {/* Mobile menu button */}
            <button
                className="admin-mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-title">Quản trị</div>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`admin-nav-link ${pathname === link.href ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <link.icon size={18} />
                        {link.label}
                    </Link>
                ))}
            </aside>
            <div className="admin-content">
                {children}
            </div>
        </div>
    );
}
