import fs from 'fs';
import path from 'path';

const coursesDir = path.join(process.cwd(), 'content', 'courses');

export type Lesson = {
    id: string;
    title: string;
    duration: string;
    videoUrl: string;
    videoType: 'youtube' | 'vimeo';
    description: string;
    materials?: { label: string; url: string }[];
};

export type Course = {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    lessons: Lesson[];
};

export function getAllCourses(): Course[] {
    if (!fs.existsSync(coursesDir)) return [];

    const files = fs.readdirSync(coursesDir).filter(f => f.endsWith('.json'));
    return files.map(file => {
        const raw = fs.readFileSync(path.join(coursesDir, file), 'utf8');
        return JSON.parse(raw) as Course;
    });
}

export function getCourseBySlug(slug: string): Course | null {
    const filePath = path.join(coursesDir, `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as Course;
}
