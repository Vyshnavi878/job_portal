/**
 * Skeleton loading components
 */

export function Skeleton({ width, height = 16, circle = false, className = '', style = {} }) {
  return (
    <div
      className={`skeleton ${circle ? 'skeleton-circle' : ''} ${className}`}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: circle ? '50%' : undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height={14}
        />
      ))}
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="flex items-start gap-3" style={{ marginBottom: 'var(--space-3)' }}>
        <Skeleton width={48} height={48} circle />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height={16} className="mb-2" />
          <Skeleton width="40%" height={13} />
        </div>
      </div>
      <div className="flex gap-2" style={{ marginBottom: 'var(--space-3)' }}>
        <Skeleton width={80} height={24} />
        <Skeleton width={80} height={24} />
        <Skeleton width={80} height={24} />
      </div>
      <Skeleton width="100%" height={1} />
      <div className="flex justify-between" style={{ marginTop: 'var(--space-3)' }}>
        <Skeleton width={80} height={24} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="table-container">
      {/* Header */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-gray-50)' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width={`${100 / cols}%`} height={12} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-gray-100)' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={c === 0 ? '30%' : `${70 / (cols - 1)}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}
