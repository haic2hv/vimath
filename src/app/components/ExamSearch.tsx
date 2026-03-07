'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SUGGESTIONS = [
    { label: 'Lớp 6', query: 'lớp 6' },
    { label: 'Lớp 7', query: 'lớp 7' },
    { label: 'Lớp 8', query: 'lớp 8' },
    { label: 'Lớp 9', query: 'lớp 9' },
    { label: 'Đại số', query: 'đại số' },
    { label: 'Hình học', query: 'hình học' },
    { label: 'Thi vào 6', query: 'thi vào 6' },
    { label: 'Thi vào 10', query: 'thi vào 10' },
    { label: 'Học kỳ 1', query: 'hk1' },
    { label: 'Học kỳ 2', query: 'hk2' },
    { label: 'Chuyên', query: 'chuyên' },
];

type Props = {
    onSearch: (query: string) => void;
    value: string;
};

export default function ExamSearch({ onSearch, value }: Props) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSuggestion(query: string) {
        onSearch(query);
        setFocused(false);
        inputRef.current?.blur();
    }

    function handleClear() {
        onSearch('');
        inputRef.current?.focus();
    }

    return (
        <div className="exam-search-wrap">
            <div className={`exam-search ${focused ? 'focused' : ''}`}>
                <Search size={18} className="exam-search-icon" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm đề thi theo tên, lớp, chủ đề..."
                    value={value}
                    onChange={(e) => onSearch(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                    className="exam-search-input"
                />
                {value && (
                    <button onClick={handleClear} className="exam-search-clear">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Suggestion Tags */}
            <div className="exam-search-tags">
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s.query}
                        className={`exam-tag-btn ${value.toLowerCase() === s.query.toLowerCase() ? 'active' : ''}`}
                        onClick={() => handleSuggestion(s.query)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
