import { Loader2 } from 'lucide-react';

/**
 * Button component
 * @param {string} variant - primary | secondary | outline | ghost | danger | success
 * @param {string} size    - xs | sm | md | lg | xl
 * @param {boolean} fullWidth
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {boolean} iconOnly
 * @param {ReactNode} leftIcon
 * @param {ReactNode} rightIcon
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconOnly = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}) {
  const sizeClass = size === 'md' ? '' : `btn-${size}`;
  const classes = [
    'btn',
    `btn-${variant}`,
    sizeClass,
    fullWidth ? 'btn-full' : '',
    iconOnly ? 'btn-icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="btn-spinner" />
      ) : leftIcon ? (
        <span className="btn-icon-left">{leftIcon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  );
}
