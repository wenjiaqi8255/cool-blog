import { useState, useEffect, useCallback } from 'react';

interface SearchInputProps {
  eventName?: string;
}

export default function SearchInput({ eventName = 'search-change' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce: 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Dispatch search event when debounced query changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(eventName, { detail: debouncedQuery }));
  }, [debouncedQuery, eventName]);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    window.dispatchEvent(new CustomEvent(eventName, { detail: '' }));
  }, [eventName]);

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