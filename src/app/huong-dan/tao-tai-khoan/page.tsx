import Link from 'next/link';

export const metadata = {
    title: 'Hướng dẫn tạo tài khoản - HMath',
    description: 'Hướng dẫn chi tiết cách tạo tài khoản trên HMath bằng Google.',
};

export default function GuideCreateAccountPage() {
    return (
        <div className="legal-page">
            <div className="legal-content">
                <h1>Hướng dẫn tạo tài khoản</h1>

                <section>
                    <h2>Bước 1: Truy cập trang HMath</h2>
                    <p>
                        Mở trình duyệt (Chrome, Safari, Firefox...) và truy cập website{' '}
                        <strong>hmath.vercel.app</strong>.
                    </p>
                </section>

                <section>
                    <h2>Bước 2: Nhấn nút Đăng nhập</h2>
                    <p>
                        Tại góc trên bên phải của trang, nhấn vào nút <strong>&quot;Đăng nhập&quot;</strong>.
                        Hệ thống sẽ chuyển bạn đến trang đăng nhập bằng Google.
                    </p>
                </section>

                <section>
                    <h2>Bước 3: Chọn tài khoản Google</h2>
                    <p>
                        Chọn tài khoản Google mà bạn muốn sử dụng để đăng nhập.
                        Nếu chưa đăng nhập Google trên trình duyệt, bạn cần nhập email và mật khẩu Google của mình.
                    </p>
                    <ul>
                        <li>HMath sử dụng <strong>Google OAuth</strong> — bạn không cần tạo mật khẩu riêng.</li>
                        <li>Thông tin được lấy từ Google: <strong>Tên</strong>, <strong>Email</strong>, và <strong>Ảnh đại diện</strong>.</li>
                    </ul>
                </section>

                <section>
                    <h2>Bước 4: Hoàn tất</h2>
                    <p>
                        Sau khi chọn tài khoản Google, bạn sẽ được tự động chuyển về HMath
                        với trạng thái đã đăng nhập. Ảnh đại diện của bạn sẽ hiển thị ở góc trên bên phải.
                    </p>
                    <p>
                        🎉 <strong>Vậy là xong!</strong> Bạn đã có tài khoản HMath và có thể truy cập nội dung miễn phí ngay.
                    </p>
                </section>

                <section>
                    <h2>Lưu ý</h2>
                    <ul>
                        <li>Mỗi tài khoản Google chỉ liên kết với một tài khoản HMath.</li>
                        <li>Để xem nội dung Premium (khóa học, đề thi có lời giải...), bạn cần <Link href="/huong-dan/dang-ky-thanh-vien" style={{ color: '#6366f1', textDecoration: 'underline' }}>đăng ký gói Thành viên</Link>.</li>
                    </ul>
                </section>

                <div className="legal-back">
                    <Link href="/" className="btn-secondary">← Về trang chủ</Link>
                </div>
            </div>
        </div>
    );
}
