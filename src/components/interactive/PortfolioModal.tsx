import { useState, useEffect } from 'react';

export interface Article {
  id: number;
  title: string;
  slug: string;
  date: Date;
  tags: string[];
  excerpt: string;
  body: string;
}

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

export default function PortfolioModal({ isOpen, onClose, article }: PortfolioModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !article) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2>{article.title}</h2>
        <p>{article.date.toISOString().split('T')[0]}</p>
        <div className="tags">
          {article.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="body" dangerouslySetInnerHTML={{ __html: article.body }} />
      </div>
    </div>
  );
}
