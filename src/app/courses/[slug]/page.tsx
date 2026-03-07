import { notFound } from 'next/navigation';
import { getCourseBySlug, getAllCourses } from '@/lib/courses';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, Clock, Lock, Crown } from 'lucide-react';

export async function generateStaticParams() {
    const courses = getAllCourses();
    return courses.map(c => ({ slug: c.slug }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = getCourseBySlug(slug);

    if (!course) notFound();

    return (
        <div className="course-detail">
            <Link href="/" className="exam-back-link">
                <ArrowLeft size={16} />
                Quay lại trang chủ
            </Link>

            <header className="course-detail-header">
                <h1>{course.title}</h1>
                <p>{course.description}</p>
                <div className="course-detail-meta">
                    <span>{course.lessons.length} bài học</span>
                    <span className="badge badge-premium">
                        <Lock size={11} /> Thành viên
                    </span>
                </div>
            </header>

            <div className="course-lessons-list">
                <h2>Danh sách bài học</h2>
                {course.lessons.map((lesson, index) => (
                    <Link
                        key={lesson.id}
                        href={`/courses/${slug}/${lesson.id}`}
                        className="course-lesson-item"
                    >
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-info">
                            <h3>{lesson.title}</h3>
                            <p>{lesson.description}</p>
                        </div>
                        <div className="lesson-meta">
                            <span className="lesson-duration">
                                <Clock size={13} />
                                {lesson.duration}
                            </span>
                            {lesson.videoUrl ? (
                                <PlayCircle size={20} className="lesson-play-icon" />
                            ) : (
                                <span className="lesson-coming-soon">Sắp ra mắt</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="course-cta">
                <Crown size={20} color="#f59e0b" />
                <p>Đăng ký Thành viên để xem toàn bộ video bài giảng</p>
                <Link href="/pricing" className="btn-primary">
                    Xem bảng giá
                </Link>
            </div>
        </div>
    );
}
