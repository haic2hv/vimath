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
                        Chào mừng bạn đến với HMath. Khi truy cập và sử dụng website của chúng tôi,
                        bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
                        Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
                    </p>
                </section>

                <section>
                    <h2>2. Mô tả dịch vụ</h2>
                    <p>
                        HMath là nền tảng học và luyện thi trực tuyến dành cho học sinh THCS,
                        cung cấp đề thi, bài giảng và lời giải chi tiết các môn Toán học.
                        Dịch vụ bao gồm nội dung miễn phí và nội dung Premium có thu phí.
                    </p>
                </section>

                <section>
                    <h2>3. Tài khoản người dùng</h2>
                    <ul>
                        <li>Bạn cần đăng nhập bằng tài khoản Google để sử dụng đầy đủ tính năng.</li>
                        <li>Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình.</li>
                        <li>Mỗi tài khoản chỉ dành cho một cá nhân sử dụng, không được chia sẻ.</li>
                        <li>Chúng tôi có quyền khóa tài khoản vi phạm điều khoản mà không cần thông báo trước.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Nội dung và bản quyền</h2>
                    <ul>
                        <li>Toàn bộ nội dung đề thi, lời giải, bài giảng trên HMath thuộc quyền sở hữu của HMath hoặc được cấp phép sử dụng hợp lệ.</li>
                        <li>Bạn không được sao chép, phân phối, bán lại hoặc sử dụng nội dung cho mục đích thương mại mà không có sự đồng ý bằng văn bản.</li>
                        <li>Bạn được phép sử dụng nội dung cho mục đích học tập cá nhân.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Gói Premium và thanh toán</h2>
                    <ul>
                        <li>Gói Premium được kích hoạt sau khi thanh toán thành công qua hệ thống SePay.</li>
                        <li>Thời hạn sử dụng tính từ ngày kích hoạt, theo gói đã chọn (6 tháng hoặc 12 tháng).</li>
                        <li>Phí đã thanh toán không được hoàn lại, trừ trường hợp đặc biệt do HMath quyết định.</li>
                        <li>HMath có quyền thay đổi giá các gói dịch vụ và sẽ thông báo trước khi áp dụng.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Quy tắc sử dụng</h2>
                    <p>Khi sử dụng HMath, bạn cam kết:</p>
                    <ul>
                        <li>Không can thiệp, phá hoại hoặc tấn công hệ thống.</li>
                        <li>Không sử dụng bot, script tự động để truy cập hàng loạt.</li>
                        <li>Không chia sẻ tài khoản Premium cho người khác.</li>
                        <li>Sử dụng nội dung đúng mục đích học tập.</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Giới hạn trách nhiệm</h2>
                    <p>
                        HMath cung cấp nội dung "nguyên trạng" (as-is). Chúng tôi nỗ lực đảm bảo
                        tính chính xác nhưng không chịu trách nhiệm cho các sai sót trong nội dung đề thi
                        hoặc lời giải. Kết quả học tập phụ thuộc vào nỗ lực cá nhân của người dùng.
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
                        <strong> support@hmath.vn</strong>
                    </p>
                </section>

                <div className="legal-back">
                    <Link href="/" className="btn-secondary">← Về trang chủ</Link>
                </div>
            </div>
        </div>
    );
}
