/**
 * PageSkeleton — full-page loading skeleton layouts.
 * Use these as placeholder loaders while async data fetches.
 * Simply render with `loading={true}` guards:
 *   if (loading) return <DashboardSkeleton />;
 */
import { Skeleton } from './Skeleton';

/** Generic single stat card skeleton */
function StatSkeleton() {
  return (
    <div className="skeleton-stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="50%" height={13} />
        <Skeleton width={36} height={36} circle />
      </div>
      <Skeleton width="60%" height={28} />
      <Skeleton width="40%" height={11} />
    </div>
  );
}

/** Dashboard page skeleton — stat row + two content panels */
export function DashboardSkeleton({ statCount = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Stats */}
      <div className="skeleton-stat-grid">
        {Array.from({ length: statCount }).map((_, i) => <StatSkeleton key={i} />)}
      </div>

      {/* Two panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        {[0, 1].map(i => (
          <div key={i} className="skeleton-card">
            <Skeleton width="40%" height={16} style={{ marginBottom: 'var(--space-4)' }} />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="skeleton-list-item" style={{ marginBottom: 'var(--space-3)' }}>
                <Skeleton width={40} height={40} circle />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" height={13} style={{ marginBottom: 'var(--space-2)' }} />
                  <Skeleton width="45%" height={11} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Table / list page skeleton */
export function TablePageSkeleton({ rows = 5, showHeader = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Page header */}
      {showHeader && (
        <div className="skeleton-page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width="25%" height={22} />
            <Skeleton width={120} height={36} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Skeleton width="30%" height={36} />
            <Skeleton width={80} height={36} />
            <Skeleton width={80} height={36} />
          </div>
        </div>
      )}

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <Skeleton width={44} height={44} circle />
          <div style={{ flex: 1 }}>
            <Skeleton width="55%" height={14} style={{ marginBottom: 'var(--space-2)' }} />
            <Skeleton width="35%" height={11} style={{ marginBottom: 'var(--space-2)' }} />
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Skeleton width={60} height={20} />
              <Skeleton width={60} height={20} />
            </div>
          </div>
          <Skeleton width={80} height={32} />
        </div>
      ))}
    </div>
  );
}

/** Notification page skeleton */
export function NotificationPageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header card */}
      <div className="skeleton-page-header">
        <Skeleton width="35%" height={22} />
        <Skeleton width="60%" height={13} />
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          {[60, 80, 90, 100, 80].map((w, i) => (
            <Skeleton key={i} width={w} height={28} style={{ borderRadius: 99 }} />
          ))}
        </div>
      </div>

      {/* Notification items */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <Skeleton width={44} height={44} circle />
          <div style={{ flex: 1 }}>
            <Skeleton width="20%" height={11} style={{ marginBottom: 'var(--space-1)' }} />
            <Skeleton width="60%" height={14} style={{ marginBottom: 'var(--space-2)' }} />
            <Skeleton width="85%" height={11} style={{ marginBottom: 'var(--space-1)' }} />
            <Skeleton width="70%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Profile / form page skeleton */
export function FormPageSkeleton({ fields = 6 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Avatar row */}
      <div className="skeleton-page-header">
        <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center' }}>
          <Skeleton width={88} height={88} circle />
          <div style={{ flex: 1 }}>
            <Skeleton width="30%" height={18} style={{ marginBottom: 'var(--space-2)' }} />
            <Skeleton width="20%" height={13} />
          </div>
          <Skeleton width={100} height={36} />
        </div>
      </div>

      {/* Form fields */}
      <div className="skeleton-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i}>
              <Skeleton width="30%" height={12} style={{ marginBottom: 'var(--space-2)' }} />
              <Skeleton width="100%" height={38} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
