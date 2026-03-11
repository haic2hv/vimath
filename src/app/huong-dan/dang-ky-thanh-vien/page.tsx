import Link from 'next/link';

export const metadata = {
    title: 'Hướng dẫn đăng ký thành viên và thanh toán - HMath',
    description: 'Hướng dẫn chi tiết cách đăng ký gói Thành viên HMath và thanh toán qua chuyển khoản ngân hàng.',
};

export default function GuideMembershipPage() {
    return (
        <div className="legal-page">
            <div className="legal-content">
                <h1>Hướng dẫn đăng ký thành viên và thanh toán</h1>

                <section>
                    <h2>Bước 1: Đăng nhập tài khoản</h2>
                    <p>
                        Trước tiên, bạn cần <Link href="/huong-dan/tao-tai-khoan" style={{ color: '#6366f1', textDecoration: 'underline' }}>đăng nhập tài khoản HMath</Link> bằng Google.
                        Nếu chưa có tài khoản, hãy xem hướng dẫn tạo tài khoản.
                    </p>
                </section>

                <section>
                    <h2>Bước 2: Chọn gói Thành viên</h2>
                    <p>
                        Truy cập trang <Link href="/pricing" style={{ color: '#6366f1', textDecoration: 'underline' }}>Bảng giá</Link> để xem gói Thành viên.
                        HMath cung cấp gói:
                    </p>
                    <ul>
                        <li><strong>Gói Thành viên 1 năm</strong> — 59.000đ</li>
                    </ul>
                    <p>Nhấn vào nút <strong>&quot;Đăng ký ngay&quot;</strong> tại gói bạn muốn chọn.</p>
                </section>

                <section>
                    <h2>Bước 3: Thanh toán bằng chuyển khoản ngân hàng</h2>
                    <p>
                        Sau khi chọn gói, hệ thống sẽ hiển thị thông tin chuyển khoản bao gồm:
                    </p>
                    <ul>
                        <li><strong>Số tài khoản</strong> ngân hàng</li>
                        <li><strong>Tên chủ tài khoản</strong></li>
                        <li><strong>Số tiền</strong> cần chuyển</li>
                        <li><strong>Nội dung chuyển khoản</strong> (mã giao dịch — rất quan trọng!)</li>
                    </ul>
                    <p>
                        ⚠️ <strong>Lưu ý quan trọng:</strong> Bạn phải nhập đúng <strong>nội dung chuyển khoản</strong> được
                        hiển thị trên màn hình để hệ thống tự động xác nhận thanh toán.
                    </p>
                    <p>
                        Bạn có thể thanh toán bằng ứng dụng ngân hàng hoặc quét mã QR được hiển thị trên trang.
                    </p>
                </section>

                <section>
                    <h2>Bước 4: Chờ kích hoạt tự động</h2>
                    <p>
                        Sau khi chuyển khoản thành công, hệ thống <strong>SePay</strong> sẽ tự động xác nhận
                        và kích hoạt gói Thành viên cho tài khoản của bạn.
                    </p>
                    <ul>
                        <li>Thời gian kích hoạt: thường trong vòng <strong>1–5 phút</strong>.</li>
                        <li>Sau khi kích hoạt, bạn tải lại trang (F5) để xem trạng thái Thành viên.</li>
                    </ul>
                </section>

                <section>
                    <h2>Bước 5: Tận hưởng nội dung Premium</h2>
                    <p>
                        Khi đã là Thành viên, bạn có thể truy cập toàn bộ nội dung trên HMath, bao gồm:
                    </p>
                    <ul>
                        <li>✅ Lời giải chi tiết các đề thi</li>
                        <li>✅ Video bài giảng đầy đủ các khóa học</li>
                        <li>✅ Tài liệu và bài tập bổ trợ</li>
                    </ul>
                </section>

                <section>
                    <h2>Cần hỗ trợ?</h2>
                    <p>
                        Nếu sau 10 phút mà gói Thành viên chưa được kích hoạt, hoặc bạn gặp vấn đề
                        trong quá trình thanh toán, vui lòng liên hệ:
                    </p>
                    <ul>
                        <li>📧 Email: <strong>contact.hmath@gmail.com</strong></li>
                    </ul>
                </section>

                <div className="legal-back">
                    <Link href="/" className="btn-secondary">← Về trang chủ</Link>
                </div>
            </div>
        </div>
    );
}
