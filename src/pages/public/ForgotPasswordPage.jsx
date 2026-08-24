import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Briefcase, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: 'var(--space-6)' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <Link to="/" className="logo" style={{ justifyContent: 'center', display: 'inline-flex', marginBottom: 'var(--space-8)' }}>
          <div className="logo-icon"><Briefcase size={18} /></div>
          <span className="logo-text">Job<span>Connect</span></span>
        </Link>

        {sent ? (
          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', background: 'var(--color-success-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-500)' }}>
                <CheckCircle2 size={32} />
              </div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Check your email</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" style={{ width: '100%' }}>
                <Button variant="primary" fullWidth>Back to Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Forgot your password?</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <FormField label="Email address" htmlFor="email" required>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail size={16} />} required />
                </FormField>
                <Button type="submit" variant="primary" fullWidth loading={loading}>Send Reset Link</Button>
              </form>
            </div>
            <div className="card-footer" style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
