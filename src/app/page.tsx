import Link from "next/link";
import { getAllExams } from "@/lib/exams";
import { Lock, Unlock, ArrowRight, BookOpen, Award, GraduationCap } from "lucide-react";

export default function HomePage() {
  const exams = getAllExams();
  const freeCount = exams.filter(e => e.frontmatter.isFree).length;
  const premiumCount = exams.filter(e => !e.frontmatter.isFree).length;

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <GraduationCap size={14} />
            Nền tảng #1 cho Toán học THPT
          </div>
          <h1>
            Chinh phục Toán học cùng{" "}
            <span className="gradient-text">HMath</span>
          </h1>
          <p>
            Hệ thống đề thi trắc nghiệm Toán học với lời giải chi tiết,
            trực quan bằng LaTeX. Ôn tập thông minh, đạt điểm cao.
          </p>
          <div className="hero-actions">
            <Link href="#exams" className="btn-primary">
              <BookOpen size={18} />
              Xem đề thi
            </Link>
            <Link href="/pricing" className="btn-secondary">
              Nâng cấp Premium
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">{exams.length}</div>
          <div className="stat-label">Đề thi</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{freeCount}</div>
          <div className="stat-label">Miễn phí</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{premiumCount}</div>
          <div className="stat-label">Premium</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            <Award size={28} />
          </div>
          <div className="stat-label">Lời giải chi tiết</div>
        </div>
      </div>

      {/* Exam List */}
      <section className="exams-section" id="exams">
        <div className="section-header">
          <div>
            <h2 className="section-title">Danh sách đề thi</h2>
            <p className="section-subtitle">Duyệt và chọn đề thi phù hợp với bạn</p>
          </div>
        </div>

        <div className="exams-grid">
          {exams.map((exam) => (
            <Link
              key={exam.slug}
              href={`/exams/${exam.slug}`}
              className="exam-card"
            >
              <div className="exam-card-header">
                <div className="exam-card-badges">
                  {exam.frontmatter.isFree ? (
                    <span className="badge badge-free">
                      <Unlock size={11} />
                      Miễn phí
                    </span>
                  ) : (
                    <span className="badge badge-premium">
                      <Lock size={11} />
                      Premium
                    </span>
                  )}
                  <span className="badge badge-date">
                    {exam.frontmatter.date}
                  </span>
                </div>
              </div>

              <h3 className="exam-card-title">
                {exam.frontmatter.title}
              </h3>

              <div className="exam-card-tags">
                {exam.frontmatter.tags.map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </Link>
          ))}
          {exams.length === 0 && (
            <div className="empty-state">
              <p>Chưa có đề thi nào trong hệ thống.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng chinh phục điểm cao?</h2>
          <p>
            Nâng cấp tài khoản Premium để truy cập toàn bộ đề thi và lời giải chi tiết
            từ các trường chuyên hàng đầu.
          </p>
          <Link href="/pricing" className="btn-primary">
            Xem bảng giá Premium
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
