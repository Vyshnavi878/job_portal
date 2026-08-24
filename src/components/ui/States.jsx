import { SearchX, FolderOpen, Briefcase, Users, FileText, Building2 } from 'lucide-react';

const ICONS = {
  default:      <FolderOpen size={40} />,
  jobs:         <Briefcase size={40} />,
  applications: <FileText size={40} />,
  candidates:   <Users size={40} />,
  companies:    <Building2 size={40} />,
  search:       <SearchX size={40} />,
};

/**
 * EmptyState component
 * @param {string}    title
 * @param {string}    description
 * @param {ReactNode} action    - CTA button
 * @param {string}    icon      - preset name or custom ReactNode
 */
export function EmptyState({ title = 'Nothing here yet', description, action, icon = 'default', className = '' }) {
  const iconEl = typeof icon === 'string' ? ICONS[icon] || ICONS.default : icon;
  return (
    <div className={`state-container fade-in ${className}`}>
      <div className="state-icon empty">{iconEl}</div>
      <div>
        <h3 className="state-title">{title}</h3>
        {description && <p className="state-desc">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * ErrorState component
 */
export function ErrorState({ title = 'Something went wrong', description = 'An unexpected error occurred. Please try again.', action, className = '' }) {
  return (
    <div className={`state-container fade-in ${className}`}>
      <div className="state-icon error">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <h3 className="state-title">{title}</h3>
        {description && <p className="state-desc">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * SuccessState component
 */
export function SuccessState({ title = 'Success!', description, action, className = '' }) {
  return (
    <div className={`state-container fade-in ${className}`}>
      <div className="state-icon success">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <div>
        <h3 className="state-title">{title}</h3>
        {description && <p className="state-desc">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * LoadingState component
 */
export function LoadingState({ title = 'Loading...', description, className = '' }) {
  return (
    <div className={`state-container ${className}`}>
      <div className="state-icon loading">
        <div
          style={{
            width: 40, height: 40,
            border: '3px solid var(--color-primary-200)',
            borderTopColor: 'var(--color-primary-600)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
      <div>
        <h3 className="state-title">{title}</h3>
        {description && <p className="state-desc">{description}</p>}
      </div>
    </div>
  );
}
