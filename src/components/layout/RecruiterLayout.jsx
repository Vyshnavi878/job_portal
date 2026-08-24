import { Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Briefcase, Users, GraduationCap,
  CalendarCheck, Bell, Settings, LogOut, CalendarDays,
} from 'lucide-react';
import Sidebar from './Sidebar';
import PortalHeader from './PortalHeader';
import { SidebarProvider } from '../../context/SidebarContext';

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/recruiter/dashboard',      icon: <LayoutDashboard size={18} />, end: true },
  { label: 'Company',      href: '/recruiter/company',        icon: <Building2 size={18} />,       section: 'Manage' },
  { label: 'Jobs',         href: '/recruiter/jobs',           icon: <Briefcase size={18} /> },
  { label: 'Internships',  href: '/recruiter/internships',    icon: <GraduationCap size={18} /> },
  { label: 'Interviews',   href: '/recruiter/interviews',     icon: <CalendarCheck size={18} /> },
  { label: 'Job Mela',     href: '/recruiter/job-mela',       icon: <CalendarDays size={18} /> },
  { label: 'Notifications',href: '/recruiter/notifications',  icon: <Bell size={18} />,            section: 'Other' },
];

const FOOTER_ITEMS = [
  { label: 'Settings', href: '/recruiter/settings', icon: <Settings size={18} /> },
  { label: 'Log Out',  href: '/login',              icon: <LogOut size={18} /> },
];

const MOCK_USER = { name: 'Rahul Mehta', role: 'Recruiter' };

function getPageTitle(pathname) {
  const map = {
    '/recruiter/dashboard':    'Dashboard',
    '/recruiter/company':      'Company Profile',
    '/recruiter/jobs':         'Jobs',
    '/recruiter/jobs/create':  'Post New Job',
    '/recruiter/internships':  'Internships',
    '/recruiter/interviews':   'Interviews',
    '/recruiter/job-mela':     'Job Mela',
    '/recruiter/notifications':'Notifications',
    '/recruiter/settings':     'Settings',
  };
  return map[pathname] || 'Recruiter Portal';
}

export default function RecruiterLayout() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <div className="portal-layout">
        <Sidebar
          navItems={NAV_ITEMS}
          footerItems={FOOTER_ITEMS}
          user={MOCK_USER}
          portalName="Recruiter"
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
