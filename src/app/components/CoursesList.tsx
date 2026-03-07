import { getAllCourses } from '@/lib/courses';
import { BookOpen } from 'lucide-react';
import CoursesListClient from './CoursesListClient';

export default function CoursesList() {
    const courses = getAllCourses();

    if (courses.length === 0) return null;

    const courseData = courses.map(c => ({
        slug: c.slug,
        title: c.title,
        description: c.description,
        tags: c.tags,
        isFree: c.isFree,
        lessonsCount: c.lessons.length,
    }));

    return (
        <section className="courses-section" id="courses">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Khóa học</h2>
                    <p className="section-subtitle">Video bài giảng chi tiết dành cho học sinh</p>
                </div>
            </div>
            <CoursesListClient courses={courseData} />
        </section>
    );
}
