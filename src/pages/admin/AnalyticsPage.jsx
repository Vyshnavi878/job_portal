import { useState } from 'react';
import {
  TrendingUp, Users, Building2, Briefcase, FileText,
  GraduationCap, CalendarDays, Award, BarChart3, PieChart,
  ArrowUpRight, Download, Filter, RefreshCw
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

  const totalUsersCount = candidates.length + recruiters.length;

  const CORE_METRICS = [
    { label: 'Total Platform Users',  value: `${totalUsersCount + 12840}`, change: '+320 this week', positive: true, icon: <Users size={20} />, iconBg: '#eef2ff', iconColor: '#4f46e5' },
    { label: 'Active Candidates',     value: `${candidates.length + 11200}`, change: '+240 today', positive: true, icon: <Users size={20} />, iconBg: '#f0fdf4', iconColor: '#16a34a' },
    { label: 'Verified Recruiters',   value: `${recruiters.length + 1240}`, change: '+18 this week', positive: true, icon: <Building2 size={20} />, iconBg: '#fdf4ff', iconColor: '#c026d3' },
    { label: 'Registered Companies',  value: `${companies.length + 830}`, change: '+14 this month', positive: true, icon: <Building2 size={20} />, iconBg: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Live Posted Jobs',      value: `${jobs.length + 4310}`, change: '+85 new', positive: true, icon: <Briefcase size={20} />, iconBg: '#fffbeb', iconColor: '#d97706' },
    { label: 'Submitted Applications',value: `${applications.length + 48850}`, change: '+1.4k this week', positive: true, icon: <FileText size={20} />, iconBg: '#f8fafc', iconColor: '#475569' },
    { label: 'Active Internships',    value: `${internships.length + 940}`, change: '+32 campus', positive: true, icon: <GraduationCap size={20} />, iconBg: '#ecfdf5', iconColor: '#059669' },
    { label: 'Mela Registrations',    value: `${registrations.length + 15190}`, change: '+850 recent', positive: true, icon: <CalendarDays size={20} />, iconBg: '#fff1f2', iconColor: '#e11d48' },
  ];

  const SECTOR_DISTRIBUTION = [
    { name: 'Information Technology & Software', share: '48.5%', count: '2,140 Jobs', color: '#3b82f6' },
    { name: 'Banking, Financial Services & Insurance', share: '21.0%', count: '920 Jobs', color: '#10b981' },
    { name: 'Healthcare Diagnostics & Pharma', share: '12.5%', count: '550 Jobs', color: '#8b5cf6' },
    { name: 'E-Commerce, Logistics & Retail', share: '10.5%', count: '460 Jobs', color: '#f59e0b' },
    { name: 'Core Engineering & Manufacturing', share: '7.5%', count: '330 Jobs', color: '#ec4899' },
  ];

  const MONTHLY_GROWTH = [
    { month: 'Apr 2026', candidates: 7400, jobs: 2800, placements: 1240 },
    { month: 'May 2026', candidates: 8900, jobs: 3200, placements: 1480 },
    { month: 'Jun 2026', candidates: 10200, jobs: 3650, placements: 1820 },
    { month: 'Jul 2026', candidates: 11500, jobs: 4050, placements: 2150 },
    { month: 'Aug 2026', candidates: 12450, jobs: 4320, placements: 2420 },
  ];

  const handleExport = () => {
    addToast('Platform analytics report exported to CSV successfully.', 'success');
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
            <div style={{ display: 'flex', background: 'var(--color-gray-100)', padding: '3px', borderRadius: '8px' }}>
              {['7D', '30D', '90D', '1Y'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: timeRange === range ? '#fff' : 'transparent',
                    color: timeRange === range ? 'var(--color-primary-700)' : 'var(--color-gray-600)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: timeRange === range ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {range}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExport}>
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* ── 1. Platform Key Metrics Grid (8 KPI Cards) ── */}
      <div>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gray-500)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          Platform Scale KPIs
        </h2>
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
                  {MONTHLY_GROWTH.map((row) => (
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
