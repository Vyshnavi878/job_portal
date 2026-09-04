import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Clock, Building2, MapPin, DollarSign,
  Calendar, CheckCircle2, XCircle, ArrowRight, Eye, RefreshCw,
  AlertCircle, Sparkles, UserCheck, MessageSquare, ChevronRight,
  Briefcase, Check, X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/States';
import { useCandidate } from '../../context/CandidateContext';
import { useToast } from '../../context/ToastContext';

const TIMELINE_STAGES = [
  { key: 'Applied', label: 'Applied', desc: 'Application & resume submitted' },
  { key: 'Screening', label: 'Screening', desc: 'Recruiter evaluating qualifications' },
  { key: 'Shortlisted', label: 'Shortlisted', desc: 'Shortlisted for technical rounds' },
  { key: 'Interview', label: 'Interview', desc: 'Technical & architectural discussion' },
  { key: 'Selected', label: 'Selected', desc: 'Offer release & onboarding' },
];

export default function CandidateApplicationsPage() {
  const { candidate } = useCandidate();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const filterTabs = [
    { key: 'ALL', label: 'All', count: candidate.applications.length },
    { key: 'APPLIED', label: 'Applied', count: candidate.applications.filter(a => a.status === 'APPLIED').length },
    { key: 'SCREENING', label: 'Screening', count: candidate.applications.filter(a => a.status === 'SCREENING').length },
    { key: 'SHORTLISTED', label: 'Shortlisted', count: candidate.applications.filter(a => a.status === 'SHORTLISTED').length },
    { key: 'INTERVIEW', label: 'Interview', count: candidate.applications.filter(a => a.status === 'INTERVIEW').length },
    { key: 'SELECTED', label: 'Selected', count: candidate.applications.filter(a => a.status === 'SELECTED').length },
    { key: 'REJECTED', label: 'Rejected', count: candidate.applications.filter(a => a.status === 'REJECTED').length },
  ];

  const filteredApps = useMemo(() => {
    return candidate.applications.filter((app) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = app.title.toLowerCase().includes(q);
        const matchComp = app.company.toLowerCase().includes(q);
        if (!matchTitle && !matchComp) return false;
      }
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
      return true;
    });
  }, [candidate.applications, search, statusFilter]);

  const handleOpenDetails = (app) => {
    setSelectedApp(app);
    setDetailsModalOpen(true);
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'APPLIED': return 0;
      case 'SCREENING': return 1;
      case 'SHORTLISTED': return 2;
      case 'INTERVIEW': return 3;
      case 'SELECTED': return 4;
      case 'REJECTED': return 1;
      default: return 0;
    }
  };

  return (
    <div className="candidate-applications-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      
      {/* ── Top Header ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Briefcase size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>My Applications Tracker</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Real-time application tracking with step-by-step recruitment milestones for {candidate.name}
            </p>
          </div>

          <Link to="/candidate/jobs">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Find More Jobs
            </Button>
          </Link>
        </div>

        {/* Search Input */}
        <div style={{ marginTop: 'var(--space-5)', maxWidth: 460 }}>
          <div className="input-wrapper">
            <span className="input-icon-left"><Search size={16} style={{ color: 'var(--color-primary-600)' }} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search applied role, company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-1)', marginTop: 'var(--space-4)' }}>
          {filterTabs.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: active ? '1.5px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  background: active ? 'var(--color-primary-600)' : 'var(--color-surface)',
                  color: active ? '#fff' : 'var(--color-text-muted)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
                <span style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-gray-100)',
                  color: active ? '#fff' : 'var(--color-text-muted)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Applications List ── */}
      {filteredApps.length === 0 ? (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
          <EmptyState
            icon="default"
            title="No applications in this category"
            description="Explore open jobs matching your skills and submit applications to start tracking."
            action={
              <Link to="/candidate/jobs">
                <Button variant="primary">Browse Jobs</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredApps.map((app) => {
            const currentStage = getStageIndex(app.status);
            return (
              <div
                key={app.id}
                className="card card-hoverable"
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)'
                }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-xl)',
                      background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                      color: '#fff',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {app.company?.[0] || 'C'}
                    </div>

                    <div>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)' }}>
                        {app.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-600)' }}>
                          {app.company}
                        </span>
                        <span style={{ color: 'var(--color-text-light)' }}>•</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          Applied: {app.appliedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <StatusBadge status={app.status} />
                    <Button size="sm" variant="outline" onClick={() => handleOpenDetails(app)}>
                      View Timeline
                    </Button>
                  </div>
                </div>

                {/* Meta details */}
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {app.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={13} /> {app.salary}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={13} /> {app.type} ({app.mode})</span>
                </div>

                {/* ── Progress Milestone Line ── */}
                <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'center' }}>
                    
                    {/* Background track */}
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: '8%',
                      right: '8%',
                      height: 2,
                      background: 'var(--color-gray-200)',
                      zIndex: 1
                    }} />

                    {TIMELINE_STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStage && app.status !== 'REJECTED';
                      const isCurrent = idx === currentStage && app.status !== 'REJECTED';
                      const isRejectedState = app.status === 'REJECTED' && idx === 1;

                      return (
                        <div
                          key={stage.key}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 2,
                            position: 'relative'
                          }}
                        >
                          <div style={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: isRejectedState ? 'var(--color-danger-500)' : isCompleted ? 'var(--color-primary-600)' : 'var(--color-surface)',
                            border: isCompleted || isRejectedState ? 'none' : '2px solid var(--color-gray-300)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            boxShadow: isCurrent ? '0 0 0 4px var(--color-primary-100)' : 'none'
                          }}>
                            {isRejectedState ? <X size={13} /> : isCompleted ? <Check size={13} /> : idx + 1}
                          </div>

                          <span style={{
                            fontSize: '11px',
                            fontWeight: isCurrent ? 800 : 600,
                            color: isRejectedState ? 'var(--color-danger-600)' : isCurrent ? 'var(--color-primary-700)' : isCompleted ? 'var(--color-text)' : 'var(--color-text-light)',
                            marginTop: 4
                          }}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail Timeline Modal ── */}
      {detailsModalOpen && selectedApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setDetailsModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--color-bg)'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-600)', textTransform: 'uppercase' }}>
                  Application Timeline
                </span>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{selectedApp.title}</h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedApp.company} • {selectedApp.location}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Current Status:</span>
                <StatusBadge status={selectedApp.status} />
              </div>

              {/* Step by step timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                {(selectedApp.timeline || [
                  { stage: 'Applied', date: selectedApp.appliedDate, completed: true },
                  { stage: 'Screening', date: 'In Progress', completed: selectedApp.status !== 'APPLIED' },
                  { stage: 'Shortlisted', date: 'Pending', completed: selectedApp.status === 'SHORTLISTED' || selectedApp.status === 'INTERVIEW' || selectedApp.status === 'SELECTED' },
                  { stage: 'Interview', date: 'Pending', completed: selectedApp.status === 'INTERVIEW' || selectedApp.status === 'SELECTED' },
                  { stage: 'Selected', date: 'TBD', completed: selectedApp.status === 'SELECTED' },
                ]).map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: step.completed ? 'var(--color-success-500)' : 'var(--color-gray-200)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, flexShrink: 0
                    }}>
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: step.completed ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                        {step.stage}
                      </h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {step.date || 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
