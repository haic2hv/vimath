import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <div className="footer-logo">VinaMath</div>
                    <p>
                        Nền tảng chia sẻ đề thi và lời giải Toán học với định dạng LaTeX đẹp mắt,
                        dành cho học sinh THPT trên toàn quốc.
                    </p>
                </div>
                <div className="footer-column">
                    <h4>Khám phá</h4>
                    <Link href="/">Trang chủ</Link>
                    <Link href="/pricing">Bảng giá</Link>
                </div>
                <div className="footer-column">
                    <h4>Hỗ trợ</h4>
                    <a href="mailto:support@vinamath.vn">Email liên hệ</a>
                    <a href="#">Zalo hỗ trợ</a>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} VinaMath. All rights reserved.
            </div>
        </footer>
    );
}
