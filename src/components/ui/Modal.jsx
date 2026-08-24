import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Modal / Dialog component
 * @param {boolean}  open
 * @param {Function} onClose
 * @param {string}   title
 * @param {string}   size    - sm | md | lg | xl
 * @param {boolean}  closable
 * @param {ReactNode} footer
 */
export function Modal({ open, onClose, title, size = 'md', closable = true, footer, children }) {
  // Close on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && closable) onClose?.();
  }, [closable, onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget && closable) onClose?.(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal modal-${size}`}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title" id="modal-title">{title}</h2>
            {closable && (
              <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
                <X size={16} />
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/**
 * ConfirmDialog — simple confirmation modal with icon, animation, and loading state.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const iconMap = {
    danger:  { bg: 'var(--color-danger-50)',  color: 'var(--color-danger-500)',  svg: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>) },
    primary: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)', svg: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>) },
    success: { bg: 'var(--color-success-50)', color: 'var(--color-success-600)', svg: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>) },
  };
  const icon = iconMap[variant] || iconMap.danger;

  return (
    <Modal open={open} onClose={onClose} title={null} size="sm">
      <div style={{ textAlign: 'center', padding: 'var(--space-2) 0 var(--space-4)' }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64,
          borderRadius: '50%',
          background: icon.bg,
          color: icon.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-4)',
        }}>
          {icon.svg}
        </div>

        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
        <button className="btn btn-secondary" onClick={onClose} disabled={loading} style={{ minWidth: 100 }}>
          {cancelText}
        </button>
        <button
          className={`btn btn-${variant}${variant === 'danger' ? ' attention' : ''}`}
          onClick={onConfirm}
          disabled={loading}
          style={{ minWidth: 100 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              Processing…
            </span>
          ) : confirmText}
        </button>
      </div>
    </Modal>
  );
}
