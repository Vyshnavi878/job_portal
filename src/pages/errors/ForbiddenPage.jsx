import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ForbiddenPage() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-6)',
      background: 'var(--color-bg)'
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(4rem, 10vw, 7rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1
      }}>
        403
      </div>

      <div style={{
        width: 60,
        height: 60,
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-danger-50)',
        color: 'var(--color-danger-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'var(--space-4) 0 var(--space-2)'
      }}>
        <Lock size={28} />
      </div>

      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-2)' }}>
        Access Forbidden
      </h1>

      <p style={{ color: 'var(--color-text-muted)', maxWidth: 460, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
        You do not have administrative or authorized permissions to view this resource. Please sign in with an authorized account or return to the homepage.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg" leftIcon={<Home size={18} />}>
            Back to Homepage
          </Button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="lg">
            Sign In with Another Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
