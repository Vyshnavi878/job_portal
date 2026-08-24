import { Briefcase, FileText, Bookmark, CalendarDays, TrendingUp, Clock, Bell, ArrowRight, UserCheck, Search, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { JobCard } from '../../components/ui/EntityCards';
import { MOCK_JOBS } from '../../data/mockData';

const STATS = [
  { label: 'Applied Jobs', value: '18', change: '+3 this week', positive: true, icon: <FileText size={20} />, iconBg: '#eef2ff', iconColor: '#4f46e5' },
  { label: 'Shortlisted',  value: '4',  change: '+1 new',      positive: true, icon: <TrendingUp size={20} />, iconBg: '#f0fdf4', iconColor: '#16a34a', variant: 'success' },
  { label: 'Interviews',   value: '2',  change: 'Upcoming',    positive: true, icon: <Clock size={20} />, iconBg: '#fffbeb', iconColor: '#d97706', variant: 'warning' },
  { label: 'Saved Jobs',   value: '8',  icon: <Bookmark size={20} />, iconBg: '#eff6ff', iconColor: '#2563eb' },
];

const RECENT_APPLICATIONS = [
  { id: '1', company: 'TechCorp India',  role: 'Senior Frontend Engineer', appliedOn: '22 Aug 2026', status: 'SHORTLISTED', salary: '₹14-22 LPA' },
  { id: '2', company: 'Flipkart',        role: 'Lead Product Manager',    appliedOn: '20 Aug 2026', status: 'UNDER_REVIEW', salary: '₹28-42 LPA' },
  { id: '3', company: 'Infosys',         role: 'Senior Data Scientist',     appliedOn: '18 Aug 2026', status: 'INTERVIEW',    salary: '₹18-28 LPA' },
  { id: '4', company: 'Zomato',          role: 'Full Stack Developer',   appliedOn: '15 Aug 2026', status: 'REJECTED',     salary: '₹12-20 LPA' },
];

export default function CandidateDashboard() {
  const recommendedJobs = MOCK_JOBS.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* ── 1. Welcome Section ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <p style={{ opacity: 0.85, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Good morning 👋</p>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)', color: '#ffffff' }}>Welcome back, Priya!</h1>
          <p style={{ opacity: 0.9, fontSize: 'var(--text-sm)', color: '#cbd5e1' }}>You have 2 interview rounds scheduled this week and 3 new application status updates.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link to="/candidate/applications">
            <Button variant="secondary" rightIcon={<ArrowRight size={16} />} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              My Applications
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="primary" style={{ background: '#ffffff', color: '#312e81', fontWeight: 700 }}>
              Search Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Stat Cards (Applied Jobs, Shortlisted, Interviews, Saved Jobs) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── 3. Quick Actions Bar ── */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Quick Actions:
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Link to="/jobs"><Button size="xs" variant="outline" leftIcon={<Search size={13} />}>Browse New Jobs</Button></Link>
            <Link to="/candidate/profile"><Button size="xs" variant="outline" leftIcon={<Upload size={13} />}>Update Resume</Button></Link>
            <Link to="/candidate/job-mela"><Button size="xs" variant="outline" leftIcon={<CalendarDays size={13} />}>Job Mela Passes</Button></Link>
            <Link to="/candidate/saved-jobs"><Button size="xs" variant="outline" leftIcon={<Bookmark size={13} />}>Saved Bookmarks</Button></Link>
          </div>
        </div>
      </div>

      {/* ── 4. Main Grid: Recent Applications + Profile Strength & Job Mela Summary ── */}
      <div className="responsive-dashboard-grid">

        {/* Recent Applications Card */}
        <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
          <CardHeader>
            <h2 className="card-title">Recent Applications</h2>
            <Link to="/candidate/applications"><Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>View All</Button></Link>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            {RECENT_APPLICATIONS.map((app, i) => (
              <div key={app.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: i < RECENT_APPLICATIONS.length - 1 ? '1px solid var(--color-gray-100)' : 'none',
                gap: 'var(--space-3)',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{app.role}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {app.company} • Applied on {app.appliedOn}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>{app.salary}</span>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Right column: Profile completion & Job Mela Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Profile completion */}
          <Card style={{ borderRadius: 'var(--radius-2xl)' }}>
            <CardBody>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-3)' }}>Profile Strength</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>80% Complete</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-success-600)' }}>Very Good</span>
              </div>
              <div style={{ height: 8, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-accent-500))', borderRadius: 'var(--radius-full)' }} />
              </div>

              <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[
                  { label: 'Basic contact information', done: true },
                  { label: 'Upload verified resume PDF', done: true },
                  { label: 'Add key technical skills (5+)', done: true },
                  { label: 'Add portfolio / project link', done: false },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: item.done ? 'var(--color-success-500)' : 'var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.done && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                    </div>
                    <span style={{ color: item.done ? 'var(--color-text-muted)' : 'var(--color-text)', textDecoration: item.done ? 'line-through' : 'none' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <Link to="/candidate/profile" style={{ marginTop: 'var(--space-4)', display: 'block' }}>
                <Button variant="outline" fullWidth size="sm">Manage Full Profile</Button>
              </Link>
            </CardBody>
          </Card>

          {/* Job Mela Registration Summary */}
          <Card style={{ background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-accent-50))', border: '1px solid var(--color-primary-200)', borderRadius: 'var(--radius-2xl)' }}>
            <CardBody>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-xl)', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <CalendarDays size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>Registered</span>
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 2 }}>Bengaluru Mega IT Job Mela</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Sep 18–19 • 09:00 AM • BIEC Hall 3</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', marginTop: 4, fontWeight: 600 }}>Fast-Track QR Pass Ready</p>
                </div>
              </div>
              <Link to="/candidate/job-mela" style={{ marginTop: 'var(--space-4)', display: 'block' }}>
                <Button variant="primary" fullWidth size="sm">View Mela Ticket & Pass</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ── 5. Recommended Jobs Section ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Recommended for Your Profile</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Based on your skills: React, TypeScript, Node.js</p>
          </div>
          <Link to="/jobs"><Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>Browse All Jobs</Button></Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      </div>
    </div>
  );
}
