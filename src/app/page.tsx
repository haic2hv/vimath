import Link from "next/link";
import { getAllExams } from "@/lib/exams";
import { getAllCourses } from "@/lib/courses";
import { ArrowRight, BookOpen, Award, GraduationCap, PlayCircle } from "lucide-react";
import ExamListClient from "@/app/components/ExamListClient";
import CoursesList from "@/app/components/CoursesList";

export default function HomePage() {
  const exams = getAllExams();
  const courses = getAllCourses();
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

  const examData = exams.map(e => ({
    slug: e.slug,
    title: e.frontmatter.title,
    date: e.frontmatter.date,
    isFree: e.frontmatter.isFree,
    tags: e.frontmatter.tags,
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <GraduationCap size={14} />
            Nền tảng Học và Luyện thi trực tuyến
          </div>
          <h1>
            Chinh phục Toán học cùng{" "}
            <span className="gradient-text">HMath</span>
          </h1>
          <p>
            Hệ thống Bài giảng và Đề thi với lời giải chi tiết,
            trực quan và chuyên nghiệp. Luyện thi tinh gọn, tối ưu, đạt điểm cao.
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
          <div className="stat-number">{courses.length}</div>
          <div className="stat-label">Khóa học</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{totalLessons}</div>
          <div className="stat-label">Bài giảng</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            <Award size={28} />
          </div>
          <div className="stat-label">Lời giải chi tiết</div>
        </div>
      </div>

      {/* Exam List with Search */}
      <section className="exams-section" id="exams">
        <div className="section-header">
          <div>
            <h2 className="section-title">Danh sách đề thi</h2>
            <p className="section-subtitle">Tìm kiếm và chọn đề thi phù hợp với bạn</p>
          </div>
        </div>

        <ExamListClient exams={examData} />
      </section>

      {/* Courses Section */}
      <CoursesList />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng chinh phục điểm cao?</h2>
          <p>
            Nâng cấp tài khoản Premium để truy cập toàn bộ đề thi và lời giải chi tiết.
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
