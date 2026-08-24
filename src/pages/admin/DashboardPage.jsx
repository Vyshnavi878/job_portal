import { Link } from 'react-router-dom';
import {
  Users, Building2, Briefcase, FileText, GraduationCap,
  CalendarDays, UserCheck, Clock, TrendingUp, AlertCircle,
  ArrowRight, ShieldCheck, CheckCircle2, XCircle, Activity,
  Layers, BarChart2, Eye
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const STATS_PRIMARY = [
    { label: 'Total Candidates',       value: '12,450', change: '+240 today', positive: true, icon: <Users size={20} />,        iconBg: '#eef2ff', iconColor: '#4f46e5' },
    { label: 'Total Recruiters',       value: '1,280',  change: '+18 this week', positive: true, icon: <Users size={20} />,       iconBg: '#fdf4ff', iconColor: '#c026d3' },
    { label: 'Verified Companies',     value: '840',    change: '+12 this month', positive: true, icon: <Building2 size={20} />,   iconBg: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Active Jobs',            value: '4,320',  change: '+85 new', positive: true, icon: <Briefcase size={20} />,         iconBg: '#f0fdf4', iconColor: '#16a34a', variant: 'success' },
    { label: 'Total Applications',     value: '48,900', change: '+1.4k this week', positive: true, icon: <FileText size={20} />, iconBg: '#f8fafc', iconColor: '#475569' },
    { label: 'Mela Registrations',     value: '15,200', change: '+850 for BLR', positive: true, icon: <CalendarDays size={20} />, iconBg: '#fff1f2', iconColor: '#e11d48' },
  ];

  const STATS_PENDING_ACTION = [
    { label: 'Pending Recruiters',     value: '14',  change: 'Action Required', positive: false, icon: <UserCheck size={20} />,   iconBg: '#fffbeb', iconColor: '#d97706', variant: 'warning' },
    { label: 'Pending Jobs',           value: '28',  change: 'Under Review',    positive: false, icon: <Clock size={20} />,       iconBg: '#fffbeb', iconColor: '#d97706', variant: 'warning' },
    { label: 'Pending Internships',    value: '9',   change: 'Campus Queue',    positive: false, icon: <GraduationCap size={20} />,iconBg: '#fffbeb', iconColor: '#d97706', variant: 'warning' },
    { label: 'Pending Mela Requests',  value: '6',   change: 'Stall Approvals', positive: false, icon: <Building2 size={20} />,    iconBg: '#fffbeb', iconColor: '#d97706', variant: 'warning' },
  ];

  const PENDING_QUEUE_ITEMS = [
    { type: 'Recruiter Verification', name: 'Rahul Mehta', company: 'TechCorp India Pvt Ltd', submitted: '10 mins ago', link: '/admin/recruiters/requests', badge: 'REC_PENDING' },
    { type: 'Job Approval',           name: 'Cloud Security Architect', company: 'Infosys Ltd', submitted: '25 mins ago', link: '/admin/jobs/requests', badge: 'JOB_PENDING' },
    { type: 'Internship Approval',    name: 'AI Engineering Intern', company: 'Razorpay', submitted: '1 hr ago', link: '/admin/internships/requests', badge: 'INT_PENDING' },
    { type: 'Mela Stall Allocation',  name: 'Delhi NCR Career Expo', company: 'Swiggy', submitted: '2 hrs ago', link: '/admin/job-melas/participation', badge: 'MELA_PENDING' },
  ];

  return (
    <div className="admin-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 1. Admin Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <ShieldCheck size={18} style={{ color: '#34d399' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', color: '#a1a1aa', textTransform: 'uppercase' }}>
              System Command Center
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: '#ffffff', marginBottom: 'var(--space-2)' }}>
            Administrator Dashboard
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: '#d4d4d8' }}>
            There are <strong>57 pending moderation tasks</strong> across recruiter verifications, job approvals, and Job Mela stalls.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link to="/admin/recruiters/requests">
            <Button variant="primary" size="lg" style={{ background: '#3b82f6', color: '#ffffff', fontWeight: 700 }}>
              Verify Recruiters (14)
            </Button>
          </Link>
          <Link to="/admin/jobs/requests">
            <Button variant="secondary" size="lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
              Approve Jobs (28)
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Pending Moderation Action Cards (4 Cards) ── */}
      <div>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.05em' }}>
          Action Required: Moderation Queue
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {STATS_PENDING_ACTION.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── 3. Platform Growth & Core Metric Cards (6 Cards) ── */}
      <div>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.05em' }}>
          Platform Scale & Activity Metrics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
          {STATS_PRIMARY.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── 4. Visual Analytics & Charts Section ── */}
      <div className="responsive-dashboard-grid">

        {/* Recruitment Activity & Conversion Metrics */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Activity size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 className="card-title">Recruitment Pipeline & Volume Velocity</h2>
            </div>
            <Link to="/admin/reports"><Button variant="ghost" size="sm">Full Reports</Button></Link>
          </CardHeader>
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { label: 'Information Technology & Software', jobs: '2,140 jobs', pct: '49.5%', color: '#3b82f6' },
              { label: 'Banking, Financial Services & Insurance', jobs: '860 jobs', pct: '19.9%', color: '#10b981' },
              { label: 'Healthcare & Life Sciences', jobs: '540 jobs', pct: '12.5%', color: '#8b5cf6' },
              { label: 'E-Commerce, Logistics & Retail', jobs: '480 jobs', pct: '11.1%', color: '#f59e0b' },
              { label: 'Core Engineering, Auto & Manufacturing', jobs: '300 jobs', pct: '7.0%', color: '#ec4899' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.jobs} ({item.pct})</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: item.pct, height: '100%', background: item.color, borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Urgent Action Stream */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Clock size={18} style={{ color: 'var(--color-warning-600)' }} />
              <h2 className="card-title">Pending Moderation Stream</h2>
            </div>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {PENDING_QUEUE_ITEMS.map((item, idx) => (
              <div key={idx} style={{
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: idx < PENDING_QUEUE_ITEMS.length - 1 ? '1px solid var(--color-gray-100)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--color-warning-700)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.type}
                  </span>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{item.name}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.company} • {item.submitted}</p>
                </div>
                <Link to={item.link}>
                  <Button size="xs" variant="outline" rightIcon={<ArrowRight size={12} />}>
                    Review
                  </Button>
                </Link>
              </div>
            ))}
          </CardBody>
        </Card>

      </div>

    </div>
  );
}
