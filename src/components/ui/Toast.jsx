import { useToast } from '../../context/ToastContext';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
};

function Toast({ id, type = 'info', title, message, duration = 4000, onDismiss }) {
  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="polite">
      {duration > 0 && (
        <div
          className="toast-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
      <span className="toast-icon">{ICONS[type]}</span>
      <div className="toast-content">
        {title && <p className="toast-title">{title}</p>}
        <p className="toast-message">{message}</p>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-container" aria-label="Notifications" role="region">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
