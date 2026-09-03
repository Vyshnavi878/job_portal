/**
 * NotificationDropdown — popup panel shown when the bell icon is clicked.
 * Shows recent notifications with unread/read states, mark-read, and a link
 * to the full notifications page. Uses NotificationContext for state.
 */
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, X, Check, ArrowRight, Briefcase, CalendarDays,
  User, CheckCircle2, Info, Building2
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
  const { getNotifs, getUnreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const notifications = getNotifs(portal);
  const unreadCount = getUnreadCount(portal);
  const recentNotifs = notifications.slice(0, 6); // Show recent notifications

  const fullNotifsRoute = notifPageLink || `/${portal}/notifications`;

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

  const handleNotificationClick = (notif) => {
    markRead(portal, notif.id);
    if (notif.link) {
      setOpen(false);
      navigate(notif.link);
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell trigger button */}
      <button
        type="button"
        className="notif-btn"
        onClick={() => setOpen(v => !v)}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="true"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background var(--transition-fast), color var(--transition-fast)',
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            minWidth: 18,
            height: 18,
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-600)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            border: '2px solid var(--color-surface)',
            padding: '0 4px',
            boxShadow: 'var(--shadow-sm)'
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
              <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {unreadCount} New
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <Link
                to={fullNotifsRoute}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-primary-600)',
                  textDecoration: 'none',
                }}
              >
                See All
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Notification Items List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
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
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: 'var(--space-4) var(--space-5)',
                    borderBottom: '1px solid var(--color-gray-100)',
                    background: notif.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'flex-start',
                    transition: 'background var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = notif.read ? 'var(--color-gray-50)' : 'rgba(99, 102, 241, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)';
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        {!notif.read && (
                          <span style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'var(--color-primary-600)',
                            flexShrink: 0,
                          }} />
                        )}
                        <span>{notif.title}</span>
                      </p>
                    </div>

                    <p style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.4,
                      marginTop: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {notif.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{notif.time}</span>
                      {notif.link && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: 'var(--color-primary-600)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 2,
                        }}>
                          View <ArrowRight size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Mark all as read */}
          <div style={{
            padding: 'var(--space-3) var(--space-5)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-bg)',
          }}>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => markAllRead(portal)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-600)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 0',
                }}
              >
                <Check size={14} /> Mark all as read
              </button>
            ) : (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                All notifications read
              </span>
            )}

            <Link
              to={fullNotifsRoute}
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
              See All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
