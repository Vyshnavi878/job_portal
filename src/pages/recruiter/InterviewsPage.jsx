import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, Clock, Video, Phone, Building2, User,
  Plus, Search, CheckCircle2, XCircle, RefreshCw, Calendar,
  MoreVertical, ArrowRight, Eye, AlertCircle, Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import Pagination from '../../components/ui/Pagination';
import { useRecruiter } from '../../context/RecruiterContext';
import { useToast } from '../../context/ToastContext';

const PAGE_SIZE = 10;

export default function RecruiterInterviewsPage() {
  const {
    recruiter,
    scheduleInterview,
    rescheduleInterview,
    cancelInterview,
    updateInterviewStatus
  } = useRecruiter();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Reschedule Modal
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '', notes: '' });

  // Cancel Dialog
  const [cancelTarget, setCancelTarget] = useState(null);

  // New Interview Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    candidateName: '',
    candidateEmail: '',
    jobTitle: '',
    date: '2026-09-10',
    time: '14:00',
    type: 'Online (Google Meet)',
    interviewer: recruiter?.name || 'Recruiter Lead',
    meetingLink: 'https://meet.google.com/ntr-round',
    notes: 'Technical discussion & evaluation.',
  });

  const interviews = recruiter?.interviews || [];
  const jobs = recruiter?.jobs || [];

  const tabCounts = useMemo(() => ({
    all: interviews.length,
    scheduled: interviews.filter(i => i.status === 'SCHEDULED').length,
    completed: interviews.filter(i => i.status === 'COMPLETED').length,
    rescheduled: interviews.filter(i => i.status === 'RESCHEDULED').length,
    cancelled: interviews.filter(i => i.status === 'CANCELLED').length,
  }), [interviews]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.candidateName?.toLowerCase().includes(q);
        const matchJob = item.jobTitle?.toLowerCase().includes(q);
        const matchInterviewer = item.interviewer?.toLowerCase().includes(q);
        if (!matchName && !matchJob && !matchInterviewer) return false;
      }
      return true;
    });
  }, [interviews, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / PAGE_SIZE));

  const paginatedInterviews = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredInterviews.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredInterviews, currentPage]);

  const handleOpenReschedule = (item) => {
    setRescheduleTarget(item);
    setRescheduleForm({
      date: item.date || '',
      time: item.time || '',
      notes: item.notes || ''
    });
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleTarget) return;
    rescheduleInterview(rescheduleTarget.id, rescheduleForm.date, rescheduleForm.time, rescheduleForm.notes);
    addToast(`Interview with ${rescheduleTarget.candidateName} rescheduled to ${rescheduleForm.date} at ${rescheduleForm.time}.`, 'success');
    setRescheduleTarget(null);
  };

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    cancelInterview(cancelTarget.id);
    addToast(`Interview with ${cancelTarget.candidateName} has been cancelled.`, 'info');
    setCancelTarget(null);
  };

  const handleMarkCompleted = (item) => {
    updateInterviewStatus(item.id, 'COMPLETED');
    addToast(`Interview with ${item.candidateName} marked as Completed.`, 'success');
  };

  const handleCreateNewInterview = (e) => {
    e.preventDefault();
    if (!newForm.candidateName.trim() || !newForm.jobTitle.trim()) {
      addToast('Please fill all required interview details.', 'error');
      return;
    }

    scheduleInterview({
      ...newForm,
      jobId: jobs.find(j => j.title === newForm.jobTitle)?.id || 'job-custom',
    });

    addToast(`Interview scheduled with ${newForm.candidateName}!`, 'success');
    setIsNewModalOpen(false);
    setNewForm({
      candidateName: '',
      candidateEmail: '',
      jobTitle: '',
      date: '2026-09-10',
      time: '14:00',
      type: 'Online (Google Meet)',
      interviewer: recruiter?.name || 'Recruiter Lead',
      meetingLink: 'https://meet.google.com/ntr-round',
      notes: 'Technical evaluation round.',
    });
  };

  return (
    <div className="portal-page">
      {/* Header */}
      <div className="portal-header-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: 0 }}>
            Interview Schedule & Calendar
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Coordinate candidate rounds, join meeting links, and manage interview schedules.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setIsNewModalOpen(true)}>
          Schedule New Interview
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by candidate name, job title, or interviewer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%', height: '42px', borderRadius: '8px' }}
            />
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
            { id: 'ALL', label: 'All Interviews', count: tabCounts.all },
            { id: 'SCHEDULED', label: 'Upcoming / Scheduled', count: tabCounts.scheduled },
            { id: 'COMPLETED', label: 'Completed', count: tabCounts.completed },
            { id: 'RESCHEDULED', label: 'Rescheduled', count: tabCounts.rescheduled },
            { id: 'CANCELLED', label: 'Cancelled', count: tabCounts.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                background: statusFilter === tab.id ? 'var(--color-primary-50)' : 'transparent',
                color: statusFilter === tab.id ? 'var(--color-primary-700)' : 'var(--color-gray-600)',
                fontWeight: statusFilter === tab.id ? 600 : 500,
                border: statusFilter === tab.id ? '1px solid var(--color-primary-200)' : '1px solid transparent',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: statusFilter === tab.id ? 'var(--color-primary-600)' : 'var(--color-gray-200)',
                color: statusFilter === tab.id ? '#fff' : 'var(--color-gray-700)',
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

      {/* Interviews List */}
      {filteredInterviews.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={48} />}
          title="No interviews found"
          description="Schedule interviews directly from Shortlisted candidates or click the button above."
          action={
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => setIsNewModalOpen(true)}>
              Schedule New Interview
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paginatedInterviews.map((item) => {
            const isUpcoming = item.status === 'SCHEDULED' || item.status === 'RESCHEDULED';
            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  border: isUpcoming ? '1px solid #c7d2fe' : '1px solid var(--color-gray-200)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'var(--color-primary-600)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {item.candidateName?.[0]?.toUpperCase() || 'C'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>
                          {item.candidateName}
                        </h3>
                        <StatusBadge status={item.status} />
                      </div>

                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-primary-700)', fontWeight: 600 }}>
                        {item.jobTitle}
                      </p>

                      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.45rem', fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>
                          <Calendar size={14} color="var(--color-primary-600)" />
                          {item.date} at {item.time}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Video size={14} color="var(--color-gray-400)" />
                          {item.type || item.mode || 'Video Call'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <User size={14} color="var(--color-gray-400)" />
                          Interviewer: {item.interviewer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant="primary" size="sm" icon={<Video size={14} />}>
                          Join Meeting
                        </Button>
                      </a>
                    )}

                    {isUpcoming && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<CheckCircle2 size={14} />}
                          onClick={() => handleMarkCompleted(item)}
                        >
                          Mark Completed
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<RefreshCw size={14} />}
                          onClick={() => handleOpenReschedule(item)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ color: 'var(--color-danger-600)' }}
                          icon={<XCircle size={14} />}
                          onClick={() => setCancelTarget(item)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {item.notes && (
                  <div style={{
                    background: '#f8fafc',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--color-gray-600)',
                    borderLeft: '3px solid var(--color-primary-400)'
                  }}>
                    <strong>Notes:</strong> {item.notes}
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
              totalItems={filteredInterviews.length}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <Modal
          isOpen={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          title={`Reschedule Interview: ${rescheduleTarget.candidateName}`}
          size="md"
        >
          <form onSubmit={handleConfirmReschedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-primary-50)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Role:</strong> {rescheduleTarget.jobTitle}
              <br />
              <strong>Candidate:</strong> {rescheduleTarget.candidateName}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="New Date *" required>
                <Input
                  type="date"
                  value={rescheduleForm.date}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="New Time *" required>
                <Input
                  type="time"
                  value={rescheduleForm.time}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Reschedule Reason / Updated Agenda">
              <Textarea
                rows={3}
                value={rescheduleForm.notes}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })}
                placeholder="Reason for changing the slot..."
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setRescheduleTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Confirm Reschedule
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Confirm Dialog */}
      {cancelTarget && (
        <ConfirmDialog
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancel}
          title="Cancel Interview?"
          message={`Are you sure you want to cancel the interview with ${cancelTarget.candidateName} for the ${cancelTarget.jobTitle} role?`}
          confirmText="Yes, Cancel Interview"
          variant="danger"
        />
      )}

      {/* New Interview Modal */}
      {isNewModalOpen && (
        <Modal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          title="Schedule New Interview"
          size="md"
        >
          <form onSubmit={handleCreateNewInterview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormField label="Candidate Full Name *" required>
              <Input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={newForm.candidateName}
                onChange={(e) => setNewForm({ ...newForm, candidateName: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Candidate Email">
              <Input
                type="email"
                placeholder="candidate@example.com"
                value={newForm.candidateEmail}
                onChange={(e) => setNewForm({ ...newForm, candidateEmail: e.target.value })}
              />
            </FormField>

            <FormField label="Select Job Role *" required>
              <Select
                value={newForm.jobTitle}
                onChange={(e) => setNewForm({ ...newForm, jobTitle: e.target.value })}
                required
              >
                <option value="">Select a job position...</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.title}>{j.title}</option>
                ))}
              </Select>
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="Date *" required>
                <Input
                  type="date"
                  value={newForm.date}
                  onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Time *" required>
                <Input
                  type="time"
                  value={newForm.time}
                  onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Format / Medium">
              <Select
                value={newForm.type}
                onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
              >
                <option value="Online (Google Meet)">Online (Google Meet)</option>
                <option value="Online (Microsoft Teams)">Online (Microsoft Teams)</option>
                <option value="Online (Zoom)">Online (Zoom)</option>
                <option value="In-Person (Office Round)">In-Person (Office Round)</option>
                <option value="Telephonic Screening">Telephonic Screening</option>
              </Select>
            </FormField>

            <FormField label="Meeting Link / Venue">
              <Input
                type="text"
                value={newForm.meetingLink}
                onChange={(e) => setNewForm({ ...newForm, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/xyz"
              />
            </FormField>

            <FormField label="Interviewer Panel">
              <Input
                type="text"
                value={newForm.interviewer}
                onChange={(e) => setNewForm({ ...newForm, interviewer: e.target.value })}
              />
            </FormField>

            <FormField label="Agenda / Notes">
              <Textarea
                rows={2}
                value={newForm.notes}
                onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsNewModalOpen(false)}>
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
