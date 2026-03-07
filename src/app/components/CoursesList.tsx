import Link from 'next/link';
import { getAllCourses } from '@/lib/courses';
import { BookOpen, PlayCircle, Lock } from 'lucide-react';

export default function CoursesList() {
    const courses = getAllCourses();

    if (courses.length === 0) return null;

    return (
        <section className="courses-section">
            <div className="courses-section-header">
                <h2><BookOpen size={22} /> Khóa học</h2>
                <p>Video bài giảng chi tiết dành cho thành viên</p>
            </div>
            <div className="courses-grid">
                {courses.map((course) => (
                    <Link
                        key={course.slug}
                        href={`/courses/${course.slug}`}
                        className="course-card"
                    >
                        <div className="course-card-icon">
                            <PlayCircle size={32} />
                        </div>
                        <h3>{course.title}</h3>
                        <p className="course-card-desc">{course.description}</p>
                        <div className="course-card-meta">
                            <span className="course-lessons-count">
                                {course.lessons.length} bài học
                            </span>
                            <span className="badge badge-premium">
                                <Lock size={11} />
                                Thành viên
                            </span>
                        </div>
                        <div className="course-card-tags">
                            {course.tags.map(tag => (
                                <span key={tag} className="tag">#{tag}</span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
