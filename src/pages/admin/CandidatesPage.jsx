import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, ShieldAlert, ShieldCheck,
  Mail, Phone, MapPin, GraduationCap, Briefcase, FileText,
  CheckCircle2, XCircle, AlertTriangle, Sparkles, Calendar, Ticket,
  Download
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

// Consolidated Pages
import AdminApplicationsPage from './ApplicationsPage';
import AdminRegistrationsPage from './RegistrationsPage';

export default function AdminCandidatesPage() {
  const { addToast } = useToast();
  const { candidates, suspendCandidate, activateCandidate } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const validTabs = ['candidates', 'applications', 'registrations'];
  const currentTab = validTabs.includes(tabParam) ? tabParam : 'candidates';

  const [activeSection, setActiveSection] = useState(currentTab);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveSection(tabParam);
    } else if (!tabParam) {
      setActiveSection('candidates');
    }
  }, [tabParam]);

  const handleTabChange = (tabKey) => {
    setActiveSection(tabKey);
    if (tabKey === 'candidates') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabKey });
    }
  };

  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Candidate Profile Modal
  const [selectedCand, setSelectedCand] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Suspend Dialog
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesEmail = c.email?.toLowerCase().includes(q);
        const matchesHeadline = c.headline?.toLowerCase().includes(q);
        const matchesSkills = c.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesHeadline && !matchesSkills) return false;
      }
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'ACTIVE' && c.accountStatus !== 'ACTIVE') return false;
        if (statusFilter === 'SUSPENDED' && c.accountStatus !== 'SUSPENDED') return false;
      }
      return true;
    });
  }, [candidates, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleActivate = (c) => {
    activateCandidate(c.id);
    addToast(`${c.name}'s account is now ACTIVE.`, 'success');
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    suspendCandidate(suspendTarget.id);
    addToast(`Candidate account for ${suspendTarget.name} has been SUSPENDED.`, 'error');
    setSuspendTarget(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Candidate',
      sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary-600), #7c3aed)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 'var(--text-sm)'
          }}>
            {row.name?.[0] || 'C'}
          </div>
          <div>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.headline || 'Job Seeker'}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>{row.location}</span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email & Phone',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Mail size={12} style={{ color: 'var(--color-primary-600)' }} />
            <span>{row.email}</span>
          </div>
          {row.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: 'var(--color-text-muted)' }}>
              <Phone size={12} />
              <span>{row.phone}</span>
            </div>
          )}
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
      key: 'profileStatus',
      label: 'Profile Status',
      render: (v) => {
        const isComplete = v === 'COMPLETE' || v === 'VERIFIED';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isComplete ? '#ecfdf5' : '#fffbeb',
            color: isComplete ? '#047857' : '#b45309',
            border: isComplete ? '1px solid #a7f3d0' : '1px solid #fde68a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isComplete ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {v || 'COMPLETE'}
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
              setSelectedCand(row);
              setProfileModalOpen(true);
            }}
          >
            View Profile
          </Button>

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
    <div className="admin-candidates-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 0. Consolidated Navigation Tabs (Candidates | Applications | Job Mela Registrations) ── */}
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
          onClick={() => handleTabChange('candidates')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'candidates' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'candidates' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'candidates' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <Users size={16} /> Candidates
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('applications')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'applications' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'applications' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'applications' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <FileText size={16} /> Applications
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('registrations')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'registrations' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'registrations' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'registrations' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <Ticket size={16} /> Job Mela Registrations
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeSection === 'applications' ? (
        <AdminApplicationsPage />
      ) : activeSection === 'registrations' ? (
        <AdminRegistrationsPage />
      ) : (
        <>
          {/* Header Bar */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <Users size={20} style={{ color: 'var(--color-primary-600)' }} />
                  <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Platform Candidates Directory</h1>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Search, moderate, and manage job seekers registered across NTR Vikasa employment programs.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span style={{
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700
                }}>
                  {candidates.filter(c => c.accountStatus === 'ACTIVE').length} Active Candidates
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
                  placeholder="Search candidate name, email, headline, skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
                  {['ALL', 'ACTIVE', 'SUSPENDED'].map((filterKey) => (
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
                      {filterKey === 'ALL' ? 'All Accounts' : filterKey}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Users size={40} />}
                title="No Candidates Found"
                description="No candidate records match your current search and filter criteria."
              />
            ) : (
              <>
                <Table columns={columns} data={paginatedCandidates} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </div>

          {/* ── 1. Candidate Full Profile Modal ── */}
          {profileModalOpen && selectedCand && (
            <Modal
              isOpen={profileModalOpen}
              onClose={() => setProfileModalOpen(false)}
              title={`Candidate Profile: ${selectedCand.name}`}
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
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 800
                  }}>
                    {selectedCand.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>{selectedCand.name}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: '#c7d2fe', margin: '2px 0 0 0' }}>{selectedCand.headline}</p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#e0e7ff' }}>
                      <span>📍 {selectedCand.location}</span>
                      <span>💼 Experience: {selectedCand.experience}</span>
                      <span>📅 Joined: {selectedCand.registrationDate || 'Aug 2026'}</span>
                    </div>
                  </div>
                </div>

                {/* Candidate Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Contact Information
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Email:</strong> {selectedCand.email}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Phone:</strong> {selectedCand.phone || '+91 98765 43210'}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Location:</strong> {selectedCand.location}</p>
                  </div>

                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Education & Experience
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Education:</strong> {selectedCand.education || 'B.Tech Computer Science'}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Experience:</strong> {selectedCand.experience}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Applications:</strong> {selectedCand.applicationsCount || 12} Submitted</p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                    Skills & Competencies
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {selectedCand.skills?.map((skill) => (
                      <span key={skill} style={{
                        background: 'var(--color-primary-50)',
                        color: 'var(--color-primary-700)',
                        border: '1px solid var(--color-primary-200)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                  <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
                    Close
                  </Button>
                  {selectedCand.accountStatus === 'ACTIVE' ? (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setProfileModalOpen(false);
                        setSuspendTarget(selectedCand);
                      }}
                    >
                      Suspend Candidate Account
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleActivate(selectedCand);
                        setSelectedCand({ ...selectedCand, accountStatus: 'ACTIVE' });
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
              title="Suspend Candidate Account?"
              message={`Are you sure you want to suspend candidate ${suspendTarget.name} (${suspendTarget.email})? The candidate will no longer be able to submit job applications.`}
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
