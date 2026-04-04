'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlayCircle, Unlock, Coins, Search } from 'lucide-react';

type CourseData = {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    tokenPrice: number;
    lessonsCount: number;
};

export default function CoursesListClient({ courses }: { courses: CourseData[] }) {
    const [search, setSearch] = useState('');

    const filtered = search
        ? courses.filter((c) => {
            const q = search.toLowerCase();
            return (
                c.title.toLowerCase().includes(q) ||
                c.tags.some(t => t.toLowerCase().includes(q)) ||
                c.slug.toLowerCase().includes(q)
            );
        })
        : courses;

    return (
        <>
            <div className="course-search-box">
                <Search size={16} className="course-search-icon" />
                <input
                    type="text"
                    placeholder="Tìm khóa học theo tên, lớp..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="course-search-input"
                />
            </div>

            <div className="courses-grid">
                {filtered.map((course) => (
                    <Link
                        key={course.slug}
                        href={`/courses/${course.slug}`}
                        className="exam-card"
                    >
                        <div className="exam-card-header">
                            <div className="exam-card-badges">
                                {course.tokenPrice === 0 ? (
                                    <span className="badge badge-free">
                                        <Unlock size={11} />
                                        Miễn phí
                                    </span>
                                ) : (
                                    <span className="badge badge-token">
                                        <Coins size={11} />
                                        {course.tokenPrice} token
                                    </span>
                                )}
                                <span className="badge badge-date">
                                    {course.lessonsCount} bài học
                                </span>
                            </div>
                        </div>

                        <h3 className="exam-card-title">{course.title}</h3>

                        <p className="course-card-desc-sm">{course.description}</p>

                        <div className="exam-card-tags">
                            {course.tags.map(tag => (
                                <span key={tag} className="tag">#{tag}</span>
                            ))}
                        </div>
                    </Link>
                ))}
                {filtered.length === 0 && (
                    <div className="empty-state">
                        <p>{search ? 'Không tìm thấy khóa học phù hợp.' : 'Chưa có khóa học nào.'}</p>
                    </div>
                )}
            </div>
        </>
    );
}
