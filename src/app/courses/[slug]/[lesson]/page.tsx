import { notFound } from 'next/navigation';
import { getCourseBySlug, getAllCourses } from '@/lib/courses';
import LessonView from './LessonView';

export async function generateStaticParams() {
    const courses = getAllCourses();
    const params: { slug: string; lesson: string }[] = [];
    for (const course of courses) {
        for (const lesson of course.lessons) {
            params.push({ slug: course.slug, lesson: lesson.id });
        }
    }
    return params;
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
    const { slug, lesson: lessonId } = await params;
    const course = getCourseBySlug(slug);

    if (!course) notFound();

    const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) notFound();

    const lesson = course.lessons[lessonIndex];
    const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
    const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;

    return (
        <LessonView
            courseTitle={course.title}
            courseSlug={course.slug}
            isFree={course.isFree ?? false}
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            lessonDescription={lesson.description}
            videoUrl={lesson.videoUrl}
            videoType={lesson.videoType}
            materials={lesson.materials || []}
            prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
            nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
        />
    );
}
