import { useEffect, useCallback } from 'react';
import {
  X, Briefcase, Building2, MapPin, DollarSign, Calendar,
  FileText, CheckCircle2, QrCode, User, Mail, Phone,
  Layers, ShieldCheck, Ticket, Sparkles, Clock, ArrowRight
} from 'lucide-react';
import Button from './Button';
import { StatusBadge } from './Badge';

/**
 * ApplicationDetailsModal
 * Comprehensive modal displaying all application, job, job mela, and candidate details.
 * Shared between My Applications and Job Melas pages to eliminate duplicate logic.
 */
export default function ApplicationDetailsModal({
  isOpen,
  open,
  onClose,
  application,
  candidate,
  onViewTimeline
}) {
  const isModalOpen = isOpen !== undefined ? isOpen : open;

  // Handle Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, handleKeyDown]);

  if (!isModalOpen || !application) return null;

  const isMela = Boolean(
    application.melaId ||
    application.applicationType === 'Job Mela Application' ||
    (application.appNumber && application.appNumber.startsWith('NTR-')) ||
    (application.appId && application.appId.startsWith('NTR-'))
  );

  const appNumber = application.appNumber || application.appId || (isMela ? 'NTR-01-02-0024' : 'APP-000124');
  const appType = application.applicationType || (isMela ? 'Job Mela Application' : 'Direct Job Application');
  const appliedDate = application.appliedDate || application.appliedAt || '02 Sept 2026';
  const currentStatus = application.status || 'APPLIED';

  // Candidate details fallback from props
  const candidateName = candidate?.name || application.candidateName || 'Priya Sharma';
  const candidateEmail = candidate?.email || application.candidateEmail || 'priya.sharma@example.com';
  const candidatePhone = candidate?.phone || application.candidatePhone || '+91 98765 43210';
  const candidateLocation = candidate?.location || application.location || 'Visakhapatnam, Andhra Pradesh';
  const candidateResume = application.resumeName || candidate?.resume?.fileName || 'Verified_Candidate_Resume.pdf';
  const candidateSkills = candidate?.skillsPreferences?.skills
    ? candidate.skillsPreferences.skills.slice(0, 8).join(', ')
    : 'React.js, TypeScript, JavaScript, HTML5/CSS3, REST APIs';
  const candidateEducation = candidate?.skillsPreferences?.educationLevel ||
    candidate?.educationList?.[0]?.degree ||
    "Bachelor's Degree (B.Tech - CSE)";
  const candidateExperience = candidate?.skillsPreferences?.experience ||
    candidate?.experienceList?.[0]?.duration ||
    '4+ Years Experience';

  // Status progress stages
  const stages = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'SCREENING', label: 'Screening' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Selected' },
  ];

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

  const activeStageIdx = getStageIndex(currentStatus);

  return (
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
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-details-modal-title"
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-2xl)',
          width: '100%',
          maxWidth: 680,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Briefcase size={18} style={{ color: 'var(--color-primary-600)' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Application Details
              </span>
            </div>
            <h2 id="app-details-modal-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.3 }}>
              {application.title || application.role}
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {application.company || application.companyName} • {application.location || 'Andhra Pradesh'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-md)'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          
          {/* ── 1. Application Information Header Card ── */}
          <div style={{
            background: isMela ? 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)' : 'var(--color-gray-50)',
            border: isMela ? '1.5px solid var(--color-primary-200)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>
                  Application No:
                </span>
                <span style={{
                  fontSize: '13px',
                  fontFamily: 'monospace, monospace',
                  fontWeight: 800,
                  color: isMela ? 'var(--color-primary-700)' : 'var(--color-text)'
                }}>
                  {appNumber}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>
                  Application Type:
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isMela ? 'var(--color-primary-700)' : 'var(--color-text-muted)',
                  background: isMela ? 'var(--color-primary-50)' : 'var(--color-gray-200)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-block'
                }}>
                  {appType}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>
                  Applied Date:
                </span>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                  {appliedDate}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: 2 }}>
                  Current Status:
                </span>
                <StatusBadge status={currentStatus} />
              </div>
            </div>
          </div>

          {/* ── 2. Recruitment Status Workflow Bar ── */}
          <div style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-3)' }}>
              Recruitment Progress
            </span>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {stages.map((stage, idx) => {
                const isCompleted = idx <= activeStageIdx && currentStatus !== 'REJECTED';
                const isCurrent = idx === activeStageIdx;
                return (
                  <div
                    key={stage.key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 1,
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: isCompleted
                        ? 'var(--color-primary-600)'
                        : 'var(--color-gray-200)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginBottom: 4,
                      boxShadow: isCurrent ? '0 0 0 3px var(--color-primary-100)' : 'none'
                    }}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: isCurrent ? 800 : 600,
                      color: isCurrent
                        ? 'var(--color-primary-700)'
                        : isCompleted
                          ? 'var(--color-text)'
                          : 'var(--color-text-muted)'
                    }}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. Job Information Card ── */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <Building2 size={16} style={{ color: 'var(--color-primary-600)' }} />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>Job Details</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Job Role</span>
                <strong>{application.title || application.role}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Company</span>
                <strong style={{ color: 'var(--color-primary-600)' }}>{application.company || application.companyName}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Location</span>
                <span>{application.location || 'Visakhapatnam'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Salary Range</span>
                <span style={{ color: 'var(--color-success-700)', fontWeight: 700 }}>{application.salary || 'Competitive / As per industry standards'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Employment Type</span>
                <span>{application.type || 'Full-time'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Work Mode</span>
                <span>{application.mode || (isMela ? 'On-site / Walk-in' : 'Hybrid')}</span>
              </div>

              {application.jobId && (
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Job ID</span>
                  <span style={{ fontFamily: 'monospace, monospace' }}>JOB-{application.jobId}</span>
                </div>
              )}

              {application.postedDate && (
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Posted Date</span>
                  <span>{application.postedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── 4. Job Mela Information (ONLY for Job Mela Applications) ── */}
          {isMela && (
            <div style={{
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
              border: '1.5px solid var(--color-primary-300)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Ticket size={16} style={{ color: 'var(--color-primary-600)' }} />
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary-900)' }}>
                  Job Mela Event Information
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Job Mela</span>
                  <strong>{application.melaTitle || application.melaName || 'AP Mega IT & ITES Job Mela 2026'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Event No</span>
                  <span style={{ fontFamily: 'monospace, monospace', fontWeight: 700 }}>
                    {application.eventNumber || '01'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Event Date</span>
                  <span>{application.melaDate || '28 Sept 2026 (09:00 AM - 05:30 PM)'}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Venue</span>
                  <span>{application.melaVenue || 'AU Convention Center, Beach Road, Visakhapatnam'}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Participating Company</span>
                  <strong>{application.company || application.companyName}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Company No</span>
                  <span style={{ fontFamily: 'monospace, monospace', fontWeight: 700 }}>
                    {application.companySequence || '02'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Application Sequence</span>
                  <span style={{ fontFamily: 'monospace, monospace', fontWeight: 700 }}>
                    {application.applicationSequence || '0024'}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Application Reference</span>
                  <strong style={{ fontFamily: 'monospace, monospace', color: 'var(--color-primary-700)' }}>
                    {appNumber}
                  </strong>
                </div>

                {(application.passId || true) && (
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Job Mela Pass Ref</span>
                    <span style={{ fontFamily: 'monospace, monospace', fontWeight: 700, color: 'var(--color-primary-600)' }}>
                      {application.passId || 'PASS-AP-849201'}
                    </span>
                  </div>
                )}

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Registration Status</span>
                  <span style={{ color: 'var(--color-success-700)', fontWeight: 700 }}>
                    {application.passStatus || 'Confirmed / Active QR Entry Pass'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. Candidate Information ── */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <User size={16} style={{ color: 'var(--color-primary-600)' }} />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>Submitted Candidate Information</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Full Name</span>
                <strong>{candidateName}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Email</span>
                <span>{candidateEmail}</span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Phone</span>
                <span>{candidatePhone}</span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Location</span>
                <span>{candidateLocation}</span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Submitted Resume</span>
                <span style={{ color: 'var(--color-primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FileText size={12} /> {candidateResume}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Education</span>
                <span>{candidateEducation}</span>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px', marginBottom: 2 }}>Relevant Skills</span>
                <span>{candidateSkills}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-bg)'
        }}>
          <div>
            {onViewTimeline && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose?.();
                  onViewTimeline(application);
                }}
              >
                View Recruitment Timeline
              </Button>
            )}
          </div>

          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
