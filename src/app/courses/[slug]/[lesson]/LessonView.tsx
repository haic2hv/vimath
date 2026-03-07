'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { ArrowLeft, Lock, Crown, Download } from 'lucide-react';

type Material = {
    label: string;
    url: string;
};

type LessonViewProps = {
    courseTitle: string;
    courseSlug: string;
    isFree: boolean;
    lessonTitle: string;
    lessonDescription: string;
    videoUrl: string;
    videoType: 'youtube' | 'vimeo';
    materials: Material[];
    prevLesson: { id: string; title: string } | null;
    nextLesson: { id: string; title: string } | null;
};

export default function LessonView({
    courseTitle, courseSlug, isFree, lessonTitle, lessonDescription,
    videoUrl, videoType, materials, prevLesson, nextLesson
}: LessonViewProps) {
    const { user, isPremium, loading, signInWithGoogle } = useAuth();

    if (loading) {
        return <div className="lesson-page"><p style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Đang tải...</p></div>;
    }

    // Free courses: everyone can view. Paid courses: members only.
    const canView = isFree || isPremium;

    if (!canView) {
        return (
            <div className="lesson-page">
                <Link href={`/courses/${courseSlug}`} className="exam-back-link">
                    <ArrowLeft size={16} />
                    {courseTitle}
                </Link>

                <div className="lesson-locked">
                    <div className="premium-lock-content">
                        <div className="premium-lock-icon">
                            <Lock size={28} color="white" />
                        </div>
                        <h2>{lessonTitle}</h2>
                        <p>
                            Nội dung video bài giảng này dành riêng cho Thành viên HMath.
                            Đăng ký gói Thành viên để xem toàn bộ khóa học.
                        </p>
                        <div className="premium-lock-price">
                            <Crown size={16} color="#f59e0b" />
                            Chỉ 199.000đ / năm
                        </div>
                        <div className="premium-lock-actions">
                            <Link href="/pricing" className="lock-btn-primary">
                                Đăng ký Thành viên
                            </Link>
                            {!user && (
                                <button onClick={() => signInWithGoogle()} className="lock-btn-secondary">
                                    Đăng nhập →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Can view: show full lesson
    return (
        <div className="lesson-page">
            <Link href={`/courses/${courseSlug}`} className="exam-back-link">
                <ArrowLeft size={16} />
                {courseTitle}
            </Link>

            <h1 className="lesson-title">{lessonTitle}</h1>
            <p className="lesson-desc">{lessonDescription}</p>

            {/* Download Materials */}
            {materials.length > 0 && (
                <div className="lesson-materials">
                    {materials.map((m, i) => (
                        <a
                            key={i}
                            href={m.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`lesson-material-link ${!m.url ? 'disabled' : ''}`}
                        >
                            {m.label}.{' '}
                            <span className="download-badge">
                                <Download size={13} />
                                DOWNLOAD
                            </span>
                        </a>
                    ))}
                </div>
            )}

            {/* Video */}
            <h3 className="lesson-video-label">Video bài giảng</h3>
            <div className="lesson-video-wrap">
                {videoUrl ? (
                    <iframe
                        src={videoUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="lesson-no-video">
                        <p>🎬 Video đang được chuẩn bị, vui lòng quay lại sau.</p>
                    </div>
                )}
            </div>

            <div className="lesson-nav">
                {prevLesson ? (
                    <Link href={`/courses/${courseSlug}/${prevLesson.id}`} className="lesson-nav-btn prev">
                        ← {prevLesson.title}
                    </Link>
                ) : <div />}
                {nextLesson ? (
                    <Link href={`/courses/${courseSlug}/${nextLesson.id}`} className="lesson-nav-btn next">
                        {nextLesson.title} →
                    </Link>
                ) : <div />}
            </div>
        </div>
    );
}
