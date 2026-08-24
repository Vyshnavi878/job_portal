import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase, Plus, Search, Filter, Users, Eye, Edit2,
  XCircle, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  MoreVertical, Calendar, DollarSign, MapPin
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

const INITIAL_RECRUITER_JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    type: 'Full-time',
    workMode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    salary: '₹14 - ₹22 LPA',
    applicantsCount: 78,
    status: 'PUBLISHED',
    createdAt: '2026-08-15',
    deadline: '2026-09-30',
  },
  {
    id: '2',
    title: 'Staff Backend Engineer (Golang & Microservices)',
    department: 'Platform Core',
    type: 'Full-time',
    workMode: 'Remote',
    location: 'Remote',
    salary: '₹28 - ₹40 LPA',
    applicantsCount: 45,
    status: 'PUBLISHED',
    createdAt: '2026-08-18',
    deadline: '2026-09-25',
  },
  {
    id: '3',
    title: 'Cloud Security Architect (AWS / Azure)',
    department: 'Infra & SecOps',
    type: 'Full-time',
    workMode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    salary: '₹32 - ₹48 LPA',
    applicantsCount: 12,
    status: 'PENDING',
    createdAt: '2026-08-23',
    deadline: '2026-10-15',
  },
  {
    id: '4',
    title: 'Associate Product Marketing Lead',
    department: 'Marketing',
    type: 'Full-time',
    workMode: 'On-site',
    location: 'Gurugram, Haryana',
    salary: '₹10 - ₹16 LPA',
    applicantsCount: 0,
    status: 'DRAFT',
    createdAt: '2026-08-24',
    deadline: '2026-10-01',
  },
  {
    id: '5',
    title: 'Data Platform Engineer (Kafka / Spark)',
    department: 'Data Analytics',
    type: 'Full-time',
    workMode: 'Hybrid',
    location: 'Hyderabad, Telangana',
    salary: '₹18 - ₹26 LPA',
    applicantsCount: 52,
    status: 'CLOSED',
    createdAt: '2026-07-10',
    deadline: '2026-08-15',
  },
  {
    id: '6',
    title: 'Junior QA Automation Tester',
    department: 'Quality Assurance',
    type: 'Contract',
    workMode: 'On-site',
    location: 'Pune, Maharashtra',
    salary: '₹6 - ₹9 LPA',
    applicantsCount: 19,
    status: 'EXPIRED',
    createdAt: '2026-06-01',
    deadline: '2026-07-15',
  },
  {
    id: '7',
    title: 'Cryptocurrency Arbitrage Analyst',
    department: 'Trading Tech',
    type: 'Full-time',
    workMode: 'Remote',
    location: 'Remote',
    salary: '₹15 - ₹25 LPA',
    applicantsCount: 0,
    status: 'REJECTED',
    createdAt: '2026-08-10',
    deadline: '2026-09-10',
  },
];

export default function RecruiterJobsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = useState(INITIAL_RECRUITER_JOBS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [closeTargetJob, setCloseTargetJob] = useState(null);

  const filterTabs = [
    { key: 'ALL', label: 'All Postings' },
    { key: 'PUBLISHED', label: 'Published' },
    { key: 'PENDING', label: 'Pending Review' },
    { key: 'DRAFT', label: 'Drafts' },
    { key: 'CLOSED', label: 'Closed' },
    { key: 'EXPIRED', label: 'Expired' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!job.title.toLowerCase().includes(q) && !job.department.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && job.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [jobs, search, statusFilter]);

  const handleCloseJob = () => {
    if (!closeTargetJob) return;
    setJobs(jobs.map(j => j.id === closeTargetJob.id ? { ...j, status: 'CLOSED' } : j));
    toast({
      type: 'info',
      title: 'Job Closed',
      message: `Position "${closeTargetJob.title}" has been closed to new applications.`,
    });
    setCloseTargetJob(null);
  };

  const columns = [
    {
      key: 'title',
      label: 'Job Title & Department',
      sortable: true,
      render: (_, row) => (
        <div>
          <Link to={`/recruiter/jobs/${row.id}`} style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', textDecoration: 'none' }}>
            {row.title}
          </Link>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {row.department} • {row.workMode} ({row.location})
          </p>
        </div>
      )
    },
    {
      key: 'applicantsCount',
      label: 'Applicants',
      sortable: true,
      render: (count, row) => (
        <Link to={`/recruiter/jobs/${row.id}/applicants`} style={{ textDecoration: 'none' }}>
          <span className="badge badge-primary" style={{ cursor: 'pointer' }}>
            <Users size={12} style={{ marginRight: 4 }} /> {count} Candidates
          </span>
        </Link>
      )
    },
    {
      key: 'createdAt',
      label: 'Posted / Created',
      sortable: true,
      render: (v) => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Link to={`/recruiter/jobs/${row.id}`}>
            <Button size="xs" variant="ghost" title="View Job Details">
              <Eye size={13} />
            </Button>
          </Link>

          <Link to={`/recruiter/jobs/${row.id}/applicants`}>
            <Button size="xs" variant="outline">
              Applicants
            </Button>
          </Link>

          {row.status === 'PENDING' && (
            <Link to="/admin/jobs/requests">
              <Button size="xs" variant="ghost" title="Awaiting Admin Review (Inspect in Admin Portal)">
                <Clock size={13} style={{ color: 'var(--color-warning-600)' }} />
              </Button>
            </Link>
          )}

          {row.status === 'PUBLISHED' && (
            <Button size="xs" variant="danger" onClick={() => setCloseTargetJob(row)} title="Close job opening">
              Close
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="recruiter-jobs-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Briefcase size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Manage Job Postings</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Track hiring progress, review candidate submissions, and manage vacancy lifecycles
            </p>
          </div>

          <Link to="/recruiter/jobs/create">
            <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs (DRAFT, PENDING, PUBLISHED, REJECTED, CLOSED, EXPIRED) */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? jobs.length : jobs.filter(j => j.status === tab.key).length;
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: active ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  background: active ? 'var(--color-primary-600)' : 'var(--color-surface)',
                  color: active ? '#fff' : 'var(--color-text-muted)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {tab.label}
                <span style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-gray-100)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Jobs Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by job title or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredJobs.length}</strong> postings
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filteredJobs.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState
                icon="jobs"
                title="No jobs found"
                description={statusFilter !== 'ALL' ? `You have no job postings with status "${statusFilter}".` : 'No job openings found matching your search query.'}
                action={<Link to="/recruiter/jobs/create"><Button variant="primary">Create Job Posting</Button></Link>}
              />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredJobs}
              rowKey="id"
            />
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Closing Job */}
      <ConfirmDialog
        open={!!closeTargetJob}
        onClose={() => setCloseTargetJob(null)}
        onConfirm={handleCloseJob}
        title="Close Job Posting?"
        message={`Are you sure you want to close "${closeTargetJob?.title}"? Candidates will no longer be able to submit new applications.`}
        confirmText="Yes, Close Job"
        danger
      />

    </div>
  );
}
