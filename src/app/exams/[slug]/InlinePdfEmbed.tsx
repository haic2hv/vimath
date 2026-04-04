'use client';

import { Download, Lock, Coins } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function PdfEmbed({ url }: { url: string }) {
    return (
        <div className="pdf-iframe-container">
            <iframe
                src={url}
                title="Xem tài liệu PDF"
                allowFullScreen
            />
        </div>
    );
}

export function PdfDownload({ url, free }: { url: string; free?: string }) {
    const { user, signInWithGoogle } = useAuth();

    const isFree = free === 'true';
    // For free PDFs, anyone logged in can download
    // For non-free PDFs, they are gated by ContentGate already
    const canDownload = isFree || !!user;

    return (
        <div className="pdf-download-area">
            {canDownload ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-download-btn"
                >
                    <Download size={18} />
                    Tải về file word
                </a>
            ) : (
                <div className="pdf-download-locked">
                    <div className="pdf-locked-info">
                        <Lock size={16} />
                        <span>Đăng nhập để tải file tài liệu này</span>
                    </div>
                    <div className="pdf-locked-actions">
                        <button
                            onClick={() => signInWithGoogle()}
                            className="pdf-locked-btn-primary"
                        >
                            <Coins size={14} />
                            Đăng nhập
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
