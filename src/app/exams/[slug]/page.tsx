import { notFound } from "next/navigation";
import { getExamBySlug, getAllExams } from "@/lib/exams";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { ArrowLeft, Lock, Calendar, CheckCircle, Crown, Unlock } from "lucide-react";
import SolutionGate from "./SolutionGate";
import ExamViewTracker from "./ExamViewTracker";
import PdfViewer from "./PdfViewer";

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
                        {exam.frontmatter.isFree ? (
                            <span className="meta-item meta-free">
                                <CheckCircle size={14} />
                                Miễn phí
                            </span>
                        ) : (
                            <span className="meta-item meta-premium">
                                <Crown size={14} />
                                Thành viên
                            </span>
                        )}
                    </div>
                </header>

                {exam.frontmatter.pdfUrl && (
                    <PdfViewer
                        pdfUrl={exam.frontmatter.pdfUrl}
                        downloadUrl={exam.frontmatter.downloadUrl}
                        freeDownload={exam.frontmatter.freeDownload}
                    />
                )}

                {exam.frontmatter.isFree ? (
                    <>
                        <section className="markdown-body prose prose-indigo prose-lg max-w-none">
                            {/* @ts-ignore: Next.js RSC type incompatibility with next-mdx-remote */}
                            <MDXRemote source={exam.questionContent} options={{ mdxOptions }} />
                        </section>

                        {exam.solutionContent && (
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
                        )}
                    </>
                ) : (
                    <SolutionGate isFree={false}>
                        <section className="markdown-body prose prose-indigo prose-lg max-w-none">
                            {/* @ts-ignore */}
                            <MDXRemote source={exam.questionContent} options={{ mdxOptions }} />
                        </section>

                        {exam.solutionContent && (
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
                        )}
                    </SolutionGate>
                )}
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
                                        {re.frontmatter.isFree ? (
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
