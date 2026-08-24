import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
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
        background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-700))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1
      }}>
        404
      </div>

      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 'var(--space-4) 0 var(--space-2)' }}>
        Page Not Found
      </h1>

      <p style={{ color: 'var(--color-text-muted)', maxWidth: 460, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg" leftIcon={<Home size={18} />}>
            Back to Homepage
          </Button>
        </Link>
        <Link to="/jobs" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="lg" leftIcon={<Search size={18} />}>
            Browse Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
}
