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
import { useRecruiter } from '../../context/RecruiterContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterJobMelaPage() {
  const { recruiter, registerJobMela } = useRecruiter();
  const { addToast } = useToast();

  const events = recruiter?.jobMelas || [];

  // Request Participation Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: 'Visakhapatnam IT & FinTech Job Fair 2026',
    date: '2026-10-18',
    venue: 'Andhra University Convention Hall, Vizag',
    positions: 'React Engineers, Cloud Specialists, Python Devs',
    expectedHires: '20',
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    registerJobMela({
      title: requestForm.title,
      date: requestForm.date,
      venue: requestForm.venue,
      status: 'PENDING',
      boothNumber: 'Awaiting Admin Allocation',
      candidatesCount: 0,
      interviewsCount: 0,
    });
    setRequestModalOpen(false);
    addToast(`Registration requested for "${requestForm.title}". Status: PENDING.`, 'success');
  };

  return (
    <div className="portal-page">
      {/* Header */}
      <div className="portal-header-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: 0 }}>
            NTR Vikasa Job Melas Participation
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Participate in government & district mega career drives, allocate corporate booths, and conduct spot hiring.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setRequestModalOpen(true)}>
          Register for Job Mela
        </Button>
      </div>

      {/* Events List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {events.map((event) => (
          <div
            key={event.id}
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-2xl)',
              border: event.status === 'APPROVED' ? '1px solid #c7d2fe' : '1px solid var(--color-gray-200)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                    {event.title}
                  </h2>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: event.status === 'APPROVED' ? '#ecfdf5' : '#fffbeb',
                    color: event.status === 'APPROVED' ? '#059669' : '#d97706',
                    border: `1px solid ${event.status === 'APPROVED' ? '#a7f3d0' : '#fde68a'}`
                  }}>
                    {event.status === 'APPROVED' ? '✓ Registered & Approved' : '⏳ Registration Pending Approval'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-gray-600)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CalendarDays size={16} color="var(--color-primary-600)" />
                    {event.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={16} color="var(--color-gray-400)" />
                    {event.venue}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--color-primary-800)' }}>
                    <Building2 size={16} color="var(--color-primary-600)" />
                    {event.boothNumber}
                  </span>
                </div>
              </div>

              {/* Event Metrics Box */}
              <div style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>{event.candidatesCount || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Registered</div>
                </div>
                <div style={{ width: '1px', height: '28px', background: 'var(--color-gray-200)', alignSelf: 'center' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-600)' }}>{event.interviewsCount || 0}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Spot Interviews</div>
                </div>
              </div>
            </div>

            {/* Live Queue Preview */}
            <div style={{ background: 'var(--color-gray-50)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                  Live Booth Queue & Screening
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Updated live during event</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>
                Candidates walking up to <strong>{event.boothNumber}</strong> will scan QR codes to enter your digital screening pipeline directly.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Register Modal */}
      {requestModalOpen && (
        <Modal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          title="Register for Upcoming NTR Vikasa Job Mela"
          size="md"
        >
          <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormField label="Job Mela Event *" required>
              <Select
                value={requestForm.title}
                onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
              >
                <option value="Visakhapatnam IT & FinTech Job Fair 2026">Visakhapatnam IT & FinTech Job Fair 2026</option>
                <option value="Tirupati Rayalaseema Mega Employment Drive">Tirupati Rayalaseema Mega Employment Drive</option>
                <option value="Guntur & Amaravati Skills & Tech Expo">Guntur & Amaravati Skills & Tech Expo</option>
              </Select>
            </FormField>

            <FormField label="Openings / Positions for Hiring">
              <Input
                type="text"
                placeholder="e.g. React Engineers, Cloud Specialists, Python Devs"
                value={requestForm.positions}
                onChange={(e) => setRequestForm({ ...requestForm, positions: e.target.value })}
              />
            </FormField>

            <FormField label="Target Hires Count">
              <Input
                type="number"
                min="1"
                max="200"
                value={requestForm.expectedHires}
                onChange={(e) => setRequestForm({ ...requestForm, expectedHires: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Participation Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
