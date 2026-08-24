import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Input from './Input';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * DatePicker UI component (no external library)
 * @param {string}   value      - ISO date string YYYY-MM-DD
 * @param {Function} onChange   - (isoDateString) => void
 * @param {string}   placeholder
 * @param {string}   minDate    - ISO date string
 * @param {string}   maxDate    - ISO date string
 */
export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  error,
  disabled,
  label,
}) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const daysInMonth   = getDaysInMonth(viewYear, viewMonth);
  const firstDayIndex = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDay = (day) => {
    const month = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const iso = `${viewYear}-${month}-${dayStr}`;

    if (minDate && iso < minDate) return;
    if (maxDate && iso > maxDate) return;

    onChange(iso);
    setOpen(false);
  };

  const clearDate = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const cells = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="date-picker" ref={ref}>
      <div className="input-wrapper" onClick={() => !disabled && setOpen((v) => !v)} style={{ cursor: 'pointer' }}>
        <span className="input-icon-left"><Calendar size={16} /></span>
        <input
          readOnly
          className={`input has-icon-left ${value ? 'has-icon-right' : ''} ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={displayValue}
          disabled={disabled}
          style={{ cursor: 'pointer' }}
        />
        {value && !disabled && (
          <button type="button" className="input-icon-right" onClick={clearDate} aria-label="Clear date">
            <X size={16} />
          </button>
        )}
      </div>

      {open && (
        <div className="date-picker-popup">
          {/* Header */}
          <div className="date-picker-header">
            <button type="button" className="date-picker-nav" onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>
            <span className="date-picker-month">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className="date-picker-nav" onClick={nextMonth} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day names */}
          <div className="date-picker-grid">
            {DAYS.map((d) => (
              <div key={d} className="date-picker-day-name">{d}</div>
            ))}
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const m = String(viewMonth + 1).padStart(2, '0');
              const dStr = String(day).padStart(2, '0');
              const iso = `${viewYear}-${m}-${dStr}`;
              const isSelected = value === iso;
              const isToday = iso === today.toISOString().slice(0, 10);
              const isDisabled = (minDate && iso < minDate) || (maxDate && iso > maxDate);

              return (
                <div
                  key={day}
                  className={[
                    'date-picker-day',
                    isSelected ? 'selected' : '',
                    isToday && !isSelected ? 'today' : '',
                    isDisabled ? 'disabled' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => !isDisabled && selectDay(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
