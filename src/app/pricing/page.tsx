import { Check, X } from "lucide-react";
import Link from "next/link";

const tiers = [
    {
        name: "Cơ bản",
        id: "tier-free",
        href: "/",
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
        href: "#",
        price: "199.000đ",
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
        href: "#",
        price: "299.000đ",
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
                            {tier.id !== "tier-free" && <span> /gói</span>}
                        </div>

                        <Link
                            href={tier.href}
                            className={`pricing-btn ${tier.popular ? "pricing-btn-primary" : "pricing-btn-outline"}`}
                        >
                            {tier.id === "tier-free" ? "Khám phá ngay" : "Nâng cấp Premium"}
                        </Link>

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
        </div>
    );
}
