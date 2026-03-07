import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <div className="footer-logo">HMath</div>
                    <p>
                        Nền tảng Học và Luyện thi trực tuyến
                        dành cho học sinh THCS.
                    </p>
                </div>
                <div className="footer-column">
                    <h4>Khám phá</h4>
                    <Link href="/">Trang chủ</Link>
                    <Link href="/pricing">Bảng giá</Link>
                </div>
                <div className="footer-column">
                    <h4>Pháp lý</h4>
                    <Link href="/terms">Điều khoản sử dụng</Link>
                    <Link href="/privacy">Chính sách bảo mật</Link>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} HMath. All rights reserved.
            </div>
        </footer>
    );
}
