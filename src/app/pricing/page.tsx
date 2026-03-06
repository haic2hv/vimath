'use client';

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const tiers = [
    {
        name: "Cơ bản",
        id: "tier-free",
        plan: "free",
        price: "Miễn phí",
        description: "Phù hợp để trải nghiệm hệ thống và đọc các đề thi cơ bản.",
        features: [
            { text: "Truy cập đề thi được đánh dấu miễn phí", included: true },
            { text: "Xem đáp án của đề thi miễn phí", included: true },
            { text: "Giao diện duyệt đề thi LaTeX tiêu chuẩn", included: true },
            { text: "Lời giải đề thi phân loại cao", included: false },
        ],
        popular: false,
    },
    {
        name: "Học kỳ (6 Tháng)",
        id: "tier-6months",
        plan: "6months",
        price: "59.000đ",
        description: "Dành cho học sinh cần bứt tốc trong một học kỳ.",
        features: [
            { text: "Mở khóa toàn bộ đề thi trong hệ thống", included: true },
            { text: "Xem lời giải chi tiết tất cả các câu", included: true },
            { text: "Tải file PDF (Sắp ra mắt)", included: true },
            { text: "Ưu tiên hỗ trợ giải đáp qua Email", included: true },
        ],
        popular: true,
    },
    {
        name: "Năm học (12 Tháng)",
        id: "tier-12months",
        plan: "12months",
        price: "99.000đ",
        description: "Tiết kiệm nhất, đồng hành suốt cả một năm học.",
        features: [
            { text: "Tất cả quyền lợi của gói Học kỳ", included: true },
            { text: "Công cụ tạo đề thi ngẫu nhiên (Sắp ra mắt)", included: true },
            { text: "Cam kết cập nhật đề thi mới mỗi tuần", included: true },
            { text: "Tham gia nhóm Zalo nội bộ", included: true },
        ],
        popular: false,
    },
];

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [paymentModal, setPaymentModal] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleBuy(plan: string) {
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan,
                    userId: user.id,
                    email: user.email,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setPaymentModal(data);
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <p className="pricing-badge">Bảng giá Premium</p>
                <h1>Mở khóa sức mạnh Toán học của bạn</h1>
                <p>
                    Hãy chọn gói cước phù hợp với mục tiêu học tập.
                    Thanh toán nhanh chóng, kích hoạt ngay lập tức.
                </p>
            </div>

            <div className="pricing-grid">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={`pricing-card ${tier.popular ? "popular" : ""}`}
                    >
                        {tier.popular && (
                            <div className="popular-tag">Phổ biến nhất</div>
                        )}

                        <h3>{tier.name}</h3>
                        <p className="description">{tier.description}</p>

                        <div className="price">
                            {tier.price}
                            {tier.plan !== "free" && <span> /gói</span>}
                        </div>

                        {tier.plan === "free" ? (
                            <Link href="/" className="pricing-btn pricing-btn-outline">
                                Khám phá ngay
                            </Link>
                        ) : (
                            <button
                                className={`pricing-btn ${tier.popular ? "pricing-btn-primary" : "pricing-btn-outline"}`}
                                onClick={() => handleBuy(tier.plan)}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Nâng cấp Premium'}
                            </button>
                        )}

                        <ul className="features">
                            {tier.features.map((feature) => (
                                <li key={feature.text}>
                                    {feature.included ? (
                                        <Check className="icon-check" size={18} />
                                    ) : (
                                        <X className="icon-x" size={18} />
                                    )}
                                    {feature.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Payment Modal */}
            {paymentModal && (
                <div className="payment-modal-overlay" onClick={() => setPaymentModal(null)}>
                    <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Thanh toán đơn hàng</h2>
                        <p className="subtitle">Chuyển khoản ngân hàng với nội dung bên dưới</p>

                        <div className="payment-info-row">
                            <span className="label">Gói cước</span>
                            <span className="value">{paymentModal.planLabel}</span>
                        </div>
                        <div className="payment-info-row">
                            <span className="label">Số tiền</span>
                            <span className="value">{formatCurrency(paymentModal.amount)}</span>
                        </div>
                        <div className="payment-info-row">
                            <span className="label">Mã đơn hàng</span>
                            <span className="value" style={{ fontFamily: 'monospace' }}>{paymentModal.orderCode}</span>
                        </div>

                        {paymentModal.qrUrl && (
                            <div style={{ textAlign: 'center', margin: '1.25rem 0' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                                    📱 Quét mã QR để thanh toán
                                </p>
                                <img
                                    src={paymentModal.qrUrl}
                                    alt="QR thanh toán"
                                    style={{
                                        width: 220,
                                        height: 220,
                                        margin: '0 auto',
                                        borderRadius: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                    }}
                                />
                            </div>
                        )}

                        <div className="payment-content-box">
                            <div className="label">⚠️ NỘI DUNG CHUYỂN KHOẢN (bắt buộc)</div>
                            <div className="code">{paymentModal.paymentContent}</div>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', lineHeight: 1.5 }}>
                            Sau khi chuyển khoản với đúng nội dung, hệ thống sẽ tự động kích hoạt Premium cho bạn trong vài phút.
                        </p>

                        <div className="payment-modal-actions">
                            <button className="btn-modal-cancel" onClick={() => setPaymentModal(null)}>
                                Đóng
                            </button>
                            <Link href="/" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
