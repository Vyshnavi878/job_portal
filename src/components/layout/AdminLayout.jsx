import { Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText, GraduationCap,
  CalendarDays, Bell, Settings, LogOut, Shield, ClipboardList,
  BarChart3, History, UserCheck,
} from 'lucide-react';
import Sidebar from './Sidebar';
import PortalHeader from './PortalHeader';
import { SidebarProvider } from '../../context/SidebarContext';

const NAV_ITEMS = [
  { label: 'Dashboard',          href: '/admin/dashboard',                 icon: <LayoutDashboard size={18} />, end: true },

  // Users
  { label: 'Recruiter Requests', href: '/admin/recruiters/requests',       icon: <UserCheck size={18} />,  section: 'Users', badge: 4 },
  { label: 'Recruiters',         href: '/admin/recruiters',                icon: <Users size={18} /> },
  { label: 'Candidates',         href: '/admin/candidates',                icon: <Users size={18} /> },
  { label: 'Companies',          href: '/admin/companies',                 icon: <Building2 size={18} /> },

  // Content
  { label: 'Job Requests',       href: '/admin/jobs/requests',             icon: <Briefcase size={18} />,  section: 'Content', badge: 7 },
  { label: 'Jobs',               href: '/admin/jobs',                     icon: <Briefcase size={18} /> },
  { label: 'Internship Requests',href: '/admin/internships/requests',      icon: <GraduationCap size={18} />, badge: 2 },
  { label: 'Internships',        href: '/admin/internships',               icon: <GraduationCap size={18} /> },
  { label: 'Applications',       href: '/admin/applications',              icon: <FileText size={18} /> },

  // Events
  { label: 'Job Melas',          href: '/admin/job-melas',                 icon: <CalendarDays size={18} />, section: 'Events' },
  { label: 'Registrations',      href: '/admin/job-melas/registrations',   icon: <ClipboardList size={18} /> },
  { label: 'Participation',      href: '/admin/job-melas/participation',   icon: <Users size={18} /> },

  // System
  { label: 'Notifications',      href: '/admin/notifications',             icon: <Bell size={18} />,        section: 'System' },
  { label: 'Reports',            href: '/admin/reports',                   icon: <BarChart3 size={18} /> },
  { label: 'Audit Logs',         href: '/admin/audit-logs',                icon: <History size={18} /> },
];

const FOOTER_ITEMS = [
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
  { label: 'Log Out',  href: '/login',          icon: <LogOut size={18} /> },
];

const MOCK_USER = { name: 'Admin User', role: 'Super Admin' };

function getPageTitle(pathname) {
  const map = {
    '/admin/dashboard':               'Dashboard',
    '/admin/recruiters/requests':     'Recruiter Requests',
    '/admin/recruiters':              'Recruiters',
    '/admin/candidates':              'Candidates',
    '/admin/companies':               'Companies',
    '/admin/jobs/requests':           'Job Approval Requests',
    '/admin/jobs':                    'All Jobs',
    '/admin/internships/requests':    'Internship Requests',
    '/admin/internships':             'Internships',
    '/admin/applications':            'Applications',
    '/admin/job-melas':               'Job Melas',
    '/admin/job-melas/create':        'Create Job Mela',
    '/admin/job-melas/participation': 'Participation',
    '/admin/job-melas/registrations': 'Registrations',
    '/admin/notifications':           'Notifications',
    '/admin/reports':                 'Reports',
    '/admin/audit-logs':              'Audit Logs',
    '/admin/settings':                'Settings',
  };
  return map[pathname] || 'Admin Portal';
}

export default function AdminLayout() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <div className="portal-layout">
        <Sidebar
          navItems={NAV_ITEMS}
          footerItems={FOOTER_ITEMS}
          user={MOCK_USER}
          portalName="Admin"
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
