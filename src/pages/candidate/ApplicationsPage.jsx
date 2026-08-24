import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Clock, Building2, MapPin, DollarSign,
  Calendar, CheckCircle2, XCircle, ArrowRight, Eye, RefreshCw,
  AlertCircle, Sparkles, UserCheck, MessageSquare, ChevronRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState, ErrorState } from '../../components/ui/States';
import Table from '../../components/ui/Table';
import { useToast } from '../../context/ToastContext';

const STATUS_STAGES = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

const MOCK_APPLICATIONS = [
  {
    id: 'APP-1001',
    jobId: '1',
    role: 'Senior Frontend Engineer',
    company: 'TechCorp India',
    companyLogo: null,
    location: 'Bengaluru, Karnataka',
    salary: '₹14 - ₹22 LPA',
    type: 'Full-time',
    appliedOn: '2026-08-22',
    status: 'SHORTLISTED',
    lastUpdate: '1 day ago',
    currentStageNumber: 3,
    interviewSchedule: '2026-08-28 at 02:30 PM (Google Meet)',
    timeline: [
      { status: 'APPLIED', title: 'Application Submitted', date: '22 Aug 2026, 10:30 AM', note: 'Resume and profile forwarded to hiring recruiter.', done: true },
      { status: 'UNDER_REVIEW', title: 'Resume Screened by Recruiter', date: '23 Aug 2026, 04:15 PM', note: 'Technical recruiter reviewed qualifications and portfolio.', done: true },
      { status: 'SHORTLISTED', title: 'Shortlisted for Round 1', date: '24 Aug 2026, 11:00 AM', note: 'Selected for technical live-coding evaluation.', done: true },
      { status: 'INTERVIEW', title: 'Technical Interview', date: 'Pending (Scheduled for 28 Aug)', note: '45-minute live coding round on React & algorithms.', done: false },
      { status: 'SELECTED', title: 'Final Decision & Offer', date: 'Upcoming', note: 'Formal offer rollout upon clearing rounds.', done: false },
    ],
  },
  {
    id: 'APP-1002',
    jobId: '2',
    role: 'Lead Product Manager - Checkout',
    company: 'Flipkart',
    companyLogo: null,
    location: 'Bengaluru, Karnataka',
    salary: '₹28 - ₹42 LPA',
    type: 'Full-time',
    appliedOn: '2026-08-20',
    status: 'UNDER_REVIEW',
    lastUpdate: '3 days ago',
    currentStageNumber: 2,
    interviewSchedule: null,
    timeline: [
      { status: 'APPLIED', title: 'Application Submitted', date: '20 Aug 2026, 02:00 PM', note: 'Direct submission via JobConnect.', done: true },
      { status: 'UNDER_REVIEW', title: 'Under Review by Product Guild', date: '21 Aug 2026, 09:30 AM', note: 'Reviewing product execution portfolio.', done: true },
      { status: 'SHORTLISTED', title: 'Shortlisting Decision', date: 'Pending', note: 'Awaiting recruiter feedback.', done: false },
      { status: 'INTERVIEW', title: 'Interview Round', date: 'Pending', note: '', done: false },
      { status: 'SELECTED', title: 'Final Offer', date: 'Pending', note: '', done: false },
    ],
  },
  {
    id: 'APP-1003',
    jobId: '5',
    role: 'Senior Data Scientist (NLP / GenAI)',
    company: 'Infosys',
    companyLogo: null,
    location: 'Hyderabad, Telangana',
    salary: '₹18 - ₹28 LPA',
    type: 'Full-time',
    appliedOn: '2026-08-18',
    status: 'INTERVIEW',
    lastUpdate: '2 days ago',
    currentStageNumber: 4,
    interviewSchedule: '2026-08-26 at 11:00 AM IST (MS Teams)',
    timeline: [
      { status: 'APPLIED', title: 'Application Submitted', date: '18 Aug 2026, 11:00 AM', note: 'Applied for Topaz AI COE.', done: true },
      { status: 'UNDER_REVIEW', title: 'Screening Passed', date: '19 Aug 2026, 03:20 PM', note: 'Python & ML credentials validated.', done: true },
      { status: 'SHORTLISTED', title: 'Shortlisted by Hiring Manager', date: '21 Aug 2026, 05:00 PM', note: 'Advanced to interview panel.', done: true },
      { status: 'INTERVIEW', title: 'Technical Panel Interview', date: '26 Aug 2026, 11:00 AM', note: 'Meeting link sent via email.', done: true },
      { status: 'SELECTED', title: 'Final Offer Letter', date: 'Pending', note: '', done: false },
    ],
  },
  {
    id: 'APP-1004',
    jobId: '4',
    role: 'Full Stack Developer (Node.js + React)',
    company: 'Zomato',
    companyLogo: null,
    location: 'Gurugram, Haryana',
    salary: '₹12 - ₹20 LPA',
    type: 'Full-time',
    appliedOn: '2026-08-15',
    status: 'REJECTED',
    lastUpdate: '5 days ago',
    currentStageNumber: 2,
    interviewSchedule: null,
    timeline: [
      { status: 'APPLIED', title: 'Application Submitted', date: '15 Aug 2026', note: 'Applied directly.', done: true },
      { status: 'UNDER_REVIEW', title: 'Application Screened', date: '17 Aug 2026', note: 'Position filled by another applicant with prior restaurant-tech experience.', done: true },
      { status: 'REJECTED', title: 'Application Not Shortlisted', date: '19 Aug 2026', note: 'Profile kept in talent pool for future openings.', done: true },
    ],
  },
];

