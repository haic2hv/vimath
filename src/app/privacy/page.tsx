import Link from 'next/link';

export const metadata = {
    title: 'Chính sách bảo mật - HMath',
};

export default function PrivacyPage() {
    return (
        <div className="legal-page">
            <div className="legal-content">
                <h1>Chính sách bảo mật</h1>
                <p className="legal-updated">Cập nhật lần cuối: Tháng 3, 2026</p>

                <section>
                    <h2>1. Thông tin chúng tôi thu thập</h2>
                    <p>Khi bạn sử dụng HMath, chúng tôi có thể thu thập các thông tin sau:</p>
                    <ul>
                        <li><strong>Thông tin tài khoản:</strong> Tên, email, ảnh đại diện từ tài khoản Google khi bạn đăng nhập qua Google OAuth 2.0.</li>
                        <li><strong>Thông tin giao dịch:</strong> Chi tiết thanh toán khi đăng ký gói Thành viên (số tiền, ngày giao dịch), được xử lý qua hệ thống SePay.</li>
                        <li><strong>Dữ liệu sử dụng:</strong> Các đề thi, khóa học, video bài giảng bạn đã truy cập để cải thiện trải nghiệm.</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Mục đích sử dụng thông tin</h2>
                    <p>Chúng tôi sử dụng thông tin của bạn để:</p>
                    <ul>
                        <li>Cung cấp và duy trì dịch vụ học tập trực tuyến (đề thi, khóa học video, tài liệu).</li>
                        <li>Xử lý thanh toán và kích hoạt gói Thành viên qua SePay.</li>
                        <li>Quản lý trạng thái tài khoản và quyền truy cập nội dung Premium.</li>
                        <li>Gửi thông báo quan trọng liên quan đến tài khoản.</li>
                        <li>Cải thiện chất lượng nội dung và trải nghiệm người dùng.</li>
                        <li>Hỗ trợ khách hàng khi có yêu cầu.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Bảo vệ thông tin</h2>
                    <p>
                        Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ dữ liệu cá nhân:
                    </p>
                    <ul>
                        <li>Xác thực qua Google OAuth 2.0 — chúng tôi <strong>không lưu trữ mật khẩu</strong> của bạn.</li>
                        <li>Dữ liệu được mã hóa trong quá trình truyền tải (HTTPS/TLS).</li>
                        <li>Cơ sở dữ liệu được lưu trữ trên <strong>Supabase</strong> với các biện pháp bảo mật chuẩn công nghiệp.</li>
                        <li>Thông tin thanh toán được xử lý qua <strong>SePay</strong> — HMath không lưu trữ thông tin tài khoản ngân hàng của bạn.</li>
                        <li>Video bài giảng được lưu trữ và phân phối an toàn qua <strong>Vimeo</strong>.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Chia sẻ thông tin</h2>
                    <p>
                        Chúng tôi <strong>không bán, trao đổi hoặc chia sẻ</strong> thông tin cá nhân
                        của bạn cho bên thứ ba, ngoại trừ:
                    </p>
                    <ul>
                        <li><strong>Nhà cung cấp dịch vụ:</strong> Supabase (xác thực và lưu trữ dữ liệu), SePay (xử lý thanh toán), Google (đăng nhập OAuth), Vimeo (lưu trữ và phát video bài giảng), Vercel (hosting website).</li>
                        <li><strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan chức năng có thẩm quyền.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Cookie và lưu trữ cục bộ</h2>
                    <p>
                        HMath sử dụng cookie và localStorage để duy trì phiên đăng nhập
                        và lưu trữ các tùy chọn cá nhân. Bạn có thể xóa cookie trong trình duyệt bất kỳ lúc nào,
                        tuy nhiên điều này có thể ảnh hưởng đến trải nghiệm sử dụng.
                    </p>
                </section>

                <section>
                    <h2>6. Quyền của người dùng</h2>
                    <p>Bạn có quyền:</p>
                    <ul>
                        <li>Yêu cầu xem, sửa đổi hoặc xóa dữ liệu cá nhân của mình.</li>
                        <li>Hủy đăng ký và ngừng sử dụng dịch vụ bất kỳ lúc nào.</li>
                        <li>Liên hệ chúng tôi để khiếu nại về quyền riêng tư.</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Dành cho người dùng dưới 18 tuổi</h2>
                    <p>
                        HMath chào đón học sinh THCS sử dụng dịch vụ. Chúng tôi khuyến khích
                        phụ huynh hoặc người giám hộ giám sát việc sử dụng internet của con em mình.
                        Chúng tôi không cố ý thu thập thông tin nhạy cảm từ trẻ em.
                    </p>
                </section>

                <section>
                    <h2>8. Thay đổi chính sách</h2>
                    <p>
                        Chính sách bảo mật này có thể được cập nhật theo thời gian.
                        Mọi thay đổi sẽ được đăng tải trên trang này.
                        Chúng tôi khuyến khích bạn kiểm tra định kỳ.
                    </p>
                </section>

                <section>
                    <h2>9. Liên hệ</h2>
                    <p>
                        Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
                        <strong> contact.hmath@gmail.com</strong>
                    </p>
                </section>

                <div className="legal-back">
                    <Link href="/" className="btn-secondary">← Về trang chủ</Link>
                </div>
            </div>
        </div>
    );
}
