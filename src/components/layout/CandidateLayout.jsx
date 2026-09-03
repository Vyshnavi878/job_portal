import { Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, BookOpen, Bookmark, FileText,
  CalendarDays, HelpCircle
} from 'lucide-react';
import Sidebar from './Sidebar';
import PortalHeader from './PortalHeader';
import { SidebarProvider } from '../../context/SidebarContext';

const NAV_ITEMS = [
  // MAIN
  { section: 'MAIN', label: 'Dashboard',       href: '/candidate/dashboard',    icon: <LayoutDashboard size={18} />, end: true },
  { section: 'MAIN', label: 'Jobs',            href: '/jobs',                   icon: <Briefcase size={18} /> },
  { section: 'MAIN', label: 'Internships',     href: '/internships',            icon: <BookOpen size={18} /> },
  { section: 'MAIN', label: 'Saved Jobs',      href: '/candidate/saved-jobs',   icon: <Bookmark size={18} /> },
  { section: 'MAIN', label: 'My Applications', href: '/candidate/applications', icon: <FileText size={18} /> },
  { section: 'MAIN', label: 'Job Melas',       href: '/candidate/job-mela',     icon: <CalendarDays size={18} /> },

  // SUPPORT
  { section: 'SUPPORT', label: 'Help & Support', href: '/contact',              icon: <HelpCircle size={18} /> },
];

// Mock user — replace with real auth context when ready
const MOCK_USER = { name: 'Priya Sharma', role: 'Candidate' };

function getPageTitle(pathname) {
  const map = {
    '/candidate/dashboard':    'Dashboard',
    '/candidate/profile':      'My Profile',
    '/candidate/applications': 'My Applications',
    '/candidate/saved-jobs':   'Saved Jobs',
    '/candidate/job-mela':     'Job Melas',
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
