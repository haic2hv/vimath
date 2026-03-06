'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Users, Crown, DollarSign, ShoppingCart } from 'lucide-react';

type Stats = {
    totalUsers: number;
    premiumUsers: number;
    totalRevenue: number;
    totalOrders: number;
    recentOrders: any[];
    recentUsers: any[];
};

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchStats();
    }, [user]);

    async function fetchStats() {
        try {
            const res = await fetch('/api/admin/stats', {
                headers: { 'x-user-id': user!.id },
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="admin-page-title">Đang tải...</div>;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <h1 className="admin-page-title">Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-label">
                        <Users size={14} style={{ display: 'inline', marginRight: 6 }} />
                        Tổng Users
                    </div>
                    <div className="stat-card-value">{stats?.totalUsers || 0}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">
                        <Crown size={14} style={{ display: 'inline', marginRight: 6 }} />
                        Users Premium
                    </div>
                    <div className="stat-card-value">{stats?.premiumUsers || 0}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">
                        <DollarSign size={14} style={{ display: 'inline', marginRight: 6 }} />
                        Doanh thu
                    </div>
                    <div className="stat-card-value revenue">{formatCurrency(stats?.totalRevenue || 0)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">
                        <ShoppingCart size={14} style={{ display: 'inline', marginRight: 6 }} />
                        Đơn hàng
                    </div>
                    <div className="stat-card-value">{stats?.totalOrders || 0}</div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="data-table-wrap">
                <div className="data-table-header">
                    <div className="data-table-title">Giao dịch gần đây</div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Gói</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order: any) => (
                                <tr key={order.id}>
                                    <td>{order.profile?.email || '—'}</td>
                                    <td>{order.plan === '6months' ? '6 Tháng' : '12 Tháng'}</td>
                                    <td>{formatCurrency(order.amount)}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.status === 'paid' ? 'Đã thanh toán' : order.status === 'pending' ? 'Chờ TT' : 'Thất bại'}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    Chưa có giao dịch nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Recent Users */}
            <div className="data-table-wrap">
                <div className="data-table-header">
                    <div className="data-table-title">Users mới đăng ký</div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Premium</th>
                            <th>Ngày đăng ký</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                            stats.recentUsers.map((u: any) => (
                                <tr key={u.id}>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`status-badge ${u.role === 'admin' ? 'status-admin' : 'status-inactive'}`}>
                                            {u.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${u.isPremium ? 'status-active' : 'status-inactive'}`}>
                                            {u.isPremium ? 'Premium' : 'Free'}
                                        </span>
                                    </td>
                                    <td>{formatDate(u.createdAt)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    Chưa có user nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
