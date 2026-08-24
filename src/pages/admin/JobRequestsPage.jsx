import { useState } from 'react';
import {
  Briefcase, Search, Filter, Eye, CheckCircle2, XCircle,
  Building2, MapPin, DollarSign, Clock, AlertCircle, FileText
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_JOB_REQUESTS = [
  {
    id: 'JOB-REQ-01',
    title: 'Cloud Security Architect (AWS / Azure)',
    company: 'TechCorp India Technologies Pvt Ltd',
    recruiter: 'Rahul Mehta',
    department: 'Infra & SecOps',
    location: 'Bengaluru, Karnataka (Hybrid)',
    salary: '₹32 - ₹48 LPA',
    experience: '8-12 years',
    openings: 2,
    submittedDate: '2026-08-24, 10:15 AM',
    status: 'PENDING',
    description: 'We are seeking an experienced Cloud Security Architect to design zero-trust security postures across AWS and multi-cloud enterprise deployments.',
    responsibilities: ['Architect enterprise zero-trust IAM frameworks', 'Conduct threat modeling & automated compliance checks', 'Liaise with CISO for ISO27001 & SOC2 audits'],
    skills: ['AWS Security', 'Zero Trust', 'Kubernetes', 'Terraform', 'CIS Benchmarks'],
  },
  {
    id: 'JOB-REQ-02',
    title: 'Senior NLP / GenAI Research Scientist',
    company: 'Infosys Ltd',
    recruiter: 'Sameer Sen',
    department: 'Topaz AI Center of Excellence',
    location: 'Hyderabad, Telangana',
    salary: '₹24 - ₹38 LPA',
    experience: '5-8 years',
    openings: 4,
    submittedDate: '2026-08-24, 08:30 AM',
    status: 'PENDING',
    description: 'Lead research in fine-tuning open-source LLMs, retrieval-augmented generation (RAG), and agentic workflows.',
    responsibilities: ['Train and fine-tune foundation models', 'Optimize inference latencies via quantization & vLLM', 'Publish research whitepapers'],
    skills: ['PyTorch', 'Transformers', 'LangChain', 'RAG', 'Python'],
  },
  {
    id: 'JOB-REQ-03',
    title: 'Cryptocurrency Arbitrage Analyst',
    company: 'Crypto Trading Global',
    recruiter: 'Pooja Nair',
    department: 'Trading Desk',
    location: 'Remote',
    salary: '₹15 - ₹25 LPA',
    experience: '2-4 years',
    openings: 1,
    submittedDate: '2026-08-23, 05:00 PM',
    status: 'PENDING',
    description: 'High frequency automated arbitrage strategies across decentralized liquidity pools.',
    responsibilities: ['Monitor automated trading bots', 'Execute manual market maker hedges'],
    skills: ['Solidity', 'Web3.js', 'Python'],
  },
];

export default function AdminJobRequestsPage() {
  const { toast } = useToast();

  const [requests, setRequests] = useState(INITIAL_JOB_REQUESTS);
  const [search, setSearch] = useState('');

  // Details Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Reject Reason Modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = (job) => {
    setRequests(requests.map(j => j.id === job.id ? { ...j, status: 'PUBLISHED' } : j));
    if (selectedJob?.id === job.id) {
      setSelectedJob({ ...selectedJob, status: 'PUBLISHED' });
    }
    toast({
      type: 'success',
      title: 'Job Approved & Published',
      message: `"${job.title}" by ${job.company} is now active on the public job board.`,
    });
  };

  const handleOpenReject = (job) => {
    setRejectTarget(job);
    setRejectionReason('Job description does not comply with portal verification and wage transparency standards.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectTarget || !rejectionReason.trim()) return;
    setRequests(requests.map(j => j.id === rejectTarget.id ? { ...j, status: 'REJECTED' } : j));
    if (selectedJob?.id === rejectTarget.id) {
      setSelectedJob({ ...selectedJob, status: 'REJECTED' });
    }
    setRejectModalOpen(false);
    toast({
      type: 'error',
      title: 'Job Posting Rejected',
      message: `Job "${rejectTarget.title}" has been rejected. Notification sent to ${rejectTarget.recruiter}.`,
    });
  };

  const filtered = requests.filter(j => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.recruiter.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'title',
      label: 'Job Title & Company',
      sortable: true,
      render: (_, row) => (
        <div>
          <strong style={{ fontSize: 'var(--text-sm)' }}>{row.title}</strong>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{row.company}</p>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Recruiter: {row.recruiter} ({row.department})</p>
        </div>
      )
    },
    {
      key: 'salary',
      label: 'Compensation & Exp',
      render: (_, row) => (
        <div style={{ fontSize: 'var(--text-xs)' }}>
          <strong style={{ color: 'var(--color-success-700)' }}>{row.salary}</strong>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.experience}</p>
        </div>
      )
    },
    {
      key: 'submittedDate',
      label: 'Submitted On',
      sortable: true,
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
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => { setSelectedJob(row); setViewModalOpen(true); }}>
            Review
          </Button>
          {row.status === 'PENDING' && (
            <>
              <Button size="xs" variant="primary" onClick={() => handleApprove(row)}>
                Approve
              </Button>
              <Button size="xs" variant="danger" onClick={() => handleOpenReject(row)}>
                Reject
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-job-requests-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Briefcase size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Job Approval Requests Queue</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Moderate and verify employer job postings before public directory indexing
            </p>
          </div>

          <span className="badge badge-warning" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }}>
            {requests.filter(j => j.status === 'PENDING').length} Jobs Awaiting Review
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> job approval submissions
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="jobs" title="No job approval requests" description="All employer job postings have been moderated." />
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

      {/* ── Job Details Review Modal ── */}
      {selectedJob && (
        <Modal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Job Specification Review: ${selectedJob.title}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{selectedJob.title}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedJob.company} • {selectedJob.department}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Posted by: {selectedJob.recruiter} • Location: {selectedJob.location}</p>
              </div>
              <StatusBadge status={selectedJob.status} size="lg" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>CTC Range</span><strong>{selectedJob.salary}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Experience</span><strong>{selectedJob.experience}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Vacancies</span><strong>{selectedJob.openings} Openings</strong></div>
            </div>

            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Job Description</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.5 }}>{selectedJob.description}</p>
            </div>

            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Target Skills</h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {selectedJob.skills.map((s) => (
                  <span key={s} className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <Button size="sm" variant="secondary" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              {selectedJob.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button size="sm" variant="danger" onClick={() => { setViewModalOpen(false); handleOpenReject(selectedJob); }}>
                    Reject Job
                  </Button>
                  <Button size="sm" variant="primary" leftIcon={<CheckCircle2 size={14} />} onClick={() => handleApprove(selectedJob)}>
                    Approve & Publish
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── Reject Reason Modal ── */}
      {rejectTarget && (
        <Modal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Job Posting"
          size="sm"
        >
          <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Provide the feedback reason for rejecting <strong>{rejectTarget.title}</strong>:
            </p>

            <FormField label="Rejection Reason" required>
              <Textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="danger">Confirm Rejection</Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
