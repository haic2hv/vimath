'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Check, X, Crown, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { user, isPremium, signInWithGoogle } = useAuth();
    const router = useRouter();

    function handleJoinMember() {
        if (!user) {
            signInWithGoogle();
            return;
        }
        router.push('/checkout');
    }

    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <h1>Chọn gói phù hợp</h1>
                <p>Nâng cấp Thành viên để truy cập toàn bộ nội dung</p>
            </div>

            <div className="pricing-grid">
                {/* Free Tier */}
                <div className="pricing-card">
                    <div className="pricing-card-top">
                        <BookOpen size={24} color="#64748b" />
                        <h2>Miễn phí</h2>
                        <div className="pricing-price">0đ</div>
                        <p className="pricing-desc">Trải nghiệm hệ thống với các bài viết cơ bản.</p>
                    </div>
                    <ul className="pricing-features">
                        <li><Check size={16} className="icon-check" /> Đọc toàn bộ bài viết miễn phí</li>
                        <li><Check size={16} className="icon-check" /> Xem đáp án bài viết miễn phí</li>
                        <li><Check size={16} className="icon-check" /> Giao diện đề thi chuyên nghiệp</li>
                        <li><X size={16} className="icon-x" /> Bài viết dành cho thành viên</li>
                        <li><X size={16} className="icon-x" /> Lời giải chi tiết bài thành viên</li>
                    </ul>
                    <Link href="/" className="pricing-btn-secondary">
                        Xem bài miễn phí
                    </Link>
                </div>

                {/* Member Tier */}
                <div className="pricing-card popular">
                    <div className="pricing-badge">Đề xuất</div>
                    <div className="pricing-card-top">
                        <Crown size={24} color="#f59e0b" />
                        <h2>Thành viên</h2>
                        <div className="pricing-price">5.000đ<span>/năm</span></div>
                        <p className="pricing-desc">Mở khóa toàn bộ nội dung, đồng hành suốt năm học.</p>
                    </div>
                    <ul className="pricing-features">
                        <li><Check size={16} className="icon-check" /> Tất cả quyền lợi gói Miễn phí</li>
                        <li><Check size={16} className="icon-check" /> Mở khóa toàn bộ bài viết</li>
                        <li><Check size={16} className="icon-check" /> Xem lời giải chi tiết tất cả các bài</li>
                        <li><Check size={16} className="icon-check" /> Được ưu tiên hỗ trợ</li>
                        <li><Check size={16} className="icon-check" /> Tham gia nhóm Zalo đặc quyền riêng</li>
                    </ul>
                    {isPremium ? (
                        <button className="pricing-btn-primary" disabled style={{ opacity: 0.6 }}>
                            ✅ Bạn đã là Thành viên
                        </button>
                    ) : (
                        <button onClick={handleJoinMember} className="pricing-btn-primary">
                            Đăng ký Thành viên
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
