'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

type Order = {
    id: string;
    plan: string;
    amount: number;
    status: string;
    sepayRef: string | null;
    createdAt: string;
    profile: { email: string } | null;
};

export default function AdminOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchOrders();
    }, [user]);

    async function fetchOrders() {
        try {
            const { data, error } = await supabase
                .from('Order')
                .select('*, profile:Profile(email)')
                .order('createdAt', { ascending: false })
                .limit(100);

            if (!error && data) {
                setOrders(data as any);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const totalRevenue = orders
        .filter((o) => o.status === 'paid')
        .reduce((sum, o) => sum + o.amount, 0);

    const paidCount = orders.filter((o) => o.status === 'paid').length;
    const pendingCount = orders.filter((o) => o.status === 'pending').length;

    return (
        <>
            <h1 className="admin-page-title">Giao dịch</h1>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="stat-card">
                    <div className="stat-card-label">Tổng doanh thu</div>
                    <div className="stat-card-value revenue">{formatCurrency(totalRevenue)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Đã thanh toán</div>
                    <div className="stat-card-value">{paidCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Chờ thanh toán</div>
                    <div className="stat-card-value">{pendingCount}</div>
                </div>
            </div>

            <div className="data-table-wrap">
                <div className="data-table-header">
                    <div className="data-table-title">Lịch sử giao dịch</div>
                </div>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Đang tải...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã GD</th>
                                <th>Email</th>
                                <th>Gói</th>
                                <th>Số tiền</th>
                                <th>SePay Ref</th>
                                <th>Trạng thái</th>
                                <th>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            {order.id.slice(0, 8)}
                                        </td>
                                        <td>{order.profile?.email || '—'}</td>
                                        <td>{order.plan === '6months' ? '6 Tháng' : '12 Tháng'}</td>
                                        <td style={{ fontWeight: 600 }}>{formatCurrency(order.amount)}</td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            {order.sepayRef || '—'}
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${order.status}`}>
                                                {order.status === 'paid' ? 'Đã TT' : order.status === 'pending' ? 'Chờ TT' : 'Thất bại'}
                                            </span>
                                        </td>
                                        <td>{formatDate(order.createdAt)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                        Chưa có giao dịch nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