export default function CandidateApplicationsPage() {
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const filterTabs = [
    { key: 'ALL', label: 'All Applications' },
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Selected' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filteredApps = useMemo(() => {
    return MOCK_APPLICATIONS.filter((app) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchRole = app.role.toLowerCase().includes(q);
        const matchComp = app.company.toLowerCase().includes(q);
        if (!matchRole && !matchComp) return false;
      }
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  const handleOpenDetails = (app) => {
    setSelectedApp(app);
    setDetailsModalOpen(true);
  };

  const columns = [
    {
      key: 'role',
      label: 'Job Role & Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{row.role}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company} • {row.location}</p>
        </div>
      )
    },
    {
      key: 'appliedOn',
      label: 'Applied Date',
      sortable: true,
      render: (v) => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    {
      key: 'salary',
      label: 'Offered CTC'
    },
    {
      key: 'status',
      label: 'Current Status',
      render: (v) => <StatusBadge status={v} />
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button size="xs" variant="outline" leftIcon={<Eye size={13} />} onClick={() => handleOpenDetails(row)}>
          Track Status
        </Button>
      )
    }
  ];

  return (
    <div className="candidate-applications-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Overview Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>My Job Applications</h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
              Track recruitment milestones and interview schedules with live timeline updates
            </p>
          </div>
          <Link to="/jobs"><Button variant="primary" size="sm">Browse More Jobs</Button></Link>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? MOCK_APPLICATIONS.length : MOCK_APPLICATIONS.filter(a => a.status === tab.key).length;
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
                  gap: 6,
                  transition: 'all var(--transition-fast)'
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

      {/* Search and Table results */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredApps.length}</strong> applications
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {hasError ? (
            <div style={{ padding: 'var(--space-8)' }}>
              <ErrorState title="Failed to load applications" description="Please try refreshing the page." action={<Button onClick={() => setHasError(false)}>Retry</Button>} />
            </div>
          ) : filteredApps.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState
                icon="jobs"
                title="No applications in this category"
                description={statusFilter !== 'ALL' ? `You currently have zero applications with status "${statusFilter}".` : 'You have not applied to any jobs yet.'}
                action={<Link to="/jobs"><Button variant="primary">Explore Open Jobs</Button></Link>}
              />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredApps}
              rowKey="id"
            />
          )}
        </div>
      </div>

      {/* ── Application Details & Status Timeline Modal ── */}
      {selectedApp && (
        <Modal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Application Details: ${selectedApp.role}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header info */}
            <div style={{
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-4)'
            }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedApp.role}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedApp.company} • {selectedApp.location}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Application ID: <strong>{selectedApp.id}</strong> • Applied: {selectedApp.appliedOn}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={selectedApp.status} size="lg" />
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text)', marginTop: 4 }}>
                  CTC: {selectedApp.salary}
                </p>
              </div>
            </div>

            {/* Scheduled Interview Notice */}
            {selectedApp.interviewSchedule && (
              <div style={{
                background: 'var(--color-warning-50)',
                border: '1px solid var(--color-warning-200)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4) var(--space-5)',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'center'
              }}>
                <Clock size={22} style={{ color: 'var(--color-warning-600)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-warning-900)' }}>
                    Interview Scheduled
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning-800)', marginTop: 2 }}>
                    {selectedApp.interviewSchedule}
                  </p>
                </div>
              </div>
            )}

            {/* ── Status Lifecycle Timeline: APPLIED → UNDER_REVIEW → SHORTLISTED → INTERVIEW → SELECTED/REJECTED ── */}
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-4)', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                Application Lifecycle & Stage Timeline
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 'var(--space-4)' }}>
                {selectedApp.timeline.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative', paddingBottom: idx < selectedApp.timeline.length - 1 ? 'var(--space-6)' : 0 }}>
                    {/* Vertical connecting line */}
                    {idx < selectedApp.timeline.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: 11,
                        top: 24,
                        bottom: 0,
                        width: 2,
                        background: step.done ? 'var(--color-primary-600)' : 'var(--color-gray-200)'
                      }} />
                    )}

                    {/* Step circle indicator */}
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: step.done ? 'var(--color-primary-600)' : 'var(--color-gray-200)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      zIndex: 1,
                      flexShrink: 0
                    }}>
                      {step.done ? '✓' : idx + 1}
                    </div>

                    <div style={{ flex: 1, marginTop: -2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: step.done ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                          {step.title}
                        </p>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {step.date}
                        </span>
                      </div>
                      {step.note && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2, lineHeight: 1.4 }}>
                          {step.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Link to={`/jobs/${selectedApp.jobId}`} target="_blank">
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />}>
                  View Original Job Posting
                </Button>
              </Link>
              <Button size="sm" variant="secondary" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
