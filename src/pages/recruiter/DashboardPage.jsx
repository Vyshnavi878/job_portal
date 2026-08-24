import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Clock, CheckCircle2, TrendingUp, AlertCircle,
  Plus, ArrowRight, Eye, CalendarCheck, Building2, UserCheck,
  Sparkles, FileText, ChevronRight
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const STATS = [
  { label: 'Active Jobs',   value: '6',   change: '+2 this week', positive: true, icon: <Briefcase size={20} />, iconBg: '#eef2ff', iconColor: '#4f46e5' },
  { label: 'Pending Jobs',  value: '2',   change: 'Under Admin Review', positive: false, icon: <Clock size={20} />, iconBg: '#fffbeb', iconColor: '#d97706', variant: 'warning' },
  { label: 'Total Applicants', value: '214', change: '+38 this week', positive: true, icon: <Users size={20} />, iconBg: '#eff6ff', iconColor: '#2563eb' },
  { label: 'Shortlisted',   value: '38',  change: '+9 new', positive: true, icon: <TrendingUp size={20} />, iconBg: '#f0fdf4', iconColor: '#16a34a', variant: 'success' },
  { label: 'Interviews',    value: '12',  change: '4 scheduled today', positive: true, icon: <CalendarCheck size={20} />, iconBg: '#fdf4ff', iconColor: '#c026d3', variant: 'default' },
  { label: 'Selected / Hired', value: '6', change: '+2 this month', positive: true, icon: <UserCheck size={20} />, iconBg: '#ecfdf5', iconColor: '#059669', variant: 'success' },
];

const RECENT_APPLICATIONS = [
  { id: '1', name: 'Priya Sharma', role: 'Senior Frontend Engineer', exp: '4.2 yrs', appliedOn: 'Today, 10:30 AM', status: 'SHORTLISTED', score: '92%' },
  { id: '2', name: 'Amitav Ghosh', role: 'Staff Backend Engineer (Java)', exp: '8.5 yrs', appliedOn: 'Today, 09:15 AM', status: 'UNDER_REVIEW', score: '88%' },
  { id: '3', name: 'Sneha Kulkarni', role: 'UI/UX Product Designer', exp: '3.0 yrs', appliedOn: 'Yesterday', status: 'INTERVIEW', score: '95%' },
  { id: '4', name: 'Vikram Patel', role: 'DevOps & Cloud Engineer', exp: '5.1 yrs', appliedOn: '2 days ago', status: 'APPLIED', score: '79%' },
  { id: '5', name: 'Kavita Menon', role: 'Talent Acquisition Lead', exp: '2.5 yrs', appliedOn: '3 days ago', status: 'REJECTED', score: '62%' },
];

const RECENT_JOBS = [
  { id: '1', title: 'Senior Frontend Engineer', dept: 'Engineering', applicants: 78, status: 'PUBLISHED', posted: '2 days ago' },
  { id: '2', title: 'Staff Backend Engineer (Golang/Java)', dept: 'Platform Core', applicants: 45, status: 'PUBLISHED', posted: '4 days ago' },
  { id: '3', title: 'Cloud Security Architect', dept: 'Infra Security', applicants: 12, status: 'PENDING', posted: '1 day ago' },
  { id: '4', title: 'Associate Product Marketing Lead', dept: 'Marketing', applicants: 0, status: 'DRAFT', posted: 'Today' },
];

export default function RecruiterDashboard() {
  return (
    <div className="recruiter-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 1. Welcome Banner ── */}
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
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <span className="badge badge-success" style={{ fontSize: '11px' }}>Verified Employer</span>
            <span style={{ fontSize: 'var(--text-xs)', opacity: 0.85, color: '#c7d2fe' }}>TechCorp India</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: '#ffffff', marginBottom: 'var(--space-2)' }}>
            Recruiter Workspace
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1' }}>
            You have <strong>38 shortlisted candidates</strong> awaiting interview scheduling and <strong>2 jobs</strong> pending admin approval.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link to="/recruiter/jobs/create">
            <Button variant="primary" size="lg" leftIcon={<Plus size={18} />} style={{ background: '#ffffff', color: '#1e1b4b', fontWeight: 700 }}>
              Post New Job
            </Button>
          </Link>
          <Link to="/recruiter/interviews">
            <Button variant="secondary" size="lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Interview Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Stat Cards (All 6 Required Metrics) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── 3. Hiring Funnel / Activity Summary ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Recruitment Funnel Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            { stage: '1. Applications', count: '214', color: '#6366f1', pct: '100%' },
            { stage: '2. Screened', count: '142', color: '#8b5cf6', pct: '66.3%' },
            { stage: '3. Shortlisted', count: '38', color: '#06b6d4', pct: '17.7%' },
            { stage: '4. Interviews', count: '12', color: '#f59e0b', pct: '5.6%' },
            { stage: '5. Offers / Hired', count: '6', color: '#10b981', pct: '2.8%' },
          ].map((step) => (
            <div key={step.stage} style={{
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{step.stage}</span>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: step.color }}>{step.count}</p>
              <div style={{ height: 4, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 4 }}>
                <div style={{ width: step.pct, height: '100%', background: step.color }} />
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>{step.pct} conversion rate</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Main Two Column: Recent Applications + Recent Jobs ── */}
      <div className="responsive-dashboard-grid">

        {/* Recent Applications Card */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">Recent Candidate Applications</h2>
            <Link to="/recruiter/jobs/1/applicants">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>View All Applicants</Button>
            </Link>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {RECENT_APPLICATIONS.map((cand, i) => (
              <div key={cand.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: i < RECENT_APPLICATIONS.length - 1 ? '1px solid var(--color-gray-100)' : 'none',
                gap: 'var(--space-3)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{cand.name}</p>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>{cand.score} Match</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{cand.role}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Experience: {cand.exp} • {cand.appliedOn}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <StatusBadge status={cand.status} />
                  <Link to="/recruiter/jobs/1/applicants">
                    <Button size="xs" variant="outline">Review</Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Recent Jobs Management Card */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">My Posted Positions</h2>
            <Link to="/recruiter/jobs">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>Manage All</Button>
            </Link>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {RECENT_JOBS.map((job, i) => (
              <div key={job.id} style={{
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: i < RECENT_JOBS.length - 1 ? '1px solid var(--color-gray-100)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--space-3)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <Link to={`/recruiter/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{job.title}</p>
                  </Link>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {job.dept} • {job.posted}
                  </p>
                  <Link to={`/recruiter/jobs/${job.id}/applicants`} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600, textDecoration: 'none' }}>
                    {job.applicants} Applicants Received →
                  </Link>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={job.status} size="sm" />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

      </div>

    </div>
  );
}
