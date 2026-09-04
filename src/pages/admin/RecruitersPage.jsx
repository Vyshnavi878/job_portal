import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, ShieldAlert, ShieldCheck,
  Building2, Briefcase, Mail, Phone, MapPin, CheckCircle2,
  XCircle, AlertTriangle, FileText, GraduationCap, UserCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

// Consolidated Sub-Pages
import AdminJobsPage from './JobsPage';
import AdminInternshipsPage from './InternshipsPage';
import AdminRecruiterRequestsPage from './RecruiterRequestsPage';
import AdminJobRequestsPage from './JobRequestsPage';
import AdminInternshipRequestsPage from './InternshipRequestsPage';

export default function AdminRecruitersPage() {
  const { addToast } = useToast();
  const { recruiters, verifyRecruiter, suspendRecruiter, activateRecruiter, pendingCounts } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tabAliasMap = {
    'recruiters': 'recruiters',
    'jobs': 'jobs',
    'internships': 'internships',
    'verification': 'verification',
    'recruiter-verification': 'verification',
    'recruiter-requests': 'verification',
    'requests': 'verification',
    'job-approvals': 'job-approvals',
    'job_approvals': 'job-approvals',
    'job-requests': 'job-approvals',
    'jobs-requests': 'job-approvals',
    'internship-approvals': 'internship-approvals',
    'internship_approvals': 'internship-approvals',
    'internship-requests': 'internship-approvals',
    'internships-requests': 'internship-approvals',
  };
  const currentTab = tabAliasMap[tabParam] || 'recruiters';

  const [activeSection, setActiveSection] = useState(currentTab);

  useEffect(() => {
    if (tabParam && tabAliasMap[tabParam]) {
      setActiveSection(tabAliasMap[tabParam]);
    } else if (!tabParam) {
      setActiveSection('recruiters');
    }
  }, [tabParam]);

  const handleTabChange = (tabKey) => {
    setActiveSection(tabKey);
    if (tabKey === 'recruiters') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabKey });
    }
  };

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // View modal
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Suspend Dialog
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filtered = useMemo(() => {
    return recruiters.filter((r) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = r.name?.toLowerCase().includes(q);
        const matchesEmail = r.email?.toLowerCase().includes(q);
        const matchesCompany = r.company?.toLowerCase().includes(q);
        const matchesDesignation = r.designation?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCompany && !matchesDesignation) return false;
      }
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'VERIFIED' && r.verificationStatus !== 'VERIFIED') return false;
        if (statusFilter === 'PENDING' && r.verificationStatus !== 'PENDING') return false;
        if (statusFilter === 'SUSPENDED' && r.accountStatus !== 'SUSPENDED') return false;
      }
      return true;
    });
  }, [recruiters, search, statusFilter]);

  const handleVerify = (r) => {
    verifyRecruiter(r.id);
    addToast(`${r.name} (${r.company}) has been marked as VERIFIED.`, 'success');
  };

  const handleActivate = (r) => {
    activateRecruiter(r.id);
    addToast(`${r.name} account is now ACTIVE.`, 'success');
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    suspendRecruiter(suspendTarget.id);
    addToast(`Recruiter account for ${suspendTarget.name} has been SUSPENDED.`, 'error');
    setSuspendTarget(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Recruiter',
      sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 'var(--text-sm)'
          }}>
            {row.name?.[0] || 'R'}
          </div>
          <div>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.designation || 'Talent Acquisition'}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{row.company}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>{row.industry || 'IT & Services'}</span>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>📍 {row.location || 'India'}</span>
        </div>
      )
    },
    {
      key: 'registrationDate',
      label: 'Registration Date',
      sortable: true,
      render: (v) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026'}
        </span>
      )
    },
    {
      key: 'verificationStatus',
      label: 'Verification Status',
      render: (v) => {
        const isVerified = v === 'VERIFIED';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isVerified ? '#ecfdf5' : '#fffbeb',
            color: isVerified ? '#047857' : '#b45309',
            border: isVerified ? '1px solid #a7f3d0' : '1px solid #fde68a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isVerified ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {v || 'PENDING'}
          </span>
        );
      }
    },
    {
      key: 'accountStatus',
      label: 'Account Status',
      render: (v) => {
        const isActive = v === 'ACTIVE';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isActive ? '#f0fdf4' : '#fef2f2',
            color: isActive ? '#15803d' : '#b91c1c',
            border: isActive ? '1px solid #bbf7d0' : '1px solid #fecaca',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isActive ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            {v || 'ACTIVE'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button
            size="xs"
            variant="outline"
            leftIcon={<Eye size={13} />}
            onClick={() => {
              setSelectedRecruiter(row);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>

          {row.verificationStatus === 'PENDING' && (
            <Button
              size="xs"
              variant="primary"
              leftIcon={<CheckCircle2 size={12} />}
              onClick={() => handleVerify(row)}
            >
              Verify
            </Button>
          )}

          {row.accountStatus === 'ACTIVE' ? (
            <Button
              size="xs"
              variant="danger"
              onClick={() => setSuspendTarget(row)}
            >
              Suspend
            </Button>
          ) : (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => handleActivate(row)}
            >
              Activate
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-recruiters-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 0. Consolidated Navigation Tabs (Recruiters | Jobs | Internships | Verification | Job Approvals | Internship Approvals) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'var(--color-surface)',
        padding: '6px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        width: 'fit-content',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => handleTabChange('recruiters')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'recruiters' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'recruiters' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'recruiters' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <UserCheck size={16} /> Recruiters
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('jobs')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'jobs' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'jobs' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'jobs' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <Briefcase size={16} /> Jobs
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('internships')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'internships' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'internships' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'internships' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <GraduationCap size={16} /> Internships
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('verification')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'verification' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'verification' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'verification' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <ShieldCheck size={16} /> Verification
          {pendingCounts?.recruiterVerifications > 0 && (
            <span style={{
              background: activeSection === 'verification' ? 'rgba(255,255,255,0.25)' : 'var(--color-warning-500)',
              color: '#fff',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              lineHeight: 1
            }}>
              {pendingCounts.recruiterVerifications}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('job-approvals')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'job-approvals' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'job-approvals' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'job-approvals' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <CheckCircle2 size={16} /> Job Approvals
          {pendingCounts?.jobApprovals > 0 && (
            <span style={{
              background: activeSection === 'job-approvals' ? 'rgba(255,255,255,0.25)' : 'var(--color-primary-600)',
              color: '#fff',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              lineHeight: 1
            }}>
              {pendingCounts.jobApprovals}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('internship-approvals')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'internship-approvals' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'internship-approvals' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'internship-approvals' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <GraduationCap size={16} /> Internship Approvals
          {pendingCounts?.internshipApprovals > 0 && (
            <span style={{
              background: activeSection === 'internship-approvals' ? 'rgba(255,255,255,0.25)' : 'var(--color-primary-600)',
              color: '#fff',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              lineHeight: 1
            }}>
              {pendingCounts.internshipApprovals}
            </span>
          )}
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeSection === 'jobs' ? (
        <AdminJobsPage />
      ) : activeSection === 'internships' ? (
        <AdminInternshipsPage />
      ) : activeSection === 'verification' ? (
        <AdminRecruiterRequestsPage />
      ) : activeSection === 'job-approvals' ? (
        <AdminJobRequestsPage />
      ) : activeSection === 'internship-approvals' ? (
        <AdminInternshipRequestsPage />
      ) : (
        <>
          {/* Header Bar */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <Building2 size={20} style={{ color: 'var(--color-primary-600)' }} />
                  <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Registered Recruiters Management</h1>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Audit employer profiles, verify organizational authorizations, and govern platform recruiters.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <span style={{
                  background: '#f5f3ff',
                  color: '#6d28d9',
                  border: '1px solid #ddd6fe',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700
                }}>
                  {recruiters.filter(r => r.verificationStatus === 'VERIFIED').length} Verified Recruiters
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 440 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search recruiter, company, email, designation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
                {['ALL', 'VERIFIED', 'PENDING', 'SUSPENDED'].map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setStatusFilter(filterKey)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: statusFilter === filterKey ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                      background: statusFilter === filterKey ? 'var(--color-primary-600)' : 'var(--color-surface)',
                      color: statusFilter === filterKey ? '#fff' : 'var(--color-text-muted)',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {filterKey === 'ALL' ? 'All Recruiters' : filterKey}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Users size={40} />}
                title="No Recruiters Found"
                description="No recruiter records match your current search and filter criteria."
              />
            ) : (
              <Table columns={columns} data={filtered} />
            )}
          </div>

          {/* ── 1. Recruiter Full Details Modal ── */}
          {viewModalOpen && selectedRecruiter && (
            <Modal
              isOpen={viewModalOpen}
              onClose={() => setViewModalOpen(false)}
              title={`Recruiter Dossier: ${selectedRecruiter.name}`}
              size="lg"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Header Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                  color: '#fff',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-xl)'
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-xl)',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 800
                  }}>
                    {selectedRecruiter.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>{selectedRecruiter.name}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: '#c7d2fe', margin: '2px 0 0 0' }}>{selectedRecruiter.designation} • {selectedRecruiter.company}</p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#e0e7ff' }}>
                      <span>📍 {selectedRecruiter.location || 'India'}</span>
                      <span>🏢 {selectedRecruiter.industry || 'Information Technology'}</span>
                      <span>📅 Joined: {selectedRecruiter.registrationDate || 'Aug 2026'}</span>
                    </div>
                  </div>
                </div>

                {/* Recruiter Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Employer Details
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Company:</strong> {selectedRecruiter.company}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Email:</strong> {selectedRecruiter.email}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Phone:</strong> {selectedRecruiter.phone || '+91 80 4920 1000'}</p>
                  </div>

                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Verification & Postings
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Verification:</strong> {selectedRecruiter.verificationStatus}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Account:</strong> {selectedRecruiter.accountStatus}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Active Jobs:</strong> {selectedRecruiter.activeJobsCount || 6} Openings</p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                  <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                    Close
                  </Button>
                  {selectedRecruiter.verificationStatus === 'PENDING' && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleVerify(selectedRecruiter);
                        setSelectedRecruiter({ ...selectedRecruiter, verificationStatus: 'VERIFIED' });
                      }}
                    >
                      Verify Recruiter
                    </Button>
                  )}
                  {selectedRecruiter.accountStatus === 'ACTIVE' ? (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setViewModalOpen(false);
                        setSuspendTarget(selectedRecruiter);
                      }}
                    >
                      Suspend Account
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handleActivate(selectedRecruiter);
                        setSelectedRecruiter({ ...selectedRecruiter, accountStatus: 'ACTIVE' });
                      }}
                    >
                      Activate Account
                    </Button>
                  )}
                </div>
              </div>
            </Modal>
          )}

          {/* ── 2. Confirm Suspend Dialog ── */}
          {suspendTarget && (
            <ConfirmDialog
              isOpen={Boolean(suspendTarget)}
              title="Suspend Recruiter Account?"
              message={`Are you sure you want to suspend recruiter ${suspendTarget.name} (${suspendTarget.company})? Their posted vacancies will be paused from public candidate searches.`}
              confirmLabel="Confirm Suspension"
              confirmVariant="danger"
              onConfirm={handleConfirmSuspend}
              onCancel={() => setSuspendTarget(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
