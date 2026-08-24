import { getStatusConfig } from '../../utils/statusConfig';

/**
 * Badge — generic colored badge
 * @param {string} variant  - primary | success | warning | danger | info | gray
 * @param {string} size     - sm | md | lg
 * @param {boolean} dot     - show color dot
 */
export function Badge({ children, variant = 'gray', size = 'md', dot = false, className = '' }) {
  return (
    <span className={`badge badge-${variant} ${size === 'lg' ? 'badge-lg' : ''} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

/**
 * StatusBadge — auto-colors based on STATUS_CONFIG
 * @param {string} status  - one of the 20 status keys
 * @param {string} size    - sm | md | lg
 * @param {boolean} dot
 */
export function StatusBadge({ status, size = 'md', dot = true, className = '' }) {
  const config = getStatusConfig(status);
  return (
    <span className={`badge ${config.badgeClass} ${size === 'lg' ? 'badge-lg' : ''} ${className}`}>
      {dot && <span className="badge-dot" />}
      {config.label}
    </span>
  );
}
