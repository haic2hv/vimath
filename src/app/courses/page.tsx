import { getAllCourses } from '@/lib/courses';
import Link from 'next/link';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import CoursesListClient from '@/app/components/CoursesListClient';

export const metadata = {
    title: 'Khóa học - HMath',
    description: 'Danh sách tất cả các khóa học Toán trực tuyến tại HMath. Video bài giảng chi tiết từ cơ bản đến nâng cao.',
};

export default function CoursesPage() {
    const courses = getAllCourses();

    const courseData = courses.map(c => ({
        slug: c.slug,
        title: c.title,
        description: c.description,
        tags: c.tags,
        tokenPrice: c.tokenPrice,
        lessonsCount: c.lessons.length,
    }));

    return (
        <div className="courses-page">
            <Link href="/" className="exam-back-link">
                <ArrowLeft size={16} />
                Quay lại trang chủ
            </Link>

            <section className="courses-section">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">
                            <PlayCircle size={28} />
                            Tất cả khóa học
                        </h1>
                        <p className="section-subtitle">
                            Video bài giảng chi tiết dành cho học sinh
                        </p>
                    </div>
                </div>
                <CoursesListClient courses={courseData} />
            </section>
        </div>
    );
}
