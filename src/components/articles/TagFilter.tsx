import { useState } from 'react';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const AVAILABLE_TAGS = ['ML', 'Systems', 'Tutorial', 'Project', 'Notes'] as const;

export default function TagFilter({ selectedTags, onChange }: TagFilterProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTags);

  const handleTagClick = (tag: string) => {
    const newSelected = localSelected.includes(tag)
      ? localSelected.filter((t) => t !== tag)
      : [...localSelected, tag];

    setLocalSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="tag-filter">
      <label className="tag-filter-label">按标签筛选</label>
      <div className="tag-pills">
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = localSelected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`tag-pill ${isSelected ? 'selected' : ''}`}
              onClick={() => handleTagClick(tag)}
              aria-pressed={isSelected}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}