import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

/**
 * MultiSelect component
 * @param {Array}    options  - [{ value, label }] or ['string']
 * @param {Array}    value    - array of selected values
 * @param {Function} onChange - (newValues) => void
 * @param {string}   placeholder
 * @param {boolean}  disabled
 */
export default function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  error,
  maxSelected,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const normalizedOptions = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const filtered = normalizedOptions.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (optValue) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      onChange([...value, optValue]);
    }
  };

  const removeTag = (optValue, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  const selectedLabels = value.map((v) => {
    const opt = normalizedOptions.find((o) => o.value === v);
    return opt ? opt.label : v;
  });

  return (
    <div className="multi-select" ref={ref}>
      <div
        className={`multi-select-trigger ${open ? 'open' : ''} ${error ? 'input-error' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setOpen((v) => !v); } }}
      >
        {value.length === 0 && (
          <span className="multi-select-placeholder">{placeholder}</span>
        )}
        {value.map((v, i) => (
          <span key={v} className="multi-select-tag">
            {selectedLabels[i]}
            <X size={10} className="multi-select-tag-remove" onClick={(e) => removeTag(v, e)} />
          </span>
        ))}
        <ChevronDown size={16} style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--color-text-muted)' }} />
      </div>

      {open && (
        <div className="multi-select-dropdown" role="listbox" aria-multiselectable="true">
          {options.length > 5 && (
            <div style={{ padding: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
              <input
                className="input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No options found
            </div>
          ) : (
            filtered.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`multi-select-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleOption(opt.value)}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: `1.5px solid ${isSelected ? 'var(--color-primary-600)' : 'var(--color-border-2)'}`,
                    background: isSelected ? 'var(--color-primary-600)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isSelected && <Check size={10} color="#fff" />}
                  </div>
                  {opt.label}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
