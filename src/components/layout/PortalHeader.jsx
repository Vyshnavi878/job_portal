import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, User, Settings, LogOut, LayoutDashboard, Briefcase, Search, FileText, Building2 } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import Breadcrumb from '../ui/Breadcrumb';
import { DropdownMenu } from '../ui/DropdownMenu';
import NotificationDropdown from '../ui/NotificationDropdown';
import { useCandidate } from '../../context/CandidateContext';
import { useRecruiter } from '../../context/RecruiterContext';

/**
 * PortalHeader — sticky header for all portal layouts.
 * Notification count is driven by NotificationContext (via NotificationDropdown).
 *
 * @param {string}   title      - current page title
 * @param {Array}    breadcrumb - breadcrumb items [{ label, href }]
 * @param {Object}   user       - { name, role, email }
 * @param {ReactNode} actions   - right-side action buttons
 */
export default function PortalHeader({ title, breadcrumb, user, actions }) {
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: logoutCandidate } = useCandidate();
  const { logoutRecruiter } = useRecruiter();

  const isCandidate = location.pathname.startsWith('/candidate');
  const isRecruiter = location.pathname.startsWith('/recruiter');
  const isAdmin     = location.pathname.startsWith('/admin');

  const portal = isCandidate ? 'candidate' : isRecruiter ? 'recruiter' : 'admin';

  const notifLink = isCandidate
    ? '/candidate/notifications'
    : isRecruiter
    ? '/recruiter/notifications'
    : '/admin/notifications';

  const handleLogout = () => {
    if (isCandidate) {
      logoutCandidate();
    } else if (isRecruiter) {
      logoutRecruiter();
    }
    navigate('/login');
  };

  // Candidate Dropdown (Candidate Name, Candidate, Dashboard, Logout)
  const candidateMenuItems = [
    { label: `${user?.name || 'Candidate'} (Candidate)`, header: `${user?.name || 'Candidate'} (Candidate)` },
    { label: 'Dashboard', icon: <LayoutDashboard size={15} />, onClick: () => navigate('/candidate/dashboard') },
    { divider: true },
    { label: 'Log Out', icon: <LogOut size={15} />, danger: true, onClick: handleLogout },
  ];

  // Recruiter Dropdown in Portal Header (ONLY 3 actions: Company Profile, Settings, Log Out)
  const recruiterMenuItems = [
    {
      header: (
        <div>
          <strong style={{ display: 'block', color: 'var(--color-gray-900)', fontSize: '13px' }}>{user?.name || 'Arjun Reddy'}</strong>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 500 }}>{user?.role || 'ABC Technologies Pvt Ltd'}</span>
        </div>
      )
    },
    { label: 'Company Profile', icon: <Building2 size={15} />, onClick: () => navigate('/recruiter/company') },
    { label: 'Settings', icon: <Settings size={15} />, onClick: () => navigate('/recruiter/settings') },
    { divider: true },
    { label: 'Log Out', icon: <LogOut size={15} />, danger: true, onClick: handleLogout },
  ];

  const adminMenuItems = [
    { label: `${user?.name || 'Admin'} (Admin)`, header: `${user?.name || 'Admin'} (Admin Control)` },
    { divider: true },
    { label: 'Log Out', icon: <LogOut size={15} />, danger: true, onClick: handleLogout },
  ];

  const userMenuItems = isCandidate
    ? candidateMenuItems
    : isRecruiter
    ? recruiterMenuItems
    : adminMenuItems;

  return (
    <header className="portal-header">
      <div className="portal-header-left">
        {/* Mobile sidebar toggle */}
        <button
          className="portal-sidebar-toggle"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          {breadcrumb && breadcrumb.length > 0 && (
            <Breadcrumb items={breadcrumb} showHome={false} />
          )}
          {title && <h1 className="portal-header-title">{title}</h1>}
        </div>
      </div>

      <div className="portal-header-right">
        {actions}

        {/* Notification bell with dropdown */}
        <NotificationDropdown portal={portal} notifPageLink={notifLink} />

        {/* User avatar with Dropdown menu */}
        {user && (
          <DropdownMenu
            items={userMenuItems}
            align="right"
            trigger={
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', padding: '4px 8px', borderRadius: 'var(--radius-lg)', transition: 'background var(--transition-fast)' }}>
                <div className="sidebar-user-avatar" style={{ width: 32, height: 32, fontSize: 'var(--text-xs)' }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hide-mobile" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                  {user.name}
                </span>
                <ChevronDown size={14} className="hide-mobile" style={{ color: 'var(--color-text-muted)' }} />
              </div>
            }
          />
        )}
      </div>
    </header>
  );
}
