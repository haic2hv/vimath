import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
    return (
        <div className="payment-result">
            <div className="payment-card">
                <div className="payment-icon fail">
                    <XCircle size={36} />
                </div>
                <h1>Thanh toán thất bại</h1>
                <p>
                    Giao dịch của bạn chưa được hoàn tất. Nếu bạn đã chuyển khoản,
                    vui lòng đợi vài phút để hệ thống xác nhận hoặc liên hệ hỗ trợ.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/pricing" className="btn-primary" style={{ display: 'inline-flex' }}>
                        Thử lại
                    </Link>
                    <Link href="/" className="btn-secondary" style={{ display: 'inline-flex' }}>
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
