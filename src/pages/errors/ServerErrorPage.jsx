import { Link } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ServerErrorPage() {
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
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1
      }}>
        500
      </div>

      <div style={{
        width: 60,
        height: 60,
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-warning-50)',
        color: 'var(--color-warning-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'var(--space-4) 0 var(--space-2)'
      }}>
        <AlertTriangle size={28} />
      </div>

      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 'var(--space-2) 0 var(--space-2)' }}>
        Internal Server Error
      </h1>

      <p style={{ color: 'var(--color-text-muted)', maxWidth: 460, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
        Something went wrong on our servers. Our technical operations team has been notified automatically and is investigating the issue.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<RotateCcw size={18} />}
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="lg" leftIcon={<Home size={18} />}>
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
