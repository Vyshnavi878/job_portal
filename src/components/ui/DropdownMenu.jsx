import { useState, useRef, useEffect, cloneElement } from 'react';

/**
 * DropdownMenu component
 * @param {ReactNode} trigger - the trigger element (button/icon)
 * @param {Array}     items   - [{ label, icon, onClick, danger, divider, disabled }]
 * @param {string}    align   - 'right' | 'left'
 */
export function DropdownMenu({ trigger, items = [], align = 'right', children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <div onClick={() => setOpen((v) => !v)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      {open && (
        <div
          className="dropdown-menu"
          style={{ [align === 'left' ? 'left' : 'right']: 0, [align === 'left' ? 'right' : 'left']: 'auto' }}
          role="menu"
        >
          {children
            ? children
            : items.map((item, idx) => {
                if (item.divider) {
                  return <div key={idx} className="dropdown-divider" />;
                }
                if (item.header) {
                  return <div key={idx} className="dropdown-header">{item.header}</div>;
                }
                return (
                  <button
                    key={idx}
                    className={`dropdown-item ${item.danger ? 'danger' : ''}`}
                    role="menuitem"
                    onClick={() => { item.onClick?.(); setOpen(false); }}
                    disabled={item.disabled}
                  >
                    {item.icon && <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>}
                    {item.label}
                  </button>
                );
              })}
        </div>
      )}
    </div>
  );
}

/** Standalone dropdown item for use with children pattern */
export function DropdownItem({ children, onClick, danger, disabled, icon, as: As = 'button', href, ...props }) {
  return (
    <As
      className={`dropdown-item ${danger ? 'danger' : ''}`}
      onClick={onClick}
      disabled={disabled}
      href={href}
      {...props}
    >
      {icon && <span style={{ display: 'flex', flexShrink: 0 }}>{icon}</span>}
      {children}
    </As>
  );
}
