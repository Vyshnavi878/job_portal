import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Lock, Eye, EyeOff, Building2, User, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/FormControls';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleTab, setRoleTab] = useState('candidate'); // 'candidate' | 'recruiter'

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        type: 'info',
        title: 'Authentication Simulation',
        message: `Signed in as ${roleTab}. Backend auth will be integrated in future phases.`,
      });
    }, 1000);
  };

  return (
    <div className="auth-layout">
      {/* Left branding panel */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12)',
        color: '#fff',
      }} className="hide-mobile">
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.95)', borderRadius: 'var(--radius-2xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 30px rgba(0,0,0,0.3)', padding: 12 }}>
              <img src="/title_logo.png" alt="NTR Vikasa Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#fff' }}>Welcome To </span>
            <span style={{ color: '#F59E0B' }}>NTR </span>
            <span style={{ color: '#60A5FA' }}>VIKASA </span>
            <span style={{ color: '#fff' }}>Job Portal</span>
          </h2>
          <p style={{ opacity: 0.85, lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-base)', color: '#cbd5e1' }}>
            Your all-in-one portal for full-time jobs, paid internships, and nationwide Job Melas.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
            {[{ v: '52,000+', l: 'Active Jobs' }, { v: '14,000+', l: 'Verified Companies' }, { v: '2,80,000+', l: 'Candidates' }, { v: '96.4%', l: 'Placement Rate' }].map((s) => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
                <p style={{ fontWeight: 800, fontSize: 'var(--text-2xl)', color: '#e0e7ff' }}>{s.v}</p>
                <p style={{ opacity: 0.8, fontSize: 'var(--text-xs)', marginTop: 2, color: '#94a3b8' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--space-6)', position: 'relative' }}>
        
        {/* Back to Home Link */}
        <div style={{ position: 'absolute', top: 24, right: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Home
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile Logo */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <Link to="/" className="logo" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/logo_image.png" alt="NTR Vikasa Logo" style={{ height: '48px', objectFit: 'contain' }} />
            </Link>
          </div>

          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)', textAlign: 'center' }}>
            Sign in to JobConnect
          </h1>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
            Select your account type to proceed:
          </p>

          {/* Role selector tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--color-gray-100)',
            padding: 4,
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-6)'
          }}>
            <button
              type="button"
              onClick={() => setRoleTab('candidate')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                background: roleTab === 'candidate' ? 'var(--color-surface)' : 'transparent',
                color: roleTab === 'candidate' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                boxShadow: roleTab === 'candidate' ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <User size={16} /> Candidate
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('recruiter')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                background: roleTab === 'recruiter' ? 'var(--color-surface)' : 'transparent',
                color: roleTab === 'recruiter' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                boxShadow: roleTab === 'recruiter' ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Building2 size={16} /> Recruiter
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <FormField label={`${roleTab === 'recruiter' ? 'Work Email' : 'Email Address'}`} htmlFor="email" required>
              <Input
                id="email"
                type="email"
                placeholder={roleTab === 'recruiter' ? 'hr@company.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                required
              />
            </FormField>

            <FormField label="Password" htmlFor="password" required>
              <Input
                id="password"
                type="password"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox
                id="remember"
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Sign In as {roleTab === 'recruiter' ? 'Recruiter' : 'Candidate'}
            </Button>
          </form>

          {/* Registration Options Box */}
          <div style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--color-gray-50)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              New to JobConnect? Create an account:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              <Link to="/register/candidate" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm" fullWidth leftIcon={<User size={14} />}>
                  Candidate Sign Up
                </Button>
              </Link>
              <Link to="/register/recruiter" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm" fullWidth leftIcon={<Building2 size={14} />}>
                  Recruiter Sign Up
                </Button>
              </Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: 'var(--space-6)' }}>
            By continuing, you accept our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
