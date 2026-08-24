import { useParams, Link } from 'react-router-dom';
import {
  Briefcase, Building2, MapPin, DollarSign, Calendar, Clock,
  Users, ArrowLeft, Edit2, Eye, CheckCircle2, AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { MOCK_JOBS } from '../../data/mockData';

export default function RecruiterJobDetailPage() {
  const { id } = useParams();
  const job = MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];

  return (
    <div className="recruiter-job-detail-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <Link to="/recruiter/jobs" style={{ textDecoration: 'none', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}>
                <ArrowLeft size={14} /> Back to My Jobs
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{job.title}</h1>
              <StatusBadge status={job.status || 'PUBLISHED'} size="lg" />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
              Job ID: <strong>{job.id}</strong> • Posted on {job.postedDate} • Deadline: {job.deadline}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to={`/recruiter/jobs/${job.id}/applicants`}>
              <Button variant="primary" size="sm" leftIcon={<Users size={15} />}>
                View 78 Applicants
              </Button>
            </Link>
            <Link to={`/jobs/${job.id}`} target="_blank">
              <Button variant="secondary" size="sm" leftIcon={<Eye size={15} />}>
                Public View
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Work Mode & Location</span>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: 2 }}>{job.location} ({job.workMode})</p>
        </div>
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Offered Salary CTC</span>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-success-700)', marginTop: 2 }}>{job.salary}</p>
        </div>
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Required Experience</span>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: 2 }}>{job.experience}</p>
        </div>
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Open Positions</span>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: 2 }}>{job.openings} Openings</p>
        </div>
      </div>

      {/* Description & Responsibilities */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header">
          <h2 className="card-title">Job Specifications & Role Scope</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Summary
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>{job.description}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Core Responsibilities
            </h3>
            <ul style={{ paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {job.responsibilities?.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Required Qualifications & Skills
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
              {job.skills?.map((s) => (
                <span key={s} className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
