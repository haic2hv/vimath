import Link from 'next/link';

export const metadata = {
    title: 'Hướng dẫn nạp Token và thanh toán - HMath',
    description: 'Hướng dẫn chi tiết cách nạp Token trên HMath và thanh toán qua chuyển khoản ngân hàng.',
};

export default function GuideMembershipPage() {
    return (
        <div className="legal-page">
            <div className="legal-content">
                <h1>Hướng dẫn nạp Token và thanh toán</h1>

                <section>
                    <h2>Token là gì?</h2>
                    <p>
                        <strong>Token</strong> là đơn vị tiền tệ trên HMath. Bạn dùng token để mở khóa
                        đề thi và khóa học trả phí. <strong>1 token = 1.000đ</strong>.
                        Nội dung đã mua sẽ được lưu vĩnh viễn, không giới hạn thời gian xem.
                    </p>
                </section>

                <section>
                    <h2>Bước 1: Đăng nhập tài khoản</h2>
                    <p>
                        Trước tiên, bạn cần <Link href="/huong-dan/tao-tai-khoan" style={{ color: '#6366f1', textDecoration: 'underline' }}>đăng nhập tài khoản HMath</Link> bằng Google.
                        Nếu chưa có tài khoản, hãy xem hướng dẫn tạo tài khoản.
                    </p>
                </section>

                <section>
                    <h2>Bước 2: Chọn gói nạp Token</h2>
                    <p>
                        Truy cập trang <Link href="/pricing" style={{ color: '#6366f1', textDecoration: 'underline' }}>Nạp Token</Link> để chọn gói phù hợp.
                        HMath cung cấp các gói:
                    </p>
                    <ul>
                        <li><strong>20 token</strong> — 20.000đ</li>
                        <li><strong>50 token</strong> — 50.000đ</li>
                        <li><strong>100 token</strong> — 100.000đ (phổ biến)</li>
                        <li><strong>200 token</strong> — 200.000đ</li>
                        <li><strong>500 token</strong> — 500.000đ</li>
                    </ul>
                    <p>Nhấn vào nút <strong>&quot;Nạp ngay&quot;</strong> tại gói bạn muốn chọn.</p>
                </section>

                <section>
                    <h2>Bước 3: Thanh toán bằng chuyển khoản ngân hàng</h2>
                    <p>
                        Sau khi chọn gói, hệ thống sẽ hiển thị thông tin chuyển khoản bao gồm:
                    </p>
                    <ul>
                        <li><strong>Mã QR</strong> — quét bằng app ngân hàng để chuyển nhanh</li>
                        <li><strong>Số tiền</strong> cần chuyển</li>
                        <li><strong>Nội dung chuyển khoản</strong> (mã giao dịch — rất quan trọng!)</li>
                    </ul>
                    <p>
                        ⚠️ <strong>Lưu ý quan trọng:</strong> Bạn phải nhập đúng <strong>nội dung chuyển khoản</strong> được
                        hiển thị trên màn hình để hệ thống tự động xác nhận thanh toán.
                    </p>
                    <p>
                        Bạn có thể quét mã QR hoặc chuyển khoản thủ công qua app ngân hàng.
                    </p>
                </section>

                <section>
                    <h2>Bước 4: Chờ nạp Token tự động</h2>
                    <p>
                        Sau khi chuyển khoản thành công, hệ thống <strong>SePay</strong> sẽ tự động xác nhận
                        và nạp token vào tài khoản của bạn.
                    </p>
                    <ul>
                        <li>Thời gian nạp: thường trong vòng <strong>1–5 phút</strong>.</li>
                        <li>Sau khi nạp, bạn tải lại trang (F5) để xem số dư Token mới.</li>
                    </ul>
                </section>

                <section>
                    <h2>Bước 5: Sử dụng Token</h2>
                    <p>
                        Khi đã có Token, bạn có thể dùng để mở khóa nội dung:
                    </p>
                    <ul>
                        <li>✅ Mở khóa lời giải chi tiết các đề thi trả phí</li>
                        <li>✅ Mở khóa toàn bộ video bài giảng trong các khóa học</li>
                        <li>✅ Nội dung đã mua được lưu vĩnh viễn</li>
                    </ul>
                </section>

                <section>
                    <h2>Cần hỗ trợ?</h2>
                    <p>
                        Nếu sau 10 phút mà Token chưa được nạp, hoặc bạn gặp vấn đề
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
