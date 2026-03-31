import { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';

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

  // Lock body scroll when modal is open
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

  // Render markdown body safely
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
  const renderedBody = md.render(article.body);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content portfolio-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="modal-title">{article.title}</h2>
        <div className="modal-meta">
          {article.date && (
            <time>{new Date(article.date).toISOString().split('T')[0]}</time>
          )}
          {article.tags && article.tags.length > 0 && (
            <div className="modal-tags">
              {article.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        {article.excerpt && <p className="modal-excerpt">{article.excerpt}</p>}
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: renderedBody }} />
      </div>
    </div>
  );
}
