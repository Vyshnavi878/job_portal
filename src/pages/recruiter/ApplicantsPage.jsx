import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, CheckCircle2, XCircle, CalendarCheck,
  FileText, Download, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Sparkles, ArrowLeft, Clock, DollarSign
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_APPLICANTS = [
  {
    id: 'CAND-01',
    name: 'Priya Sharma',
    headline: 'Senior React & Frontend Engineer | 4+ Years Experience',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    experience: '4.2 Years',
    education: "B.Tech Computer Science, VTU (8.8 CGPA)",
    skills: ['React', 'TypeScript', 'Node.js', 'Redux Toolkit', 'Tailwind CSS', 'GraphQL'],
    appliedDate: '2026-08-22',
    status: 'SHORTLISTED',
    matchScore: 94,
    resumeName: 'Priya_Sharma_Resume_2026.pdf',
    coverNote: 'I have 4+ years of hands-on experience building performant frontend architectures at scale. I led the micro-frontend migration at Infosys and would love to bring my skills to TechCorp.',
    currentCompany: 'Infosys Ltd',
    currentSalary: '₹14.5 LPA',
    expectedSalary: '₹22.0 LPA',
    noticePeriod: '30 Days',
  },
  {
    id: 'CAND-02',
    name: 'Amitav Ghosh',
    headline: 'Staff Software Engineer | Full-Stack & Distributed Systems',
    email: 'amitav.ghosh@example.com',
    phone: '+91 98123 45678',
    location: 'Bengaluru, Karnataka',
    experience: '8.5 Years',
    education: "B.E. Information Technology, Jadavpur University",
    skills: ['React', 'Java', 'Spring Boot', 'Kafka', 'TypeScript', 'AWS'],
    appliedDate: '2026-08-21',
    status: 'UNDER_REVIEW',
    matchScore: 89,
    resumeName: 'Amitav_Ghosh_Staff_Engineer.pdf',
    coverNote: 'Experienced in high-throughput transactional architectures and leading distributed engineering squads.',
    currentCompany: 'Flipkart',
    currentSalary: '₹28.0 LPA',
    expectedSalary: '₹38.0 LPA',
    noticePeriod: '60 Days',
  },
  {
    id: 'CAND-03',
    name: 'Sneha Kulkarni',
    headline: 'Frontend & UI Guild Lead | React, Next.js, Design Systems',
    email: 'sneha.kulkarni@example.com',
    phone: '+91 97654 32109',
    location: 'Pune, Maharashtra (Open to relocate)',
    experience: '5.0 Years',
    education: "M.Tech Software Systems, BITS Pilani",
    skills: ['React', 'Next.js', 'TypeScript', 'Storybook', 'Figma', 'Jest'],
    appliedDate: '2026-08-19',
    status: 'INTERVIEW',
    matchScore: 96,
    resumeName: 'Sneha_Kulkarni_UI_Lead.pdf',
    coverNote: 'Passionate about design tokens, component architecture, and engineering excellence.',
    currentCompany: 'Swiggy',
    currentSalary: '₹18.0 LPA',
    expectedSalary: '₹26.0 LPA',
    noticePeriod: 'Immediate (Serving notice)',
  },
  {
    id: 'CAND-04',
    name: 'Rohan Verma',
    headline: 'Junior Software Engineer | Frontend Enthusiast',
    email: 'rohan.verma@example.com',
    phone: '+91 91234 56780',
    location: 'Bengaluru, Karnataka',
    experience: '1.2 Years',
    education: "B.Tech Computer Science, PES University",
    skills: ['JavaScript', 'HTML5', 'CSS3', 'React basics'],
    appliedDate: '2026-08-18',
    status: 'REJECTED',
    matchScore: 58,
    resumeName: 'Rohan_Verma_Resume.pdf',
    coverNote: 'Eager to learn and grow in a fast-paced product company.',
    currentCompany: 'TCS',
    currentSalary: '₹5.5 LPA',
    expectedSalary: '₹9.0 LPA',
    noticePeriod: '30 Days',
  },
];

