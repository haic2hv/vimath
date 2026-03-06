import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
    return (
        <div className="payment-result">
            <div className="payment-card">
                <div className="payment-icon success">
                    <CheckCircle size={36} />
                </div>
                <h1>Thanh toán thành công!</h1>
                <p>
                    Cảm ơn bạn đã nâng cấp Premium. Tài khoản của bạn đã được kích hoạt.
                    Bây giờ bạn có thể truy cập toàn bộ đề thi và lời giải chi tiết.
                </p>
                <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>
                    Khám phá đề thi ngay
                </Link>
            </div>
        </div>
    );
}
