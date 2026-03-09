'use client';

import { useEffect } from 'react';
import { addViewedExam } from '@/lib/view-history';

export default function ExamViewTracker({ slug, title }: { slug: string; title: string }) {
    useEffect(() => {
        addViewedExam(slug, title);
    }, [slug, title]);

    return null;
}
