/* @refresh reload */
import { useState, useEffect, useRef, useCallback } from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for custom event to open modal with specific article
  useEffect(() => {
    const handleOpen = (e: CustomEvent<{ slug: string }>) => {
      const slug = e.detail.slug;
      const article = articles.find((a) => a.slug === slug);
      if (article) {
        // Store the currently focused element to restore later
        previousActiveElement.current = document.activeElement as HTMLElement;
        setSelectedArticle(article);
        setIsOpen(true);
      }
    };

    window.addEventListener('open-portfolio-modal', handleOpen as EventListener);
    return () => {
      window.removeEventListener('open-portfolio-modal', handleOpen as EventListener);
    };
  }, [articles]);

  // Handle body scroll lock and focus management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the close button after a short delay to ensure modal is rendered
      const focusTimeout = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(focusTimeout);
      };
    } else {
      document.body.style.overflow = '';
      // Restore focus to the element that opened the modal
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedArticle(null);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Focus trap - keep Tab cycling within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Filter tags - exclude 'Project' and 'featured' from display
  const getDisplayTags = (tags: string[]): string[] => {
    return tags.filter((tag) => tag !== 'Project' && tag !== 'featured');
  };

  // Render markdown body safely with DOMPurify sanitization (XSS prevention)
  // Same approach as article detail page - render body directly without preprocessing
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

  const getSanitizedBody = (body: string): string => {
    const rendered = md.render(body);
    return DOMPurify.sanitize(rendered);
  };

  const displayTags = selectedArticle ? getDisplayTags(selectedArticle.tags) : [];

  return (
    <div id="portfolio-modal-container">
      {mounted && isOpen && selectedArticle && (
        <div
          ref={modalRef}
          className="modal-overlay"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content portfolio-modal" onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeButtonRef}
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
              <div className="modal-meta-top">
                {displayTags.length > 0 && (
                  <div className="modal-tags">
                    {displayTags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                {selectedArticle.date && (
                  <time className="modal-date" dateTime={selectedArticle.date}>
                    {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>
              <h2 id="modal-title" className="modal-title">
                {selectedArticle.title}
              </h2>
            </header>

            {selectedArticle.excerpt && (
              <p className="modal-excerpt">{selectedArticle.excerpt}</p>
            )}

            {/*
              Security: DOMPurify sanitizes rendered markdown to prevent XSS attacks.
              markdown-it is configured with html: false as an additional layer of defense.
            */}
            <div
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: getSanitizedBody(selectedArticle.body) }}
            />

            <footer className="modal-footer">
              <a
                href={`/articles/${selectedArticle.slug}`}
                className="read-more-link"
              >
                Read full article
              </a>
            </footer>
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
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content.portfolio-modal {
          background: var(--color-canvas-white, #ffffff);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 32px;
          position: relative;
          animation: slideUp 0.3s ease;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
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
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          color: var(--color-ink-light, #666);
          font-size: 24px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          background: rgba(0, 0, 0, 0.05);
          border-color: var(--color-ink-light, #333);
          color: var(--color-ink-black, #111);
        }

        .modal-close:focus {
          outline: 2px solid var(--color-ink-black, #111);
          outline-offset: 2px;
        }

        .modal-header {
          margin-bottom: 24px;
          padding-right: 48px;
        }

        .modal-meta-top {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.06);
          color: var(--color-ink-gray, #555);
          border-radius: 4px;
        }

        .modal-date {
          font-size: 12px;
          color: var(--color-ink-light, #888);
          font-family: 'JetBrains Mono', monospace;
        }

        .modal-title {
          font-size: 28px;
          font-weight: 400;
          color: var(--color-ink-black, #111);
          margin: 0;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }

        .modal-excerpt {
          font-size: 18px;
          color: var(--color-ink-gray, #444);
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .modal-body {
          font-family: 'Inter', sans-serif;
          color: var(--color-ink-black, #111);
          line-height: 1.8;
          font-size: 16px;
        }

        .modal-body h1,
        .modal-body h2,
        .modal-body h3 {
          color: var(--color-ink-black, #111);
          margin-top: 32px;
          margin-bottom: 16px;
        }

        .modal-body h1 { font-size: 24px; font-weight: 400; letter-spacing: -0.02em; }
        .modal-body h2 { font-size: 20px; font-weight: 400; }
        .modal-body h3 { font-size: 18px; font-weight: 400; }

        .modal-body p {
          margin-bottom: 16px;
        }

        .modal-body code {
          font-family: 'JetBrains Mono', monospace;
          background: #1f1f1f;
          color: #111111;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
        }

        .modal-body pre {
          background: #1f1f1f;
          color: #111111;
          border-radius: 8px;
          padding: 24px;
          overflow-x: auto;
          margin-bottom: 16px;
          font-size: 14px;
          line-height: 1.6;
        }

        .modal-body pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }

        .modal-body ul,
        .modal-body ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .modal-body li {
          margin-bottom: 8px;
        }

        .modal-body a {
          color: var(--color-ink-black, #111);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .modal-body a:hover {
          text-decoration: none;
        }

        .modal-body img {
          max-width: 100%;
          border-radius: 8px;
          margin: 24px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .modal-body blockquote {
          border-left: 2px solid var(--color-ink-light, #ccc);
          margin: 24px 0;
          padding-left: 16px;
          color: var(--color-ink-gray, #555);
        }

        .modal-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .read-more-link {
          color: var(--color-ink-black, #111);
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .read-more-link:hover {
          text-decoration: underline;
        }

        .read-more-link:focus {
          outline: 2px solid var(--color-ink-black, #111);
          outline-offset: 2px;
        }

        /* Scrollbar styling */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .modal-content.portfolio-modal {
            width: 95%;
            max-height: 95vh;
            padding: 24px;
          }

          .modal-title {
            font-size: 24px;
          }

          .modal-excerpt {
            font-size: 16px;
          }

          .modal-body {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
