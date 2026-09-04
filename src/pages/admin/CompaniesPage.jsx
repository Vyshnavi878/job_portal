import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2, Search, Filter, Eye, ShieldCheck, ShieldAlert,
  Users, Briefcase, Globe, Mail, Phone, MapPin, CheckCircle2,
  XCircle, AlertTriangle, FileText
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

// Consolidated Sub-Pages
import CompanyVerificationPage from './CompanyVerificationPage';

export default function AdminCompaniesPage() {
  const { addToast } = useToast();
  const { companies, approveCompany, rejectCompany, pendingCounts } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tabAliasMap = {
    'companies': 'companies',
    'verification': 'verification',
    'company-verification': 'verification',
    'company-requests': 'verification',
    'requests': 'verification',
  };
  const currentTab = tabAliasMap[tabParam] || 'companies';

  const [activeSection, setActiveSection] = useState(currentTab);

  useEffect(() => {
    if (tabParam && tabAliasMap[tabParam]) {
      setActiveSection(tabAliasMap[tabParam]);
    } else if (!tabParam) {
      setActiveSection('companies');
    }
  }, [tabParam]);

  const handleTabChange = (tabKey) => {
    setActiveSection(tabKey);
    if (tabKey === 'companies') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabKey });
    }
  };

  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // View modal
  const [selectedComp, setSelectedComp] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesIndustry = c.industry?.toLowerCase().includes(q);
        const matchesRecruiter = c.recruiter?.toLowerCase().includes(q);
        const matchesLocation = c.location?.toLowerCase().includes(q);
        if (!matchesName && !matchesIndustry && !matchesRecruiter && !matchesLocation) return false;
      }
      if (industryFilter !== 'ALL' && c.industry !== industryFilter) return false;
      if (statusFilter !== 'ALL' && c.verificationStatus !== statusFilter) return false;
      return true;
    });
  }, [companies, search, industryFilter, statusFilter]);

  const handleApprove = (c) => {
    approveCompany(c.id);
    addToast(`${c.name} has been marked as VERIFIED & APPROVED.`, 'success');
    if (selectedComp?.id === c.id) {
      setSelectedComp({ ...selectedComp, verificationStatus: 'VERIFIED' });
    }
  };

  const handleOpenReject = (c) => {
    setRejectTarget(c);
    setRejectionReason('Company business incorporation and GST credentials could not be verified.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget) return;
    rejectCompany(rejectTarget.id, rejectionReason || 'Verification rejected by administrator.');
    addToast(`${rejectTarget.name} verification has been REJECTED.`, 'info');
    setRejectModalOpen(false);
    if (selectedComp?.id === rejectTarget.id) {
      setSelectedComp({ ...selectedComp, verificationStatus: 'REJECTED' });
    }
    setRejectTarget(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Company',
      sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #1e1b4b, #3b82f6)',
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
            <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.website || 'Official Employer'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'recruiter',
      label: 'Recruiter Lead',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <strong>{row.recruiter}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>{row.email || 'hr@company.com'}</span>
        </div>
      )
    },
    {
      key: 'industry',
      label: 'Industry',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <strong>{row.industry}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>{row.size || '100-500 emp'}</span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>📍 {v}</span>
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
        const isPending = v === 'PENDING';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isVerified ? '#ecfdf5' : isPending ? '#fffbeb' : '#fef2f2',
            color: isVerified ? '#047857' : isPending ? '#b45309' : '#b91c1c',
            border: isVerified ? '1px solid #a7f3d0' : isPending ? '1px solid #fde68a' : '1px solid #fecaca',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isVerified ? <CheckCircle2 size={12} /> : isPending ? <AlertTriangle size={12} /> : <XCircle size={12} />}
            {v || 'PENDING'}
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
            leftIcon={<Eye size={12} />}
            onClick={() => {
              setSelectedComp(row);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>

          {row.verificationStatus !== 'VERIFIED' && (
            <Button
              size="xs"
              variant="primary"
              onClick={() => handleApprove(row)}
            >
              Approve
            </Button>
          )}

          {row.verificationStatus !== 'REJECTED' && (
            <Button
              size="xs"
              variant="danger"
              onClick={() => handleOpenReject(row)}
            >
              Reject
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-companies-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── 0. Consolidated Navigation Tabs (Companies | Verification) ── */}
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
          onClick={() => handleTabChange('companies')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeSection === 'companies' ? 'var(--color-primary-600)' : 'transparent',
            color: activeSection === 'companies' ? '#fff' : 'var(--color-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: activeSection === 'companies' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
            transition: 'all 150ms ease'
          }}
        >
          <Building2 size={16} /> Companies
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('verification')}
          style={{
            padding: '8px 18px',
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
          {pendingCounts?.companyVerifications > 0 && (
            <span style={{
              background: activeSection === 'verification' ? 'rgba(255,255,255,0.25)' : 'var(--color-warning-500)',
              color: '#fff',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              lineHeight: 1
            }}>
              {pendingCounts.companyVerifications}
            </span>
          )}
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeSection === 'verification' ? (
        <CompanyVerificationPage />
      ) : (
        <>
          {/* Header Bar */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <Building2 size={20} style={{ color: 'var(--color-primary-600)' }} />
                  <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Registered Companies Directory</h1>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Audit enterprise credentials, industry classifications, and manage verified employer records.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <span style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700
                }}>
                  {companies.filter(c => c.verificationStatus === 'VERIFIED').length} Verified Organizations
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
                  placeholder="Search company name, industry, recruiter lead, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
                {['ALL', 'VERIFIED', 'PENDING', 'REJECTED'].map((filterKey) => (
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
                    {filterKey === 'ALL' ? 'All Status' : filterKey}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Building2 size={40} />}
                title="No Companies Found"
                description="No company records match your current search and filter criteria."
              />
            ) : (
              <Table columns={columns} data={filtered} />
            )}
          </div>

          {/* ── 1. Company View Modal ── */}
          {viewModalOpen && selectedComp && (
            <Modal
              isOpen={viewModalOpen}
              onClose={() => setViewModalOpen(false)}
              title={`Company Record: ${selectedComp.name}`}
              size="lg"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Header Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
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
                    {selectedComp.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>{selectedComp.name}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: '#93c5fd', margin: '2px 0 0 0' }}>{selectedComp.industry} • {selectedComp.location}</p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#cbd5e1' }}>
                      <span>🌐 {selectedComp.website || 'https://example.com'}</span>
                      <span>📅 Registered: {selectedComp.registrationDate || 'Aug 2026'}</span>
                      <span>🛡️ Status: {selectedComp.verificationStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Legal / Corporate Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Corporate Identity
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>CIN:</strong> {selectedComp.cinNumber || 'U72200KA2012PTC064123'}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>GSTIN:</strong> {selectedComp.gstNumber || '29ABCDE1234F1Z5'}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Company Size:</strong> {selectedComp.size || '500-1000 employees'}</p>
                  </div>

                  <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                      Recruiter Contact
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Authorized Lead:</strong> {selectedComp.recruiter}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Official Email:</strong> {selectedComp.email || 'hr@company.com'}</p>
                    <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Phone:</strong> {selectedComp.phone || '+91 80 4920 1000'}</p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                  <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                    Close
                  </Button>
                  {selectedComp.verificationStatus !== 'VERIFIED' && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleApprove(selectedComp);
                        setSelectedComp({ ...selectedComp, verificationStatus: 'VERIFIED' });
                      }}
                    >
                      Approve Company
                    </Button>
                  )}
                  {selectedComp.verificationStatus !== 'REJECTED' && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setViewModalOpen(false);
                        handleOpenReject(selectedComp);
                      }}
                    >
                      Reject Company
                    </Button>
                  )}
                </div>
              </div>
            </Modal>
          )}

          {/* ── 2. Reject Reason Modal ── */}
          {rejectModalOpen && rejectTarget && (
            <Modal
              isOpen={rejectModalOpen}
              onClose={() => setRejectModalOpen(false)}
              title={`Reject Verification: ${rejectTarget.name}`}
              size="md"
            >
              <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Specify the administrative reason for rejecting {rejectTarget.name}.
                </p>

                <FormField label="Rejection Notes" required>
                  <Textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    required
                  />
                </FormField>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                  <Button type="button" variant="outline" onClick={() => setRejectModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="danger">
                    Confirm Rejection
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
