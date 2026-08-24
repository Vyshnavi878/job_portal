/**
 * Status configuration for all 20 application statuses.
 * Maps each status key to: label, badgeClass, icon name (lucide), description.
 */

export const STATUS_CONFIG = {
  PENDING: {
    key: 'PENDING',
    label: 'Pending',
    badgeClass: 'badge-pending',
    color: '#f59e0b',
    description: 'Awaiting review',
  },
  APPROVED: {
    key: 'APPROVED',
    label: 'Approved',
    badgeClass: 'badge-approved',
    color: '#22c55e',
    description: 'Approved and active',
  },
  REJECTED: {
    key: 'REJECTED',
    label: 'Rejected',
    badgeClass: 'badge-rejected',
    color: '#ef4444',
    description: 'Rejected',
  },
  SUSPENDED: {
    key: 'SUSPENDED',
    label: 'Suspended',
    badgeClass: 'badge-suspended',
    color: '#f97316',
    description: 'Temporarily suspended',
  },
  DRAFT: {
    key: 'DRAFT',
    label: 'Draft',
    badgeClass: 'badge-draft',
    color: '#94a3b8',
    description: 'Saved as draft',
  },
  PUBLISHED: {
    key: 'PUBLISHED',
    label: 'Published',
    badgeClass: 'badge-published',
    color: '#6366f1',
    description: 'Publicly visible',
  },
  CLOSED: {
    key: 'CLOSED',
    label: 'Closed',
    badgeClass: 'badge-closed',
    color: '#475569',
    description: 'No longer accepting applications',
  },
  EXPIRED: {
    key: 'EXPIRED',
    label: 'Expired',
    badgeClass: 'badge-expired',
    color: '#dc2626',
    description: 'Deadline has passed',
  },
  APPLIED: {
    key: 'APPLIED',
    label: 'Applied',
    badgeClass: 'badge-applied',
    color: '#3b82f6',
    description: 'Application submitted',
  },
  UNDER_REVIEW: {
    key: 'UNDER_REVIEW',
    label: 'Under Review',
    badgeClass: 'badge-under_review',
    color: '#8b5cf6',
    description: 'Application is being reviewed',
  },
  SHORTLISTED: {
    key: 'SHORTLISTED',
    label: 'Shortlisted',
    badgeClass: 'badge-shortlisted',
    color: '#06b6d4',
    description: 'Shortlisted for next round',
  },
  INTERVIEW: {
    key: 'INTERVIEW',
    label: 'Interview',
    badgeClass: 'badge-interview',
    color: '#f59e0b',
    description: 'Interview scheduled',
  },
  SELECTED: {
    key: 'SELECTED',
    label: 'Selected',
    badgeClass: 'badge-selected',
    color: '#22c55e',
    description: 'Selected for the role',
  },
  SCHEDULED: {
    key: 'SCHEDULED',
    label: 'Scheduled',
    badgeClass: 'badge-scheduled',
    color: '#3b82f6',
    description: 'Interview scheduled',
  },
  COMPLETED: {
    key: 'COMPLETED',
    label: 'Completed',
    badgeClass: 'badge-completed',
    color: '#22c55e',
    description: 'Successfully completed',
  },
  CANCELLED: {
    key: 'CANCELLED',
    label: 'Cancelled',
    badgeClass: 'badge-cancelled',
    color: '#ef4444',
    description: 'Has been cancelled',
  },
  RESCHEDULED: {
    key: 'RESCHEDULED',
    label: 'Rescheduled',
    badgeClass: 'badge-rescheduled',
    color: '#f59e0b',
    description: 'Rescheduled to a new time',
  },
  UPCOMING: {
    key: 'UPCOMING',
    label: 'Upcoming',
    badgeClass: 'badge-upcoming',
    color: '#6366f1',
    description: 'Happening soon',
  },
  REGISTRATION_OPEN: {
    key: 'REGISTRATION_OPEN',
    label: 'Registration Open',
    badgeClass: 'badge-registration_open',
    color: '#10b981',
    description: 'Open for registration',
  },
  ONGOING: {
    key: 'ONGOING',
    label: 'Ongoing',
    badgeClass: 'badge-ongoing',
    color: '#059669',
    description: 'Currently in progress',
  },
};

/**
 * Get status config for a given status key.
 * Falls back gracefully for unknown statuses.
 */
export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || {
    key: status,
    label: status,
    badgeClass: 'badge-gray',
    color: '#94a3b8',
    description: '',
  };
}
