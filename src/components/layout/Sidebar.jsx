import { NavLink, Link } from 'react-router-dom';
import { Briefcase, X } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

/**
 * Sidebar — reusable portal sidebar
 * @param {Array}  navItems  - [{ label, href, icon, badge, section }]
 * @param {Object} user      - { name, role, avatar }
 * @param {Array}  footerItems - bottom nav items (settings, logout)
 */
export default function Sidebar({ navItems = [], user, footerItems = [], portalName }) {
  const { isOpen, close } = useSidebar();

  // Group nav items by section
  const sections = navItems.reduce((acc, item) => {
    const key = item.section || '';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Sidebar navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/" className="logo" style={{ flex: 1, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo_image.png" alt="NTR Vikasa Logo" style={{ height: '32px', objectFit: 'contain' }} />
          </Link>
          {/* Mobile close button */}
          <button
            className="sidebar-close-btn hide-desktop"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label={`${portalName || ''} navigation`}>
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} className={items.length > 0 && items.every(i => i.hideOnMobile) ? 'hide-mobile' : ''}>
              {section && (
                <p className="sidebar-section-title">{section}</p>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : ''}${item.hideOnMobile ? ' hide-mobile' : ''}${item.className ? ` ${item.className}` : ''}`
                  }
                  onClick={close}
                  aria-label={item.label}
                >
                  {item.icon && (
                    <span className="sidebar-item-icon">{item.icon}</span>
                  )}
                  <span className="sidebar-item-label">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="sidebar-item-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {(footerItems.length > 0 || user) && (
          <div className="sidebar-footer">
            {footerItems.map((item) => (
              <NavLink
                key={item.href || item.label}
                to={item.href || '#'}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
                onClick={(e) => { item.onClick && (e.preventDefault(), item.onClick()); close(); }}
              >
                {item.icon && <span className="sidebar-item-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </NavLink>
            ))}
            {user && (
              <div className="sidebar-user">
                <div className="sidebar-user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    user.name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                  <p className="sidebar-user-role">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
