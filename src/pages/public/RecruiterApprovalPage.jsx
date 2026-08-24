import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ShieldCheck, Mail, Phone, Home, ArrowRight, Building2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';

export default function RecruiterApprovalPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 'var(--space-8) var(--space-4)'
    }}>
      <div style={{ width: '100%', maxWidth: 580, textAlign: 'center' }}>
        {/* Logo */}
        <Link to="/" className="logo" style={{ justifyContent: 'center', display: 'inline-flex', marginBottom: 'var(--space-6)', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo_image.png" alt="NTR Vikasa Logo" style={{ height: '48px', objectFit: 'contain' }} />
        </Link>

        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
          {/* Status Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            borderBottom: '1px solid var(--color-warning-200)',
            padding: 'var(--space-8) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-warning-100)',
              color: 'var(--color-warning-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--color-warning-200)'
            }}>
              <Clock size={32} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <StatusBadge status="PENDING" size="lg" />
            </div>

            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-warning-900)' }}>
              Registration Under Admin Review
            </h1>
          </div>

          <div className="card-body" style={{ padding: 'var(--space-8)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
              Thank you for submitting your employer application. Your company credentials and verification documents have been received successfully.
            </p>

            <div style={{
              background: 'var(--color-gray-50)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)' }}>
                What happens next?
              </h2>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  1
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  <strong>Manual Verification:</strong> The JobConnect compliance team will verify your Certificate of Incorporation and authorized ID within <strong>1–2 business days</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  2
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  <strong>Activation Email:</strong> You will receive an official approval email with your recruiter portal login credentials once approved.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  3
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  <strong>Login Access:</strong> Please note that Recruiter Portal login is available <em>only after formal Admin approval</em>.
                </p>
              </div>
            </div>

            {/* Support info */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <span>Need expedited approval?</span>
              <a href="mailto:employers@jobconnect.example.com" style={{ color: 'var(--color-primary-600)', textDecoration: 'none', fontWeight: 600 }}>
                employers@jobconnect.example.com
              </a>
            </div>

            {/* Demo Workflow Simulation box */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-accent-50))',
              border: '1px dashed var(--color-primary-300)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-primary-600)' }} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary-800)', textTransform: 'uppercase' }}>
                  Interactive Workflow Sequence:
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                You can inspect this pending request in the <strong>Admin Portal</strong> or simulate immediate approval to access the <strong>Recruiter Dashboard</strong>.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 4 }}>
                <Link to="/admin/recruiters/requests" style={{ flex: 1 }}>
                  <Button size="xs" variant="outline" fullWidth>
                    Inspect Admin Queue
                  </Button>
                </Link>
                <Link to="/recruiter/dashboard" style={{ flex: 1 }}>
                  <Button size="xs" variant="primary" fullWidth rightIcon={<ArrowRight size={12} />}>
                    Enter Recruiter Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Link to="/" style={{ flex: 1, textDecoration: 'none' }}>
                <Button variant="secondary" fullWidth leftIcon={<Home size={16} />}>
                  Back to Homepage
                </Button>
              </Link>
              <Link to="/login" style={{ flex: 1, textDecoration: 'none' }}>
                <Button variant="outline" fullWidth rightIcon={<ArrowRight size={16} />}>
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
