import { useState } from 'react';
import {
  Settings, Lock, Bell, User, Users, Mail, Phone,
  Plus, Trash2, Save, ShieldCheck, Key, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import { Toggle } from '../../components/ui/FormControls';
import { useToast } from '../../context/ToastContext';

export default function RecruiterSettingsPage() {
  const { toast } = useToast();

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Rahul Mehta',
    designation: 'Senior Talent Acquisition Lead',
    email: 'rahul.mehta@techcorp-india.example.com',
    phone: '+91 98765 00112',
  });

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

  // Team members
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Pooja Nair', email: 'pooja.nair@techcorp-india.example.com', role: 'Technical Recruiter', status: 'ACTIVE' },
    { id: '2', name: 'Ananya Roy', email: 'ananya.roy@techcorp-india.example.com', role: 'Hiring Manager (Design)', status: 'ACTIVE' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Recruiter');

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast({ type: 'success', title: 'Profile Updated', message: 'Recruiter personal details saved.' });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast({ type: 'error', title: 'Validation Error', message: 'Passwords do not match.' });
      return;
    }
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ type: 'success', title: 'Password Updated', message: 'Your account password has been updated securely.' });
    }, 1000);
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'INVITED',
    };
    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    toast({ type: 'success', title: 'Invitation Sent', message: `Team invite sent to ${inviteEmail.trim()}` });
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast({ type: 'info', title: 'Team member removed', message: '' });
  };

  return (
    <div className="recruiter-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Settings size={20} style={{ color: 'var(--color-primary-600)' }} />
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Recruiter Account & Team Settings</h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
          Manage your personal recruiter profile, security credentials, email alerts, and team workspace access
        </p>
      </div>

      {/* ── 1. Recruiter Personal Profile ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <User size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Recruiter Profile</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 640 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Full Name" required>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
              </FormField>
              <FormField label="Official Designation" required>
                <Input value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} required />
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Official Email" required>
                <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required />
              </FormField>
              <FormField label="Direct Phone Number" required>
                <Input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} required />
              </FormField>
            </div>

            <div>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Save size={14} />}>
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── 2. Security & Password ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Lock size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Security & Password</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 500 }}>
            <FormField label="Current Password" required>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </FormField>

            <FormField label="New Password" required hint="Minimum 8 characters">
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </FormField>

            <FormField label="Confirm New Password" required>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </FormField>

            <div>
              <Button type="submit" variant="primary" size="sm" loading={passwordLoading} leftIcon={<Key size={14} />}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── 3. Hiring Team Collaboration ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Users size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Hiring Team Members ({teamMembers.length})</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Invite form */}
          <form onSubmit={handleInviteMember} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 540, flexWrap: 'wrap' }}>
            <Input
              type="email"
              placeholder="colleague@techcorp-india.example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{ flex: 1, minWidth: 240 }}
              required
            />
            <Button type="submit" variant="primary" size="sm" leftIcon={<Plus size={14} />}>
              Invite Team Member
            </Button>
          </form>

          {/* Members list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {teamMembers.map((m) => (
              <div key={m.id} style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-gray-50)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-2)'
              }}>
                <div>
                  <strong style={{ fontSize: 'var(--text-sm)' }}>{m.name}</strong>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{m.email} • {m.role}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className={`badge ${m.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                    {m.status}
                  </span>
                  <button type="button" onClick={() => handleRemoveMember(m.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger-600)', cursor: 'pointer' }} title="Remove access">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Notification Preferences ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Bell size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Recruiter Notification Preferences</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>New Applicant Instant Alerts</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Notify immediately when high-match candidates apply to your openings</p>
            </div>
            <Toggle checked={applicantAlerts} onChange={(e) => setApplicantAlerts(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Interview Calendar Sync & Confirmations</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Get reminders 15 minutes before scheduled technical rounds</p>
            </div>
            <Toggle checked={interviewAlerts} onChange={(e) => setInterviewAlerts(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Job Mela Registration & Pass Alerts</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Receive live stall queue dispatches on fair event days</p>
            </div>
            <Toggle checked={jobMelaAlerts} onChange={(e) => setJobMelaAlerts(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Weekly Hiring Analytics Report</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Summary of applicant pipeline conversion and recruiter activity</p>
            </div>
            <Toggle checked={weeklyDigest} onChange={(e) => setWeeklyDigest(e.target.checked)} />
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <Button variant="primary" size="sm" leftIcon={<Save size={14} />} onClick={() => toast({ type: 'success', title: 'Preferences Saved', message: 'Notification preferences updated.' })}>
              Save Notification Preferences
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
