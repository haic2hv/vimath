import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const examsDirectory = path.join(process.cwd(), 'content/exams');

export type ExamFrontmatter = {
  title: string;
  date: string;
  isFree: boolean;
  tags: string[];
  pdfUrl?: string;
  downloadUrl?: string;
  freeDownload?: boolean;
};

export type Exam = {
  slug: string;
  frontmatter: ExamFrontmatter;
  questionContent: string;
  solutionContent: string;
};

function splitContent(content: string): { questionContent: string; solutionContent: string } {
  const parts = content.split('## Lời giải');
  if (parts.length > 1) {
    return {
      questionContent: parts[0],
      solutionContent: '## Lời giải\n' + parts.slice(1).join('## Lời giải'),
    };
  }
  return {
    questionContent: content,
    solutionContent: '',
  };
}

export function getAllExams(): Exam[] {
  if (!fs.existsSync(examsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(examsDirectory);
  const allExamsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(examsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const matterResult = matter(fileContents);
      const { questionContent, solutionContent } = splitContent(matterResult.content);

      return {
        slug,
        frontmatter: matterResult.data as ExamFrontmatter,
        questionContent,
        solutionContent,
      };
    });

  return allExamsData.sort((a, b) => {
    if (a.frontmatter.date < b.frontmatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getExamBySlug(slug: string): Exam | null {
  try {
    const fullPath = path.join(examsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const { questionContent, solutionContent } = splitContent(matterResult.content);

    return {
      slug,
      frontmatter: matterResult.data as ExamFrontmatter,
      questionContent,
      solutionContent,
    };
  } catch (error) {
    return null;
  }
}
