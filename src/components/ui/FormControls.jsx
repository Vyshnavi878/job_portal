/**
 * Checkbox component
 */
export function Checkbox({ label, id, error, className = '', ...props }) {
  return (
    <label className={`checkbox-wrapper ${className}`} htmlFor={id}>
      <input type="checkbox" id={id} {...props} />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
}

/**
 * Radio component
 */
export function Radio({ label, id, className = '', ...props }) {
  return (
    <label className={`radio-wrapper ${className}`} htmlFor={id}>
      <input type="radio" id={id} {...props} />
      {label && <span className="radio-label">{label}</span>}
    </label>
  );
}

/**
 * RadioGroup component
 */
export function RadioGroup({ options = [], name, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {options.map((opt) => {
        const optValue = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        return (
          <Radio
            key={optValue}
            id={`${name}-${optValue}`}
            name={name}
            value={optValue}
            label={optLabel}
            checked={value === optValue}
            onChange={() => onChange(optValue)}
          />
        );
      })}
    </div>
  );
}

/**
 * Toggle component
 */
export function Toggle({ label, checked = false, onChange, disabled = false, id }) {
  return (
    <div
      className="toggle-wrapper"
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && onChange(!checked); } }}
      id={id}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div className={`toggle-track ${checked ? 'active' : ''}`}>
        <div className="toggle-thumb" />
      </div>
      {label && <span className="toggle-label">{label}</span>}
    </div>
  );
}
