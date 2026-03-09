'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Crown, Calendar, Receipt, BookOpen, ArrowRight, PlayCircle, Eye, Shield } from 'lucide-react';
import Link from 'next/link';
import { getViewedExams, getViewedLessons, type ViewedExam, type ViewedLesson } from '@/lib/view-history';

type ProfileData = {
    email: string;
    role: string;
    isPremium: boolean;
    premiumUntil: string | null;
    createdAt: string;
    orders: any[];
};

export default function ProfilePage() {
    const { user, loading, isPremium, signOut } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [viewedExams, setViewedExams] = useState<ViewedExam[]>([]);
    const [viewedLessons, setViewedLessons] = useState<ViewedLesson[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchProfile();
            setViewedExams(getViewedExams());
            setViewedLessons(getViewedLessons());
        }
    }, [user, loading]);

    async function fetchProfile() {
        try {
            const { data } = await supabase
                .from('Profile')
                .select('*, orders:Order(*)')
                .eq('userId', user!.id)
                .single();

            if (data) setProfile(data as any);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoadingProfile(false);
        }
    }

    if (loading || loadingProfile) {
        return (
            <div className="profile-page">
                <div className="profile-loading">Đang tải...</div>
            </div>
        );
    }

    if (!user) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Vừa xong';
        if (mins < 60) return `${mins} phút trước`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} ngày trước`;
        return formatDate(dateStr);
    };

    const paidOrders = profile?.orders?.filter((o: any) => o.status === 'paid') || [];
    const daysRemaining = profile?.premiumUntil
        ? Math.max(0, Math.ceil((new Date(profile.premiumUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

    return (
        <div className="profile-page">
            {/* Profile Header */}
            <div className="profile-header-card">
                <div className="profile-avatar-large">
                    {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="" className="profile-avatar-img" />
                    ) : (
                        user.email?.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="profile-info">
                    <h1>{user.user_metadata?.full_name || user.email}</h1>
                    <p className="profile-email">{user.email}</p>
                    <div className="profile-badges">
                        {isPremium ? (
                            <span className="status-badge status-active">
                                <Crown size={12} /> Premium
                            </span>
                        ) : (
                            <span className="status-badge status-inactive">Free</span>
                        )}
                        {profile?.role === 'admin' && (
                            <span className="status-badge status-admin">Admin</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="profile-stats">
                <div className="stat-card">
                    <div className="stat-card-label">Trạng thái</div>
                    <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>
                        {isPremium ? '🌟 Premium' : 'Miễn phí'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">
                        <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
                        Còn lại
                    </div>
                    <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>
                        {isPremium ? `${daysRemaining} ngày` : '—'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">
                        <Receipt size={14} style={{ display: 'inline', marginRight: 4 }} />
                        Đơn hàng
                    </div>
                    <div className="stat-card-value" style={{ fontSize: '1.25rem' }}>
                        {paidOrders.length}
                    </div>
                </div>
            </div>

            {/* Premium CTA */}
            {!isPremium && (
                <div className="profile-cta">
                    <div className="profile-cta-content">
                        <Crown size={24} color="#f59e0b" />
                        <div>
                            <h3>Nâng cấp Premium</h3>
                            <p>Mở khóa tất cả đề thi và lời giải chi tiết</p>
                        </div>
                    </div>
                    <Link href="/pricing" className="btn-primary">
                        Xem bảng giá <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {/* Premium Info */}
            {isPremium && profile?.premiumUntil && (
                <div className="profile-premium-info">
                    <Crown size={20} color="#059669" />
                    <div>
                        <strong>Premium đang hoạt động</strong>
                        <p>Hết hạn: {formatDate(profile.premiumUntil)}</p>
                    </div>
                </div>
            )}

            {/* Viewed Exams */}
            <div className="data-table-wrap">
                <div className="data-table-header">
                    <div className="data-table-title">
                        <Eye size={16} style={{ display: 'inline', marginRight: 6 }} />
                        Đề thi đã xem
                    </div>
                </div>
                {viewedExams.length > 0 ? (
                    <div className="profile-history-grid">
                        {viewedExams.slice(0, 10).map((exam) => (
                            <Link
                                key={exam.slug}
                                href={`/exams/${exam.slug}`}
                                className="profile-history-item"
                            >
                                <BookOpen size={16} className="history-icon" />
                                <div className="history-info">
                                    <span className="history-title">{exam.title}</span>
                                    <span className="history-time">{timeAgo(exam.viewedAt)}</span>
                                </div>
                                <ArrowRight size={14} className="history-arrow" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        Chưa xem đề thi nào
                    </div>
                )}
            </div>

            {/* Viewed Lessons */}
            <div className="data-table-wrap">
                <div className="data-table-header">
                    <div className="data-table-title">
                        <PlayCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
                        Bài giảng đã xem
                    </div>
                </div>
                {viewedLessons.length > 0 ? (
                    <div className="profile-history-grid">
                        {viewedLessons.slice(0, 10).map((lesson) => (
                            <Link
                                key={`${lesson.courseSlug}/${lesson.lessonId}`}
                                href={`/courses/${lesson.courseSlug}/${lesson.lessonId}`}
                                className="profile-history-item"
                            >
                                <PlayCircle size={16} className="history-icon" />
                                <div className="history-info">
                                    <span className="history-title">{lesson.lessonTitle}</span>
                                    <span className="history-subtitle">{lesson.courseTitle}</span>
                                    <span className="history-time">{timeAgo(lesson.viewedAt)}</span>
                                </div>
                                <ArrowRight size={14} className="history-arrow" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        Chưa xem bài giảng nào
                    </div>
                )}
            </div>

            {/* Order History */}
            <div className="data-table-wrap">
                <div className="data-table-header">
                    <div className="data-table-title">Lịch sử giao dịch</div>
                </div>
                {profile?.orders && profile.orders.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Gói</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile.orders.map((order: any) => (
                                <tr key={order.id}>
                                    <td>{order.plan === '6months' ? 'Học kỳ (6 Tháng)' : 'Năm học (12 Tháng)'}</td>
                                    <td style={{ fontWeight: 600 }}>{formatCurrency(order.amount)}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.status === 'paid' ? 'Đã TT' : order.status === 'pending' ? 'Chờ TT' : 'Thất bại'}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        Chưa có giao dịch nào
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="profile-links">
                <Link href="/" className="profile-link-card">
                    <BookOpen size={20} />
                    <span>Xem đề thi</span>
                    <ArrowRight size={16} />
                </Link>
                <Link href="/pricing" className="profile-link-card">
                    <Crown size={20} />
                    <span>Bảng giá</span>
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Admin Quick Access */}
            {profile?.role === 'admin' && (
                <Link href="/admin" className="profile-admin-link">
                    <Shield size={20} />
                    <span>Quản lý người dùng</span>
                    <ArrowRight size={16} />
                </Link>
            )}

            {/* Sign Out */}
            <button onClick={() => { signOut(); router.push('/'); }} className="btn-logout-full">
                Đăng xuất
            </button>
        </div>
    );
}
