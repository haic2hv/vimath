'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Coins } from 'lucide-react';

type User = {
    id: string;
    email: string;
    role: string;
    tokenBalance: number;
    createdAt: string;
    orders: any[];
};

export default function AdminUsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [giftAmount, setGiftAmount] = useState<Record<string, string>>({});
    const [giftingId, setGiftingId] = useState<string | null>(null);

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

    async function giftTokens(profile: User) {
        const amount = parseInt(giftAmount[profile.id] || '0');
        if (!amount || amount === 0) return;

        setGiftingId(profile.id);
        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user!.id,
                },
                body: JSON.stringify({
                    profileId: profile.id,
                    tokenAmount: amount,
                    action: 'add',
                }),
            });

            // Clear input and refresh
            setGiftAmount(prev => ({ ...prev, [profile.id]: '' }));
            fetchUsers();
        } catch (error) {
            console.error('Failed to gift tokens:', error);
        }
        setGiftingId(null);
    }

    async function setTokenBalance(profile: User, amount: number) {
        setGiftingId(profile.id);
        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user!.id,
                },
                body: JSON.stringify({
                    profileId: profile.id,
                    tokenAmount: amount,
                    action: 'set',
                }),
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to set tokens:', error);
        }
        setGiftingId(null);
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
                                <th>Token</th>
                                <th>Đơn hàng</th>
                                <th>Ngày ĐK</th>
                                <th>Tặng Token</th>
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
                                            <span style={{ fontWeight: 700, color: '#f59e0b' }}>
                                                {u.tokenBalance || 0}
                                            </span>
                                        </td>
                                        <td>{u.orders?.length || 0}</td>
                                        <td>{formatDate(u.createdAt)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                                <input
                                                    type="number"
                                                    placeholder="Số token"
                                                    value={giftAmount[u.id] || ''}
                                                    onChange={(e) => setGiftAmount(prev => ({ ...prev, [u.id]: e.target.value }))}
                                                    style={{
                                                        width: '80px', padding: '0.25rem 0.5rem',
                                                        borderRadius: '6px', border: '1px solid #334155',
                                                        background: '#1e293b', color: '#e2e8f0', fontSize: '0.8rem'
                                                    }}
                                                />
                                                <button
                                                    className="toggle-btn active"
                                                    onClick={() => giftTokens(u)}
                                                    disabled={giftingId === u.id || !giftAmount[u.id]}
                                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                >
                                                    <Coins size={12} /> Tặng
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
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
