import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const examsDirectory = path.join(process.cwd(), 'content/exams');

export type ExamFrontmatter = {
  title: string;
  date: string;
  tokenPrice: number;
  tags: string[];
  // Backward compat: isFree is derived from tokenPrice
  isFree?: boolean;
};

export type Exam = {
  slug: string;
  frontmatter: ExamFrontmatter;
  questionContent: string;
  solutionContent: string;
};

/**
 * Convert shortcode syntax to JSX component tags for MDXRemote.
 * - [pdf-embed](url) → <PdfEmbed url="url" />
 * - [pdf-download url="..." free=true|false] → <PdfDownload url="..." free="true|false" />
 */
function processShortcodes(content: string): string {
  // [pdf-embed](url)
  content = content.replace(
    /\[pdf-embed\]\(([^)]+)\)/g,
    (_match, url) => `<PdfEmbed url="${url.trim()}" />`
  );

  // [pdf-download url="..." free=true|false]
  content = content.replace(
    /\[pdf-download\s+url="([^"]+)"(?:\s+free=(true|false))?\]/g,
    (_match, url, free) => `<PdfDownload url="${url.trim()}" free="${free || 'false'}" />`
  );

  return content;
}

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

function parseFrontmatter(data: Record<string, any>): ExamFrontmatter {
  // Support both old isFree and new tokenPrice format
  let tokenPrice = 0;
  if (data.tokenPrice !== undefined) {
    tokenPrice = Number(data.tokenPrice) || 0;
  } else if (data.isFree === false) {
    tokenPrice = 5; // Default price for old premium exams
  }

  return {
    title: data.title || '',
    date: data.date || '',
    tokenPrice,
    tags: data.tags || [],
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
        frontmatter: parseFrontmatter(matterResult.data),
        questionContent: processShortcodes(questionContent),
        solutionContent: processShortcodes(solutionContent),
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
      frontmatter: parseFrontmatter(matterResult.data),
      questionContent: processShortcodes(questionContent),
      solutionContent: processShortcodes(solutionContent),
    };
  } catch (error) {
    return null;
  }
}
