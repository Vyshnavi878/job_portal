import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * FormField — wraps a label, input/control, hint, and error/success message.
 *
 * @param {string}    label
 * @param {string}    htmlFor      - id of the associated input
 * @param {boolean}   required
 * @param {string}    hint         - helper text below input
 * @param {string}    error        - error message
 * @param {string}    success      - success message
 * @param {ReactNode} children     - the actual input/control
 * @param {string}    className
 */
export default function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  success,
  children,
  className = '',
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="form-error" role="alert">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="form-success-msg">
          <CheckCircle2 size={12} />
          {success}
        </p>
      )}
      {hint && !error && !success && (
        <p className="form-hint">{hint}</p>
      )}
    </div>
  );
}