export default function RecruiterApplicantsPage() {
  const { id } = useParams();
  const { toast } = useToast();

  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Candidate Details Modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Schedule Interview Modal
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '2026-08-28',
    time: '14:30',
    type: 'Online (Google Meet)',
    interviewer: 'Rahul Mehta (Tech Lead)',
    notes: 'Please prepare 45 minutes for live coding and system architecture discussion.',
  });

  const filterTabs = [
    { key: 'ALL', label: 'All Candidates' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview Scheduled' },
    { key: 'SELECTED', label: 'Selected / Hired' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!app.name.toLowerCase().includes(q) && !app.skills.some(s => s.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && app.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [applicants, search, statusFilter]);

  const handleOpenDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setDetailsModalOpen(true);
  };

  const handleShortlist = (candId, candName) => {
    setApplicants(applicants.map(c => c.id === candId ? { ...c, status: 'SHORTLISTED' } : c));
    if (selectedCandidate?.id === candId) {
      setSelectedCandidate({ ...selectedCandidate, status: 'SHORTLISTED' });
    }
    toast({
      type: 'success',
      title: 'Candidate Shortlisted',
      message: `${candName} has been moved to Shortlisted stage.`,
    });
  };

  const handleReject = (candId, candName) => {
    setApplicants(applicants.map(c => c.id === candId ? { ...c, status: 'REJECTED' } : c));
    if (selectedCandidate?.id === candId) {
      setSelectedCandidate({ ...selectedCandidate, status: 'REJECTED' });
    }
    toast({
      type: 'info',
      title: 'Candidate Status Updated',
      message: `${candName} marked as Rejected.`,
    });
  };

  const handleOpenScheduleModal = (candidate) => {
    setInterviewCandidate(candidate);
    setInterviewModalOpen(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!interviewCandidate) return;
    setApplicants(applicants.map(c => c.id === interviewCandidate.id ? { ...c, status: 'INTERVIEW' } : c));
    if (selectedCandidate?.id === interviewCandidate.id) {
      setSelectedCandidate({ ...selectedCandidate, status: 'INTERVIEW' });
    }
    setInterviewModalOpen(false);
    toast({
      type: 'success',
      title: 'Interview Scheduled',
      message: `Interview for ${interviewCandidate.name} on ${interviewForm.date} at ${interviewForm.time} has been scheduled.`,
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Candidate',
      sortable: true,
      render: (_, row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{row.name}</span>
            <span className="badge badge-success" style={{ fontSize: '10px' }}>{row.matchScore}% Match</span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{row.headline}</p>
        </div>
      )
    },
    {
      key: 'experience',
      label: 'Experience',
      sortable: true,
      render: (v, row) => (
        <div>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{v}</span>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{row.currentCompany}</p>
        </div>
      )
    },
    {
      key: 'skills',
      label: 'Key Skills',
      render: (skills) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 220 }}>
          {skills.slice(0, 3).map((s) => (
            <span key={s} className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 6px' }}>{s}</span>
          ))}
          {skills.length > 3 && <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>+{skills.length - 3}</span>}
        </div>
      )
    },
    {
      key: 'appliedDate',
      label: 'Applied On',
      sortable: true,
      render: (v) => new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
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
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Button size="xs" variant="outline" leftIcon={<Eye size={12} />} onClick={() => handleOpenDetails(row)}>
            Review
          </Button>

          {row.status !== 'SHORTLISTED' && row.status !== 'INTERVIEW' && (
            <Button size="xs" variant="secondary" onClick={() => handleShortlist(row.id, row.name)} title="Shortlist candidate">
              Shortlist
            </Button>
          )}

          <Button size="xs" variant="primary" onClick={() => handleOpenScheduleModal(row)} title="Schedule Interview">
            Interview
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="recruiter-applicants-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <Link to="/recruiter/jobs" style={{ textDecoration: 'none', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}>
                <ArrowLeft size={14} /> Back to Jobs
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Users size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Applicants: Senior Frontend Engineer</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Review resumes, shortlist top engineering talent, and schedule live interview rounds
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? applicants.length : applicants.filter(a => a.status === tab.key).length;
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

      {/* Applicants Table */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search by candidate name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredApplicants.length}</strong> candidates
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filteredApplicants.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState
                icon="default"
                title="No candidates found"
                description={statusFilter !== 'ALL' ? `No applicants currently match status "${statusFilter}".` : 'No candidate applications matching your search query.'}
              />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredApplicants}
              rowKey="id"
            />
          )}
        </div>
      </div>

      {/* ── Candidate Application Details Modal ── */}
      {selectedCandidate && (
        <Modal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Candidate Profile: ${selectedCandidate.name}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Header info */}
            <div style={{
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 'var(--space-4)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedCandidate.name}</h3>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>{selectedCandidate.matchScore}% Match</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{selectedCandidate.headline}</p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {selectedCandidate.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> {selectedCandidate.email}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {selectedCandidate.phone}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={selectedCandidate.status} size="lg" />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Applied: {selectedCandidate.appliedDate}
                </p>
              </div>
            </div>

            {/* Compensation & Experience Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Total Experience</span>
                <strong>{selectedCandidate.experience}</strong>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Current CTC</span>
                <strong>{selectedCandidate.currentSalary}</strong>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Expected CTC</span>
                <strong style={{ color: 'var(--color-success-700)' }}>{selectedCandidate.expectedSalary}</strong>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Notice Period</span>
                <strong>{selectedCandidate.noticePeriod}</strong>
              </div>
            </div>

            {/* Resume Preview Box */}
            <div style={{
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <FileText size={22} style={{ color: 'var(--color-primary-600)' }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>{selectedCandidate.resumeName}</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Verified Candidate CV Document</p>
                </div>
              </div>
              <Button size="xs" variant="primary" leftIcon={<Download size={13} />} onClick={() => toast({ type: 'info', title: 'Downloading CV', message: `Downloading ${selectedCandidate.resumeName}` })}>
                Download Resume
              </Button>
            </div>

            {/* Skills Badges */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Validated Technical Skills
              </h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {selectedCandidate.skills.map((s) => (
                  <span key={s} className="badge badge-primary" style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Cover Note */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Candidate Cover Note
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', lineHeight: 'var(--leading-relaxed)' }}>
                {selectedCandidate.coverNote}
              </p>
            </div>

            {/* Education */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                Educational Qualifications
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>{selectedCandidate.education}</p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <Button variant="danger" size="sm" onClick={() => handleReject(selectedCandidate.id, selectedCandidate.name)}>
                Reject Candidate
              </Button>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {selectedCandidate.status !== 'SHORTLISTED' && selectedCandidate.status !== 'INTERVIEW' && (
                  <Button variant="secondary" size="sm" onClick={() => handleShortlist(selectedCandidate.id, selectedCandidate.name)}>
                    Shortlist
                  </Button>
                )}
                <Button variant="primary" size="sm" leftIcon={<CalendarCheck size={14} />} onClick={() => handleOpenScheduleModal(selectedCandidate)}>
                  Schedule Interview
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Schedule Interview Modal ── */}
      {interviewCandidate && (
        <Modal
          open={interviewModalOpen}
          onClose={() => setInterviewModalOpen(false)}
          title={`Schedule Interview: ${interviewCandidate.name}`}
          size="md"
        >
          <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <FormField label="Interview Date" required>
                <Input
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Interview Time (IST)" required>
                <Input
                  type="time"
                  value={interviewForm.time}
                  onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Interview Mode / Format" required>
              <Select
                options={['Online (Google Meet)', 'Online (MS Teams)', 'Online (Zoom)', 'On-Site Office Round', 'Telephonic Screening']}
                value={interviewForm.type}
                onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
              />
            </FormField>

            <FormField label="Interviewer / Panel Lead" required>
              <Input
                value={interviewForm.interviewer}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Instructions & Meeting Link Note">
              <Textarea
                rows={3}
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setInterviewModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" leftIcon={<CalendarCheck size={14} />}>Confirm Interview</Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
