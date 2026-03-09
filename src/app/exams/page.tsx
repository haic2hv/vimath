import { getAllExams } from '@/lib/exams';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ExamListClient from '@/app/components/ExamListClient';

export const metadata = {
    title: 'Đề thi - HMath',
    description: 'Danh sách tất cả các đề thi Toán có lời giải chi tiết tại HMath.',
};

export default function ExamsPage() {
    const exams = getAllExams();

    const examData = exams.map(e => ({
        slug: e.slug,
        title: e.frontmatter.title,
        date: e.frontmatter.date,
        isFree: e.frontmatter.isFree,
        tags: e.frontmatter.tags,
    }));

    return (
        <div className="exams-page">
            <Link href="/" className="exam-back-link">
                <ArrowLeft size={16} />
                Quay lại trang chủ
            </Link>

            <section className="exams-section">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">
                            <BookOpen size={28} />
                            Tất cả đề thi
                        </h1>
                        <p className="section-subtitle">
                            Tìm kiếm và chọn đề thi phù hợp với bạn
                        </p>
                    </div>
                </div>
                <ExamListClient exams={examData} />
            </section>
        </div>
    );
}
