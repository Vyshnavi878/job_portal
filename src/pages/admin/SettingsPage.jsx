import { useState } from 'react';
import {
  Settings, ShieldCheck, Lock, Bell, Server, Database,
  Key, Save, AlertTriangle, RefreshCw, CheckCircle2, UserCheck,
  Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import { Toggle } from '../../components/ui/FormControls';
import { useToast } from '../../context/ToastContext';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const { settings, updateAdminSettings, adminUsers, activeAdminId, switchAdmin, currentAdmin } = useAdmin();

  const [platformName, setPlatformName] = useState(settings?.platformName || 'NTR VIKASA Job Portal Enterprise');
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || 'support@ntrvikasa.com');
  const [grievanceEmail, setGrievanceEmail] = useState(settings?.grievanceEmail || 'grievance@ntrvikasa.com');

  // Security Policy Toggles
  const [requireRecruiterVerification, setRequireRecruiterVerification] = useState(settings?.requireRecruiterVerification ?? true);
  const [requireJobModeration, setRequireJobModeration] = useState(settings?.requireJobModeration ?? true);
  const [enforceZeroCandidateFee, setEnforceZeroCandidateFee] = useState(settings?.enforceZeroCandidateFee ?? true);
  const [enableMaintenanceMode, setEnableMaintenanceMode] = useState(settings?.enableMaintenanceMode ?? false);

  const handleSave = () => {
    updateAdminSettings({
      platformName,
      supportEmail,
      grievanceEmail,
      requireRecruiterVerification,
      requireJobModeration,
      enforceZeroCandidateFee,
      enableMaintenanceMode,
    });
    addToast('System configuration and policy settings updated successfully.', 'success');
  };

  const handleSwitchAdmin = (adminId) => {
    switchAdmin(adminId);
    const target = adminUsers.find(a => a.id === adminId);
    addToast(`Switched active administrator to: ${target?.name} (${target?.email})`, 'success');
  };

  return (
    <div className="admin-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Settings size={20} style={{ color: 'var(--color-primary-600)' }} />
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>System & Global Platform Settings</h1>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 2, margin: 0 }}>
          Configure enterprise platform parameters, verification policies, and security guardrails.
        </p>
      </div>

      {/* ── 0. Active Administrator Profile & Switcher ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-primary-200)', background: 'var(--color-primary-50)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <UserCheck size={18} style={{ color: 'var(--color-primary-700)' }} />
            <h2 className="card-title" style={{ color: 'var(--color-primary-900)' }}>Active Administrator Profile</h2>
          </div>
          <span style={{ fontSize: '11px', background: 'var(--color-primary-600)', color: '#fff', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
            Active Session
          </span>
        </div>
        <div className="card-body">
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-800)', marginBottom: 'var(--space-4)' }}>
            Currently managing the NTR Vikasa portal as <strong>{currentAdmin?.name}</strong> ({currentAdmin?.email} • {currentAdmin?.title}). Select below to simulate super-admin role changes:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
            {adminUsers.map((admin) => {
              const isCurrent = admin.id === activeAdminId;
              return (
                <div
                  key={admin.id}
                  onClick={() => handleSwitchAdmin(admin.id)}
                  style={{
                    background: isCurrent ? '#fff' : 'rgba(255,255,255,0.6)',
                    border: isCurrent ? '2px solid var(--color-primary-600)' : '1px solid var(--color-primary-200)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    boxShadow: isCurrent ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-full)',
                    background: isCurrent ? 'linear-gradient(135deg, #1e1b4b, #4338ca)' : 'var(--color-gray-200)',
                    color: isCurrent ? '#fff' : 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 'var(--text-sm)'
                  }}>
                    {admin.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{admin.name}</strong>
                      {isCurrent && <CheckCircle2 size={14} style={{ color: 'var(--color-primary-600)' }} />}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary-700)', display: 'block', fontWeight: 600 }}>{admin.title}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{admin.email}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 1. General Platform Configuration ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Server size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">General Platform Parameters</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 640 }}>
            <FormField label="Platform Display Name" required>
              <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <FormField label="Primary Support Email" required>
                <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
              </FormField>
              <FormField label="Grievance Redressal Email" required>
                <Input value={grievanceEmail} onChange={(e) => setGrievanceEmail(e.target.value)} />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Moderation & Compliance Policies ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <ShieldCheck size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 className="card-title">Moderation & Regulatory Policies</h2>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>Mandatory Recruiter Legal Verification</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>Require Admin COI & GST approval before allowing employers to post vacancies</p>
            </div>
            <Toggle checked={requireRecruiterVerification} onChange={(e) => setRequireRecruiterVerification(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>Pre-Publish Job Moderation Queue</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>Hold new job and internship postings for administrative wage transparency checks</p>
            </div>
            <Toggle checked={requireJobModeration} onChange={(e) => setRequireJobModeration(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-gray-100)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>Strict Zero-Fee Candidate Rule Enforcement</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>Automatically flag any recruiter mentioning registration fees or security deposits</p>
            </div>
            <Toggle checked={enforceZeroCandidateFee} onChange={(e) => setEnforceZeroCandidateFee(e.target.checked)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>Platform Maintenance Mode</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>Restrict public candidate registration during scheduled state-wide database maintenance</p>
            </div>
            <Toggle checked={enableMaintenanceMode} onChange={(e) => setEnableMaintenanceMode(e.target.checked)} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" size="lg" leftIcon={<Save size={16} />} onClick={handleSave}>
          Save System Settings
        </Button>
      </div>
    </div>
  );
}
