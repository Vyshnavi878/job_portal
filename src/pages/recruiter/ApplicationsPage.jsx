import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, CheckCircle2, XCircle, CalendarCheck,
  FileText, Download, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Sparkles, Clock, DollarSign, ChevronRight, Check, X, AlertCircle
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

export default function ApplicationsPage() {
  const {
    recruiter,
    shortlistCandidate,
    rejectCandidate,
    scheduleInterview
  } = useRecruiter();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedJobFilter, selectedStatusTab, sortBy]);

  // Modals state
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewTarget, setInterviewTarget] = useState(null);

  const [interviewForm, setInterviewForm] = useState({
    date: '2026-09-08',
    time: '14:30',
    type: 'Video Call (Google Meet)',
    meetingLink: 'https://meet.google.com/ntr-hiring-round',
    interviewer: recruiter?.name || 'Recruiter Lead',
    notes: 'Technical discussion and architecture deep-dive.'
  });

  const allApplicants = recruiter?.applicants || recruiter?.applications || [];
  const allJobs = recruiter?.jobs || [];

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return allApplicants.filter((app) => {
      // Job filter
      if (selectedJobFilter !== 'ALL' && app.jobId !== selectedJobFilter) {
        return false;
      }

      // Status filter
      if (selectedStatusTab !== 'ALL') {
        if (selectedStatusTab === 'SCREENING' && !(app.status === 'UNDER_REVIEW' || app.status === 'SCREENING' || app.status === 'APPLIED')) {
          return false;
        }
        if (selectedStatusTab === 'SHORTLISTED' && app.status !== 'SHORTLISTED') {
          return false;
        }
        if (selectedStatusTab === 'INTERVIEW' && app.status !== 'INTERVIEW') {
          return false;
        }
        if (selectedStatusTab === 'SELECTED' && app.status !== 'SELECTED' && app.status !== 'HIRED') {
          return false;
        }
        if (selectedStatusTab === 'REJECTED' && app.status !== 'REJECTED') {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = app.candidateName?.toLowerCase().includes(q);
        const matchEmail = app.candidateEmail?.toLowerCase().includes(q);
        const matchRole = app.jobTitle?.toLowerCase().includes(q);
        const matchSkills = app.skills?.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchEmail && !matchRole && !matchSkills) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
      if (sortBy === 'oldest') return new Date(a.appliedDate) - new Date(b.appliedDate);
      return new Date(b.appliedDate) - new Date(a.appliedDate);
    });
  }, [allApplicants, selectedJobFilter, selectedStatusTab, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / PAGE_SIZE));

  const paginatedApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredApplicants.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredApplicants, currentPage]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const list = selectedJobFilter === 'ALL'
      ? allApplicants
      : allApplicants.filter(a => a.jobId === selectedJobFilter);

    return {
      all: list.length,
      screening: list.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'SCREENING' || a.status === 'APPLIED').length,
      shortlisted: list.filter(a => a.status === 'SHORTLISTED').length,
      interview: list.filter(a => a.status === 'INTERVIEW').length,
      selected: list.filter(a => a.status === 'SELECTED' || a.status === 'HIRED').length,
      rejected: list.filter(a => a.status === 'REJECTED').length,
    };
  }, [allApplicants, selectedJobFilter]);

  const handleOpenReview = (applicant) => {
    setSelectedApplicant(applicant);
    setIsReviewModalOpen(true);
  };

  const handleShortlist = (app) => {
    shortlistCandidate(app.id, app.jobId);
    addToast(`${app.candidateName} moved to Shortlisted candidates!`, 'success');
    if (selectedApplicant?.id === app.id) {
      setSelectedApplicant({ ...selectedApplicant, status: 'SHORTLISTED' });
    }
  };

  const handleReject = (app) => {
    rejectCandidate(app.id, app.jobId);
    addToast(`${app.candidateName} marked as Rejected.`, 'info');
    if (selectedApplicant?.id === app.id) {
      setSelectedApplicant({ ...selectedApplicant, status: 'REJECTED' });
    }
  };

  const handleOpenScheduleModal = (app) => {
    setInterviewTarget(app);
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

    addToast(`Interview scheduled with ${interviewTarget.candidateName}!`, 'success');
    setIsInterviewModalOpen(false);
    setInterviewTarget(null);
    if (selectedApplicant?.id === interviewTarget.id) {
      setSelectedApplicant({ ...selectedApplicant, status: 'INTERVIEW' });
    }
  };

  return (
    <div className="portal-page">
      {/* Header Banner */}
      <div className="portal-header-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: 0 }}>
            Job Applications
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review, screen, shortlist, and manage all applicants across your active job postings.
          </p>
        </div>
      </div>

      {/* Metric summary banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--color-primary-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Received</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gray-900)', marginTop: '0.25rem' }}>{tabCounts.all}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Screening</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.25rem' }}>{tabCounts.screening}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--color-primary-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shortlisted</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary-600)', marginTop: '0.25rem' }}>{tabCounts.shortlisted}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Interviews</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#8b5cf6', marginTop: '0.25rem' }}>{tabCounts.interview}</div>
        </div>
        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected / Hired</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>{tabCounts.selected}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', flex: '1 1 auto' }}>
            {/* Search box */}
            <div style={{ flex: '1 1 240px', minWidth: '200px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search by candidate name, email, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%', height: '42px', borderRadius: '8px' }}
              />
            </div>

            {/* Job Filter Dropdown */}
            <div style={{ width: '240px' }}>
              <select
                className="form-control"
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                style={{ height: '42px', borderRadius: '8px' }}
              >
                <option value="ALL">All Job Postings ({allApplicants.length})</option>
                {allJobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({allApplicants.filter(a => a.jobId === job.id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div style={{ width: '170px' }}>
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ height: '42px', borderRadius: '8px' }}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="match">Sort: Match Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderTop: '1px solid var(--color-gray-100)',
          paddingTop: '0.85rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'ALL', label: 'All Applications', count: tabCounts.all },
            { id: 'SCREENING', label: 'Screening', count: tabCounts.screening },
            { id: 'SHORTLISTED', label: 'Shortlisted', count: tabCounts.shortlisted },
            { id: 'INTERVIEW', label: 'Interview Scheduled', count: tabCounts.interview },
            { id: 'SELECTED', label: 'Selected', count: tabCounts.selected },
            { id: 'REJECTED', label: 'Rejected', count: tabCounts.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              style={{
                background: selectedStatusTab === tab.id ? 'var(--color-primary-50)' : 'transparent',
                color: selectedStatusTab === tab.id ? 'var(--color-primary-700)' : 'var(--color-gray-600)',
                fontWeight: selectedStatusTab === tab.id ? 600 : 500,
                border: selectedStatusTab === tab.id ? '1px solid var(--color-primary-200)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: selectedStatusTab === tab.id ? 'var(--color-primary-600)' : 'var(--color-gray-200)',
                color: selectedStatusTab === tab.id ? '#fff' : 'var(--color-gray-700)',
                fontSize: '0.75rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '10px',
                fontWeight: 600
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplicants.length === 0 ? (
        <EmptyState
          icon={<Users size={48} />}
          title="No applications match your criteria"
          description={
            searchQuery || selectedJobFilter !== 'ALL' || selectedStatusTab !== 'ALL'
              ? 'Try adjusting your search keywords, job filter, or status tab.'
              : 'You have not received applications yet for this view.'
          }
          action={
            (searchQuery || selectedJobFilter !== 'ALL' || selectedStatusTab !== 'ALL') ? (
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedJobFilter('ALL'); setSelectedStatusTab('ALL'); }}>
                Clear Filters
              </Button>
            ) : null
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paginatedApplicants.map((app) => {
            const isShortlisted = app.status === 'SHORTLISTED';
            const isInterview = app.status === 'INTERVIEW';
            const isRejected = app.status === 'REJECTED';
            const isSelected = app.status === 'SELECTED' || app.status === 'HIRED';

            return (
              <div
                key={app.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'box-shadow 0.2s ease',
                  border: isShortlisted ? '1px solid #c7d2fe' : '1px solid var(--color-gray-200)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  {/* Left: Avatar & Details */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-primary-600), #7c3aed)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {app.candidateName?.[0]?.toUpperCase() || 'C'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>
                          {app.candidateName}
                        </h3>
                        {app.matchScore && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: app.matchScore >= 90 ? '#ecfdf5' : '#eef2ff',
                            color: app.matchScore >= 90 ? '#059669' : 'var(--color-primary-700)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '12px',
                            border: `1px solid ${app.matchScore >= 90 ? '#a7f3d0' : '#c7d2fe'}`
                          }}>
                            <Sparkles size={12} />
                            {app.matchScore}% Match
                          </span>
                        )}
                        <StatusBadge status={app.status || 'UNDER_REVIEW'} />
                      </div>

                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-gray-600)', fontWeight: 500 }}>
                        Applied for: <span style={{ color: 'var(--color-primary-700)', fontWeight: 600 }}>{app.jobTitle}</span>
                      </p>

                      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Briefcase size={14} />
                          {app.experience || '3+ Years'} Experience
                        </span>
                        {app.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MapPin size={14} />
                            {app.location}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={14} />
                          Applied {app.appliedDate}
                        </span>
                        {app.noticePeriod && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            Notice: {app.noticePeriod}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={14} />}
                      onClick={() => handleOpenReview(app)}
                    >
                      Review
                    </Button>

                    {!isShortlisted && !isInterview && !isSelected && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Check size={14} />}
                        onClick={() => handleShortlist(app)}
                      >
                        Shortlist
                      </Button>
                    )}

                    {!isInterview && !isSelected && !isRejected && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<CalendarCheck size={14} />}
                        onClick={() => handleOpenScheduleModal(app)}
                      >
                        Schedule Interview
                      </Button>
                    )}

                    {!isRejected && !isSelected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ color: 'var(--color-danger-600)' }}
                        icon={<X size={14} />}
                        onClick={() => handleReject(app)}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>

                {/* Skills tags preview */}
                {app.skills && app.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--color-gray-100)' }}>
                    {app.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--color-gray-100)',
                          color: 'var(--color-gray-700)',
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredApplicants.length}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}

      {/* ================= Candidate Review Modal ================= */}
      {isReviewModalOpen && selectedApplicant && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title={`Applicant Review — ${selectedApplicant.candidateName}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header info */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              background: 'var(--color-primary-50)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-primary-100)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--color-primary-600)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 700
              }}>
                {selectedApplicant.candidateName?.[0]?.toUpperCase() || 'C'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                    {selectedApplicant.candidateName}
                  </h3>
                  {selectedApplicant.matchScore && (
                    <span style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      border: '1px solid #a7f3d0'
                    }}>
                      ⚡ {selectedApplicant.matchScore}% Match
                    </span>
                  )}
                  <StatusBadge status={selectedApplicant.status} />
                </div>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                  {selectedApplicant.candidateHeadline || `Candidate for ${selectedApplicant.jobTitle}`}
                </p>
              </div>
            </div>

            {/* Quick Contact & Details grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              background: 'var(--color-gray-50)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Email</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{selectedApplicant.candidateEmail || 'priya.sharma@example.com'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Phone</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{selectedApplicant.phone || '+91 98765 43210'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Location</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{selectedApplicant.location || 'Bengaluru, India'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Experience</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{selectedApplicant.experience || '4.2 Years'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Notice Period</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{selectedApplicant.noticePeriod || '30 Days'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Expected CTC</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{selectedApplicant.expectedSalary || '₹22.0 LPA'}</span>
              </div>
            </div>

            {/* Skills */}
            {selectedApplicant.skills && (
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '0.5rem' }}>
                  Core Competencies & Skills
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedApplicant.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'var(--color-primary-50)',
                        color: 'var(--color-primary-700)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--color-primary-100)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Note */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '0.35rem' }}>
                Applicant Cover Note
              </h4>
              <p style={{
                background: '#fff',
                border: '1px solid var(--color-gray-200)',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: 'var(--color-gray-700)',
                lineHeight: 1.5,
                margin: 0
              }}>
                {selectedApplicant.coverNote || 'I am excited to apply for this opening. With my hands-on background in frontend software design and delivery, I am confident I can make an immediate high-impact contribution to your team.'}
              </p>
            </div>

            {/* Resume Preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              border: '1px solid var(--color-gray-200)',
              borderRadius: '8px',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={28} color="var(--color-primary-600)" />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>
                    {selectedApplicant.resumeName || `${selectedApplicant.candidateName.replace(/\s+/g, '_')}_Resume.pdf`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Verified PDF • 1.4 MB</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<Download size={14} />}
                onClick={() => addToast('Downloading candidate resume...', 'info')}
              >
                Download Resume
              </Button>
            </div>

            {/* Modal Actions Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--color-gray-200)',
              paddingTop: '1rem',
              marginTop: '0.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <Button
                variant="outline"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Close
              </Button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedApplicant.status !== 'REJECTED' && (
                  <Button
                    variant="ghost"
                    style={{ color: 'var(--color-danger-600)' }}
                    icon={<X size={14} />}
                    onClick={() => handleReject(selectedApplicant)}
                  >
                    Reject
                  </Button>
                )}

                {selectedApplicant.status !== 'SHORTLISTED' && selectedApplicant.status !== 'INTERVIEW' && (
                  <Button
                    variant="secondary"
                    icon={<Check size={14} />}
                    onClick={() => handleShortlist(selectedApplicant)}
                  >
                    Shortlist
                  </Button>
                )}

                <Button
                  variant="primary"
                  icon={<CalendarCheck size={14} />}
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    handleOpenScheduleModal(selectedApplicant);
                  }}
                >
                  Schedule Interview
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= Schedule Interview Modal ================= */}
      {isInterviewModalOpen && interviewTarget && (
        <Modal
          isOpen={isInterviewModalOpen}
          onClose={() => { setIsInterviewModalOpen(false); setInterviewTarget(null); }}
          title={`Schedule Interview: ${interviewTarget.candidateName}`}
          size="md"
        >
          <form onSubmit={handleConfirmSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-primary-50)', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Job Role:</strong> {interviewTarget.jobTitle}
              <br />
              <strong>Candidate:</strong> {interviewTarget.candidateName} ({interviewTarget.candidateEmail})
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

            <FormField label="Interview Format / Medium" required>
              <Select
                value={interviewForm.type}
                onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
              >
                <option value="Video Call (Google Meet)">Video Call (Google Meet)</option>
                <option value="Video Call (Microsoft Teams)">Video Call (Microsoft Teams)</option>
                <option value="Video Call (Zoom)">Video Call (Zoom)</option>
                <option value="In-Person (Office Round)">In-Person (Office Round)</option>
                <option value="Telephonic Screening">Telephonic Screening</option>
              </Select>
            </FormField>

            <FormField label="Meeting Link / Location Address">
              <Input
                type="text"
                value={interviewForm.meetingLink}
                onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/xyz or Office address"
              />
            </FormField>

            <FormField label="Interviewer / Panel Name">
              <Input
                type="text"
                value={interviewForm.interviewer}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
              />
            </FormField>

            <FormField label="Notes / Agenda for Candidate">
              <Textarea
                rows={3}
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                placeholder="Details on topics to cover, technical task presentation, etc."
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
                Confirm & Send Invite
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
