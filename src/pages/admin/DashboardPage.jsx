import { Link } from 'react-router-dom';
import {
  Users, Building2, Briefcase, FileText, GraduationCap,
  CalendarDays, UserCheck, Clock, TrendingUp, AlertCircle,
  ArrowRight, ShieldCheck, CheckCircle2, XCircle, Activity,
  Layers, BarChart2, Eye, AlertTriangle, History
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const {
    candidates,
    recruiters,
    companies,
    jobs,
    internships,
    applications,
    jobMelas,
    registrations,
    reports,
    auditLogs,
    pendingCounts
  } = useAdmin();

  // 1. Action Required: Moderation Queue (6 Cards)
  const STATS_PENDING_ACTION = [
    {
      label: 'Pending Recruiter Verifications',
      value: String(pendingCounts.recruiterVerifications),
      change: 'Action Required',
      positive: false,
      icon: <UserCheck size={20} />,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      variant: 'warning',
      href: '/admin/recruiter-verification'
    },
    {
      label: 'Pending Company Verifications',
      value: String(pendingCounts.companyVerifications),
      change: 'Identity Check',
      positive: false,
      icon: <Building2 size={20} />,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      variant: 'warning',
      href: '/admin/company-verification'
    },
    {
      label: 'Pending Job Approvals',
      value: String(pendingCounts.jobApprovals),
      change: 'Under Review',
      positive: false,
      icon: <Clock size={20} />,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      variant: 'warning',
      href: '/admin/job-approvals'
    },
    {
      label: 'Pending Internship Approvals',
      value: String(pendingCounts.internshipApprovals),
      change: 'Campus Queue',
      positive: false,
      icon: <GraduationCap size={20} />,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      variant: 'warning',
      href: '/admin/internship-approvals'
    },
    {
      label: 'Pending Job Mela Approvals',
      value: String(pendingCounts.jobMelaApprovals),
      change: 'Event Queues',
      positive: false,
      icon: <CalendarDays size={20} />,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      variant: 'warning',
      href: '/admin/job-melas'
    },
    {
      label: 'Open Moderation Reports',
      value: String(pendingCounts.openReports),
      change: 'Urgent Complaints',
      positive: false,
      icon: <AlertTriangle size={20} />,
      iconBg: '#fef2f2',
      iconColor: '#dc2626',
      variant: 'danger',
      href: '/admin/reports'
    },
  ];

  // 2. Platform Overview (6 Cards)
  const STATS_PRIMARY = [
    {
      label: 'Total Candidates',
      value: String(candidates.length + 12450),
      change: '+240 today',
      positive: true,
      icon: <Users size={20} />,
      iconBg: '#eef2ff',
      iconColor: '#4f46e5'
    },
    {
      label: 'Total Recruiters',
      value: String(recruiters.length + 1280),
      change: '+18 this week',
      positive: true,
      icon: <UserCheck size={20} />,
      iconBg: '#fdf4ff',
      iconColor: '#c026d3'
    },
    {
      label: 'Verified Companies',
      value: String(companies.filter(c => c.verificationStatus === 'VERIFIED').length + 840),
      change: '+12 this month',
      positive: true,
      icon: <Building2 size={20} />,
      iconBg: '#eff6ff',
      iconColor: '#2563eb'
    },
    {
      label: 'Active Jobs',
      value: String(jobs.filter(j => j.status === 'ACTIVE').length + 4320),
      change: '+85 new',
      positive: true,
      icon: <Briefcase size={20} />,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      variant: 'success'
    },
    {
      label: 'Submitted Applications',
      value: String(applications.length + 48900),
      change: '+1.4k this week',
      positive: true,
      icon: <FileText size={20} />,
      iconBg: '#f8fafc',
      iconColor: '#475569'
    },
    {
      label: 'Job Mela Registrations',
      value: String(registrations.length + 15200),
      change: '+850 recent',
      positive: true,
      icon: <CalendarDays size={20} />,
      iconBg: '#fff1f2',
      iconColor: '#e11d48'
    },
  ];

  // 3. Pending Approvals Queue Items
  const pendingQueue = [
    ...recruiters.filter(r => r.verificationStatus === 'PENDING').map(r => ({
      type: 'Recruiter Verification',
      name: r.name,
      entity: r.company,
      time: r.registrationDate,
      link: '/admin/recruiter-verification',
    })),
    ...companies.filter(c => c.verificationStatus === 'PENDING').map(c => ({
      type: 'Company Verification',
      name: c.name,
      entity: `${c.industry} • ${c.recruiter}`,
      time: c.registrationDate,
      link: '/admin/company-verification',
    })),
    ...jobs.filter(j => j.status === 'PENDING').map(j => ({
      type: 'Job Approval',
      name: j.title,
      entity: `${j.company} • ${j.recruiter}`,
      time: j.postedDate,
      link: '/admin/job-approvals',
    })),
    ...internships.filter(i => i.status === 'PENDING').map(i => ({
      type: 'Internship Approval',
      name: i.title,
      entity: i.company,
      time: i.submittedDate,
      link: '/admin/internship-approvals',
    })),
  ].slice(0, 5);

  return (
    <div className="admin-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 1. Admin Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
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
              NTR VIKASA Administration
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: '#ffffff', marginBottom: 'var(--space-2)' }}>
            Platform Command Center
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: '#d4d4d8' }}>
            There are <strong>{pendingCounts.recruiterVerifications + pendingCounts.companyVerifications + pendingCounts.jobApprovals + pendingCounts.internshipApprovals + pendingCounts.openReports} pending moderation items</strong> requiring administrative review.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link to="/admin/recruiter-verification">
            <Button variant="primary" size="lg" style={{ background: '#3b82f6', color: '#ffffff', fontWeight: 700 }}>
              Recruiters ({pendingCounts.recruiterVerifications})
            </Button>
          </Link>
          <Link to="/admin/job-approvals">
            <Button variant="secondary" size="lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
              Jobs ({pendingCounts.jobApprovals})
            </Button>
          </Link>
          <Link to="/admin/company-verification">
            <Button variant="secondary" size="lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
              Companies ({pendingCounts.companyVerifications})
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Action Required: Moderation Queue (6 Cards) ── */}
      <div>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.05em' }}>
          Action Required: Moderation Queue
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          {STATS_PENDING_ACTION.map((s) => (
            <Link key={s.label} to={s.href} style={{ textDecoration: 'none' }}>
              <StatCard {...s} />
            </Link>
          ))}
        </div>
      </div>

      {/* ── 3. Platform Scale & Core Overview (6 Cards) ── */}
      <div>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.05em' }}>
          Platform Scale & Operations Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {STATS_PRIMARY.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* ── 4. Recent Pending Approvals & System Activity ── */}
      <div className="responsive-dashboard-grid">

        {/* Pending Approvals Stream */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Clock size={18} style={{ color: 'var(--color-warning-600)' }} />
              <h2 className="card-title">Pending Moderation Stream</h2>
            </div>
            <Link to="/admin/recruiter-verification">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {pendingQueue.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: 600 }}>All moderation queues are clear!</p>
              </div>
            ) : (
              pendingQueue.map((item, idx) => (
                <div key={idx} style={{
                  padding: 'var(--space-4) var(--space-6)',
                  borderBottom: idx < pendingQueue.length - 1 ? '1px solid var(--color-gray-100)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 'var(--space-3)'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--color-warning-700)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.type}
                    </span>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', margin: '2px 0' }}>{item.name}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>{item.entity} • {item.time}</p>
                  </div>
                  <Link to={item.link}>
                    <Button size="xs" variant="outline" rightIcon={<ArrowRight size={12} />}>
                      Review
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* System Activity & Audit Logs */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <History size={18} style={{ color: 'var(--color-primary-600)' }} />
              <h2 className="card-title">Recent System Audit Logs</h2>
            </div>
            <Link to="/admin/audit-logs">
              <Button variant="ghost" size="sm">Full Logs</Button>
            </Link>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {auditLogs.slice(0, 5).map((log, idx) => (
              <div key={log.id} style={{
                padding: 'var(--space-3) var(--space-6)',
                borderBottom: idx < 4 ? '1px solid var(--color-gray-100)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 'var(--text-xs)'
              }}>
                <div>
                  <strong style={{ color: 'var(--color-gray-900)', display: 'block' }}>{log.action}</strong>
                  <span style={{ color: 'var(--color-gray-500)' }}>{log.target} • by {log.adminUser}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{log.result}</span>
                  <div style={{ color: 'var(--color-gray-400)', fontSize: '10px' }}>{log.time}</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

      </div>

    </div>
  );
}
