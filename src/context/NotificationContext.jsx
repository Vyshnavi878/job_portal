/**
 * NotificationContext — Shared notification store for all portals.
 * Provides unread counts, notification list, mark-read, and dismiss.
 * Ready for API integration: replace mock data with real fetch calls.
 */
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const NotificationContext = createContext(null);

// ─── Category icons / labels ──────────────────────────────────────────────
export const NOTIF_CATEGORY = {
  APPLICATION:  { label: 'Application',    color: '#3b82f6', bg: '#eff6ff' },
  SHORTLIST:    { label: 'Shortlisted',     color: '#10b981', bg: '#f0fdf4' },
  INTERVIEW:    { label: 'Interview',       color: '#8b5cf6', bg: '#f5f3ff' },
  OFFER:        { label: 'Offer',           color: '#f59e0b', bg: '#fffbeb' },
  REJECTION:    { label: 'Rejection',       color: '#ef4444', bg: '#fef2f2' },
  JOB_MELA:     { label: 'Job Mela',        color: '#ec4899', bg: '#fdf2f8' },
  JOB_APPROVAL: { label: 'Job Approval',    color: '#10b981', bg: '#f0fdf4' },
  ACCOUNT:      { label: 'Account',         color: '#6b7280', bg: '#f9fafb' },
  SYSTEM:       { label: 'System',          color: '#6366f1', bg: '#eef2ff' },
  RECRUITER:    { label: 'Recruiter',       color: '#d97706', bg: '#fffbeb' },
  COMPANY:      { label: 'Company',         color: '#0284c7', bg: '#e0f2fe' },
};

// ─── Portal-specific mock notification sets ────────────────────────────────
const CANDIDATE_NOTIFS = [
  {
    id: 'cn-1',
    category: 'SHORTLIST',
    title: 'You have been shortlisted! 🎉',
    message: 'TechCorp India shortlisted you for Senior Frontend Engineer. Interview may be scheduled within 2–3 business days.',
    time: '10 mins ago',
    read: false,
    link: '/candidate/applications',
  },
  {
    id: 'cn-2',
    category: 'INTERVIEW',
    title: 'Interview scheduled — 28 Aug 2026',
    message: 'Your Round 1 technical interview at TechCorp India is scheduled for 28 Aug at 2:30 PM via Google Meet.',
    time: '1 hour ago',
    read: false,
    link: '/candidate/applications',
  },
  {
    id: 'cn-3',
    category: 'APPLICATION',
    title: 'Application submitted to Flipkart',
    message: 'Your application for Lead Product Manager — Checkout was received. You will hear back within 5–7 working days.',
    time: '3 hours ago',
    read: false,
    link: '/candidate/applications',
  },
  {
    id: 'cn-4',
    category: 'JOB_MELA',
    title: 'Job Mela Pass confirmed!',
    message: 'Your Fast-Track QR pass for Bengaluru Mega IT Job Mela 2026 is ready. Gate 3 opens at 9:00 AM.',
    time: 'Yesterday',
    read: true,
    link: '/candidate/job-mela',
  },
  {
    id: 'cn-5',
    category: 'REJECTION',
    title: 'Application update: Swiggy',
    message: 'After careful review, Swiggy has decided not to move forward with your application for Senior Data Scientist at this time.',
    time: '2 days ago',
    read: true,
    link: '/candidate/applications',
  },
  {
    id: 'cn-6',
    category: 'ACCOUNT',
    title: 'Profile completion reminder',
    message: 'Your profile is 80% complete. Add your work experience to increase recruiter visibility by 3x.',
    time: '3 days ago',
    read: true,
    link: '/candidate/profile',
  },
];

