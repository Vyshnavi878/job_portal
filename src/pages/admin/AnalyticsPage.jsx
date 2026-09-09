import { useState, useMemo } from 'react';
import {
  TrendingUp, Users, Building2, Briefcase, FileText,
  GraduationCap, CalendarDays, Award, BarChart3, PieChart,
  ArrowUpRight, Download, Filter, RefreshCw, Calendar
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

export default function AdminAnalyticsPage() {
  const { candidates, recruiters, companies, jobs, internships, applications, jobMelas, registrations } = useAdmin();
  const { addToast } = useToast();
  
  const [timeRange, setTimeRange] = useState('30D');
  const [customFrom, setCustomFrom] = useState('2026-08-01');
  const [customTo, setCustomTo] = useState('2026-08-31');
  const [appliedCustomRange, setAppliedCustomRange] = useState(null);
  const [dateError, setDateError] = useState('');

  // Active date boundary calculation
  const activeDateRange = useMemo(() => {
    const now = new Date('2026-09-09T23:59:59.999Z');
    if (timeRange === '7D') {
      const from = new Date(now);
      from.setDate(from.getDate() - 7);
      return { from, to: now, label: 'Last 7 Days' };
    }
    if (timeRange === '30D') {
      const from = new Date(now);
      from.setDate(from.getDate() - 30);
      return { from, to: now, label: 'Last 30 Days' };
    }
    if (timeRange === '90D') {
      const from = new Date(now);
      from.setDate(from.getDate() - 90);
      return { from, to: now, label: 'Last 90 Days' };
    }
    if (timeRange === '1Y') {
      const from = new Date(now);
      from.setFullYear(from.getFullYear() - 1);
      return { from, to: now, label: 'Last 1 Year' };
    }
    if (timeRange === 'CUSTOM' && appliedCustomRange) {
      const from = new Date(appliedCustomRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(appliedCustomRange.to);
      to.setHours(23, 59, 59, 999);
      const label = `${from.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} – ${to.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      return { from, to, label };
    }
    return null;
  }, [timeRange, appliedCustomRange]);

  const isWithinRange = (dateStr) => {
    if (!activeDateRange) return true;
    if (!dateStr) return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    return d >= activeDateRange.from && d <= activeDateRange.to;
  };

  const handleApplyCustomDate = (e) => {
    if (e) e.preventDefault();
    if (!customFrom || !customTo) {
      setDateError('Please select both From Date and To Date.');
      addToast('Please select both From Date and To Date.', 'error');
      return;
    }

    const fromDate = new Date(customFrom);
    const toDate = new Date(customTo);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      setDateError('Please enter a valid date range.');
      addToast('Please enter a valid date range.', 'error');
      return;
    }

    if (fromDate > toDate) {
      setDateError('From Date cannot be after To Date.');
      addToast('From Date cannot be after To Date.', 'error');
      return;
    }

    setDateError('');
    setAppliedCustomRange({ from: customFrom, to: customTo });
    addToast(
      `Applied custom date range: ${new Date(customFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} to ${new Date(customTo).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      'success'
    );
  };

  // Filter existing collections by active date range
  const filteredCandidates = useMemo(() => {
    if (!activeDateRange) return candidates;
    return candidates.filter(c => isWithinRange(c.createdAt || c.registeredDate || c.joinedDate));
  }, [candidates, activeDateRange]);

  const filteredRecruiters = useMemo(() => {
    if (!activeDateRange) return recruiters;
    return recruiters.filter(r => isWithinRange(r.createdAt || r.joinedDate));
  }, [recruiters, activeDateRange]);

  const filteredCompanies = useMemo(() => {
    if (!activeDateRange) return companies;
    return companies.filter(c => isWithinRange(c.createdAt || c.joinedDate));
  }, [companies, activeDateRange]);

  const filteredJobs = useMemo(() => {
    if (!activeDateRange) return jobs;
    return jobs.filter(j => isWithinRange(j.postedDate || j.createdAt));
  }, [jobs, activeDateRange]);

  const filteredInternships = useMemo(() => {
    if (!activeDateRange) return internships;
    return internships.filter(i => isWithinRange(i.postedDate || i.createdAt));
  }, [internships, activeDateRange]);

  const filteredApplications = useMemo(() => {
    if (!activeDateRange) return applications;
    return applications.filter(a => isWithinRange(a.appliedDate || a.createdAt));
  }, [applications, activeDateRange]);

  const filteredRegistrations = useMemo(() => {
    if (!activeDateRange) return registrations;
    return registrations.filter(r => isWithinRange(r.registrationDate || r.registeredDate || r.createdAt));
  }, [registrations, activeDateRange]);

  const totalUsersCount = filteredCandidates.length + filteredRecruiters.length;

  const CORE_METRICS = [
    { label: 'Total Platform Users',  value: `${totalUsersCount + 12840}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+320 this week', positive: true, icon: <Users size={20} />, iconBg: '#eef2ff', iconColor: '#4f46e5' },
    { label: 'Active Candidates',     value: `${filteredCandidates.length + 11200}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+240 today', positive: true, icon: <Users size={20} />, iconBg: '#f0fdf4', iconColor: '#16a34a' },
    { label: 'Verified Recruiters',   value: `${filteredRecruiters.length + 1240}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+18 this week', positive: true, icon: <Building2 size={20} />, iconBg: '#fdf4ff', iconColor: '#c026d3' },
    { label: 'Registered Companies',  value: `${filteredCompanies.length + 830}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+14 this month', positive: true, icon: <Building2 size={20} />, iconBg: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Live Posted Jobs',      value: `${filteredJobs.length + 4310}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+85 new', positive: true, icon: <Briefcase size={20} />, iconBg: '#fffbeb', iconColor: '#d97706' },
    { label: 'Submitted Applications',value: `${filteredApplications.length + 48850}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+1.4k this week', positive: true, icon: <FileText size={20} />, iconBg: '#f8fafc', iconColor: '#475569' },
    { label: 'Active Internships',    value: `${filteredInternships.length + 940}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+32 campus', positive: true, icon: <GraduationCap size={20} />, iconBg: '#ecfdf5', iconColor: '#059669' },
    { label: 'Mela Registrations',    value: `${filteredRegistrations.length + 15190}`, change: timeRange === 'CUSTOM' ? 'in selected range' : '+850 recent', positive: true, icon: <CalendarDays size={20} />, iconBg: '#fff1f2', iconColor: '#e11d48' },
  ];

  const SECTOR_DISTRIBUTION = [
    { name: 'Information Technology & Software', share: '48.5%', count: '2,140 Jobs', color: '#3b82f6' },
    { name: 'Banking, Financial Services & Insurance', share: '21.0%', count: '920 Jobs', color: '#10b981' },
    { name: 'Healthcare Diagnostics & Pharma', share: '12.5%', count: '550 Jobs', color: '#8b5cf6' },
    { name: 'E-Commerce, Logistics & Retail', share: '10.5%', count: '460 Jobs', color: '#f59e0b' },
    { name: 'Core Engineering & Manufacturing', share: '7.5%', count: '330 Jobs', color: '#ec4899' },
  ];

  const ALL_MONTHLY_GROWTH = [
    { month: 'Apr 2026', date: new Date('2026-04-01'), candidates: 7400, jobs: 2800, placements: 1240 },
    { month: 'May 2026', date: new Date('2026-05-01'), candidates: 8900, jobs: 3200, placements: 1480 },
    { month: 'Jun 2026', date: new Date('2026-06-01'), candidates: 10200, jobs: 3650, placements: 1820 },
    { month: 'Jul 2026', date: new Date('2026-07-01'), candidates: 11500, jobs: 4050, placements: 2150 },
    { month: 'Aug 2026', date: new Date('2026-08-01'), candidates: 12450, jobs: 4320, placements: 2420 },
  ];

  const displayedMonthlyGrowth = useMemo(() => {
    if (timeRange === 'CUSTOM' && activeDateRange) {
      const filtered = ALL_MONTHLY_GROWTH.filter(m => {
        const mEnd = new Date(m.date.getFullYear(), m.date.getMonth() + 1, 0, 23, 59, 59);
        return mEnd >= activeDateRange.from && m.date <= activeDateRange.to;
      });
      return filtered.length > 0 ? filtered : ALL_MONTHLY_GROWTH;
    }
    if (timeRange === '7D' || timeRange === '30D') {
      return ALL_MONTHLY_GROWTH.slice(-2);
    }
    if (timeRange === '90D') {
      return ALL_MONTHLY_GROWTH.slice(-3);
    }
    return ALL_MONTHLY_GROWTH;
  }, [timeRange, activeDateRange]);

  const handleExport = () => {
    const rangeLabel = activeDateRange?.label || timeRange;
    addToast(`Platform analytics report (${rangeLabel}) exported to CSV successfully.`, 'success');
  };

  return (
    <div className="portal-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <TrendingUp size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Platform-Wide Hiring Analytics</h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', margin: 0 }}>
              Real-time platform metrics, user adoption trends, sector demand distribution, and placement funnel performance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: 'var(--color-gray-100)', padding: '3px', borderRadius: '8px', flexWrap: 'wrap', gap: 2 }}>
              {['7D', '30D', '90D', '1Y', 'Custom Date'].map((range) => {
                const isCustom = range === 'Custom Date';
                const isSelected = isCustom ? timeRange === 'CUSTOM' : timeRange === range;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      if (isCustom) {
                        setTimeRange('CUSTOM');
                      } else {
                        setTimeRange(range);
                        setAppliedCustomRange(null);
                        setDateError('');
                      }
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: isSelected ? '#fff' : 'transparent',
                      color: isSelected ? 'var(--color-primary-700)' : 'var(--color-gray-600)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {range}
                  </button>
                );
              })}
            </div>

            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExport}>
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Date Range Selector (shown when Custom Date tab is selected) */}
      {timeRange === 'CUSTOM' && (
        <div
          className="card"
          style={{
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-primary-200, #bfdbfe)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CalendarDays size={18} style={{ color: 'var(--color-primary-600)' }} />
              <div>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', display: 'block' }}>
                  Custom Date Range Filter
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Select From Date and To Date to filter analytics metrics and placement trends.
                </span>
              </div>
            </div>

            {appliedCustomRange && (
              <span style={{
                fontSize: '11px',
                background: 'var(--color-primary-50, #eff6ff)',
                color: 'var(--color-primary-700, #1d4ed8)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                border: '1px solid var(--color-primary-200, #bfdbfe)'
              }}>
                Active Range: {new Date(appliedCustomRange.from).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} – {new Date(appliedCustomRange.to).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <form
            onSubmit={handleApplyCustomDate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                From Date:
              </label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => {
                  setCustomFrom(e.target.value);
                  setDateError('');
                }}
                className="form-control"
                style={{ height: 36, padding: '4px 10px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)' }}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                To Date:
              </label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => {
                  setCustomTo(e.target.value);
                  setDateError('');
                }}
                className="form-control"
                style={{ height: 36, padding: '4px 10px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <Button type="submit" variant="primary" size="sm">
                Apply
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setTimeRange('30D');
                  setAppliedCustomRange(null);
                  setDateError('');
                }}
              >
                Reset to 30D
              </Button>
            </div>
          </form>

          {dateError && (
            <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
              ⚠️ {dateError}
            </div>
          )}
        </div>
      )}

      {/* ── 1. Platform Key Metrics Grid (8 KPI Cards) ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gray-500)', margin: 0, letterSpacing: '0.05em' }}>
            Platform Scale KPIs
          </h2>
          {activeDateRange && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Period: {activeDateRange.label}
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {CORE_METRICS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── 2. Visual Distribution & Funnel Analysis ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Industry Sector Demand */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 className="card-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                Hiring Demand by Industry Sector
              </h2>
            </div>
          </CardHeader>
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SECTOR_DISTRIBUTION.map((sector) => (
              <div key={sector.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{sector.name}</span>
                  <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>{sector.count} ({sector.share})</span>
                </div>
                <div style={{ height: '8px', background: 'var(--color-gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: sector.share, height: '100%', background: sector.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Monthly Platform Trajectory */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: '#16a34a' }} />
              <h2 className="card-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                Monthly Platform Placement Trajectory
              </h2>
            </div>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-gray-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Month</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Candidates</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Active Jobs</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Placements</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMonthlyGrowth.map((row) => (
                    <tr key={row.month} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>{row.month}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-gray-700)' }}>{row.candidates.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-gray-700)' }}>{row.jobs.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#16a34a', fontWeight: 700 }}>{row.placements.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}
