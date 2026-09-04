import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Clock, Building2, QrCode, Download,
  CheckCircle2, ArrowRight, Sparkles, ExternalLink, Ticket, Users, X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { useCandidate } from '../../context/CandidateContext';
import { MOCK_JOB_MELAS } from '../../data/mockData';

export default function CandidateJobMelaPage() {
  const { toast } = useToast();
  const { candidate } = useCandidate();

  const [registeredEvents, setRegisteredEvents] = useState([
    {
      ...MOCK_JOB_MELAS[0],
      passId: `PASS-AP-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredOn: '21 Aug 2026',
      gateNumber: 'Gate 3 (Priority Fast-Track)',
      entryQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=JOBMELA-PASS',
    },
  ]);

  const [selectedPass, setSelectedPass] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);

  const handleOpenPass = (event) => {
    setSelectedPass(event);
    setPassModalOpen(true);
  };

  const handleDownloadPass = () => {
    toast({
      type: 'success',
      title: 'Pass Downloaded',
      message: 'Your Digital QR Entry Pass has been downloaded as PDF.',
    });
  };

  const handleRegisterEvent = (event) => {
    if (registeredEvents.some(e => e.id === event.id)) {
      toast({ type: 'info', title: 'Already Registered', message: 'You already have an active entry pass for this event.' });
      return;
    }

    const newPass = {
      ...event,
      passId: `PASS-AP-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredOn: 'Today',
      gateNumber: 'Gate 2 (General Fast-Track)',
      entryQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=JOBMELA-PASS',
    };

    setRegisteredEvents([newPass, ...registeredEvents]);
    setSelectedPass(newPass);
    setPassModalOpen(true);

    toast({
      type: 'success',
      title: 'Registration Confirmed! 🎉',
      message: `Your fast-track entry pass for ${event.title} is ready.`,
    });
  };

  return (
    <div className="candidate-job-mela-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* ── Header ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarDays size={20} style={{ color: '#c7d2fe' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#ffffff' }}>Mega Job Melas & Walk-in Drives</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: '#cbd5e1' }}>
              Free fast-track entry passes, digital QR check-in badges, and spot interviews for {candidate.name}
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 1: Registered Event Passes ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <Ticket size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
            My Registered Event Passes ({registeredEvents.length})
          </h2>
        </div>

        {registeredEvents.length === 0 ? (
          <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)' }}>
            <EmptyState
              icon="default"
              title="No Registered Job Melas"
              description="Register for upcoming career fairs below to book your free digital walk-in pass."
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {registeredEvents.map((event) => (
              <div
                key={event.id}
                className="card"
                style={{
                  borderRadius: 'var(--radius-2xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-primary-200)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Top Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
                  color: '#fff',
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                      <span className="badge badge-success" style={{ fontSize: '10px' }}>
                        <CheckCircle2 size={11} style={{ marginRight: 2 }} /> Registration Confirmed
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Pass ID: {event.passId}</span>
                    </div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#ffffff' }}>
                      {event.title}
                    </h3>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Ticket size={15} />}
                    onClick={() => handleOpenPass(event)}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    View Digital QR Pass
                  </Button>
                </div>

                {/* Event Details Grid */}
                <div className="card-body" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Date & Timings</span>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>{event.date}</strong>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{event.time}</p>
                    </div>

                    <div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Venue Location</span>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>{event.venue}</strong>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{event.city}, Andhra Pradesh</p>
                    </div>

                    <div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Allocated Entry Point</span>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)' }}>{event.gateNumber}</strong>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Carry 5 printed copies of resume</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2: All Upcoming Job Melas ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <CalendarDays size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>
            Upcoming Job Melas Across Andhra Pradesh
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
          {MOCK_JOB_MELAS.map((mela) => {
            const isRegistered = registeredEvents.some(e => e.id === mela.id);
            return (
              <div
                key={mela.id}
                className="card card-hoverable"
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                      {mela.status || 'Registration Open'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-text)' }}>
                    {mela.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-3) 0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalendarDays size={13} /> {mela.date} ({mela.time})</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {mela.venue}, {mela.city}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={13} /> {mela.companies || '45+'} Participating Employers</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={13} /> {mela.seats || '1,200+'} Spot Opportunities</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-3)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-success-700)', fontWeight: 700 }}>
                    Free Walk-in Entry
                  </span>

                  {isRegistered ? (
                    <Button size="sm" variant="outline" leftIcon={<CheckCircle2 size={13} />} disabled>
                      Registered
                    </Button>
                  ) : (
                    <Button size="sm" variant="primary" onClick={() => handleRegisterEvent(mela)}>
                      Register Free Pass
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Digital QR Pass Modal ── */}
      {selectedPass && passModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-4)', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)'
          }}
          onClick={() => setPassModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%', maxWidth: 460,
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              background: '#ffffff',
              border: '2px dashed var(--color-primary-400)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-4)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="badge badge-success" style={{ marginBottom: 'var(--space-3)' }}>
                Official Fast-Track Entry Pass
              </span>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 2 }}>{selectedPass.title}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Candidate: <strong>{candidate.name}</strong> • Pass ID: <strong>{selectedPass.passId}</strong>
              </p>

              {/* QR placeholder */}
              <div style={{
                width: 140, height: 140,
                background: 'var(--color-gray-100)',
                borderRadius: 'var(--radius-xl)',
                margin: '0 auto var(--space-4)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--color-border)'
              }}>
                <QrCode size={80} style={{ color: 'var(--color-primary-900)' }} />
                <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginTop: 2 }}>Scan at Entrance</span>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <strong>Venue:</strong> {selectedPass.venue}, {selectedPass.city}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 700, marginTop: 2 }}>
                {selectedPass.gateNumber}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="secondary" fullWidth onClick={() => setPassModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" fullWidth leftIcon={<Download size={14} />} onClick={handleDownloadPass}>
                Download PDF Pass
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
