import { Outlet, useLocation } from 'react-router-dom';
import {
  Home, LayoutDashboard, Users, Building2, Briefcase, FileText,
  GraduationCap, UserCheck, ShieldCheck, CheckCircle2,
  CalendarDays, ClipboardList, AlertTriangle, BarChart3,
  TrendingUp, History, Bell, Settings
} from 'lucide-react';
import Sidebar from './Sidebar';
import PortalHeader from './PortalHeader';
import { SidebarProvider } from '../../context/SidebarContext';
import { useAdmin } from '../../context/AdminContext';

function getPageTitle(pathname) {
  const map = {
    '/admin/dashboard':               'System Administration Dashboard',
    '/admin/candidates':              'Platform Candidates Management',
    '/admin/recruiters':              'Registered Recruiters',
    '/admin/companies':               'Registered Companies',
    '/admin/jobs':                    'Platform Jobs Directory',
    '/admin/internships':             'Platform Internships Directory',
    '/admin/applications':            'Applications Activity Monitoring',
    '/admin/recruiter-verification':  'Recruiter Verification Requests',
    '/admin/recruiters/requests':     'Recruiter Verification Requests',
    '/admin/company-verification':    'Company Verification Requests',
    '/admin/companies/requests':      'Company Verification Requests',
    '/admin/job-approvals':           'Job Posting Approval Queue',
    '/admin/jobs/requests':           'Job Posting Approval Queue',
    '/admin/internship-approvals':    'Internship Approval Queue',
    '/admin/internships/requests':    'Internship Approval Queue',
    '/admin/job-melas':               'Job Melas & Career Summits',
    '/admin/job-melas/create':        'Create New Job Mela Event',
    '/admin/registrations':           'Job Mela Candidate Registrations',
    '/admin/job-melas/registrations': 'Job Mela Candidate Registrations',
    '/admin/job-melas/participation': 'Job Mela Company Participation',
    '/admin/reports':                 'Platform Reports & Complaints Moderation',
    '/admin/analytics':               'Platform Performance & Recruitment Analytics',
    '/admin/audit-logs':              'Security & System Audit Logs',
    '/admin/notifications':           'Admin Notifications & System Alerts',
    '/admin/settings':                'Platform Administration Settings',
  };
  return map[pathname] || 'NTR VIKASA Administration';
}

export default function AdminLayout() {
  const location = useLocation();
  const { currentAdmin, pendingCounts } = useAdmin();
  const title = getPageTitle(location.pathname);

  const navItems = [
    // 1. MAIN
    { label: 'Home',                  href: '/',                            icon: <Home size={18} />,             section: 'MAIN' },
    { label: 'Dashboard',             href: '/admin/dashboard',             icon: <LayoutDashboard size={18} />,  end: true, section: 'MAIN' },

    // 2. USERS
    { label: 'Candidates',            href: '/admin/candidates',            icon: <Users size={18} />,            section: 'USERS' },
    { label: 'Recruiters',            href: '/admin/recruiters',            icon: <UserCheck size={18} />,        section: 'USERS' },
    { label: 'Companies',             href: '/admin/companies',             icon: <Building2 size={18} />,        section: 'USERS' },

    // 3. EMPLOYMENT
    { label: 'Jobs',                  href: '/admin/jobs',                  icon: <Briefcase size={18} />,        section: 'EMPLOYMENT' },
    { label: 'Internships',           href: '/admin/internships',           icon: <GraduationCap size={18} />,    section: 'EMPLOYMENT' },
    { label: 'Applications',          href: '/admin/applications',          icon: <FileText size={18} />,         section: 'EMPLOYMENT' },

    // 4. APPROVALS
    { label: 'Recruiter Verification',href: '/admin/recruiter-verification',icon: <ShieldCheck size={18} />,      section: 'APPROVALS', badge: pendingCounts?.recruiterVerifications || null },
    { label: 'Company Verification',  href: '/admin/company-verification',  icon: <Building2 size={18} />,        section: 'APPROVALS', badge: pendingCounts?.companyVerifications || null },
    { label: 'Job Approvals',         href: '/admin/job-approvals',         icon: <CheckCircle2 size={18} />,     section: 'APPROVALS', badge: pendingCounts?.jobApprovals || null },
    { label: 'Internship Approvals',  href: '/admin/internship-approvals',  icon: <GraduationCap size={18} />,    section: 'APPROVALS', badge: pendingCounts?.internshipApprovals || null },

    // 5. EVENTS
    { label: 'Job Melas',             href: '/admin/job-melas',             icon: <CalendarDays size={18} />,     section: 'EVENTS' },
    { label: 'Registrations',         href: '/admin/registrations',         icon: <ClipboardList size={18} />,    section: 'EVENTS' },

    // 6. MODERATION
    { label: 'Reports / Complaints',  href: '/admin/reports',               icon: <AlertTriangle size={18} />,    section: 'MODERATION', badge: pendingCounts?.openReports || null },

    // 7. ANALYTICS
    { label: 'Reports',               href: '/admin/reports',               icon: <BarChart3 size={18} />,        section: 'ANALYTICS' },
    { label: 'Analytics',             href: '/admin/analytics',             icon: <TrendingUp size={18} />,       section: 'ANALYTICS' },
    { label: 'Audit Logs',            href: '/admin/audit-logs',            icon: <History size={18} />,          section: 'ANALYTICS' },

    // 8. SYSTEM
    { label: 'Notifications',         href: '/admin/notifications',         icon: <Bell size={18} />,             section: 'SYSTEM', badge: pendingCounts?.unreadNotifications || null },
    { label: 'Settings',              href: '/admin/settings',              icon: <Settings size={18} />,         section: 'SYSTEM' },
  ];

  const adminUserObj = {
    name: currentAdmin?.name || 'Admin User',
    role: currentAdmin?.title || 'Platform Administrator',
    avatar: currentAdmin?.avatar || 'A',
  };

  return (
    <SidebarProvider>
      <div className="portal-layout">
        <Sidebar
          navItems={navItems}
          footerItems={[]}
          user={null}
          portalName="NTR Vikasa Admin"
        />
        <div className="portal-main">
          <PortalHeader
            title={title}
            user={adminUserObj}
          />
          <main className="portal-content">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
