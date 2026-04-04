import { notFound } from "next/navigation";
import { getExamBySlug, getAllExams } from "@/lib/exams";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle, Coins, Unlock } from "lucide-react";
import ContentGate from "./SolutionGate";
import ExamViewTracker from "./ExamViewTracker";
import { PdfEmbed, PdfDownload } from "./InlinePdfEmbed";

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

    // Find related exams by matching tags
    const allExams = getAllExams();
    const currentTags = exam.frontmatter.tags.map(t => t.toLowerCase());
    const relatedExams = allExams
        .filter(e => e.slug !== slug)
        .map(e => {
            const matchCount = e.frontmatter.tags.filter(t =>
                currentTags.includes(t.toLowerCase())
            ).length;
            return { ...e, matchCount };
        })
        .filter(e => e.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 4);

    const mdxOptions = {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    };

    const mdxComponents = {
        PdfEmbed,
        PdfDownload,
    };

    const isFree = exam.frontmatter.tokenPrice === 0;

    return (
        <div className="exam-detail">
            <ExamViewTracker slug={slug} title={exam.frontmatter.title} />
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
                        {isFree ? (
                            <span className="meta-item meta-free">
                                <Unlock size={14} />
                                Miễn phí
                            </span>
                        ) : (
                            <span className="meta-item meta-token">
                                <Coins size={14} />
                                {exam.frontmatter.tokenPrice} token
                            </span>
                        )}
                    </div>
                </header>

                <ContentGate tokenPrice={exam.frontmatter.tokenPrice} itemType="exam" itemSlug={slug}>
                    <section className="markdown-body prose prose-indigo prose-lg max-w-none">
                        {/* @ts-ignore: Next.js RSC type incompatibility with next-mdx-remote */}
                        <MDXRemote source={exam.questionContent} options={{ mdxOptions }} components={mdxComponents} />
                    </section>

                    {exam.solutionContent && (
                        <section className="solution-section">
                            <div className="solution-header">
                                <CheckCircle size={20} color="#059669" />
                                <h3>Chi tiết lời giải</h3>
                            </div>
                            <div className="markdown-body prose prose-indigo prose-lg max-w-none">
                                {/* @ts-ignore */}
                                <MDXRemote source={exam.solutionContent} options={{ mdxOptions }} components={mdxComponents} />
                            </div>
                        </section>
                    )}
                </ContentGate>
            </article>

            {/* Related Exams */}
            {relatedExams.length > 0 && (
                <section className="related-exams">
                    <h2 className="related-exams-title">Đề thi cùng chuyên mục</h2>
                    <div className="related-exams-grid">
                        {relatedExams.map((re) => (
                            <Link
                                key={re.slug}
                                href={`/exams/${re.slug}`}
                                className="exam-card"
                            >
                                <div className="exam-card-header">
                                    <div className="exam-card-badges">
                                        {re.frontmatter.tokenPrice === 0 ? (
                                            <span className="badge badge-free">
                                                <Unlock size={11} />
                                                Miễn phí
                                            </span>
                                        ) : (
                                            <span className="badge badge-token">
                                                <Coins size={11} />
                                                {re.frontmatter.tokenPrice} token
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="exam-card-title">{re.frontmatter.title}</h3>
                                <div className="exam-card-tags">
                                    {re.frontmatter.tags.map((tag) => (
                                        <span key={tag} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
