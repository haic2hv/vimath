import Link from 'next/link';

export const metadata = {
    title: 'Điều khoản sử dụng - HMath',
};

export default function TermsPage() {
    return (
        <div className="legal-page">
            <div className="legal-content">
                <h1>Điều khoản sử dụng</h1>
                <p className="legal-updated">Cập nhật lần cuối: Tháng 3, 2026</p>

                <section>
                    <h2>1. Giới thiệu</h2>
                    <p>
                        Chào mừng bạn đến với HMath (<strong>hmath.vercel.app</strong>). Khi truy cập và sử dụng website của chúng tôi,
                        bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
                        Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
                    </p>
                </section>

                <section>
                    <h2>2. Mô tả dịch vụ</h2>
                    <p>
                        HMath là nền tảng học và luyện thi Toán trực tuyến dành cho học sinh THCS.
                        Dịch vụ bao gồm:
                    </p>
                    <ul>
                        <li>Đề thi và lời giải chi tiết các kỳ thi Toán.</li>
                        <li>Khóa học video bài giảng từ cơ bản đến nâng cao.</li>
                        <li>Tài liệu học tập và bài tập bổ trợ.</li>
                    </ul>
                    <p>
                        Dịch vụ bao gồm nội dung miễn phí và nội dung dành riêng cho Thành viên (Premium).
                    </p>
                </section>

                <section>
                    <h2>3. Tài khoản người dùng</h2>
                    <ul>
                        <li>Bạn đăng nhập bằng tài khoản Google thông qua Google OAuth 2.0. HMath không yêu cầu tạo mật khẩu riêng.</li>
                        <li>Bạn chịu trách nhiệm bảo mật thông tin tài khoản Google của mình.</li>
                        <li>Mỗi tài khoản chỉ dành cho một cá nhân sử dụng, không được chia sẻ.</li>
                        <li>Chúng tôi có quyền khóa tài khoản vi phạm điều khoản mà không cần thông báo trước.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Nội dung và bản quyền</h2>
                    <ul>
                        <li>Toàn bộ nội dung đề thi, lời giải, video bài giảng, và tài liệu trên HMath thuộc quyền sở hữu của HMath hoặc được cấp phép sử dụng hợp lệ.</li>
                        <li>Video bài giảng được lưu trữ và phân phối qua nền tảng Vimeo.</li>
                        <li>Bạn không được sao chép, tải xuống, phân phối, bán lại hoặc sử dụng nội dung cho mục đích thương mại mà không có sự đồng ý bằng văn bản.</li>
                        <li>Bạn được phép sử dụng nội dung cho mục đích học tập cá nhân.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Gói Thành viên và thanh toán</h2>
                    <ul>
                        <li>HMath cung cấp gói Thành viên với giá <strong>199.000đ / năm</strong>, mở khóa toàn bộ nội dung Premium.</li>
                        <li>Thanh toán được thực hiện qua chuyển khoản ngân hàng, xử lý bởi hệ thống <strong>SePay</strong>.</li>
                        <li>Gói Thành viên được kích hoạt tự động sau khi hệ thống xác nhận thanh toán thành công (thường trong vòng 1–5 phút).</li>
                        <li>Thời hạn sử dụng tính từ ngày kích hoạt, kéo dài 12 tháng.</li>
                        <li>Phí đã thanh toán không được hoàn lại, trừ trường hợp đặc biệt do HMath quyết định.</li>
                        <li>HMath có quyền thay đổi giá gói dịch vụ và sẽ thông báo trước khi áp dụng.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Quy tắc sử dụng</h2>
                    <p>Khi sử dụng HMath, bạn cam kết:</p>
                    <ul>
                        <li>Không can thiệp, phá hoại hoặc tấn công hệ thống.</li>
                        <li>Không sử dụng bot, script tự động để truy cập hàng loạt.</li>
                        <li>Không chia sẻ tài khoản Thành viên cho người khác.</li>
                        <li>Không tải xuống, ghi lại hoặc phát tán video bài giảng dưới bất kỳ hình thức nào.</li>
                        <li>Sử dụng nội dung đúng mục đích học tập.</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Giới hạn trách nhiệm</h2>
                    <p>
                        HMath cung cấp nội dung &quot;nguyên trạng&quot; (as-is). Chúng tôi nỗ lực đảm bảo
                        tính chính xác nhưng không chịu trách nhiệm cho các sai sót trong nội dung đề thi,
                        lời giải hoặc video bài giảng. Kết quả học tập phụ thuộc vào nỗ lực cá nhân của người dùng.
                    </p>
                </section>

                <section>
                    <h2>8. Thay đổi điều khoản</h2>
                    <p>
                        HMath có quyền cập nhật các điều khoản này bất kỳ lúc nào.
                        Các thay đổi sẽ có hiệu lực ngay khi được đăng tải.
                        Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận điều khoản mới.
                    </p>
                </section>

                <section>
                    <h2>9. Liên hệ</h2>
                    <p>
                        Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua email:
                        <strong> pdanghai@gmail.com</strong>
                    </p>
                </section>

                <div className="legal-back">
                    <Link href="/" className="btn-secondary">← Về trang chủ</Link>
                </div>
            </div>
        </div>
    );
}
