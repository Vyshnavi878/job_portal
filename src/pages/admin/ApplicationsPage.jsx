import { useState, useMemo } from 'react';
import {
  FileText, Search, Filter, Eye, Building2, User,
  Calendar, CheckCircle2, Clock, XCircle, Briefcase, DollarSign
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';
import { exportToExcel, exportToPDF, getExportFilename } from '../../utils/exportUtils';

export default function AdminApplicationsPage() {
  const { addToast } = useToast();
  const { applications } = useAdmin();

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
        const matchesCand = app.candidate?.toLowerCase().includes(q) || app.candidateName?.toLowerCase().includes(q);
        const matchesJob = app.job?.toLowerCase().includes(q) || app.jobTitle?.toLowerCase().includes(q);
        const matchesCompany = app.company?.toLowerCase().includes(q);
        if (!matchesCand && !matchesJob && !matchesCompany) return false;
      }
      if (statusFilter !== 'ALL') {
        if (app.status !== statusFilter) return false;
      }
      return true;
    });
  }, [applications, search, statusFilter]);

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting applications list to Excel...', 'info');
    const headers = ['Candidate Name', 'Candidate Email', 'Job Title', 'Company', 'Applied Date', 'Application Status'];
    const rows = filtered.map(app => [
      app.candidate || app.candidateName || 'Candidate',
      app.candidateEmail || 'N/A',
      app.job || app.jobTitle || 'Role',
      app.company || 'N/A',
      app.appliedDate || '24 Aug 2026',
      app.status || 'APPLIED'
    ]);
    const statusLabel = statusFilter === 'SELECTED' ? 'selected_hired' : statusFilter.toLowerCase();
    exportToExcel({
      filename: getExportFilename('applications', statusLabel, 'xlsx'),
      sheetName: 'Applications',
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
    addToast('Exporting applications list to PDF...', 'info');
    const headers = ['Candidate Name', 'Candidate Email', 'Job Title', 'Company', 'Applied Date', 'Status'];
    const rows = filtered.map(app => [
      app.candidate || app.candidateName || 'Candidate',
      app.candidateEmail || 'N/A',
      app.job || app.jobTitle || 'Role',
      app.company || 'N/A',
      app.appliedDate || '24 Aug 2026',
      app.status || 'APPLIED'
    ]);
    const currentTabObj = filterTabs.find(t => t.key === statusFilter);
    const statusTitle = currentTabObj ? currentTabObj.label : statusFilter;
    exportToPDF({
      filename: getExportFilename('applications', statusFilter.toLowerCase(), 'pdf'),
      title: statusFilter === 'SELECTED' ? 'Selected / Hired Candidates' : 'Applications Activity Report',
      subtitle: `Status: ${statusTitle}`,
      metadata: {
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Status Filter': statusTitle,
        'Total Records': filtered.length
      },
      headers,
      rows
    });
    addToast('PDF export downloaded successfully!', 'success');
  };

  const columns = [
    {
      key: 'candidate',
      label: 'Candidate',
      sortable: true,
      render: (_, row) => {
        const candName = row.candidate || row.candidateName || 'Candidate';
        const candEmail = row.candidateEmail || 'candidate@example.com';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #4338ca, #6366f1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 'var(--text-sm)'
            }}>
              {candName[0]}
            </div>
            <div>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'block' }}>{candName}</strong>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{candEmail}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'job',
      label: 'Job Title',
      sortable: true,
      render: (_, row) => {
        const title = row.job || row.jobTitle || 'Role';
        return (
          <div>
            <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{title}</strong>
            <span style={{ fontSize: '10px', color: 'var(--color-primary-600)', display: 'block', fontWeight: 600 }}>{row.company}</span>
          </div>
        );
      }
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (v) => <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{v}</strong>
    },
    {
      key: 'appliedDate',
      label: 'Applied Date',
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
      render: (v) => <StatusBadge status={v} />
    },
    {
      key: 'actions',
      label: 'Audit View',
      render: (_, row) => (
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Eye size={12} />}
          onClick={() => {
            setSelectedApp(row);
            setModalOpen(true);
          }}
        >
          View Record
        </Button>
      )
    }
  ];

  return (
    <div className="admin-applications-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <FileText size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Applications Activity Monitoring</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Live audit monitor of all job seeker applications across public vacancies and recruitment drives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span style={{
              background: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700
            }}>
              {applications.length + 48900} Total Applications Tracked
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
              placeholder="Search candidate name, job title, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  style={{
                    padding: '5px 12px',
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
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={40} />}
            title="No Applications Found"
            description="No application logs match your current search and filter criteria."
          />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ── 1. Application Detail Modal (Audit View Only) ── */}
      {modalOpen && selectedApp && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Application Record Audit Dossier"
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#fff',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-xl)'
            }}>
              <span style={{ fontSize: '10px', color: '#c7d2fe', fontWeight: 800, textTransform: 'uppercase' }}>
                Application ID: {selectedApp.id}
              </span>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: '4px 0 0 0', color: '#fff' }}>
                {selectedApp.candidate || selectedApp.candidateName}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: '#e0e7ff', margin: '2px 0 0 0' }}>
                Applying for: {selectedApp.job || selectedApp.jobTitle} at {selectedApp.company}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700 }}>RECRUITER LEAD</span>
                <strong style={{ fontSize: 'var(--text-xs)' }}>{selectedApp.recruiter || 'HR Operations Lead'}</strong>
              </div>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700 }}>DATE APPLIED</span>
                <strong style={{ fontSize: 'var(--text-xs)' }}>{selectedApp.appliedDate || '24 Aug 2026'}</strong>
              </div>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700 }}>CURRENT STAGE</span>
                <StatusBadge status={selectedApp.status} />
              </div>
              <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', fontWeight: 700 }}>OFFERED COMPENSATION</span>
                <strong style={{ fontSize: 'var(--text-xs)', color: '#047857' }}>{selectedApp.salary || 'Market Standards'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Close Audit View
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
