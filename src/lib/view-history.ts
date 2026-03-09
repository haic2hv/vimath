// View history tracking using localStorage

export type ViewedExam = {
    slug: string;
    title: string;
    viewedAt: string; // ISO timestamp
};

export type ViewedLesson = {
    courseSlug: string;
    courseTitle: string;
    lessonId: string;
    lessonTitle: string;
    viewedAt: string;
};

const EXAMS_KEY = 'hmath_viewed_exams';
const LESSONS_KEY = 'hmath_viewed_lessons';
const MAX_ITEMS = 50;

function isBrowser() {
    return typeof window !== 'undefined';
}

export function addViewedExam(slug: string, title: string) {
    if (!isBrowser()) return;
    try {
        const items: ViewedExam[] = JSON.parse(localStorage.getItem(EXAMS_KEY) || '[]');
        const filtered = items.filter(item => item.slug !== slug);
        filtered.unshift({ slug, title, viewedAt: new Date().toISOString() });
        localStorage.setItem(EXAMS_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
    } catch { }
}

export function addViewedLesson(courseSlug: string, courseTitle: string, lessonId: string, lessonTitle: string) {
    if (!isBrowser()) return;
    try {
        const items: ViewedLesson[] = JSON.parse(localStorage.getItem(LESSONS_KEY) || '[]');
        const key = `${courseSlug}/${lessonId}`;
        const filtered = items.filter(item => `${item.courseSlug}/${item.lessonId}` !== key);
        filtered.unshift({ courseSlug, courseTitle, lessonId, lessonTitle, viewedAt: new Date().toISOString() });
        localStorage.setItem(LESSONS_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
    } catch { }
}

export function getViewedExams(): ViewedExam[] {
    if (!isBrowser()) return [];
    try {
        return JSON.parse(localStorage.getItem(EXAMS_KEY) || '[]');
    } catch {
        return [];
    }
}

export function getViewedLessons(): ViewedLesson[] {
    if (!isBrowser()) return [];
    try {
        return JSON.parse(localStorage.getItem(LESSONS_KEY) || '[]');
    } catch {
        return [];
    }
}
