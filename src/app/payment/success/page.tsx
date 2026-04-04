import Link from 'next/link';
import { CheckCircle, Coins } from 'lucide-react';

export default function PaymentSuccessPage() {
    return (
        <div className="payment-result">
            <div className="payment-card">
                <div className="payment-icon success">
                    <CheckCircle size={36} />
                </div>
                <h1>Nạp Token thành công!</h1>
                <p>
                    <Coins size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    Token đã được nạp vào tài khoản của bạn.
                    Bạn có thể sử dụng token để mở khóa đề thi và khóa học ngay bây giờ.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>
                        Khám phá đề thi
                    </Link>
                    <Link href="/profile" className="btn-secondary" style={{ display: 'inline-flex' }}>
                        Xem tài khoản
                    </Link>
                </div>
            </div>
        </div>
    );
}
