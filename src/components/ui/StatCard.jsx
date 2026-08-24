import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from './Skeleton';

/**
 * StatCard — metric/KPI display card
 * @param {string}    label      - metric label
 * @param {string}    value      - metric value
 * @param {string}    change     - e.g. '+12%'
 * @param {boolean}   positive   - true = growth (green), false = decline (red)
 * @param {ReactNode} icon       - icon element
 * @param {string}    variant    - default | success | warning | danger | info
 * @param {string}    iconBg     - inline background for icon container
 * @param {boolean}   loading
 */
export default function StatCard({
  label,
  value,
  change,
  positive = true,
  icon,
  variant = 'default',
  iconBg,
  iconColor,
  loading = false,
}) {
  if (loading) {
    return (
      <div className={`stat-card stat-${variant}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={14} className="mb-2" />
            <Skeleton width="40%" height={28} className="mb-2" />
            <Skeleton width="30%" height={12} />
          </div>
          <Skeleton width={44} height={44} circle />
        </div>
      </div>
    );
  }

  return (
    <div className={`stat-card stat-${variant}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="stat-card-label">{label}</p>
          <p className="stat-card-value">{value}</p>
          {change !== undefined && (
            <div className={`stat-card-change ${positive ? 'positive' : 'negative'}`}>
              {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{change}</span>
              <span style={{ fontWeight: 'normal', color: 'var(--color-text-muted)', marginLeft: 2 }}>vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="stat-card-icon"
            style={{
              background: iconBg || 'var(--color-primary-50)',
              color: iconColor || 'var(--color-primary-600)',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
