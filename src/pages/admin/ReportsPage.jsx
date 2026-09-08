import { useState, useMemo } from 'react';
import {
  AlertTriangle, Search, Filter, Eye, CheckCircle2, XCircle,
  ShieldAlert, ShieldCheck, FileText, User, Building2, Download
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';
import ExportDropdown from '../../components/ui/ExportDropdown';
import { exportToExcel, exportToPDF, getExportFilename } from '../../utils/exportUtils';

export default function AdminReportsPage() {
  const { addToast } = useToast();
  const { reports, resolveReport, rejectReport } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Review Modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Resolve Modal
  const [resolveTarget, setResolveTarget] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  // Reject / Dismiss Modal
  const [dismissTarget, setDismissTarget] = useState(null);
  const [dismissModalOpen, setDismissModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const type = r.reportType || r.type || '';
      const entity = r.reportedEntity || '';
      const reporter = r.reporter || '';
      const reason = r.reason || '';

      if (search.trim()) {
        const q = search.toLowerCase();
        if (!type.toLowerCase().includes(q) && !entity.toLowerCase().includes(q) && !reporter.toLowerCase().includes(q) && !reason.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL') {
        if (r.status !== statusFilter) return false;
      }
      return true;
    });
  }, [reports, search, statusFilter]);

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting reports to Excel...', 'info');
    const headers = [
      'Report ID',
      'Reporter',
      'Reported User/Entity',
      'Report Type',
      'Subject / Reason',
      'Created Date',
      'Status',
      'Resolution / Action'
    ];
    const rows = filtered.map(r => [
      r.id,
      r.reporter || 'Anonymous',
      r.reportedEntity || 'N/A',
      r.reportType || r.type || 'Flagged Content',
      r.reason || r.subject || 'Violation Report',
      r.date || 'Aug 2026',
      r.status || 'PENDING',
      r.actionTaken || (r.status === 'RESOLVED' ? 'Action enforced' : (r.status === 'DISMISSED' ? 'Dismissed' : 'Under Investigation'))
    ]);
    exportToExcel({
      filename: getExportFilename('reports_complaints', statusFilter !== 'ALL' ? statusFilter.toLowerCase() : '', 'xlsx'),
      sheetName: 'Reports & Complaints',
      headers,
      rows
    });
    addToast('Reports & complaints Excel downloaded!', 'success');
  };

  const handleExportPdf = () => {
    if (filtered.length === 0) {
      addToast('No records available to export for the selected filters.', 'info');
      return;
    }
    addToast('Exporting reports to PDF...', 'info');
    const headers = ['Report ID', 'Reporter', 'Reported Entity', 'Type', 'Date', 'Status'];
    const rows = filtered.map(r => [
      `#${r.id}`,
      r.reporter || 'Candidate',
      r.reportedEntity || 'N/A',
      r.reportType || r.type || 'Violation',
      r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026',
      r.status || 'PENDING'
    ]);
    exportToPDF({
      filename: getExportFilename('reports_complaints', statusFilter !== 'ALL' ? statusFilter.toLowerCase() : '', 'pdf'),
      title: 'Reports & Complaints Moderation List',
      metadata: {
        'Status Filter': statusFilter === 'ALL' ? 'All Reports' : statusFilter,
        'Search Query': search || 'All',
        'Export Date': new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        'Total Records': filtered.length
      },
      headers,
      rows
    });
    addToast('Reports & complaints PDF downloaded!', 'success');
  };

  const handleOpenResolve = (rep) => {
    setResolveTarget(rep);
    setResolutionNotes('Reviewed evidence. Corrective action enforced against reported entity.');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    if (!resolveTarget) return;
    resolveReport(resolveTarget.id, resolutionNotes);
    addToast(`Report #${resolveTarget.id} against ${resolveTarget.reportedEntity} has been RESOLVED.`, 'success');
    setResolveModalOpen(false);
    if (selectedReport?.id === resolveTarget.id) {
      setSelectedReport({ ...selectedReport, status: 'RESOLVED', actionTaken: resolutionNotes });
    }
    setResolveTarget(null);
  };

  const handleOpenDismiss = (rep) => {
    setDismissTarget(rep);
    setDismissModalOpen(true);
  };

  const handleConfirmDismiss = () => {
    if (!dismissTarget) return;
    rejectReport(dismissTarget.id);
    addToast(`Report #${dismissTarget.id} has been DISMISSED.`, 'info');
    setDismissModalOpen(false);
    if (selectedReport?.id === dismissTarget.id) {
      setSelectedReport({ ...selectedReport, status: 'DISMISSED' });
    }
    setDismissTarget(null);
  };

  const columns = [
    {
      key: 'reportType',
      label: 'Report Type',
      sortable: true,
      render: (_, row) => {
        const type = row.reportType || row.type || 'Flagged Content';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <AlertTriangle size={15} style={{ color: '#dc2626' }} />
            <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{type}</strong>
          </div>
        );
      }
    },
    {
      key: 'reportedEntity',
      label: 'Reported Entity',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-xs)', color: '#b91c1c' }}>{row.reportedEntity}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>ID: {row.id}</span>
        </div>
      )
    },
    {
      key: 'reporter',
      label: 'Reporter',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <strong>{row.reporter}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Verified Candidate</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
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
        const isPending = v === 'PENDING';
        const isResolved = v === 'RESOLVED';
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isPending ? '#fef2f2' : isResolved ? '#ecfdf5' : '#f8fafc',
            color: isPending ? '#b91c1c' : isResolved ? '#047857' : '#475569',
            border: isPending ? '1px solid #fecaca' : isResolved ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isPending ? <AlertTriangle size={12} /> : isResolved ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
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
              setSelectedReport(row);
              setViewModalOpen(true);
            }}
          >
            Review
          </Button>

          {row.status === 'PENDING' && (
            <>
              <Button
                size="xs"
                variant="primary"
                onClick={() => handleOpenResolve(row)}
              >
                Resolve
              </Button>
              <Button
                size="xs"
                variant="danger"
                onClick={() => handleOpenDismiss(row)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-reports-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <AlertTriangle size={20} style={{ color: '#dc2626' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Reports & Complaints Moderation</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
              Investigate candidate grievances, employer policy violations, spam alerts, and fee-charging reports.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span style={{
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '6px 12px',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700
            }}>
              {reports.filter(r => r.status === 'PENDING').length} Open Complaints
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
              placeholder="Search by report type, reported entity, reporter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--radius-lg)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Filter size={15} style={{ color: 'var(--color-text-muted)' }} />
              {['ALL', 'PENDING', 'RESOLVED', 'DISMISSED'].map((filterKey) => (
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
                  {filterKey === 'ALL' ? 'All Reports' : filterKey}
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
            icon={<CheckCircle2 size={40} />}
            title="No Moderation Complaints"
            description="No reports or complaints match your current search and filter criteria."
          />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </div>

      {/* ── 1. Review Modal ── */}
      {viewModalOpen && selectedReport && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Grievance Report: #${selectedReport.id}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Header Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
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
                <AlertTriangle size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: '#fff' }}>
                  {selectedReport.reportType || selectedReport.type}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: '#fecaca', margin: '2px 0 0 0' }}>
                  Reported Target: {selectedReport.reportedEntity}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', fontSize: '11px', color: '#fee2e2' }}>
                  <span>👤 Reporter: {selectedReport.reporter}</span>
                  <span>📅 Date: {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Aug 2026'}</span>
                  <span>🛡️ Status: {selectedReport.status}</span>
                </div>
              </div>
            </div>

            {/* Complaint Narrative */}
            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Complaint Description & Evidence
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                {selectedReport.reason || 'Candidate reported suspicious recruitment behavior requesting security deposits or unofficial registration fees.'}
              </p>
            </div>

            {selectedReport.actionTaken && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#047857', marginBottom: 'var(--space-1)' }}>
                  Action Taken / Resolution
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: '#065f46', margin: 0 }}>
                  {selectedReport.actionTaken}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              {selectedReport.status === 'PENDING' && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setViewModalOpen(false);
                      handleOpenDismiss(selectedReport);
                    }}
                  >
                    Dismiss / Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setViewModalOpen(false);
                      handleOpenResolve(selectedReport);
                    }}
                  >
                    Resolve Complaint
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── 2. Resolve Modal ── */}
      {resolveModalOpen && resolveTarget && (
        <Modal
          isOpen={resolveModalOpen}
          onClose={() => setResolveModalOpen(false)}
          title={`Resolve Report #${resolveTarget.id}`}
          size="md"
        >
          <form onSubmit={handleConfirmResolve} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Specify the corrective action or resolution summary for complaint against <strong>{resolveTarget.reportedEntity}</strong>.
            </p>

            <FormField label="Resolution Summary" required>
              <Textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Resolution details..."
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="outline" onClick={() => setResolveModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm & Mark Resolved
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── 3. Dismiss Dialog ── */}
      {dismissModalOpen && dismissTarget && (
        <Modal
          isOpen={dismissModalOpen}
          onClose={() => setDismissModalOpen(false)}
          title={`Dismiss Complaint #${dismissTarget.id}`}
          size="sm"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Are you sure you want to dismiss the complaint against <strong>{dismissTarget.reportedEntity}</strong> as non-actionable?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="outline" onClick={() => setDismissModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDismiss}>
                Dismiss Complaint
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
