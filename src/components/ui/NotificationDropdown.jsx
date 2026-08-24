/**
 * NotificationDropdown — popup panel shown when the bell icon is clicked.
 * Shows recent notifications with read/unread states, mark-read, and a link
 * to the full notifications page.  Uses NotificationContext for state.
 */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, X, Check, ArrowRight, Briefcase, CalendarDays,
  User, AlertTriangle, CheckCircle2, Info, Building2
} from 'lucide-react';
import { useNotifications, NOTIF_CATEGORY } from '../../context/NotificationContext';

// Category icon mapping
function CategoryIcon({ category, size = 16 }) {
  const cat = NOTIF_CATEGORY[category] || NOTIF_CATEGORY.SYSTEM;
  const icons = {
    APPLICATION:  <Briefcase size={size} />,
    SHORTLIST:    <CheckCircle2 size={size} />,
    INTERVIEW:    <CalendarDays size={size} />,
    OFFER:        <CheckCircle2 size={size} />,
    REJECTION:    <X size={size} />,
    JOB_MELA:     <CalendarDays size={size} />,
    JOB_APPROVAL: <CheckCircle2 size={size} />,
    ACCOUNT:      <User size={size} />,
    SYSTEM:       <Info size={size} />,
    RECRUITER:    <Building2 size={size} />,
    COMPANY:      <Building2 size={size} />,
  };
  return (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: cat.bg,
      color: cat.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icons[category] || <Info size={size} />}
    </div>
  );
}

export default function NotificationDropdown({ portal = 'candidate', notifPageLink }) {
  const { getNotifs, getUnreadCount, markRead, markAllRead, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = getNotifs(portal);
  const unreadCount = getUnreadCount(portal);
  const recentNotifs = notifications.slice(0, 5); // Show up to 5 in dropdown

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell trigger */}
      <button
        type="button"
        className="notif-btn"
        onClick={() => setOpen(v => !v)}
        aria-label={`${unreadCount} unread notifications`}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background var(--transition-fast), color var(--transition-fast)',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: unreadCount > 9 ? 18 : 16,
            height: 16,
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-600)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            border: '2px solid var(--color-surface)',
            minWidth: 16,
            padding: '0 2px',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: 380,
          maxWidth: 'calc(100vw - 24px)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Bell size={16} style={{ color: 'var(--color-primary-600)' }} />
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  background: 'var(--color-primary-600)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {unreadCount} New
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead(portal)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary-600)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {recentNotifs.length === 0 ? (
              <div style={{
                padding: 'var(--space-10)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
              }}>
                <Bell size={32} style={{ margin: '0 auto var(--space-3)', opacity: 0.3, display: 'block' }} />
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>All caught up!</p>
                <p style={{ fontSize: 'var(--text-xs)' }}>No notifications right now.</p>
              </div>
            ) : (
              recentNotifs.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: 'var(--space-4) var(--space-5)',
                    borderBottom: '1px solid var(--color-gray-100)',
                    background: notif.read ? 'transparent' : 'var(--color-primary-50)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'flex-start',
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                >
                  <CategoryIcon category={notif.category} size={15} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <p style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: notif.read ? 500 : 700,
                        color: 'var(--color-text)',
                        lineHeight: 1.4,
                        flex: 1,
                      }}>
                        {notif.title}
                        {!notif.read && (
                          <span style={{
                            display: 'inline-block',
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'var(--color-primary-600)',
                            marginLeft: 6,
                            verticalAlign: 'middle',
                            flexShrink: 0,
                          }} />
                        )}
                      </p>
                    </div>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.4,
                      marginTop: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {notif.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{notif.time}</span>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {notif.link && (
                          <Link
                            to={notif.link}
                            onClick={() => { markRead(portal, notif.id); setOpen(false); }}
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: 'var(--color-primary-600)',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            View <ArrowRight size={10} />
                          </Link>
                        )}
                        {!notif.read && (
                          <button
                            type="button"
                            onClick={() => markRead(portal, notif.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '10px',
                              color: 'var(--color-text-muted)',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                            title="Mark as read"
                          >
                            <Check size={11} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => dismiss(portal, notif.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '10px',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                          title="Dismiss"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: 'var(--space-3) var(--space-5)',
              borderTop: '1px solid var(--color-border)',
              textAlign: 'center',
            }}>
              <Link
                to={notifPageLink || `/${portal}/notifications`}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-primary-600)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                View all {notifications.length} notifications <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
