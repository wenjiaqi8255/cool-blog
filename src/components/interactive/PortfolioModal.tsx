/* @refresh reload */
import { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';

export interface Article {
  id: number;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: string;
}

interface PortfolioModalProps {
  articles?: Article[];
}

export default function PortfolioModal({ articles = [] }: PortfolioModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for custom event to open modal with specific article
  useEffect(() => {
    const handleOpen = (e: CustomEvent<{ slug: string }>) => {
      const slug = e.detail.slug;
      const article = articles.find((a) => a.slug === slug);
      if (article) {
        setSelectedArticle(article);
        setIsOpen(true);
      }
    };

    window.addEventListener('open-portfolio-modal', handleOpen as EventListener);
    return () => {
      window.removeEventListener('open-portfolio-modal', handleOpen as EventListener);
    };
  }, [articles]);

  // Handle body scroll lock
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

  const handleClose = () => {
    setIsOpen(false);
    setSelectedArticle(null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Render markdown body safely - markdown-it configured with html: false prevents XSS
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

  return (
    <div id="portfolio-modal-container">
      {mounted && isOpen && selectedArticle && (
        <div
          className="modal-overlay"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <header className="modal-header">
              <h2 id="modal-title" className="modal-title">
                {selectedArticle.title}
              </h2>
              <div className="modal-meta">
                {selectedArticle.date && (
                  <time dateTime={selectedArticle.date}>
                    {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="modal-tags">
                    {selectedArticle.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {selectedArticle.excerpt && (
              <p className="modal-excerpt">{selectedArticle.excerpt}</p>
            )}

            {/*
              Security: markdown-it configured with html: false prevents XSS.
              Article body comes from trusted database source, not user input at render time.
            */}
            <div
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: md.render(selectedArticle.body) }}
            />
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content.portfolio-modal {
          background: #1a1a2e;
          border: 1px solid #2d2d44;
          border-radius: 16px;
          width: 100%;
          max-width: 640px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 32px;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: #a0a0a0;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #f0f0f0;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-header {
          margin-bottom: 16px;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 600;
          color: #f0f0f0;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .modal-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .modal-meta time {
          font-size: 14px;
          color: #6a6a7a;
        }

        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 10px;
          background: rgba(0, 212, 255, 0.15);
          color: #00d4ff;
          border-radius: 4px;
        }

        .modal-excerpt {
          font-size: 16px;
          color: #a0a0a0;
          line-height: 1.6;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #2d2d44;
        }

        .modal-body {
          color: #c0c0c0;
          line-height: 1.7;
          font-size: 15px;
        }

        .modal-body h1,
        .modal-body h2,
        .modal-body h3 {
          color: #f0f0f0;
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .modal-body h1 { font-size: 20px; }
        .modal-body h2 { font-size: 18px; }
        .modal-body h3 { font-size: 16px; }

        .modal-body p {
          margin-bottom: 16px;
        }

        .modal-body code {
          background: #0d0d1a;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
        }

        .modal-body pre {
          background: #0d0d1a;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 16px;
        }

        .modal-body pre code {
          background: transparent;
          padding: 0;
        }

        .modal-body ul,
        .modal-body ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }

        .modal-body li {
          margin-bottom: 8px;
        }

        .modal-body a {
          color: #00d4ff;
          text-decoration: none;
        }

        .modal-body a:hover {
          text-decoration: underline;
        }

        .modal-body img {
          max-width: 100%;
          border-radius: 8px;
          margin: 16px 0;
        }

        /* Scrollbar styling */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #1a1a2e;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #2d2d44;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #3d3d54;
        }
      `}</style>
    </div>
  );
}
