import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Search, Filter, CalendarCheck, FileText, Download,
  Mail, Phone, MapPin, Briefcase, Sparkles, X, ChevronRight, UserCheck
} from 'lucide-react';
import { useRecruiter } from '../../context/RecruiterContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';

const PAGE_SIZE = 10;

export default function ShortlistedPage() {
  const { recruiter, scheduleInterview, rejectCandidate } = useRecruiter();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedJobFilter]);

  // Modals state
  const [interviewTarget, setInterviewTarget] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    date: '2026-09-08',
    time: '11:00',
    type: 'Video Call (Google Meet)',
    meetingLink: 'https://meet.google.com/shortlisted-interview',
    interviewer: recruiter?.name || 'Recruiter Lead',
    notes: 'Shortlisted technical interview round.'
  });

  const allApplicants = recruiter?.applicants || recruiter?.applications || [];
  const allJobs = recruiter?.jobs || [];

  // Filter shortlisted applicants
  const shortlistedApplicants = useMemo(() => {
    return allApplicants.filter((app) => {
      if (app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW') return false;

      if (selectedJobFilter !== 'ALL' && app.jobId !== selectedJobFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = app.candidateName?.toLowerCase().includes(q);
        const matchRole = app.jobTitle?.toLowerCase().includes(q);
        const matchSkills = app.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchRole && !matchSkills) return false;
      }

      return true;
    });
  }, [allApplicants, selectedJobFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(shortlistedApplicants.length / PAGE_SIZE));

  const paginatedShortlisted = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return shortlistedApplicants.slice(startIndex, startIndex + PAGE_SIZE);
  }, [shortlistedApplicants, currentPage]);

  const handleOpenInterviewModal = (cand) => {
    setInterviewTarget(cand);
    setIsInterviewModalOpen(true);
  };

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    if (!interviewTarget) return;

    scheduleInterview({
      jobId: interviewTarget.jobId,
      jobTitle: interviewTarget.jobTitle,
      candidateId: interviewTarget.id,
      candidateName: interviewTarget.candidateName,
      candidateEmail: interviewTarget.candidateEmail,
      date: interviewForm.date,
      time: interviewForm.time,
      type: interviewForm.type,
      meetingLink: interviewForm.meetingLink,
      interviewer: interviewForm.interviewer,
      notes: interviewForm.notes
    });

    addToast(`Interview invitation sent to ${interviewTarget.candidateName}!`, 'success');
    setIsInterviewModalOpen(false);
    setInterviewTarget(null);
  };

  const handleRemoveFromShortlist = (app) => {
    rejectCandidate(app.id, app.jobId);
    addToast(`${app.candidateName} removed from shortlisted pool.`, 'info');
  };

  return (
    <div className="portal-page">
      {/* Header */}
      <div className="portal-header-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: 0 }}>
            Shortlisted Candidates
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            High-match candidates vetted and ready for technical & leadership interview rounds.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', flex: '1 1 auto' }}>
            <div style={{ flex: '1 1 300px', maxWidth: '420px', minWidth: '240px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search shortlisted candidates by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%', height: '42px', borderRadius: '8px' }}
              />
            </div>

            <div style={{ width: '260px', minWidth: '200px' }}>
              <select
                className="form-control"
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                style={{ height: '42px', borderRadius: '8px', width: '100%' }}
              >
                <option value="ALL">All Job Openings ({shortlistedApplicants.length})</option>
                {allJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      {shortlistedApplicants.length === 0 ? (
        <EmptyState
          icon={<UserCheck size={48} />}
          title="No shortlisted candidates found"
          description="Candidates marked as Shortlisted from Applications or Talent Search will appear here for fast interview scheduling."
          action={
            <Link to="/recruiter/applications">
              <Button variant="primary">Browse Applications</Button>
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {paginatedShortlisted.map((cand) => (
              <div
                key={cand.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #c7d2fe',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)'
                }}
              >
                <div>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'var(--color-primary-600)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }}>
                        {cand.candidateName?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                          {cand.candidateName}
                        </h3>
                        <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                          {cand.candidateEmail}
                        </p>
                      </div>
                    </div>

                    {cand.matchScore && (
                      <span style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        border: '1px solid #a7f3d0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}>
                        <Sparkles size={12} />
                        {cand.matchScore}%
                      </span>
                    )}
                  </div>

                  {/* Job Position */}
                  <div style={{ background: 'var(--color-primary-50)', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Shortlisted for role:</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-800)' }}>{cand.jobTitle}</div>
                  </div>

                  {/* Experience & Notice */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gray-600)', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Briefcase size={14} color="var(--color-gray-400)" />
                      <span>{cand.experience || '3+ Years'} Exp</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} color="var(--color-gray-400)" />
                      <span>{cand.location || 'India'}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  {cand.skills && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {cand.skills.slice(0, 4).map((sk, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'var(--color-gray-100)',
                            color: 'var(--color-gray-700)',
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            fontWeight: 500
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                      {cand.skills.length > 4 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)', alignSelf: 'center' }}>
                          +{cand.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-gray-200)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ flex: 1 }}
                    icon={<CalendarCheck size={14} />}
                    onClick={() => handleOpenInterviewModal(cand)}
                  >
                    Schedule Interview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download size={14} />}
                    onClick={() => addToast(`Downloading resume for ${cand.candidateName}...`, 'info')}
                    aria-label="Download Resume"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: 'var(--color-danger-600)' }}
                    icon={<X size={14} />}
                    onClick={() => handleRemoveFromShortlist(cand)}
                    aria-label="Remove from shortlist"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={shortlistedApplicants.length}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && interviewTarget && (
        <Modal
          isOpen={isInterviewModalOpen}
          onClose={() => { setIsInterviewModalOpen(false); setInterviewTarget(null); }}
          title={`Schedule Interview — ${interviewTarget.candidateName}`}
          size="md"
        >
          <form onSubmit={handleConfirmSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-primary-50)', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Role:</strong> {interviewTarget.jobTitle}
              <br />
              <strong>Candidate:</strong> {interviewTarget.candidateName}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="Interview Date *" required>
                <Input
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Interview Time *" required>
                <Input
                  type="time"
                  value={interviewForm.time}
                  onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Interview Round / Format" required>
              <Select
                value={interviewForm.type}
                onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
              >
                <option value="Video Call (Google Meet)">Video Call (Google Meet)</option>
                <option value="Video Call (Microsoft Teams)">Video Call (Microsoft Teams)</option>
                <option value="In-Person (Office Round)">In-Person (Office Round)</option>
                <option value="Technical Coding Round">Technical Coding Round</option>
                <option value="Managerial / Leadership Round">Managerial / Leadership Round</option>
              </Select>
            </FormField>

            <FormField label="Meeting Link / Venue">
              <Input
                type="text"
                value={interviewForm.meetingLink}
                onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/xyz or Office address"
              />
            </FormField>

            <FormField label="Interviewer Panel">
              <Input
                type="text"
                value={interviewForm.interviewer}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
              />
            </FormField>

            <FormField label="Notes / Instructions">
              <Textarea
                rows={3}
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                placeholder="Include topics, portfolio review, problem statement, etc."
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="outline"
                type="button"
                onClick={() => { setIsInterviewModalOpen(false); setInterviewTarget(null); }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={<CalendarCheck size={16} />}>
                Send Interview Invite
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
