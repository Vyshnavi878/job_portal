import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Clock, Building2, QrCode, Download,
  CheckCircle2, ArrowRight, Sparkles, ExternalLink, Ticket
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOB_MELAS } from '../../data/mockData';

export default function CandidateJobMelaPage() {
  const { toast } = useToast();

  const [registeredEvents, setRegisteredEvents] = useState([
    {
      ...MOCK_JOB_MELAS[0],
      passId: 'PASS-BLR-892401',
      registeredOn: '21 Aug 2026',
      gateNumber: 'Gate 3 (Priority Fast-Track)',
      entryQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=JOBMELA-PRIYA-SHARMA-PASS-892401',
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

  return (
    <div className="candidate-job-mela-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <CalendarDays size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>My Registered Job Melas</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Access your digital entry badges, spot interview checklists, and event schedules
            </p>
          </div>

          <Link to="/job-melas">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Explore Upcoming Melas
            </Button>
          </Link>
        </div>
      </div>

      {/* Registered Events List */}
      {registeredEvents.length === 0 ? (
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)' }}>
          <EmptyState
            icon="default"
            title="No Registered Job Melas"
            description="You haven't registered for any career fair events yet. Browse upcoming nationwide job melas to book your free walk-in entry pass."
            action={
              <Link to="/job-melas">
                <Button variant="primary">Browse Job Melas</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {registeredEvents.map((event) => (
            <div
              key={event.id}
              className="card"
              style={{
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                border: '1px solid var(--color-primary-200)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {/* Top Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                color: '#fff',
                padding: 'var(--space-6) var(--space-8)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-3)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>
                      <CheckCircle2 size={12} style={{ marginRight: 4 }} /> Registration Confirmed
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', opacity: 0.85 }}>Pass ID: {event.passId}</span>
                  </div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: '#ffffff' }}>
                    {event.title}
                  </h2>
                </div>

                <Button
                  variant="secondary"
                  leftIcon={<Ticket size={16} />}
                  onClick={() => handleOpenPass(event)}
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  View Digital QR Pass
                </Button>
              </div>

              {/* Event Details Grid */}
              <div className="card-body" style={{ padding: 'var(--space-6) var(--space-8)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Date & Timings</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>
                      {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                    </strong>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{event.time}</p>
                  </div>

                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Venue Location</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{event.venue}</strong>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{event.city}, {event.state}</p>
                  </div>

                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Allocated Entry Point</span>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)' }}>{event.gateNumber}</strong>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Carry 10 printed resumes</p>
                  </div>
                </div>

                {/* Participating Companies at this Mela */}
                {event.participatingCompanies && (
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                      Key Participating Employers at this Mela ({event.participatingCompanies.length})
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                      {event.participatingCompanies.map((c) => (
                        <div key={c.id} style={{ padding: 'var(--space-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <Building2 size={16} style={{ color: 'var(--color-primary-600)' }} />
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>{c.name}</p>
                            <span style={{ fontSize: '10px', color: 'var(--color-success-700)' }}>{c.openJobs}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Digital QR Pass Modal ── */}
      {selectedPass && (
        <Modal
          open={passModalOpen}
          onClose={() => setPassModalOpen(false)}
          title="Fast-Track Entry Pass"
          size="sm"
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              background: '#ffffff',
              border: '2px dashed var(--color-primary-400)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              width: '100%',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="badge badge-success" style={{ marginBottom: 'var(--space-3)' }}>
                Authorized Entry Pass
              </span>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 2 }}>{selectedPass.title}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                Candidate: <strong>Priya Sharma</strong> • Pass ID: <strong>{selectedPass.passId}</strong>
              </p>

              {/* QR placeholder representation */}
              <div style={{
                width: 160,
                height: 160,
                background: 'var(--color-gray-100)',
                borderRadius: 'var(--radius-xl)',
                margin: '0 auto var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-border)'
              }}>
                <QrCode size={96} style={{ color: 'var(--color-primary-900)' }} />
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 4 }}>Scan at Entrance</span>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <strong>Venue:</strong> {selectedPass.venue}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 700, marginTop: 2 }}>
                {selectedPass.gateNumber}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
              <Button variant="secondary" fullWidth onClick={() => setPassModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" fullWidth leftIcon={<Download size={15} />} onClick={handleDownloadPass}>
                Download PDF Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
