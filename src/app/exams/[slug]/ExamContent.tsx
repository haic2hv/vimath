'use client';

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Coins, Unlock, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ExamFrontmatter } from "@/lib/exams";

type Props = {
    frontmatter: ExamFrontmatter;
    questionContent: string;
    solutionContent: string;
};

export default function ExamContent({ frontmatter, questionContent, solutionContent }: Props) {
    const { user, loading } = useAuth();

    const mdxOptions = {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    };

    const isFree = frontmatter.tokenPrice === 0;

    if (loading) return null;

    // Not logged in
    if (!user) {
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
                            {isFree ? (
                                <span className="meta-item meta-free">
                                    <Unlock size={14} />
                                    Miễn phí
                                </span>
                            ) : (
                                <span className="meta-item meta-token">
                                    <Coins size={14} />
                                    {frontmatter.tokenPrice} token
                                </span>
                            )}
                        </div>
                    </header>

                    <section className="premium-lock">
                        <div className="premium-lock-content">
                            <div className="premium-lock-icon">
                                <LogIn size={28} color="white" />
                            </div>
                            <h2>Đăng nhập để xem nội dung</h2>
                            <p>Bạn cần đăng nhập tài khoản HMath để xem bài viết này.</p>
                        </div>
                    </section>
                </article>
            </div>
        );
    }

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
                        {isFree ? (
                            <span className="meta-item meta-free">
                                <Unlock size={14} />
                                Miễn phí
                            </span>
                        ) : (
                            <span className="meta-item meta-token">
                                <Coins size={14} />
                                {frontmatter.tokenPrice} token
                            </span>
                        )}
                    </div>
                </header>

                <section className="markdown-body prose prose-indigo prose-lg max-w-none">
                    {/* @ts-ignore: Next.js RSC type incompatibility with next-mdx-remote */}
                    <MDXRemote source={questionContent} options={{ mdxOptions }} />
                </section>

                {solutionContent && (
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
                )}
            </article>
        </div>
    );
}
