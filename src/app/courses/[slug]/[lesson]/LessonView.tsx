'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { ArrowLeft, Lock, Coins, Download, LogIn, Loader2 } from 'lucide-react';
import { addViewedLesson } from '@/lib/view-history';

type Material = {
    label: string;
    url: string;
};

type LessonViewProps = {
    courseTitle: string;
    courseSlug: string;
    tokenPrice: number;
    lessonId: string;
    lessonTitle: string;
    lessonDescription: string;
    videoUrl: string;
    videoType: 'youtube' | 'vimeo';
    materials: Material[];
    prevLesson: { id: string; title: string } | null;
    nextLesson: { id: string; title: string } | null;
};

export default function LessonView({
    courseTitle, courseSlug, tokenPrice, lessonId, lessonTitle, lessonDescription,
    videoUrl, videoType, materials, prevLesson, nextLesson
}: LessonViewProps) {
    const { user, tokenBalance, loading, signInWithGoogle, refreshTokenBalance } = useAuth();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseError, setPurchaseError] = useState('');

    const isFree = tokenPrice === 0;

    useEffect(() => {
        if (!loading && user && !isFree && hasAccess === null && !checking) {
            checkAccess();
        }
    }, [loading, user, isFree]);

    async function checkAccess() {
        if (!user) return;
        setChecking(true);
        try {
            const res = await fetch(`/api/check-access?userId=${user.id}&itemType=course&itemSlug=${courseSlug}`);
            const data = await res.json();
            setHasAccess(data.hasAccess);
        } catch {
            setHasAccess(false);
        }
        setChecking(false);
    }

    const canView = isFree || hasAccess === true;

    useEffect(() => {
        if (!loading && canView) {
            addViewedLesson(courseSlug, courseTitle, lessonId, lessonTitle);
        }
    }, [loading, canView, courseSlug, courseTitle, lessonId, lessonTitle]);

    if (loading) {
        return <div className="lesson-page"><p style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Đang tải...</p></div>;
    }

    // Not logged in
    if (!user) {
        return (
            <div className="lesson-page">
                <Link href={`/courses/${courseSlug}`} className="exam-back-link">
                    <ArrowLeft size={16} />
                    {courseTitle}
                </Link>
                <div className="lesson-locked">
                    <div className="premium-lock-content">
                        <div className="premium-lock-icon">
                            <LogIn size={28} color="white" />
                        </div>
                        <h2>{lessonTitle}</h2>
                        <p>Đăng nhập tài khoản HMath để xem bài giảng này.</p>
                        <div className="premium-lock-actions">
                            <button onClick={() => signInWithGoogle()} className="lock-btn-primary">
                                <LogIn size={16} /> Đăng nhập / Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Checking access
    if (!isFree && (hasAccess === null || checking)) {
        return (
            <div className="lesson-page">
                <Link href={`/courses/${courseSlug}`} className="exam-back-link">
                    <ArrowLeft size={16} />
                    {courseTitle}
                </Link>
                <div className="lesson-locked">
                    <div className="premium-lock-content">
                        <Loader2 size={24} className="spin" />
                        <p>Đang kiểm tra quyền truy cập...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Need to buy course
    if (!canView) {
        const handlePurchase = async () => {
            setPurchasing(true);
            setPurchaseError('');
            try {
                const res = await fetch('/api/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        itemType: 'course',
                        itemSlug: courseSlug,
                        tokenPrice,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    setHasAccess(true);
                    await refreshTokenBalance();
                } else if (res.status === 402) {
                    setPurchaseError(`Không đủ token. Cần ${tokenPrice} token, hiện có ${tokenBalance} token.`);
                } else if (res.status === 409) {
                    setHasAccess(true);
                } else {
                    setPurchaseError(data.error || 'Có lỗi xảy ra');
                }
            } catch {
                setPurchaseError('Có lỗi xảy ra. Vui lòng thử lại.');
            }
            setPurchasing(false);
        };

        const formattedPrice = new Intl.NumberFormat('vi-VN').format(tokenPrice * 1000) + 'đ';

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
                        <p>Khóa học này yêu cầu trả token để truy cập toàn bộ bài giảng.</p>
                        <div className="token-price-display">
                            <Coins size={20} />
                            <span className="token-price-amount">{tokenPrice} token</span>
                            <span className="token-price-vnd">({formattedPrice})</span>
                        </div>
                        <div className="token-balance-info">
                            Số dư hiện tại: <strong>{tokenBalance} token</strong>
                        </div>
                        {purchaseError && <div className="purchase-error">{purchaseError}</div>}
                        <div className="premium-lock-actions">
                            {tokenBalance >= tokenPrice ? (
                                <button onClick={handlePurchase} className="lock-btn-primary" disabled={purchasing}>
                                    {purchasing ? (
                                        <><Loader2 size={16} className="spin" /> Đang xử lý...</>
                                    ) : (
                                        <><Coins size={16} /> Mua khóa học ({tokenPrice} token)</>
                                    )}
                                </button>
                            ) : (
                                <Link href="/pricing" className="lock-btn-primary">
                                    <Coins size={16} /> Nạp thêm token
                                </Link>
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
            {materials.filter(m => m.label || m.url).length > 0 && (
                <div className="lesson-materials">
                    {materials.filter(m => m.label || m.url).map((m, i) => (
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
