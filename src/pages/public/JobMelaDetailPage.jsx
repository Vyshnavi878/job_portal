import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Clock, Building2, Users, CheckCircle2,
  AlertCircle, Share2, Sparkles, Send, ShieldCheck, FileText,
  Mail, Phone, Info, Award
} from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import FileUpload from '../../components/ui/FileUpload';
import { useToast } from '../../context/ToastContext';
import { MOCK_JOB_MELAS } from '../../data/mockData';

export default function JobMelaDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Form inputs
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [qualification, setQualification] = useState("Bachelor's Degree (B.Tech, B.E, B.Sc, B.Com, BCA)");
  const [experience, setExperience] = useState('Fresher (0-1 yr)');

  const mela = useMemo(() => {
    return MOCK_JOB_MELAS.find((m) => m.id === id) || MOCK_JOB_MELAS[0];
  }, [id]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRegistered(true);
      setRegisterModalOpen(false);
      toast({
        type: 'success',
        title: 'Registration Successful!',
        message: `You are registered for ${mela.title}. Your Fast-Track Entry QR Code has been generated.`,
      });
    }, 1200);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        type: 'info',
        title: 'Link Copied',
        message: 'Job Mela event link copied to clipboard!',
      });
    }
  };

  const isRegistrationOpen = mela.status === 'REGISTRATION_OPEN' || mela.status === 'UPCOMING';

  return (
    <div className="job-mela-detail-page" style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Job Melas', href: '/job-melas' }, { label: mela.title }]} />
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="responsive-split-detail">

          {/* ── Left Main Content Column ── */}
          <div>
            {/* Header Event Card */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
                color: '#ffffff',
                padding: 'var(--space-8)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                      <StatusBadge status={mela.status} />
                      <span style={{ fontSize: 'var(--text-xs)', opacity: 0.85, color: '#e0e7ff' }}>
                        Reg. Deadline: {new Date(mela.registrationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, lineHeight: 1.2, color: '#ffffff' }}>
                      {mela.title}
                    </h1>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    leftIcon={<Share2 size={16} />}
                    onClick={handleShare}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                    aria-label="Share Event"
                  />
                </div>
              </div>

              {/* Event Metadata Bar */}
              <div className="card-body" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-xl)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Event Date & Duration</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                        {new Date(mela.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-xl)', background: 'var(--color-info-50)', color: 'var(--color-info-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Timings</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{mela.time}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-xl)', background: 'var(--color-warning-50)', color: 'var(--color-warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Location & Venue</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{mela.city}, {mela.state}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-xl)', background: 'var(--color-success-50)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Participating Companies</p>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{mela.companiesCount}+ Companies</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    <strong>Full Venue Address:</strong> {mela.venue}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header"><h2 className="card-title">About this Job Mela</h2></div>
              <div className="card-body">
                <p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text)' }}>
                  {mela.description}
                </p>
              </div>
            </div>

            {/* Candidate Eligibility & Instructions */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header"><h2 className="card-title">Eligibility & Instructions</h2></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {mela.eligibility && (
                  <div style={{ background: 'var(--color-info-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-info-200)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-info-700)', textTransform: 'uppercase', marginBottom: 2 }}>
                      Eligible Candidates
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                      {mela.eligibility}
                    </p>
                  </div>
                )}

                {mela.instructions && (
                  <div>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                      Important Instructions for Attendees:
                    </h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {mela.instructions.map((inst, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', fontSize: 'var(--text-sm)' }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--color-primary-600)', flexShrink: 0, marginTop: 2 }} />
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Participating Companies */}
            {mela.participatingCompanies && mela.participatingCompanies.length > 0 && (
              <div className="card" style={{ marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-2xl)' }}>
                <div className="card-header">
                  <h2 className="card-title">Featured Participating Employers</h2>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                    {mela.participatingCompanies.map((c, idx) => (
                      <div key={idx} style={{
                        padding: 'var(--space-4)',
                        background: 'var(--color-gray-50)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {c.name?.[0]}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{c.name}</p>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)', fontWeight: 600 }}>{c.openJobs}</span>
                          </div>
                        </div>
                        {c.roles && (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                            {c.roles.map((r) => (
                              <span key={r} style={{ fontSize: '10px', background: 'var(--color-gray-200)', padding: '2px 6px', borderRadius: 4 }}>
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Available Jobs on the Spot */}
            {mela.availableJobs && mela.availableJobs.length > 0 && (
              <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
                <div className="card-header">
                  <h2 className="card-title">Spot Hiring Openings at the Event</h2>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  {mela.availableJobs.map((job, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--space-4) var(--space-6)',
                      borderBottom: idx < mela.availableJobs.length - 1 ? '1px solid var(--color-gray-100)' : 'none',
                      flexWrap: 'wrap',
                      gap: 'var(--space-2)'
                    }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{job.title}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {job.company} • {job.vacancies} open slots
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-600)' }}>
                          {job.salary}
                        </span>
                        <span className="badge badge-success" style={{ fontSize: '10px' }}>Walk-in</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky Right Column: Registration Card ── */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="card-body" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Registered Candidates</p>
                  <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary-600)' }}>
                    {mela.registeredCount || 2400}+ / {mela.seats || 5000} Seats
                  </p>
                  <div style={{ height: 6, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden', margin: 'var(--space-2) 0' }}>
                    <div style={{ width: `${Math.min(100, Math.round(((mela.registeredCount || 2400) / (mela.seats || 5000)) * 100))}%`, height: '100%', background: 'var(--color-primary-600)' }} />
                  </div>
                </div>

                {isRegistered ? (
                  <div style={{
                    background: 'var(--color-success-50)',
                    border: '1px solid var(--color-success-200)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <CheckCircle2 size={28} style={{ color: 'var(--color-success-600)' }} />
                    <p style={{ fontWeight: 700, color: 'var(--color-success-700)', fontSize: 'var(--text-sm)' }}>
                      You are Registered!
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success-700)' }}>
                      Fast-Track Entry Pass issued.
                    </p>
                    <Link to="/candidate/job-mela" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                      <Button variant="primary" size="sm" fullWidth>
                        View Digital Pass & QR Code
                      </Button>
                    </Link>
                  </div>
                ) : isRegistrationOpen ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setRegisterModalOpen(true)}
                    style={{ marginBottom: 'var(--space-3)' }}
                  >
                    Register for Free Entry
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" fullWidth disabled style={{ marginBottom: 'var(--space-3)' }}>
                    Registration Closed
                  </Button>
                )}

                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Entry Fee:</span>
                    <strong style={{ color: 'var(--color-success-600)' }}>100% FREE</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Pass Type:</span>
                    <strong>Digital QR Badge</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Contact Info */}
            <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
              <div className="card-header"><h3 className="card-title" style={{ fontSize: 'var(--text-sm)' }}>Event Helpline</h3></div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                {mela.contactEmail && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={13} style={{ color: 'var(--color-primary-600)' }} />
                    <a href={`mailto:${mela.contactEmail}`} style={{ color: 'var(--color-primary-600)', textDecoration: 'none' }}>{mela.contactEmail}</a>
                  </span>
                )}
                {mela.contactPhone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={13} style={{ color: 'var(--color-primary-600)' }} />
                    <span>{mela.contactPhone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Register Modal */}
      <Modal open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} title={`Register: ${mela.title}`} size="md">
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Free registration for walk-in interviews at <strong>{mela.venue}</strong>.
          </p>

          <FormField label="Full Name" htmlFor="candName" required>
            <Input id="candName" placeholder="Priya Sharma" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} required />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Email" htmlFor="candEmail" required>
              <Input id="candEmail" type="email" placeholder="priya@example.com" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} required />
            </FormField>
            <FormField label="Mobile Number" htmlFor="candPhone" required>
              <Input id="candPhone" type="tel" placeholder="+91 98765 43210" value={candidatePhone} onChange={(e) => setCandidatePhone(e.target.value)} required />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <FormField label="Highest Qualification" required>
              <select className="select" value={qualification} onChange={(e) => setQualification(e.target.value)}>
                <option>Diploma / Vocational</option>
                <option>Bachelor's Degree (B.Tech, B.E, B.Sc, B.Com, BCA)</option>
                <option>Master's Degree (M.Tech, MBA, MCA, M.Sc)</option>
                <option>Doctorate / Ph.D</option>
              </select>
            </FormField>
            <FormField label="Work Experience" required>
              <select className="select" value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option>Fresher (0-1 yr)</option>
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>
            </FormField>
          </div>

          <FormField label="Upload Resume (Optional)" hint="Carrying 10 printed copies to the venue is mandatory">
            <FileUpload accept=".pdf,.doc,.docx" maxSize="5 MB" />
          </FormField>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button variant="secondary" type="button" onClick={() => setRegisterModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={isSubmitting} leftIcon={<Send size={16} />}>Confirm Free Registration</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
