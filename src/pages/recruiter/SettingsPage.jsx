import { useState, useEffect } from 'react';
import {
  Settings, Lock, Bell, User, Users, Mail, Phone,
  Plus, Trash2, Save, ShieldCheck, Key, CheckCircle2, UserCheck, Sparkles, RefreshCw,
  Search, X, Check, Building2, Copy, ExternalLink, Link as LinkIcon
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Toggle } from '../../components/ui/FormControls';
import { useRecruiter } from '../../context/RecruiterContext';
import { useToast } from '../../context/ToastContext';

const SUPPORTED_ROLES = [
  'Technical Recruiter',
  'Hiring Manager',
  'Interview Panelist'
];

export default function RecruiterSettingsPage() {
  const {
    recruiter,
    currentUser,
    activeRecruiterId,
    activeUserId,
    switchRecruiter,
    updateCompanyProfile,
    updateSettings,
    inviteTeamMember,
    removeTeamMember,
  } = useRecruiter();
  const { addToast } = useToast();

  // Profile state
  const [profile, setProfile] = useState({
    name: currentUser?.name || recruiter?.name || 'Arjun Reddy',
    designation: currentUser?.designation || recruiter?.designation || 'Director of Talent Acquisition',
    email: currentUser?.email || recruiter?.email || 'recruiter1@ntrvikasa.com',
    phone: currentUser?.phone || recruiter?.phone || '+91 98765 00112',
  });

  useEffect(() => {
    if (currentUser || recruiter) {
      setProfile({
        name: currentUser?.name || recruiter?.name || '',
        designation: currentUser?.designation || recruiter?.designation || '',
        email: currentUser?.email || recruiter?.email || '',
        phone: currentUser?.phone || recruiter?.phone || '',
      });
    }
  }, [currentUser, recruiter]);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification Toggles
  const [applicantAlerts, setApplicantAlerts] = useState(true);
  const [interviewAlerts, setInterviewAlerts] = useState(true);
  const [jobMelaAlerts, setJobMelaAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // ── Team members & Search state ──
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteSuccessModal, setInviteSuccessModal] = useState({
    open: false,
    name: '',
    email: '',
    role: '',
    token: '',
    link: '',
  });

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Technical Recruiter',
  });
  const [inviteErrors, setInviteErrors] = useState({});
  const [inviteLoading, setInviteLoading] = useState(false);

  // Active company team members from recruiter context
  const teamMembers = recruiter?.settings?.teamMembers || [];

  // Live filter team members
  const trimmedSearch = searchTerm.trim().toLowerCase();
  const filteredTeamMembers = teamMembers.filter((member) => {
    if (!trimmedSearch) return true;
    const nameMatch = member.name?.toLowerCase().includes(trimmedSearch);
    const emailMatch = member.email?.toLowerCase().includes(trimmedSearch);
    const roleMatch = member.role?.toLowerCase().includes(trimmedSearch);
    return nameMatch || emailMatch || roleMatch;
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateSettings({ profile });
    addToast('Recruiter profile details saved successfully.', 'success');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Your account password has been updated securely.', 'success');
    }, 600);
  };

  // Open invite modal
  const handleOpenInviteModal = () => {
    setInviteForm({
      name: '',
      email: '',
      role: 'Technical Recruiter',
    });
    setInviteErrors({});
    setIsInviteModalOpen(true);
  };

  // Validate and submit invite
  const handleSendInvitation = (e) => {
    e.preventDefault();
    const errors = {};

    // Validate name
    if (!inviteForm.name.trim()) {
      errors.name = 'Full name is required.';
    }

    // Validate email
    const trimmedEmail = inviteForm.email.trim();
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    } else {
      // Duplicate check within current company's team
      const isDuplicate = teamMembers.some(
        (m) => m.email?.trim().toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (isDuplicate) {
        errors.email = 'This email is already a member of your hiring team.';
      }
    }

    // Validate role
    if (!inviteForm.role || !SUPPORTED_ROLES.includes(inviteForm.role)) {
      errors.role = 'Please select a valid supported role.';
    }

    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors);
      return;
    }

    setInviteLoading(true);
    setTimeout(() => {
      const result = inviteTeamMember({
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role,
      });

      setInviteLoading(false);

      if (result.success) {
        const inviteUrl = `${window.location.origin}/accept-invitation/${result.invitationToken}`;
        setIsInviteModalOpen(false);
        setInviteSuccessModal({
          open: true,
          name: inviteForm.name.trim(),
          email: inviteForm.email.trim(),
          role: inviteForm.role,
          token: result.invitationToken,
          link: inviteUrl,
        });
        addToast(`Invitation sent successfully to ${inviteForm.email.trim()}.`, 'success');
        setInviteForm({ name: '', email: '', role: 'Technical Recruiter' });
        setInviteErrors({});
      } else {
        setInviteErrors({ email: result.error || 'Failed to send invitation.' });
        addToast(result.error || 'Failed to send invitation.', 'error');
      }
    }, 400);
  };

  const handleCopyLink = (link) => {
    navigator.clipboard?.writeText(link);
    addToast('Invitation link copied to clipboard!', 'success');
  };

  const handleRemove = (id, name) => {
    removeTeamMember(id);
    addToast(`${name || 'Team member'} removed from workspace.`, 'info');
  };

  return (
    <div className="portal-page">
      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Settings size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Recruiter Settings & Preferences</h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', margin: 0 }}>
              Manage personal credentials, company team access, and email notification rules for <strong>{recruiter?.company?.name}</strong>.
            </p>
          </div>

          {/* Recruiter Switcher Demo widget */}
          <div style={{
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-900)' }}>
              <strong>Demo User Account:</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <Button
                variant={activeUserId === 'user-arjun' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  switchRecruiter('user-arjun');
                  setSearchTerm('');
                  addToast('Switched account to Arjun Reddy (ABC Technologies)', 'info');
                }}
              >
                1. Arjun (ABC)
              </Button>
              <Button
                variant={activeUserId === 'user-pooja' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  switchRecruiter('user-pooja');
                  setSearchTerm('');
                  addToast('Switched account to Pooja Nair (ABC Technologies)', 'info');
                }}
              >
                2. Pooja (ABC)
              </Button>
              <Button
                variant={activeUserId === 'user-sneha' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  switchRecruiter('user-sneha');
                  setSearchTerm('');
                  addToast('Switched account to Sneha Rao (Tech Solutions)', 'info');
                }}
              >
                3. Sneha (Tech)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 1. Recruiter Personal Profile ── */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-gray-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--color-primary-600)" />
          Personal Recruiter Profile ({currentUser?.name || recruiter?.name})
        </h2>

        <form onSubmit={handleProfileSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <FormField label="Full Name *" required>
            <Input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Designation / Title *" required>
            <Input
              type="text"
              value={profile.designation}
              onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Work Email *" required>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Official Mobile / Phone">
            <Input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </FormField>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="primary" type="submit" icon={<Save size={14} />}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      {/* ── 2. Team Members & Collaboration ── */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--color-primary-600)" />
              Hiring Team & Collaborators
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', margin: 0 }}>
              Invite hiring managers, panel interviewers, and team recruiters to review candidates together for <strong>{recruiter?.company?.name}</strong>.
            </p>
          </div>

          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenInviteModal}
          >
            Invite Member
          </Button>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search team members by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: searchTerm ? '36px' : '12px',
                height: '42px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gray-400)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Members List */}
        {filteredTeamMembers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed var(--color-gray-300)'
          }}>
            <Users size={32} style={{ color: 'var(--color-gray-400)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--color-gray-800)', fontSize: '0.95rem', margin: '0 0 0.25rem' }}>
              No team members found.
            </p>
            {searchTerm ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', margin: 0 }}>
                No members match "{searchTerm}".{' '}
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary-600)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Clear search
                </button>
              </p>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', margin: 0 }}>
                Click "Invite Member" above to add hiring team collaborators.
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredTeamMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.15rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--color-gray-200)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: member.status === 'INVITED' ? '#eff6ff' : 'var(--color-primary-100)',
                    color: member.status === 'INVITED' ? '#2563eb' : 'var(--color-primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}>
                    {member.name?.[0]?.toUpperCase() || 'M'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-gray-900)' }}>{member.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>({member.email})</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-700)', fontWeight: 600, marginTop: '2px' }}>
                      {member.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {member.status === 'ACTIVE' ? (
                    <span style={{
                      fontSize: '0.75rem',
                      background: '#ecfdf5',
                      color: '#059669',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                      letterSpacing: '0.03em'
                    }}>
                      ACTIVE
                    </span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        background: '#eff6ff',
                        color: '#2563eb',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontWeight: 700,
                        letterSpacing: '0.03em'
                      }}>
                        {member.status || 'INVITED'}
                      </span>
                      {member.invitationToken && (
                        <button
                          type="button"
                          onClick={() => handleCopyLink(`${window.location.origin}/accept-invitation/${member.invitationToken}`)}
                          style={{
                            background: '#fff',
                            border: '1px solid var(--color-primary-300)',
                            color: 'var(--color-primary-700)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Copy Invitation Link"
                        >
                          <Copy size={11} /> Copy Invite Link
                        </button>
                      )}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: 'var(--color-danger-600)', padding: '6px' }}
                    icon={<Trash2 size={15} />}
                    onClick={() => handleRemove(member.id, member.name)}
                    aria-label={`Remove ${member.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Notification Preferences ── */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-gray-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="var(--color-primary-600)" />
          Recruitment Notification Preferences
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>Instant New Applicant Alerts</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Receive instant email notification when candidates apply to active jobs.</div>
            </div>
            <Toggle checked={applicantAlerts} onChange={() => setApplicantAlerts(!applicantAlerts)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>Interview Confirmation & Reminders</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Calendar notifications 1 hour prior to scheduled candidate rounds.</div>
            </div>
            <Toggle checked={interviewAlerts} onChange={() => setInterviewAlerts(!interviewAlerts)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>Weekly Hiring Funnel Digest</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Summary of applicant volume, time-to-hire velocity, and candidate matches.</div>
            </div>
            <Toggle checked={weeklyDigest} onChange={() => setWeeklyDigest(!weeklyDigest)} />
          </div>
        </div>
      </div>

      {/* ── 4. Account Security / Password ── */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-gray-900)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={18} color="var(--color-primary-600)" />
          Account Security & Password
        </h2>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <FormField label="Current Password *" required>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </FormField>

          <FormField label="New Password *" required>
            <Input
              type="password"
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Confirm New Password *" required>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormField>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="primary" type="submit" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>

      {/* ── 5. Invite Member Modal ── */}
      <Modal
        open={isInviteModalOpen}
        onClose={() => {
          if (!inviteLoading) {
            setIsInviteModalOpen(false);
            setInviteErrors({});
          }
        }}
        title="Invite Hiring Team Member"
        size="md"
      >
        <form onSubmit={handleSendInvitation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: 'var(--color-primary-900)',
            lineHeight: 1.4
          }}>
            Invited members will receive an official invitation to join <strong>{recruiter?.company?.name || 'your company'}</strong>'s hiring workspace to collaborate on candidates.
          </div>

          <FormField
            label="Full Name *"
            error={inviteErrors.name}
            required
          >
            <Input
              type="text"
              placeholder="e.g. Ravi Kumar"
              value={inviteForm.name}
              onChange={(e) => {
                setInviteForm({ ...inviteForm, name: e.target.value });
                if (inviteErrors.name) setInviteErrors({ ...inviteErrors, name: '' });
              }}
              error={Boolean(inviteErrors.name)}
            />
          </FormField>

          <FormField
            label="Work Email Address *"
            error={inviteErrors.email}
            required
          >
            <Input
              type="email"
              placeholder="e.g. ravi@abctech.com"
              value={inviteForm.email}
              onChange={(e) => {
                setInviteForm({ ...inviteForm, email: e.target.value });
                if (inviteErrors.email) setInviteErrors({ ...inviteErrors, email: '' });
              }}
              error={Boolean(inviteErrors.email)}
            />
          </FormField>

          <FormField
            label="Assign Role *"
            error={inviteErrors.role}
            required
          >
            <select
              className={`form-control ${inviteErrors.role ? 'input-error' : ''}`}
              value={inviteForm.role}
              onChange={(e) => {
                setInviteForm({ ...inviteForm, role: e.target.value });
                if (inviteErrors.role) setInviteErrors({ ...inviteErrors, role: '' });
              }}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                border: inviteErrors.role ? '1px solid var(--color-danger-500)' : '1px solid var(--color-border)',
                fontSize: '0.9rem',
                padding: '0 10px',
                background: 'var(--color-surface)',
                color: 'var(--color-text)'
              }}
            >
              {SUPPORTED_ROLES.map((roleName) => (
                <option key={roleName} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-200)' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsInviteModalOpen(false);
                setInviteErrors({});
              }}
              disabled={inviteLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={inviteLoading}
              icon={inviteLoading ? <RefreshCw size={14} className="spin" /> : <Mail size={14} />}
            >
              {inviteLoading ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── 6. Invitation Sent Success & Link Modal ── */}
      <Modal
        open={inviteSuccessModal.open}
        onClose={() => setInviteSuccessModal({ ...inviteSuccessModal, open: false })}
        title="Invitation Created Successfully"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <strong style={{ display: 'block', color: '#065f46', fontSize: '0.95rem' }}>
                Invitation sent to {inviteSuccessModal.name}
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#047857' }}>
                Role: {inviteSuccessModal.role} • Status: INVITED
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '0.4rem' }}>
              Invitation Acceptance Link:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                readOnly
                value={inviteSuccessModal.link}
                className="form-control"
                style={{ flex: 1, fontSize: '0.8rem', background: '#f8fafc', color: 'var(--color-gray-800)' }}
              />
              <Button
                variant="outline"
                size="sm"
                icon={<Copy size={14} />}
                onClick={() => handleCopyLink(inviteSuccessModal.link)}
              >
                Copy
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-200)' }}>
            <a
              href={inviteSuccessModal.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="secondary" size="sm" icon={<ExternalLink size={14} />}>
                Open Accept Page
              </Button>
            </a>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setInviteSuccessModal({ ...inviteSuccessModal, open: false })}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
