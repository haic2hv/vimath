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
                    <h4>Chính sách và Điều khoản</h4>
                    <Link href="/pricing">Bảng giá</Link>
                    <Link href="/terms">Điều khoản sử dụng</Link>
                    <Link href="/privacy">Chính sách bảo mật</Link>
                </div>
                <div className="footer-column">
                    <h4>Hướng dẫn</h4>
                    <Link href="/huong-dan/tao-tai-khoan">Hướng dẫn tạo tài khoản</Link>
                    <Link href="/huong-dan/dang-ky-thanh-vien">Hướng dẫn đăng ký thành viên và thanh toán</Link>
                </div>
                <div className="footer-column">
                    <h4>Liên hệ</h4>
                    <a href="mailto:contact.hmath@gmail.com" className="footer-contact-item">
                        <span className="footer-contact-icon">📧</span> Email: contact.hmath@gmail.com
                    </a>
                    <a href="http://zalo.me/84385048315" target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/zalo-icon.svg" alt="Zalo" className="footer-zalo-icon" /> Zalo: +84385048315
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} HMath. All rights reserved.
            </div>
        </footer>
    );
}