const RECRUITER_NOTIFS = [
  {
    id: 'rn-1',
    category: 'JOB_APPROVAL',
    title: 'Job approved & published',
    message: '"Senior Frontend Engineer" has been approved by Admin and is now live on the public job board.',
    time: '15 mins ago',
    read: false,
    link: '/recruiter/jobs',
  },
  {
    id: 'rn-2',
    category: 'APPLICATION',
    title: 'High-match applicant: Priya Sharma (94%)',
    message: 'Priya Sharma applied to Senior Frontend Engineer. Her profile is a strong match — 4 years React experience.',
    time: '35 mins ago',
    read: false,
    link: '/recruiter/jobs/1/applicants',
  },
  {
    id: 'rn-3',
    category: 'INTERVIEW',
    title: 'Interview confirmed by candidate',
    message: 'Amitav Ghosh confirmed the technical interview on 28 Aug 2026 at 3:00 PM IST.',
    time: '2 hours ago',
    read: false,
    link: '/recruiter/interviews',
  },
  {
    id: 'rn-4',
    category: 'JOB_MELA',
    title: 'Job Mela stall request approved',
    message: 'Your participation request for Bengaluru Mega IT Job Mela was approved. Booth B-14, Hall 3 allocated.',
    time: '1 day ago',
    read: true,
    link: '/recruiter/job-mela',
  },
  {
    id: 'rn-5',
    category: 'REJECTION',
    title: 'Job posting rejected by Admin',
    message: '"Cryptocurrency Arbitrage Analyst" was rejected. Reason: Non-compliant wage disclosure practices.',
    time: '2 days ago',
    read: true,
    link: '/recruiter/jobs',
  },
];

const ADMIN_NOTIFS = [
  {
    id: 'an-1',
    category: 'RECRUITER',
    title: 'New recruiter verification: TechCorp India',
    message: 'Rahul Mehta submitted COI + GSTIN documents. Awaiting document review and manual KYC verification.',
    time: '15 mins ago',
    read: false,
    link: '/admin/recruiters/requests',
  },
  {
    id: 'an-2',
    category: 'JOB_APPROVAL',
    title: 'Job pending review: Cloud Security Architect',
    message: 'TechCorp India submitted a new ₹32–₹48 LPA job opening for moderation.',
    time: '35 mins ago',
    read: false,
    link: '/admin/jobs/requests',
  },
  {
    id: 'an-3',
    category: 'JOB_MELA',
    title: 'Job Mela stall request: Swiggy',
    message: 'Swiggy requested a Corporate 6×3m double stall at Bengaluru Mega IT Job Mela 2026.',
    time: '1 hour ago',
    read: false,
    link: '/admin/job-melas/participation',
  },
  {
    id: 'an-4',
    category: 'SYSTEM',
    title: 'Internship pending review: AI Engineering Intern',
    message: 'Razorpay submitted a 6-month internship program at ₹40,000/month for moderation.',
    time: '2 hours ago',
    read: true,
    link: '/admin/internships/requests',
  },
  {
    id: 'an-5',
    category: 'SYSTEM',
    title: 'Automated account suspension: Spam Bot',
    message: 'Security module flagged and suspended bot909@disposable-email.com (140 applications in 4 hours).',
    time: 'Yesterday',
    read: true,
    link: '/admin/candidates',
  },
];

// Portal → initial notifications mapping
const PORTAL_NOTIFS = {
  candidate: CANDIDATE_NOTIFS,
  recruiter: RECRUITER_NOTIFS,
  admin:     ADMIN_NOTIFS,
};

export function NotificationProvider({ children }) {
  const [allNotifs, setAllNotifs] = useState(PORTAL_NOTIFS);

  /** Get notifications for a specific portal */
  const getNotifs = useCallback((portal) => allNotifs[portal] || [], [allNotifs]);

  /** Unread count for a portal */
  const getUnreadCount = useCallback((portal) => {
    return (allNotifs[portal] || []).filter(n => !n.read).length;
  }, [allNotifs]);

  /** Mark a single notification as read */
  const markRead = useCallback((portal, id) => {
    setAllNotifs(prev => ({
      ...prev,
      [portal]: prev[portal].map(n => n.id === id ? { ...n, read: true } : n),
    }));
  }, []);

  /** Mark all as read for a portal */
  const markAllRead = useCallback((portal) => {
    setAllNotifs(prev => ({
      ...prev,
      [portal]: prev[portal].map(n => ({ ...n, read: true })),
    }));
  }, []);

  /** Dismiss / delete a notification */
  const dismiss = useCallback((portal, id) => {
    setAllNotifs(prev => ({
      ...prev,
      [portal]: prev[portal].filter(n => n.id !== id),
    }));
  }, []);

  const ctx = useMemo(() => ({
    getNotifs,
    getUnreadCount,
    markRead,
    markAllRead,
    dismiss,
  }), [getNotifs, getUnreadCount, markRead, markAllRead, dismiss]);

  return (
    <NotificationContext.Provider value={ctx}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
