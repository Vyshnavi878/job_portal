import { useState, useMemo, useEffect } from 'react';
import {
  Briefcase, Search, Filter, Eye, CheckCircle2, XCircle,
  Building2, MapPin, DollarSign, Clock, ShieldAlert, AlertTriangle,
  FileEdit, HelpCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { exportToExcel, exportToPDF, getExportFilename } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

export default function AdminJobsPage() {
  const { addToast } = useToast();
  const {
    jobs = [],
    companies = [],
    recruiters = [],
    approveJob,
    rejectJob,
    requestJobChanges
  } = useAdmin();

  const PAGE_SIZE = 10;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [companyFilter, setCompanyFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, companyFilter]);

  // Derive unique company names from existing job, company, and recruiter data
  const availableCompanies = useMemo(() => {
    const set = new Set();
    jobs?.forEach(j => {
      const c = j.company || j.companyName;
      if (c && typeof c === 'string' && c.trim()) {
        set.add(c.trim());
      }
    });
    companies?.forEach(c => {
      const name = typeof c === 'string' ? c : (c.name || c.companyName || c.company);
      if (name && typeof name === 'string' && name.trim()) {
        set.add(name.trim());
      }
    });
    recruiters?.forEach(r => {
      const c = r.company || r.companyName;
      if (c && typeof c === 'string' && c.trim()) {
        set.add(c.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobs, companies, recruiters]);

  // View modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Request Changes modal
  const [changesTarget, setChangesTarget] = useState(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [changesModalOpen, setChangesModalOpen] = useState(false);

  const filterTabs = [
    { key: 'ALL', label: 'All Jobs' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const filtered = useMemo(() => {
    return (jobs || []).filter((j) => {
      // 1. Company Filter
      if (companyFilter !== 'ALL') {
        const jobCompany = (j.company || j.companyName || '').trim().toLowerCase();
        if (jobCompany !== companyFilter.trim().toLowerCase()) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'APPROVED' && (j.status !== 'APPROVED' && j.status !== 'PUBLISHED')) return false;
        if (statusFilter === 'ACTIVE' && (j.status !== 'ACTIVE' && j.status !== 'PUBLISHED' && j.status !== 'APPROVED')) return false;
        if (statusFilter === 'PENDING' && j.status !== 'PENDING') return false;
        if (statusFilter === 'REJECTED' && j.status !== 'REJECTED') return false;
        if (statusFilter === 'CLOSED' && j.status !== 'CLOSED') return false;
      }

      // 3. Search Filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = j.title?.toLowerCase().includes(q);
        const matchesCompany = j.company?.toLowerCase().includes(q);
        const matchesRecruiter = j.recruiter?.toLowerCase().includes(q);
        const matchesLocation = j.location?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesRecruiter && !matchesLocation) return false;
      }
      return true;
    });
  }, [jobs, search, statusFilter, companyFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting jobs list to Excel...', 'info');
    const headers = [
      'Job Title',
      'Company',
      'Job Type',
      'Location',
      'Experience',
      'Salary',
      'Recruiter',
      'Created Date',
      'Status'
    ];
    const rows = filtered.map(j => [
      j.title || 'N/A',
      j.company || 'N/A',
      j.type || j.workMode || 'Full-time',
      j.location || 'India',
      j.experience || '2-5 Years',
      j.salary || 'Competitive',
      j.recruiter || 'N/A',
      j.createdAt || j.postedDate || j.date ? new Date(j.createdAt || j.postedDate || j.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026',
      j.status || 'ACTIVE'
    ]);
    const fileSuffix = companyFilter !== 'ALL'
      ? `${companyFilter.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${statusFilter.toLowerCase()}`
      : statusFilter.toLowerCase();
    exportToExcel({
      filename: getExportFilename('admin_jobs', fileSuffix, 'xlsx'),
      sheetName: 'Jobs',
      headers,
      rows
    });
    addToast('Excel export downloaded successfully!', 'success');
  };

  const handleExportPdf = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting jobs list to PDF...', 'info');
    const headers = ['Job Title', 'Company', 'Type', 'Location', 'Salary', 'Recruiter', 'Status'];
    const rows = filtered.map(j => [
      j.title || 'N/A',
      j.company || 'N/A',
      j.type || j.workMode || 'Full-time',
      j.location || 'India',
      j.salary || 'Competitive',
      j.recruiter || 'N/A',
      j.status || 'ACTIVE'
    ]);
    const tabObj = filterTabs.find(t => t.key === statusFilter);
    const statusLabel = tabObj ? tabObj.label : statusFilter;
    const companyLabel = companyFilter === 'ALL' ? 'All Companies' : companyFilter;

    const fileSuffix = companyFilter !== 'ALL'
      ? `${companyFilter.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${statusFilter.toLowerCase()}`
      : statusFilter.toLowerCase();

    exportToPDF({
      filename: getExportFilename('admin_jobs', fileSuffix, 'pdf'),
      title: 'Platform Job Postings Governance Report',
      subtitle: `NTR Vikasa Admin Audit - Company: ${companyLabel} • Filter: ${statusLabel}`,
      metadata: {
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Company Filter': companyLabel,
        'Status Filter': statusLabel,
        'Search Query': search || 'None',
        'Total Records': filtered.length
      },
      headers,
      rows
    });
    addToast('PDF export downloaded successfully!', 'success');
  };

  const handleApprove = (j) => {
    approveJob(j.id);
    addToast(`"${j.title}" by ${j.company} is now APPROVED.`, 'success');
    if (selectedJob?.id === j.id) {
      setSelectedJob({ ...selectedJob, status: 'APPROVED' });
    }
  };

  const handleOpenReject = (j) => {
    setRejectTarget(j);
    setRejectionReason('Job details do not comply with wage transparency or employment authenticity guidelines.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget) return;
    rejectJob(rejectTarget.id, rejectionReason || 'Rejected by administrator.');
    addToast(`"${rejectTarget.title}" has been REJECTED.`, 'info');
    setRejectModalOpen(false);
    if (selectedJob?.id === rejectTarget.id) {
      setSelectedJob({ ...selectedJob, status: 'REJECTED' });
    }
    setRejectTarget(null);
  };

  const handleOpenRequestChanges = (j) => {
    setChangesTarget(j);
    setChangeNotes('Please clarify salary compensation range, educational criteria, and job responsibilities.');
    setChangesModalOpen(true);
  };

  const handleConfirmRequestChanges = (e) => {
    e.preventDefault();
    if (!changesTarget) return;
    requestJobChanges(changesTarget.id, changeNotes || 'Changes requested by administrator.');
    addToast(`Changes requested for "${changesTarget.title}". Recruiter notified.`, 'warning');
    setChangesModalOpen(false);
    if (selectedJob?.id === changesTarget.id) {
      setSelectedJob({ ...selectedJob, status: 'CHANGES_REQUESTED' });
    }
    setChangesTarget(null);
  };

  const columns = [
    {
      key: 'title',
      label: 'Job Title',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{row.title}</strong>
          <span style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.type || 'Full-time'}</span>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (v) => <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v}</strong>
    },
    {
      key: 'location',
      label: 'Location',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>📍 {v}</span>
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{v || '2-5 Years'}</span>
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (v) => <strong style={{ fontSize: 'var(--text-xs)', color: '#047857' }}>{v}</strong>
    },
    {
      key: 'recruiter',
      label: 'Recruiter',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v || 'Authorized Lead'}</span>
    },
    {
      key: 'postedDate',
      label: 'Posted Date',
      sortable: true,
      render: (v) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {v ? new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => {
        const isApproved = v === 'APPROVED' || v === 'ACTIVE' || v === 'PUBLISHED';
        const isPending = v === 'PENDING';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isApproved ? '#ecfdf5' : isPending ? '#fffbeb' : '#fef2f2',
            color: isApproved ? '#047857' : isPending ? '#b45309' : '#b91c1c',
            border: isApproved ? '1px solid #a7f3d0' : isPending ? '1px solid #fde68a' : '1px solid #fecaca',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isApproved ? <CheckCircle2 size={12} /> : isPending ? <Clock size={12} /> : <XCircle size={12} />}
            {v}
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
              setSelectedJob(row);
              setViewModalOpen(true);
            }}
          >
            View
          </Button>

          {row.status !== 'APPROVED' && row.status !== 'ACTIVE' && (
            <Button
              size="xs"
              variant="primary"
              onClick={() => handleApprove(row)}
            >
              Approve
            </Button>
          )}

          {row.status !== 'REJECTED' && (
            <Button
              size="xs"
              variant="danger"
              onClick={() => handleOpenReject(row)}
            >
              Reject
            </Button>
          )}

          <Button
            size="xs"
            variant="secondary"
            onClick={() => handleOpenRequestChanges(row)}
          >
            Changes
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-jobs-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Briefcase size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Platform Jobs Directory</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Review, moderate, approve, or request modifications for employer job listings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              background: '#ecfdf5',
              color: '#047857',
              border: '1px solid #a7f3d0',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700
            }}>
              {jobs.filter(j => j.status === 'ACTIVE' || j.status === 'APPROVED').length} Active Listings
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Row 1: Status Filters & Export */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: statusFilter === tab.key ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  background: statusFilter === tab.key ? 'var(--color-primary-600)' : 'var(--color-surface)',
                  color: statusFilter === tab.key ? '#fff' : 'var(--color-text-muted)',
                  transition: 'all 150ms ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ExportDropdown
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            disabled={filtered.length === 0}
          />
        </div>

        {/* Row 2: Company Filter Dropdown & Search Bar */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)' }}>
          {/* Company Filter */}
          <div style={{ position: 'relative', minWidth: 260, flex: '0 1 300px' }}>
            <Building2 size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="form-control"
              style={{
                width: '100%',
                height: 38,
                paddingLeft: 36,
                paddingRight: 28,
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-text)',
                cursor: 'pointer',
                background: companyFilter === 'ALL' ? 'var(--color-surface)' : 'var(--color-primary-50, #eff6ff)',
                borderColor: companyFilter === 'ALL' ? 'var(--color-border)' : 'var(--color-primary-500)'
              }}
            >
              <option value="ALL">All Companies</option>
              {availableCompanies.map((cName) => (
                <option key={cName} value={cName}>
                  {cName}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search jobs, company, recruiter, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)' }}
            />
          </div>

          {/* Active Filter Clear */}
          {(companyFilter !== 'ALL' || statusFilter !== 'ALL' || search.trim() !== '') && (
            <button
              type="button"
              onClick={() => {
                setCompanyFilter('ALL');
                setStatusFilter('ALL');
                setSearch('');
              }}
              style={{
                height: 38,
                padding: '0 14px',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 150ms ease'
              }}
              title="Reset all filters"
            >
              <XCircle size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={40} />}
            title="No Jobs Found"
            description="No job postings match your current search and filter criteria."
          />
        ) : (
          <>
            <Table columns={columns} data={paginatedJobs} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* ── 1. Job View Details Modal ── */}
      {viewModalOpen && selectedJob && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Job Specification: ${selectedJob.title}`}
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
                <Briefcase size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>{selectedJob.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#93c5fd', margin: '2px 0 0 0' }}>{selectedJob.company} • 📍 {selectedJob.location}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#cbd5e1' }}>
                  <span>💰 {selectedJob.salary}</span>
                  <span>💼 {selectedJob.experience || '3-5 Years'}</span>
                  <span>🛡️ Status: {selectedJob.status}</span>
                </div>
              </div>
            </div>

            {/* Job Metadata */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Posting Parameters
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Recruiter:</strong> {selectedJob.recruiter || 'Enterprise Talent'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Job Type:</strong> {selectedJob.type || 'Full-time'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Posted Date:</strong> {selectedJob.postedDate || 'Aug 2026'}</p>
              </div>

              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                  Compensation & Experience
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Salary Range:</strong> {selectedJob.salary}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 4 }}><strong>Required Experience:</strong> {selectedJob.experience || '2-5 Years'}</p>
                <p style={{ fontSize: 'var(--text-xs)', marginBottom: 0 }}><strong>Applicants:</strong> {selectedJob.applicantsCount || 0} candidates</p>
              </div>
            </div>

            {/* Description / Requirements */}
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Role Description & Responsibilities
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.6, background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                {selectedJob.description || 'Enterprise role responsibilities including hands-on project delivery, cross-functional collaboration, design system execution, and quality code craftsmanship.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setViewModalOpen(false);
                  handleOpenRequestChanges(selectedJob);
                }}
              >
                Request Changes
              </Button>
              {selectedJob.status !== 'APPROVED' && selectedJob.status !== 'ACTIVE' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleApprove(selectedJob);
                    setSelectedJob({ ...selectedJob, status: 'APPROVED' });
                  }}
                >
                  Approve Job
                </Button>
              )}
              {selectedJob.status !== 'REJECTED' && (
                <Button
                  variant="danger"
                  onClick={() => {
                    setViewModalOpen(false);
                    handleOpenReject(selectedJob);
                  }}
                >
                  Reject Job
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── 2. Reject Modal ── */}
      {rejectModalOpen && rejectTarget && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title={`Reject Job: ${rejectTarget.title}`}
          size="md"
        >
          <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Specify the moderation reason for rejecting this job posting.
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

      {/* ── 3. Request Changes Modal ── */}
      {changesModalOpen && changesTarget && (
        <Modal
          isOpen={changesModalOpen}
          onClose={() => setChangesModalOpen(false)}
          title={`Request Changes: ${changesTarget.title}`}
          size="md"
        >
          <form onSubmit={handleConfirmRequestChanges} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Specify the requested modifications for the recruiter before this job can be approved.
            </p>

            <FormField label="Modification Instructions" required>
              <Textarea
                rows={3}
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                placeholder="Required modifications..."
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setChangesModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Request to Recruiter
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
