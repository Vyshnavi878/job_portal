import { Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, Bookmark, CalendarDays,
  Bell, Settings, LogOut, Briefcase,
} from 'lucide-react';
import Sidebar from './Sidebar';
import PortalHeader from './PortalHeader';
import { SidebarProvider } from '../../context/SidebarContext';

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/candidate/dashboard',     icon: <LayoutDashboard size={18} />, end: true },
  { label: 'My Profile',      href: '/candidate/profile',       icon: <User size={18} /> },
  { label: 'Applications',    href: '/candidate/applications',  icon: <FileText size={18} /> },
  { label: 'Saved Jobs',      href: '/candidate/saved-jobs',    icon: <Bookmark size={18} /> },
  { label: 'Job Mela',        href: '/candidate/job-mela',      icon: <CalendarDays size={18} /> },
  { label: 'Notifications',   href: '/candidate/notifications', icon: <Bell size={18} /> },
];

const FOOTER_ITEMS = [
  { label: 'Settings', href: '/candidate/settings', icon: <Settings size={18} /> },
  { label: 'Log Out',  href: '/login',               icon: <LogOut size={18} /> },
];

// Mock user — replace with real auth context when ready
const MOCK_USER = { name: 'Priya Sharma', role: 'Candidate' };

function getPageTitle(pathname) {
  const map = {
    '/candidate/dashboard':    'Dashboard',
    '/candidate/profile':      'My Profile',
    '/candidate/applications': 'My Applications',
    '/candidate/saved-jobs':   'Saved Jobs',
    '/candidate/job-mela':     'Job Mela',
    '/candidate/notifications':'Notifications',
    '/candidate/settings':     'Settings',
  };
  return map[pathname] || 'Candidate Portal';
}

export default function CandidateLayout() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <div className="portal-layout">
        <Sidebar
          navItems={NAV_ITEMS}
          footerItems={FOOTER_ITEMS}
          user={MOCK_USER}
          portalName="Candidate"
        />
        <div className="portal-main">
          <PortalHeader
            title={title}
            user={MOCK_USER}
          />
          <main className="portal-content">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
