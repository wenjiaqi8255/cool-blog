import { useState, useEffect, useRef } from 'react';

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

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

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setEmail('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // Phase 3: Will submit to backend API
    // For now, just log and close
    console.log('Newsletter subscription:', email);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    handleClose();

    // Show success message (Phase 3 will implement properly)
    alert('Thanks for subscribing! (Demo mode - backend coming in Phase 3)');
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="subscribe-button"
        aria-haspopup="dialog"
      >
        Subscribe
      </button>

      {isOpen && (
        <div
          className="modal-overlay"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content" ref={modalRef}>
            <button
              onClick={handleClose}
              className="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">
                Subscribe to the newsletter
              </h2>
              <p className="modal-description">
                Get the latest articles and updates delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="modal-input"
                required
                disabled={isSubmitting}
                aria-label="Email address"
              />

              <button
                type="submit"
                className="modal-submit"
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
