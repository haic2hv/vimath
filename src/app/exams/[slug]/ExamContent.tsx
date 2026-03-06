'use client';

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { ArrowLeft, Lock, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ExamFrontmatter } from "@/lib/exams";

type Props = {
    frontmatter: ExamFrontmatter;
    questionContent: string;
    solutionContent: string;
};

export default function ExamContent({ frontmatter, questionContent, solutionContent }: Props) {
    const { user, isPremium, loading } = useAuth();

    const mdxOptions = {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    };

    const showSolution = frontmatter.isFree || isPremium;

    return (
        <div className="exam-detail">
            <Link href="/" className="exam-back-link">
                <ArrowLeft size={16} />
                Quay lại danh sách
            </Link>

            <article>
                <header className="exam-detail-header">
                    <h1>{frontmatter.title}</h1>
                    <div className="exam-detail-meta">
                        <span className="meta-item meta-date">
                            <Calendar size={14} />
                            {frontmatter.date}
                        </span>
                        {frontmatter.isFree ? (
                            <span className="meta-item meta-free">
                                <CheckCircle size={14} />
                                Miễn phí
                            </span>
                        ) : (
                            <span className="meta-item meta-premium">
                                <Lock size={14} />
                                Premium
                            </span>
                        )}
                    </div>
                </header>

                <section className="markdown-body prose prose-indigo prose-lg max-w-none">
                    {/* @ts-ignore: Next.js RSC type incompatibility with next-mdx-remote */}
                    <MDXRemote source={questionContent} options={{ mdxOptions }} />
                </section>

                {loading ? null : showSolution ? (
                    solutionContent ? (
                        <section className="solution-section">
                            <div className="solution-header">
                                <CheckCircle size={20} color="#059669" />
                                <h3>Chi tiết lời giải</h3>
                            </div>
                            <div className="markdown-body prose prose-indigo prose-lg max-w-none">
                                {/* @ts-ignore */}
                                <MDXRemote source={solutionContent} options={{ mdxOptions }} />
                            </div>
                        </section>
                    ) : null
                ) : (
                    <section className="premium-lock">
                        <div className="premium-lock-content">
                            <div className="premium-lock-icon">
                                <Lock size={28} color="white" />
                            </div>
                            <h2>Đã khóa lời giải</h2>
                            <p>
                                Đây là đề thi dành riêng cho thành viên Premium.
                                Vui lòng nâng cấp tài khoản để xem toàn bộ lời giải chi tiết.
                            </p>
                            <div className="premium-lock-actions">
                                <Link href="/pricing" className="lock-btn-primary">
                                    Nâng cấp Premium
                                </Link>
                                {!user && (
                                    <Link href="/login" className="lock-btn-secondary">
                                        Đăng nhập →
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
}
