'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Unlock, ArrowRight } from 'lucide-react';
import ExamSearch from '@/app/components/ExamSearch';

type ExamData = {
    slug: string;
    title: string;
    date: string;
    isFree: boolean;
    tags: string[];
};

type Props = {
    exams: ExamData[];
    limit?: number;
    showViewAll?: boolean;
};

export default function ExamListClient({ exams, limit, showViewAll }: Props) {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const filtered = selectedTag
        ? exams.filter((exam) =>
            exam.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
        )
        : search
            ? exams.filter((exam) => {
                const q = search.toLowerCase();
                return (
                    exam.title.toLowerCase().includes(q) ||
                    exam.tags.some((t) => t.toLowerCase().includes(q)) ||
                    exam.slug.toLowerCase().includes(q)
                );
            })
            : exams;

    const displayed = limit && !search && !selectedTag ? filtered.slice(0, limit) : filtered;
    const hasMore = limit && !search && !selectedTag && filtered.length > limit;

    function handleSearch(query: string) {
        setSearch(query);
        if (query) setSelectedTag('');
    }

    function handleTagSelect(tag: string) {
        if (selectedTag === tag) {
            setSelectedTag('');
        } else {
            setSelectedTag(tag);
            setSearch('');
        }
    }

    return (
        <>
            <ExamSearch
                onSearch={handleSearch}
                value={search}
                selectedTag={selectedTag}
                onTagSelect={handleTagSelect}
            />

            <div className="exams-grid">
                {displayed.map((exam) => (
                    <Link
                        key={exam.slug}
                        href={`/exams/${exam.slug}`}
                        className="exam-card"
                    >
                        <div className="exam-card-header">
                            <div className="exam-card-badges">
                                {exam.isFree ? (
                                    <span className="badge badge-free">
                                        <Unlock size={11} />
                                        Miễn phí
                                    </span>
                                ) : (
                                    <span className="badge badge-premium">
                                        <Lock size={11} />
                                        Thành viên
                                    </span>
                                )}

                            </div>
                        </div>

                        <h3 className="exam-card-title">{exam.title}</h3>

                        <div className="exam-card-tags">
                            {exam.tags.map((tag) => (
                                <span key={tag} className="tag">#{tag}</span>
                            ))}
                        </div>
                    </Link>
                ))}
                {displayed.length === 0 && (
                    <div className="empty-state">
                        <p>{search || selectedTag ? 'Không tìm thấy đề thi phù hợp.' : 'Chưa có đề thi nào trong hệ thống.'}</p>
                    </div>
                )}
            </div>

            {showViewAll && hasMore && (
                <div className="view-all-link">
                    <Link href="/exams" className="btn-view-all">
                        Xem tất cả đề thi ({filtered.length} đề)
                        <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {!showViewAll && filtered.length > 0 && !search && !selectedTag && (
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    Hiển thị {filtered.length} đề thi
                </div>
            )}
        </>
    );
}
