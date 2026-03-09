'use client';

import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SUGGESTIONS = [
    { label: 'Thi vào 6', tag: 'Thi vào 6' },
    { label: 'Lớp 6', tag: 'Lớp 6' },
    { label: 'Lớp 7', tag: 'Lớp 7' },
    { label: 'Lớp 8', tag: 'Lớp 8' },
    { label: 'Lớp 9', tag: 'Lớp 9' },
    { label: 'Thi vào 10', tag: 'Thi vào 10' },
    { label: 'Chuyên', tag: 'Chuyên' },
    { label: 'HSG', tag: 'HSG' },
];

type Props = {
    onSearch: (query: string) => void;
    value: string;
    selectedTag: string;
    onTagSelect: (tag: string) => void;
};

export default function ExamSearch({ onSearch, value, selectedTag, onTagSelect }: Props) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
                {(value || selectedTag) && (
                    <button onClick={() => { handleClear(); onTagSelect(''); }} className="exam-search-clear">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Tag Filter Buttons */}
            <div className="exam-search-tags">
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s.tag}
                        className={`exam-tag-btn ${selectedTag === s.tag ? 'active' : ''}`}
                        onClick={() => onTagSelect(s.tag)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
