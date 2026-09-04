import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Check, Plus, X, MapPin, Briefcase, DollarSign,
  Building2, Layers, Sliders, CheckCircle2, Save, ArrowRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useCandidate } from '../../context/CandidateContext';
import {
  LOCATIONS, JOB_TYPES, WORK_MODES, SALARY_RANGES,
  INDUSTRIES, SKILL_OPTIONS
} from '../../data/mockData';

export default function CandidateSkillsPreferencesPage() {
  const { toast } = useToast();
  const { candidate, updateSkillsPreferences } = useCandidate();

  // Selected Skills State
  const [selectedSkills, setSelectedSkills] = useState(candidate.skillsPreferences.skills);
  const [customSkill, setCustomSkill] = useState('');

  // Career Preferences State
  const [preferredRoles, setPreferredRoles] = useState(candidate.skillsPreferences.preferredRoles);
  const [customRole, setCustomRole] = useState('');

  const [preferredLocations, setPreferredLocations] = useState(candidate.skillsPreferences.preferredLocations);
  const [expectedSalary, setExpectedSalary] = useState(candidate.skillsPreferences.expectedSalary);
  const [workModes, setWorkModes] = useState([candidate.skillsPreferences.workMode]);
  const [jobTypes, setJobTypes] = useState([candidate.skillsPreferences.jobType]);
  const [industries, setIndustries] = useState(candidate.skillsPreferences.industries);

  useEffect(() => {
    setSelectedSkills(candidate.skillsPreferences.skills);
    setPreferredRoles(candidate.skillsPreferences.preferredRoles);
    setPreferredLocations(candidate.skillsPreferences.preferredLocations);
    setExpectedSalary(candidate.skillsPreferences.expectedSalary);
    setWorkModes([candidate.skillsPreferences.workMode]);
    setJobTypes([candidate.skillsPreferences.jobType]);
    setIndustries(candidate.skillsPreferences.industries);
  }, [candidate]);

  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
      toast({ type: 'success', title: 'Skill Added', message: `Added "${customSkill.trim()}".` });
    }
  };

  const handleAddCustomRole = (e) => {
    e.preventDefault();
    if (customRole.trim() && !preferredRoles.includes(customRole.trim())) {
      setPreferredRoles([...preferredRoles, customRole.trim()]);
      setCustomRole('');
      toast({ type: 'success', title: 'Role Added', message: `Added "${customRole.trim()}".` });
    }
  };

  const handleToggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSaveAll = () => {
    updateSkillsPreferences({
      skills: selectedSkills,
      preferredRoles,
      preferredLocations,
      expectedSalary,
      workMode: workModes[0] || 'Hybrid',
      jobType: jobTypes[0] || 'Full-time',
      industries
    });
    toast({
      type: 'success',
      title: 'Preferences Saved Successfully',
      message: 'Your job matching preferences and skills profile have been updated.',
    });
  };

  return (
    <div className="candidate-skills-preferences-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>
      {/* ── Header ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <Sliders size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Skills & Career Preferences</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Configure matching preferences for {candidate.name} to receive high-relevance job alerts
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save size={14} />}
              onClick={handleSaveAll}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>

      {/* ── 1. Skills Management ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <Layers size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>Technical & Soft Skills ({selectedSkills.length})</h2>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          Select the technologies and skills you actively use. Recruiters search candidates using these exact tags.
        </p>

        {/* Selected skill chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              style={{
                background: 'var(--color-primary-600)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {skill}
              <button
                type="button"
                onClick={() => handleToggleSkill(skill)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        {/* Add custom skill input */}
        <form onSubmit={handleAddCustomSkill} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 380, marginBottom: 'var(--space-6)' }}>
          <input
            className="input"
            placeholder="Type custom skill..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
          />
          <Button size="sm" variant="primary" type="submit" leftIcon={<Plus size={14} />}>Add</Button>
        </form>

        {/* Suggested skills */}
        <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
          Popular Suggested Skills:
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {SKILL_OPTIONS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleToggleSkill(skill)}
                style={{
                  background: isSelected ? 'var(--color-primary-50)' : 'var(--color-surface)',
                  border: isSelected ? '1.5px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  color: isSelected ? 'var(--color-primary-700)' : 'var(--color-text-muted)',
                  borderRadius: 'var(--radius-md)',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isSelected ? '✓ ' : '+ '}{skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Preferred Roles & Locations ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Preferred Roles */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <Briefcase size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>Target Job Roles</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            {preferredRoles.map((role) => (
              <span
                key={role}
                style={{
                  background: 'var(--color-primary-50)',
                  color: 'var(--color-primary-800)',
                  border: '1px solid var(--color-primary-200)',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {role}
                <button
                  type="button"
                  onClick={() => setPreferredRoles(preferredRoles.filter(r => r !== role))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-600)' }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddCustomRole} style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              className="input"
              placeholder="e.g. Lead Architect, Data Scientist..."
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
            />
            <Button size="sm" variant="outline" type="submit">Add Role</Button>
          </form>
        </div>

        {/* Preferred Locations */}
        <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <MapPin size={18} style={{ color: 'var(--color-primary-600)' }} />
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>Preferred Locations</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {LOCATIONS.filter(l => l !== 'All Locations').slice(0, 12).map((loc) => {
              const selected = preferredLocations.includes(loc);
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleToggleItem(preferredLocations, setPreferredLocations, loc)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: selected ? '1.5px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                    background: selected ? 'var(--color-primary-600)' : 'var(--color-surface)',
                    color: selected ? '#fff' : 'var(--color-text-muted)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {selected ? '✓ ' : ''}{loc}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. Work Modes, Job Types & Expected Salary ── */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
          Work Mode, Employment Type & Expected Compensation
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Work Mode */}
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', display: 'block' }}>
              Work Mode Preference
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {WORK_MODES.filter(m => m !== 'All Modes').map((mode) => {
                const active = workModes.includes(mode);
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleToggleItem(workModes, setWorkModes, mode)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: active ? '1.5px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                      background: active ? 'var(--color-primary-50)' : 'var(--color-surface)',
                      color: active ? 'var(--color-primary-700)' : 'var(--color-text-muted)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {active ? '✓ ' : ''}{mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', display: 'block' }}>
              Job Type
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {JOB_TYPES.filter(t => t !== 'All Types').map((type) => {
                const active = jobTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleToggleItem(jobTypes, setJobTypes, type)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: active ? '1.5px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                      background: active ? 'var(--color-primary-50)' : 'var(--color-surface)',
                      color: active ? 'var(--color-primary-700)' : 'var(--color-text-muted)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {active ? '✓ ' : ''}{type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expected Salary */}
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', display: 'block' }}>
              Expected Annual CTC
            </label>
            <select
              className="select"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
            >
              {SALARY_RANGES.filter(s => s !== 'All Salaries').map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={handleSaveAll} leftIcon={<Save size={14} />}>
            Save All Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
