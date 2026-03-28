import { useState, useEffect, useCallback } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce: 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="search-input-wrapper">
      <input
        type="text"
        className="search-input"
        placeholder="搜索文章标题或内容..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="搜索文章"
      />
      {query && (
        <button
          type="button"
          className="search-clear-button"
          onClick={handleClear}
          aria-label="清除搜索"
        >
          ×
        </button>
      )}
    </div>
  );
}