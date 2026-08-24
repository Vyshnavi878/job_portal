/**
 * StubPage — placeholder component for routes not yet implemented.
 * Replace this with actual implementation during feature development.
 */
export default function StubPage({ title, icon, description }) {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-6)',
    }}>
      {icon && (
        <div style={{
          width: 80, height: 80,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary-500)',
          fontSize: 36,
          marginBottom: 'var(--space-6)',
        }}>
          {icon}
        </div>
      )}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 700,
        color: 'var(--color-text)',
        marginBottom: 'var(--space-3)',
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-text-muted)',
        maxWidth: 480,
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-2)',
      }}>
        {description || 'This page is under construction. Full implementation will be added in the next phase.'}
      </p>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-4)',
        background: 'var(--color-gray-100)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        marginTop: 'var(--space-4)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-warning-500)' }} />
        Coming Soon — UI Foundation Phase
      </div>
    </div>
  );
}
