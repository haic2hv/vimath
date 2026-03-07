const fs = require('fs');
const path = require('path');

// ===== CẤU HÌNH =====
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const EXAMS_DIR = path.join(__dirname, 'content', 'exams');

// ===== PROMPT MẪU =====
const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên nhận diện đề thi Toán học từ hình ảnh.

NHIỆM VỤ: Đọc hình ảnh đề thi và tạo file Markdown theo đúng định dạng bên dưới.

QUY TẮC:
1. Nhận diện chính xác tất cả câu hỏi, công thức toán học
2. Dùng LaTeX cho công thức: $công_thức$ (inline) hoặc $$công_thức$$ (block)
3. Giữ nguyên cấu trúc đề: Bài, Câu, phần a), b), c)
4. Phần "## Lời giải" - viết lời giải chi tiết cho TỪNG câu
5. Trả về ĐÚNG định dạng bên dưới, KHÔNG thêm \`\`\`markdown hay bất kỳ ký hiệu nào khác

ĐỊNH DẠNG BẮT BUỘC:
---
title: "[Tên đề thi - nhận diện từ ảnh]"
date: "[YYYY-MM-DD hôm nay]"
isFree: false
tags: ["lớp X", "tag phù hợp"]
---

[Nội dung đề thi với LaTeX]

## Lời giải

[Lời giải chi tiết từng câu với LaTeX]
`;

async function generateExamFromImage(imagePath, options = {}) {
    // Đọc file ảnh
    if (!fs.existsSync(imagePath)) {
        console.error(`❌ Không tìm thấy file: ${imagePath}`);
        process.exit(1);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png'
        : imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') ? 'image/jpeg'
            : imagePath.endsWith('.webp') ? 'image/webp'
                : 'image/jpeg';

    console.log(`📸 Đang xử lý ảnh: ${imagePath}`);
    console.log(`🤖 Gọi Gemini API để nhận diện đề thi...`);

    // Thêm ngày hôm nay vào prompt
    const today = new Date().toISOString().split('T')[0];
    const userPrompt = options.extraPrompt
        ? `Ngày hôm nay: ${today}\n\n${options.extraPrompt}`
        : `Ngày hôm nay: ${today}\n\nHãy nhận diện đề thi từ hình ảnh và tạo file markdown.`;

    // Gọi Gemini API
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: [{
                parts: [
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image,
                        }
                    },
                    { text: userPrompt }
                ]
            }],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 8192,
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Lỗi API: ${response.status}`);
        console.error(error);
        process.exit(1);
    }

    const data = await response.json();
    let markdown = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!markdown) {
        console.error('❌ Không nhận được kết quả từ API');
        process.exit(1);
    }

    // Xóa markdown code block nếu có
    markdown = markdown.replace(/^```markdown\n?/, '').replace(/\n?```$/, '').trim();

    // Tạo tên file từ title
    const titleMatch = markdown.match(/title:\s*"(.+?)"/);
    const title = titleMatch ? titleMatch[1] : 'de-thi-moi';
    const slug = options.slug || title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Lưu file
    const outputPath = path.join(EXAMS_DIR, `${slug}.md`);

    if (!fs.existsSync(EXAMS_DIR)) {
        fs.mkdirSync(EXAMS_DIR, { recursive: true });
    }

    fs.writeFileSync(outputPath, markdown, 'utf8');

    console.log(`\n✅ Tạo đề thi thành công!`);
    console.log(`📄 File: ${outputPath}`);
    console.log(`🔗 URL: /exams/${slug}`);
    console.log(`\n📌 Tiếp theo: git add . && git commit -m "Thêm ${title}" && git push`);

    return { slug, outputPath, markdown };
}

// ===== CHẠY SCRIPT =====
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════╗
║   🎓 HMath - Tạo đề thi từ ảnh             ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Cách dùng:                                  ║
║    node generate-exam.js <ảnh> [tùy chọn]    ║
║                                              ║
║  Ví dụ:                                      ║
║    node generate-exam.js dethi.jpg            ║
║    node generate-exam.js dethi.png --slug     ║
║         de-thi-toan-8-hk1                     ║
║                                              ║
║  Tùy chọn:                                   ║
║    --slug <tên>  Đặt tên file (URL slug)     ║
║    --free        Đặt đề thi miễn phí         ║
║    --prompt <p>  Thêm yêu cầu cho AI        ║
║                                              ║
╚══════════════════════════════════════════════╝
`);
    process.exit(0);
}

const imagePath = path.resolve(args[0]);
const options = {};

for (let i = 1; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) {
        options.slug = args[i + 1];
        i++;
    } else if (args[i] === '--free') {
        options.extraPrompt = (options.extraPrompt || '') + '\nĐặt isFree: true';
    } else if (args[i] === '--prompt' && args[i + 1]) {
        options.extraPrompt = (options.extraPrompt || '') + '\n' + args[i + 1];
        i++;
    }
}

generateExamFromImage(imagePath, options).catch(err => {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
});
