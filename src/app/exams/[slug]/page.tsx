import { notFound } from "next/navigation";
import { getExamBySlug, getAllExams } from "@/lib/exams";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { ArrowLeft, Lock, Calendar, CheckCircle } from "lucide-react";
import SolutionGate from "./SolutionGate";

export async function generateStaticParams() {
    const exams = getAllExams();
    return exams.map((exam) => ({
        slug: exam.slug,
    }));
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const exam = getExamBySlug(slug);

    if (!exam) {
        notFound();
    }

    const mdxOptions = {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    };

    return (
        <div className="exam-detail">
            <Link href="/" className="exam-back-link">
                <ArrowLeft size={16} />
                Quay lại danh sách
            </Link>

            <article>
                <header className="exam-detail-header">
                    <h1>{exam.frontmatter.title}</h1>
                    <div className="exam-detail-meta">
                        <span className="meta-item meta-date">
                            <Calendar size={14} />
                            {exam.frontmatter.date}
                        </span>
                        {exam.frontmatter.isFree ? (
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
                    <MDXRemote source={exam.questionContent} options={{ mdxOptions }} />
                </section>

                <SolutionGate isFree={exam.frontmatter.isFree}>
                    {exam.solutionContent ? (
                        <section className="solution-section">
                            <div className="solution-header">
                                <CheckCircle size={20} color="#059669" />
                                <h3>Chi tiết lời giải</h3>
                            </div>
                            <div className="markdown-body prose prose-indigo prose-lg max-w-none">
                                {/* @ts-ignore */}
                                <MDXRemote source={exam.solutionContent} options={{ mdxOptions }} />
                            </div>
                        </section>
                    ) : null}
                </SolutionGate>
            </article>
        </div>
    );
}
