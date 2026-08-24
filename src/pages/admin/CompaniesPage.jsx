import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Search, Filter, Eye, ShieldCheck, ShieldAlert,
  Users, Briefcase, Globe, Mail, Phone, MapPin, CheckCircle2,
  XCircle, AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { MOCK_COMPANIES, INDUSTRIES } from '../../data/mockData';

export default function AdminCompaniesPage() {
  const { toast } = useToast();

  const [companies, setCompanies] = useState(MOCK_COMPANIES.map(c => ({
    ...c,
    status: c.verified ? 'VERIFIED' : 'PENDING',
    recruitersCount: Math.floor(2 + Math.random() * 8),
    cinNumber: 'U72200KA2014PTC089100',
    gstNumber: '29AAACH1234F1Z5',
  })));

  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');

  // View modal
  const [selectedComp, setSelectedComp] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Suspend Dialog
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.industry.toLowerCase().includes(q)) return false;
      }
      if (industryFilter !== 'ALL' && c.industry !== industryFilter) return false;
      return true;
    });
  }, [companies, search, industryFilter]);

  const handleVerify = (c) => {
    setCompanies(companies.map(item => item.id === c.id ? { ...item, status: 'VERIFIED', verified: true } : item));
    toast({ type: 'success', title: 'Company Verified', message: `${c.name} has been marked as Verified Employer.` });
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    setCompanies(companies.map(item => item.id === suspendTarget.id ? { ...item, status: 'SUSPENDED', verified: false } : item));
    toast({ type: 'error', title: 'Company Suspended', message: `${suspendTarget.name} has been suspended.` });
    setSuspendTarget(null);
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
            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 'var(--text-sm)'
          }}>
            {row.name[0]}
          </div>
          <div>
            <strong style={{ fontSize: 'var(--text-sm)' }}>{row.name}</strong>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{row.location}</p>
          </div>
        </div>
      )
    },
    {
      key: 'industry',
      label: 'Industry & Size',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <strong>{row.industry}</strong>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.size}</p>
        </div>
      )
    },
    {
      key: 'openJobs',
      label: 'Open Jobs',
      sortable: true,
      render: (v) => <span className="badge badge-primary">{v} Openings</span>
    },
    {
      key: 'recruitersCount',
      label: 'Recruiters',
      render: (v) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{v} verified staff</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <span className={`badge ${v === 'VERIFIED' ? 'badge-success' : v === 'SUSPENDED' ? 'badge-danger' : 'badge-warning'}`}>{v}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => { setSelectedComp(row); setViewModalOpen(true); }}>
            Inspect
          </Button>

          {row.status !== 'VERIFIED' ? (
            <Button size="xs" variant="primary" onClick={() => handleVerify(row)}>
              Verify
            </Button>
          ) : (
            <Button size="xs" variant="danger" onClick={() => setSuspendTarget(row)}>
              Suspend
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-companies-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Building2 size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Corporate Enterprise Registry</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Audit enterprise employer accounts, legal credentials, and recruiter authorization rights
            </p>
          </div>

          <Link to="/companies" target="_blank">
            <Button variant="secondary" size="sm">
              Public Directory View
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search companies by name or industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> enterprise accounts
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="companies" title="No companies found" description="No registered enterprise accounts match your search query." />
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

      {/* ── Company Details Modal ── */}
      {selectedComp && (
        <Modal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Enterprise Account: ${selectedComp.name}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{selectedComp.name}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedComp.industry} • {selectedComp.size}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedComp.location}</p>
              </div>
              <span className={`badge ${selectedComp.status === 'VERIFIED' ? 'badge-success' : selectedComp.status === 'SUSPENDED' ? 'badge-danger' : 'badge-warning'}`}>
                {selectedComp.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>CIN Number</span><strong>{selectedComp.cinNumber}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>GSTIN</span><strong>{selectedComp.gstNumber}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Active Openings</span><strong>{selectedComp.openJobs} Jobs</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Authorized Recruiters</span><strong>{selectedComp.recruitersCount} Members</strong></div>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {selectedComp.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button size="sm" variant="secondary" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              {selectedComp.status !== 'VERIFIED' ? (
                <Button size="sm" variant="primary" onClick={() => { handleVerify(selectedComp); setViewModalOpen(false); }}>
                  Verify & Approve
                </Button>
              ) : (
                <Button size="sm" variant="danger" onClick={() => { setViewModalOpen(false); setSuspendTarget(selectedComp); }}>
                  Suspend Company
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Suspend Confirmation Dialog */}
      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleConfirmSuspend}
        title="Suspend Company Account?"
        message={`Are you sure you want to suspend "${suspendTarget?.name}"? All associated recruiter accounts and active job postings will be disabled.`}
        confirmText="Yes, Suspend Company"
        danger
      />

    </div>
  );
}
