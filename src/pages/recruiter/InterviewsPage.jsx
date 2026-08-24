import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, Clock, Video, Phone, Building2, User,
  Plus, Search, CheckCircle2, XCircle, RefreshCw, Calendar,
  MoreVertical, ArrowRight, Eye, AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_INTERVIEWS = [
  {
    id: 'INT-501',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    jobTitle: 'Senior Frontend Engineer',
    date: '2026-08-28',
    time: '02:30 PM IST',
    mode: 'Online (Google Meet)',
    interviewer: 'Rahul Mehta (Tech Lead)',
    status: 'SCHEDULED',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Round 1: React 18 internals, component design system, and live coding.',
  },
  {
    id: 'INT-502',
    candidateName: 'Sneha Kulkarni',
    candidateEmail: 'sneha.kulkarni@example.com',
    jobTitle: 'UI/UX Product Designer',
    date: '2026-08-27',
    time: '11:00 AM IST',
    mode: 'Online (Zoom)',
    interviewer: 'Ananya Roy (Design Director)',
    status: 'SCHEDULED',
    meetingLink: 'https://zoom.us/j/987654321',
    notes: 'Portfolio walkthrough and Figma design challenge.',
  },
  {
    id: 'INT-503',
    candidateName: 'Vikram Patel',
    candidateEmail: 'vikram.patel@example.com',
    jobTitle: 'Cloud Security Architect',
    date: '2026-08-25',
    time: '04:00 PM IST',
    mode: 'Telephonic Screening',
    interviewer: 'Rahul Mehta (Tech Lead)',
    status: 'COMPLETED',
    meetingLink: '+91 98765 01234',
    notes: 'Cleared initial technical screening. Recommended for Hiring Manager round.',
  },
  {
    id: 'INT-504',
    candidateName: 'Amitav Ghosh',
    candidateEmail: 'amitav.ghosh@example.com',
    jobTitle: 'Staff Backend Engineer',
    date: '2026-08-29',
    time: '03:00 PM IST',
    mode: 'Online (Google Meet)',
    interviewer: 'Vikram Seth (VP Engineering)',
    status: 'RESCHEDULED',
    meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
    notes: 'Rescheduled from Aug 24 per candidate notice period alignment.',
  },
  {
    id: 'INT-505',
    candidateName: 'Rohan Verma',
    candidateEmail: 'rohan.verma@example.com',
    jobTitle: 'Junior QA Tester',
    date: '2026-08-20',
    time: '10:00 AM IST',
    mode: 'On-Site Office Round',
    interviewer: 'Pooja Nair (QA Lead)',
    status: 'CANCELLED',
    meetingLink: 'Bangalore Office - Room 302',
    notes: 'Candidate accepted competing offer.',
  },
];

