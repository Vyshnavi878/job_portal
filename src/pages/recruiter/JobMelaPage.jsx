import { useState } from 'react';
import {
  CalendarDays, MapPin, Clock, Building2, Users, CheckCircle2,
  XCircle, Clock3, Plus, ArrowRight, UserCheck, Briefcase, Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOB_MELAS } from '../../data/mockData';

export default function RecruiterJobMelaPage() {
  const { toast } = useToast();

  // Employer's participation list
  const [events, setEvents] = useState([
    {
      ...MOCK_JOB_MELAS[0],
      participationStatus: 'APPROVED',
      boothNumber: 'Booth B-14 (Hall 3)',
      registeredCandidatesAtBooth: 142,
      spotInterviewsConducted: 38,
      spotOffersGiven: 8,
      showcasedPositions: ['Senior Frontend Engineer', 'Cloud Architect', 'Backend Developer'],
      candidatesQueue: [
        { id: '1', name: 'Priya Sharma', role: 'Senior Frontend Engineer', token: 'T-042', status: 'INTERVIEWED', match: '94%' },
        { id: '2', name: 'Kiran Rao', role: 'Cloud Architect', token: 'T-043', status: 'IN_QUEUE', match: '91%' },
        { id: '3', name: 'Deepak Varma', role: 'Backend Developer', token: 'T-044', status: 'OFFERED', match: '96%' },
        { id: '4', name: 'Ananya Deshmukh', role: 'Senior Frontend Engineer', token: 'T-045', status: 'IN_QUEUE', match: '88%' },
      ]
    },
    {
      ...MOCK_JOB_MELAS[1],
      participationStatus: 'PENDING',
      boothNumber: 'Allocating upon approval',
      registeredCandidatesAtBooth: 0,
      spotInterviewsConducted: 0,
      spotOffersGiven: 0,
      showcasedPositions: ['Data Platform Engineer', 'Full Stack Developer'],
      candidatesQueue: []
    }
  ]);

  // Request Participation Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    eventId: '3',
    eventName: 'Delhi NCR Mega Career Expo 2026',
    boothPreference: 'Standard 3x3m Premium Stall',
    hiringPositions: 'Senior Frontend Engineer, Backend Developer, QA Lead',
    expectedHires: '15',
    spocName: 'Rahul Mehta',
    spocPhone: '+91 80 4920 1000',
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: requestForm.eventId,
      title: requestForm.eventName,
      city: 'Delhi NCR',
      state: 'New Delhi',
      venue: 'Pragati Maidan, Hall 5',
      date: '2026-10-10',
      time: '09:00 AM - 06:00 PM IST',
      participationStatus: 'PENDING',
      boothNumber: 'Awaiting Admin Approval',
      registeredCandidatesAtBooth: 0,
      spotInterviewsConducted: 0,
      spotOffersGiven: 0,
      showcasedPositions: requestForm.hiringPositions.split(',').map(s => s.trim()),
      candidatesQueue: []
    };
    setEvents([...events, newEvent]);
    setRequestModalOpen(false);
    toast({
      type: 'success',
      title: 'Participation Requested',
      message: `Your request to join "${requestForm.eventName}" is under Admin review.`,
    });
  };

  return (
    <div className="recruiter-job-mela-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarDays size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Job Mela Employer Participation</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Participate in nationwide career drives, set up corporate booths, and conduct live spot hiring
            </p>
          </div>

          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setRequestModalOpen(true)}>
            Request Event Participation
          </Button>
        </div>
      </div>

      {/* Participating Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {events.map((event) => (
          <div
            key={event.id}
            className="card"
            style={{
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              border: event.participationStatus === 'APPROVED' ? '1px solid var(--color-success-300)' : '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Top Bar */}
            <div style={{
              background: event.participationStatus === 'APPROVED'
                ? 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'
                : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#ffffff',
              padding: 'var(--space-6) var(--space-8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                  <span className={`badge ${event.participationStatus === 'APPROVED' ? 'badge-success' : event.participationStatus === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                    Participation {event.participationStatus}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', opacity: 0.9 }}>{event.boothNumber}</span>
                </div>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: '#ffffff' }}>
                  {event.title}
                </h2>
              </div>

              <div style={{ textAlign: 'right', fontSize: 'var(--text-xs)', opacity: 0.9 }}>
                <p><strong>{new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></p>
                <p>{event.venue} ({event.city})</p>
              </div>
            </div>

            {/* Event Metrics / Status */}
            <div className="card-body" style={{ padding: 'var(--space-6) var(--space-8)' }}>
              {event.participationStatus === 'APPROVED' ? (
                <div>
                  {/* ── Spot Recruitment Metrics ── */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-200)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-800)', fontWeight: 600 }}>Candidates at Booth</span>
                      <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary-700)', marginTop: 2 }}>{event.registeredCandidatesAtBooth}</p>
                    </div>

                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-warning-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-warning-200)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning-800)', fontWeight: 600 }}>Spot Interviews Conducted</span>
                      <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-warning-700)', marginTop: 2 }}>{event.spotInterviewsConducted}</p>
                    </div>

                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-success-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-success-200)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-800)', fontWeight: 600 }}>Spot Offers Released</span>
                      <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-success-700)', marginTop: 2 }}>{event.spotOffersGiven}</p>
                    </div>
                  </div>

                  {/* ── Spot Interview Candidates Queue ── */}
                  <div>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                      Live Candidate Queue & Spot Evaluations ({event.candidatesQueue.length})
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {event.candidatesQueue.map((cand) => (
                        <div key={cand.id} style={{
                          padding: 'var(--space-3) var(--space-4)',
                          background: 'var(--color-gray-50)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-lg)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 'var(--space-3)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span style={{ padding: '2px 8px', background: 'var(--color-primary-600)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 800 }}>
                              {cand.token}
                            </span>
                            <div>
                              <strong style={{ fontSize: 'var(--text-sm)' }}>{cand.name}</strong>
                              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{cand.role} • Match: <span style={{ color: 'var(--color-success-600)', fontWeight: 700 }}>{cand.match}</span></p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span className={`badge ${cand.status === 'OFFERED' ? 'badge-success' : cand.status === 'INTERVIEWED' ? 'badge-info' : 'badge-warning'}`}>
                              {cand.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-warning-50)', border: '1px solid var(--color-warning-200)', borderRadius: 'var(--radius-xl)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <Clock3 size={24} style={{ color: 'var(--color-warning-600)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-warning-900)' }}>Participation Under Admin Verification</strong>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning-800)', marginTop: 2 }}>
                      Your company's application for stall allocation is being reviewed by the Mela organizing committee. Stall numbers and candidate dispatch will be unlocked once approved.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Request Event Participation Modal ── */}
      <Modal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request Job Mela Participation"
        size="md"
      >
        <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <FormField label="Target Career Expo / Job Mela" required>
            <Select
              options={['Delhi NCR Mega Career Expo 2026', 'Hyderabad Tech & Engineering Drive 2026', 'Pune IT & Core Engineering Mela 2026']}
              value={requestForm.eventName}
              onChange={(e) => setRequestForm({ ...requestForm, eventName: e.target.value })}
            />
          </FormField>

          <FormField label="Booth Stall Tier" required>
            <Select
              options={['Standard 3x3m Premium Stall (2 Interview Desks)', 'Corporate 6x3m Double Stall (4 Interview Desks)', 'Anchor Sponsor Pavilion']}
              value={requestForm.boothPreference}
              onChange={(e) => setRequestForm({ ...requestForm, boothPreference: e.target.value })}
            />
          </FormField>

          <FormField label="Hiring Positions to Showcase" required hint="Comma separated job titles">
            <Input
              value={requestForm.hiringPositions}
              onChange={(e) => setRequestForm({ ...requestForm, hiringPositions: e.target.value })}
              required
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField label="Target Spot Hires" required>
              <Input
                type="number"
                value={requestForm.expectedHires}
                onChange={(e) => setRequestForm({ ...requestForm, expectedHires: e.target.value })}
                required
              />
            </FormField>

            <FormField label="On-Site Lead Name" required>
              <Input
                value={requestForm.spocName}
                onChange={(e) => setRequestForm({ ...requestForm, spocName: e.target.value })}
                required
              />
            </FormField>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={() => setRequestModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Participation Request</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
