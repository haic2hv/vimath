'use client';

import { Download, Lock, Crown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

type Props = {
    pdfUrl: string;
    downloadUrl?: string;
    freeDownload?: boolean;
};

export default function PdfViewer({ pdfUrl, downloadUrl, freeDownload }: Props) {
    const { isPremium, user, signInWithGoogle } = useAuth();

    const canDownload = freeDownload || isPremium;

    return (
        <section className="pdf-viewer-section">
            <div className="pdf-iframe-container">
                <iframe
                    src={pdfUrl}
                    title="Xem đề thi PDF"
                    allowFullScreen
                />
            </div>

            {downloadUrl && (
                <div className="pdf-download-area">
                    {canDownload ? (
                        <a
                            href={downloadUrl}
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
                                <span>Tải file word tài liệu này dành cho Thành viên Premium</span>
                            </div>
                            <div className="pdf-locked-actions">
                                <Link href="/pricing" className="pdf-locked-btn-primary">
                                    <Crown size={14} />
                                    Đăng ký Premium
                                </Link>
                                {!user && (
                                    <button
                                        onClick={() => signInWithGoogle()}
                                        className="pdf-locked-btn-secondary"
                                    >
                                        Đăng nhập
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