export default function RecruiterInterviewsPage() {
  const { toast } = useToast();

  const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Reschedule Modal
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '', notes: '' });

  // Cancel Dialog
  const [cancelTarget, setCancelTarget] = useState(null);

  // New Interview Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    candidateEmail: '',
    jobTitle: 'Senior Frontend Engineer',
    date: '2026-08-30',
    time: '11:00 AM IST',
    mode: 'Online (Google Meet)',
    interviewer: 'Rahul Mehta (Tech Lead)',
    notes: '',
  });

  const filterTabs = [
    { key: 'ALL', label: 'All Interviews' },
    { key: 'SCHEDULED', label: 'Scheduled' },
    { key: 'RESCHEDULED', label: 'Rescheduled' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const filteredInterviews = useMemo(() => {
    return interviews.filter((int) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!int.candidateName.toLowerCase().includes(q) && !int.jobTitle.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && int.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [interviews, search, statusFilter]);

  const handleOpenReschedule = (item) => {
    setRescheduleTarget(item);
    setRescheduleForm({ date: item.date, time: item.time, notes: `Rescheduled from original date ${item.date}.` });
  };

  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleTarget) return;
    setInterviews(interviews.map(item => item.id === rescheduleTarget.id ? {
      ...item,
      date: rescheduleForm.date,
      time: rescheduleForm.time,
      status: 'RESCHEDULED',
      notes: rescheduleForm.notes
    } : item));
    toast({
      type: 'success',
      title: 'Interview Rescheduled',
      message: `Interview for ${rescheduleTarget.candidateName} updated to ${rescheduleForm.date} at ${rescheduleForm.time}.`,
    });
    setRescheduleTarget(null);
  };

  const handleCancelInterview = () => {
    if (!cancelTarget) return;
    setInterviews(interviews.map(item => item.id === cancelTarget.id ? { ...item, status: 'CANCELLED' } : item));
    toast({
      type: 'info',
      title: 'Interview Cancelled',
      message: `Interview with ${cancelTarget.candidateName} has been cancelled.`,
    });
    setCancelTarget(null);
  };

  const handleMarkCompleted = (item) => {
    setInterviews(interviews.map(i => i.id === item.id ? { ...i, status: 'COMPLETED' } : i));
    toast({
      type: 'success',
      title: 'Interview Completed',
      message: `Marked interview with ${item.candidateName} as Completed.`,
    });
  };

  const handleCreateInterview = (e) => {
    e.preventDefault();
    if (!newInterview.candidateName.trim()) return;
    const created = {
      id: `INT-${Math.floor(100 + Math.random() * 900)}`,
      ...newInterview,
      status: 'SCHEDULED',
      meetingLink: 'https://meet.google.com/new-scheduled-meet',
    };
    setInterviews([created, ...interviews]);
    setCreateModalOpen(false);
    toast({
      type: 'success',
      title: 'Interview Scheduled',
      message: `Scheduled new interview for ${created.candidateName}.`,
    });
  };

  return (
    <div className="recruiter-interviews-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarCheck size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Interview Management</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Coordinate video rounds, phone screenings, and technical panel evaluations
            </p>
          </div>

          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setCreateModalOpen(true)}>
            Schedule Interview
          </Button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-6)', overflowX: 'auto', paddingBottom: 4 }}>
          {filterTabs.map((tab) => {
            const count = tab.key === 'ALL' ? interviews.length : interviews.filter(i => i.status === tab.key).length;
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

      {/* Interviews Grid / Cards */}
      {filteredInterviews.length === 0 ? (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
          <EmptyState
            icon="default"
            title="No Interviews Found"
            description="No interviews match your selected status filter or search query."
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-6)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--space-4)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{item.candidateName}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>{item.jobTitle}</p>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', background: 'var(--color-gray-50)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--color-text)' }}>
                    <Calendar size={13} style={{ color: 'var(--color-primary-600)' }} />
                    {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })} at {item.time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Video size={13} /> {item.mode}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={13} /> Panel: {item.interviewer}
                  </span>
                </div>

                {item.notes && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {item.status === 'SCHEDULED' || item.status === 'RESCHEDULED' ? (
                  <>
                    <Button size="xs" variant="outline" onClick={() => handleOpenReschedule(item)}>
                      Reschedule
                    </Button>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Button size="xs" variant="secondary" onClick={() => handleMarkCompleted(item)}>
                        Mark Done
                      </Button>
                      <Button size="xs" variant="danger" onClick={() => setCancelTarget(item)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Status: {item.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Reschedule Modal ── */}
      {rescheduleTarget && (
        <Modal
          open={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          title={`Reschedule Interview: ${rescheduleTarget.candidateName}`}
          size="sm"
        >
          <form onSubmit={handleSaveReschedule} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label="New Date" required>
              <Input
                type="date"
                value={rescheduleForm.date}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                required
              />
            </FormField>

            <FormField label="New Time" required>
              <Input
                type="text"
                placeholder="e.g. 03:30 PM IST"
                value={rescheduleForm.time}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Reschedule Reason / Note">
              <Textarea
                rows={2}
                value={rescheduleForm.notes}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setRescheduleTarget(null)}>Close</Button>
              <Button type="submit" variant="primary">Confirm Reschedule</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Cancel Interview Dialog ── */}
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelInterview}
        title="Cancel Interview?"
        message={`Are you sure you want to cancel the interview scheduled with ${cancelTarget?.candidateName}? An automated cancellation alert will be sent to the candidate.`}
        confirmText="Yes, Cancel Interview"
        danger
      />

      {/* ── Schedule New Interview Modal ── */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Schedule Direct Interview"
        size="md"
      >
        <form onSubmit={handleCreateInterview} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <FormField label="Candidate Name" required>
            <Input
              placeholder="e.g. Priya Sharma"
              value={newInterview.candidateName}
              onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Candidate Email" required>
            <Input
              type="email"
              placeholder="candidate@example.com"
              value={newInterview.candidateEmail}
              onChange={(e) => setNewInterview({ ...newInterview, candidateEmail: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Job Position" required>
            <Input
              value={newInterview.jobTitle}
              onChange={(e) => setNewInterview({ ...newInterview, jobTitle: e.target.value })}
              required
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField label="Interview Date" required>
              <Input
                type="date"
                value={newInterview.date}
                onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Interview Time" required>
              <Input
                value={newInterview.time}
                onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Mode" required>
            <Select
              options={['Online (Google Meet)', 'Online (MS Teams)', 'Online (Zoom)', 'Telephonic Screening', 'On-Site Office Round']}
              value={newInterview.mode}
              onChange={(e) => setNewInterview({ ...newInterview, mode: e.target.value })}
            />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Schedule Interview</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
