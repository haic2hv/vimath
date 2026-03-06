'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

type User = {
    id: string;
    email: string;
    role: string;
    isPremium: boolean;
    premiumUntil: string | null;
    createdAt: string;
    orders: any[];
};

export default function AdminUsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!user) return;
        fetchUsers();
    }, [user, search]);

    async function fetchUsers() {
        try {
            const params = new URLSearchParams({ search, page: '1', limit: '50' });
            const res = await fetch(`/api/admin/users?${params}`, {
                headers: { 'x-user-id': user!.id },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }

    async function togglePremium(profile: User) {
        const newPremium = !profile.isPremium;
        const premiumUntil = newPremium
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null;

        await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': user!.id,
            },
            body: JSON.stringify({
                profileId: profile.id,
                isPremium: newPremium,
                premiumUntil,
            }),
        });

        fetchUsers();
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    return (
        <>
            <h1 className="admin-page-title">Quản lý Users ({total})</h1>

            <div className="data-table-wrap">
                <div className="data-table-header">
                    <div className="data-table-title">Danh sách Users</div>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm theo email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Đang tải...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Hết hạn</th>
                                <th>Đơn hàng</th>
                                <th>Ngày ĐK</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 600 }}>{u.email}</td>
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
                                        <td>{u.premiumUntil ? formatDate(u.premiumUntil) : '—'}</td>
                                        <td>{u.orders?.length || 0}</td>
                                        <td>{formatDate(u.createdAt)}</td>
                                        <td>
                                            <button
                                                className={`toggle-btn ${u.isPremium ? 'active' : ''}`}
                                                onClick={() => togglePremium(u)}
                                            >
                                                {u.isPremium ? 'Hủy Premium' : 'Cấp Premium'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                        Không tìm thấy user nào
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
