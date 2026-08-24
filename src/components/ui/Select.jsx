import { forwardRef } from 'react';

/**
 * Select / Dropdown component
 */
const Select = forwardRef(function Select({
  options = [],
  placeholder = 'Select an option',
  error,
  className = '',
  ...props
}, ref) {
  const stateClass = error ? 'input-error' : '';
  return (
    <select
      ref={ref}
      className={['select', stateClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => {
        const value = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const disabled = typeof opt === 'object' ? opt.disabled : false;
        return (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        );
      })}
    </select>
  );
});

export default Select;
