import { useState, useMemo } from 'react';
import {
  FileText, Search, Filter, Eye, Building2, User,
  Calendar, CheckCircle2, Clock, XCircle, ArrowRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';

const MASTER_APPLICATIONS = [
  {
    id: 'APP-9001',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    jobTitle: 'Senior Frontend Engineer',
    company: 'TechCorp India',
    recruiter: 'Rahul Mehta',
    appliedDate: '2026-08-22',
    status: 'SHORTLISTED',
    salary: '₹14 - ₹22 LPA',
    experience: '4.2 Years',
  },
  {
    id: 'APP-9002',
    candidateName: 'Amitav Ghosh',
    candidateEmail: 'amitav.ghosh@example.com',
    jobTitle: 'Staff Backend Engineer',
    company: 'Flipkart',
    recruiter: 'Kavita Menon',
    appliedDate: '2026-08-20',
    status: 'UNDER_REVIEW',
    salary: '₹28 - ₹42 LPA',
    experience: '8.5 Years',
  },
  {
    id: 'APP-9003',
    candidateName: 'Sneha Kulkarni',
    candidateEmail: 'sneha.kulkarni@example.com',
    jobTitle: 'Senior Data Scientist',
    company: 'Infosys Ltd',
    recruiter: 'Sameer Sen',
    appliedDate: '2026-08-18',
    status: 'INTERVIEW',
    salary: '₹18 - ₹28 LPA',
    experience: '5.0 Years',
  },
  {
    id: 'APP-9004',
    candidateName: 'Vikram Patel',
    candidateEmail: 'vikram.patel@example.com',
    jobTitle: 'Full Stack Developer',
    company: 'Zomato',
    recruiter: 'Ankit Aggarwal',
    appliedDate: '2026-08-15',
    status: 'REJECTED',
    salary: '₹12 - ₹20 LPA',
    experience: '5.1 Years',
  },
  {
    id: 'APP-9005',
    candidateName: 'Rohan Verma',
    candidateEmail: 'rohan.verma@example.com',
    jobTitle: 'QA Automation Tester',
    company: 'Wipro',
    recruiter: 'Pooja Nair',
    appliedDate: '2026-08-12',
    status: 'SELECTED',
    salary: '₹6 - ₹9 LPA',
    experience: '1.2 Years',
  },
];

export default function AdminApplicationsPage() {
  const [applications] = useState(MASTER_APPLICATIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filterTabs = [
    { key: 'ALL', label: 'All Applications' },
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Selected / Hired' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!app.candidateName.toLowerCase().includes(q) && !app.jobTitle.toLowerCase().includes(q) && !app.company.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
      return true;
    });
  }, [applications, search, statusFilter]);

  const columns = [
    {
      key: 'candidateName',
      label: 'Candidate',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)' }}>{row.candidateName}</strong>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.candidateEmail}</p>
        </div>
      )
    },
    {
      key: 'jobTitle',
      label: 'Job & Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{row.jobTitle}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Recruiter: {row.recruiter}</p>
        </div>
      )
    },
    {
      key: 'appliedDate',
      label: 'Applied On',
      sortable: true,
      render: (v) => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    {
      key: 'status',
      label: 'Application Status',
      render: (v) => <StatusBadge status={v} />
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => { setSelectedApp(row); setModalOpen(true); }}>
          Inspect
        </Button>
      )
    }
  ];

  return (
    <div className="admin-applications-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <FileText size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Master Candidate Applications Log</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Audit candidate submission records, interview progression, and hiring lifecycle transitions
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? applications.length : applications.filter(a => a.status === tab.key).length;
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

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search candidate, job, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> applications
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="jobs" title="No applications found" description="No candidate applications match your search filter." />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filtered}
              rowKey="id"
            />
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Application Dossier: ${selectedApp.id}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{selectedApp.candidateName}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>Role: {selectedApp.jobTitle}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Company: {selectedApp.company} • Recruiter: {selectedApp.recruiter}</p>
              </div>
              <StatusBadge status={selectedApp.status} size="lg" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Candidate Experience</span><strong>{selectedApp.experience}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Offered Package</span><strong>{selectedApp.salary}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Submission Date</span><strong>{selectedApp.appliedDate}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Candidate Email</span><strong>{selectedApp.candidateEmail}</strong></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button size="sm" variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
