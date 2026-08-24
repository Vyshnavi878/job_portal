import { forwardRef } from 'react';

/**
 * Textarea component
 */
const Textarea = forwardRef(function Textarea({
  error,
  success,
  rows = 4,
  className = '',
  ...props
}, ref) {
  const stateClass = error ? 'input-error' : success ? 'input-success' : '';
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={['textarea', stateClass, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
});

export default Textarea;
