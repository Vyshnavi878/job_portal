import { useState } from 'react';
import {
  Settings, Lock, Bell, Eye, Shield, Trash2, Save,
  CheckCircle2, AlertTriangle, Key, Mail, Smartphone
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import { Toggle, Checkbox } from '../../components/ui/FormControls';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export default function CandidateSettingsPage() {
  const { toast } = useToast();

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Privacy Settings
  const [profileVisible, setProfileVisible] = useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        type: 'error',
        title: 'Validation Error',
        message: 'New passwords do not match or are empty.',
      });
      return;
    }
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your account password has been updated securely.',
      });
    }, 1000);
  };

  const handleSavePreferences = () => {
    toast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Your notification and privacy preferences have been updated.',
    });
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(false);
    toast({
      type: 'info',
      title: 'Account Deletion Requested',
      message: 'Your account deletion request has been submitted.',
    });
  };

  return (
    <div className="candidate-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Settings size={20} style={{ color: 'var(--color-primary-600)' }} />
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Account & Privacy Settings</h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
          Manage your password, email alerts, recruiter visibility, and privacy preferences
        </p>
      </div>

      {/* ── 1. Security & Change Password ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Lock size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Security & Password</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 500 }}>
            <FormField label="Current Password" required>
              <Input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </FormField>

            <FormField label="New Password" required hint="Minimum 8 characters with letters & numbers">
              <Input
                type="password"
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Confirm New Password" required>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormField>

            <div>
              <Button type="submit" variant="primary" size="sm" loading={passwordLoading} leftIcon={<Key size={14} />}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── 2. Notification Preferences ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Bell size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Alerts & Notification Channels</h2>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Email Job & Application Alerts</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Receive email when your application status changes or when shortlisted</p>
            </div>
            <Toggle checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>SMS & WhatsApp Notifications</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Get urgent interview reminders and Job Mela venue instructions via SMS</p>
            </div>
            <Toggle checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Upcoming Interview Reminders</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Automated calendar reminder 2 hours prior to scheduled interviews</p>
            </div>
            <Toggle checked={interviewReminders} onChange={(e) => setInterviewReminders(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Weekly Job Recommendation Digest</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Curated list of matching jobs sent once a week</p>
            </div>
            <Toggle checked={weeklyDigest} onChange={(e) => setWeeklyDigest(e.target.checked)} />
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <Button variant="primary" size="sm" leftIcon={<Save size={14} />} onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>

      {/* ── 3. Profile Privacy & Recruiter Visibility ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Eye size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Profile Visibility & Privacy</h2>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Visible in Recruiter Talent Search</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Allow verified employers to discover your profile and invite you to apply</p>
            </div>
            <Toggle checked={profileVisible} onChange={(e) => setProfileVisible(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Direct Recruiter Messages</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Allow hiring managers to contact you regarding relevant career openings</p>
            </div>
            <Toggle checked={allowDirectMessages} onChange={(e) => setAllowDirectMessages(e.target.checked)} />
          </div>
        </div>
      </div>

      {/* ── 4. Danger Zone: Delete Account ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', borderColor: 'var(--color-danger-200)', background: 'var(--color-danger-50)' }}>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-danger-700)' }}>
              Delete Candidate Account
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger-600)', marginTop: 2 }}>
              Permanently delete your profile, resume, and application history. This action cannot be undone.
            </p>
          </div>

          <Button variant="danger" size="sm" leftIcon={<Trash2 size={14} />} onClick={() => setDeleteModalOpen(true)}>
            Delete My Account
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Permanently Delete Account?"
        message="Are you sure you want to delete your NTR VIKASA Job Portal Candidate profile? All saved resumes and application histories will be permanently removed."
        confirmText="Yes, Delete Account"
        danger
      />

    </div>
  );
}
