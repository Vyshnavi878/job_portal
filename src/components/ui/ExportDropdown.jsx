import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import Button from './Button';

/**
 * ExportDropdown — Reusable Admin Export Button and Dropdown Menu
 *
 * @param {Object} props
 * @param {Function} [props.onExportExcel] - Handler for Excel (.xlsx) export
 * @param {Function} [props.onExportPdf] - Handler for PDF (.pdf) export
 * @param {Array} [props.items] - Optional custom dropdown items [{ label, icon, onClick }]
 * @param {boolean} [props.disabled] - Whether the export button is disabled
 * @param {boolean} [props.loading] - Whether an export is currently processing
 * @param {string} [props.align] - 'right' | 'left'
 * @param {string} [props.size] - 'sm' | 'md'
 * @param {string} [props.variant] - 'outline' | 'secondary' | 'primary'
 * @param {string} [props.label] - Trigger button label (default 'Export')
 */
export default function ExportDropdown({
  onExportExcel,
  onExportPdf,
  items,
  disabled = false,
  loading = false,
  align = 'right',
  size = 'sm',
  variant = 'outline',
  label = 'Export'
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultItems = [
    {
      label: 'Excel (.xlsx)',
      icon: <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />,
      onClick: () => {
        onExportExcel?.();
      }
    },
    {
      label: 'PDF (.pdf)',
      icon: <FileText size={15} style={{ color: '#dc2626' }} />,
      onClick: () => {
        onExportPdf?.();
      }
    }
  ];

  const menuItems = items && items.length > 0 ? items : defaultItems;

  return (
    <div className="export-dropdown-wrapper" ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={() => setOpen((prev) => !prev)}
        leftIcon={loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        rightIcon={
          <ChevronDown
            size={13}
            style={{
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 150ms ease'
            }}
          />
        }
        style={{
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }}
      >
        {loading ? 'Exporting...' : label}
      </Button>

      {open && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align === 'left' ? 'left' : 'right']: 0,
            minWidth: 200,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            padding: 'var(--space-1)',
            zIndex: 150,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="dropdown-item"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '8px 12px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-text)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                border: 'none',
                background: 'transparent',
                width: '100%',
                transition: 'background 150ms ease'
              }}
            >
              {item.icon && <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>}
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
