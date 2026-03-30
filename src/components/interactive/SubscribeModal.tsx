import { useState, useEffect, useRef } from 'react';

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
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
    setError('');
    setSuccess(false);
    setResendSuccess(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    // Client-side validation: email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed. Please try again.');
      }

      setSubscribedEmail(email);
      setSuccess(true);
      setEmail('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!subscribedEmail) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      const response = await fetch('/api/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend');
      }

      setResendSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="nav-pill"
        aria-haspopup="dialog"
      >
        SUBSCRIBE
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

            {success ? (
              <div className="success-content">
                <p className="success-title">You are subscribed!</p>
                <p className="success-subtext">Check your inbox for a confirmation email.</p>
                {resendSuccess ? (
                  <p className="resend-confirm">Confirmation email resent!</p>
                ) : isResending ? (
                  <p className="resend-loading">Sending...</p>
                ) : (
                  <button
                    type="button"
                    className="resend-button"
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                  >
                    Resend confirmation email
                  </button>
                )}
              </div>
            ) : (
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
                {error && <p className="error-message" role="alert">{error}</p>}
                <button
                  type="submit"
                  className="modal-submit"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
