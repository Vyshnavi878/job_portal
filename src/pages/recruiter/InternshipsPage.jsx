import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Plus, Search, Users, Eye, Edit2,
  MapPin, DollarSign, Clock, Calendar, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useRecruiter } from '../../context/RecruiterContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterInternshipsPage() {
  const { recruiter, createInternship } = useRecruiter();
  const { addToast } = useToast();

  const internships = recruiter?.internships || [];
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newInternship, setNewInternship] = useState({
    title: '',
    stipend: '₹25,000 / month',
    duration: '6 Months',
    workMode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    openings: '3',
    description: 'We are looking for passionate student developers and fresh graduates to join our hands-on engineering team.',
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newInternship.title.trim()) {
      addToast('Please enter an internship title.', 'error');
      return;
    }

    createInternship({
      ...newInternship,
      openings: parseInt(newInternship.openings, 10) || 1,
    });

    setCreateModalOpen(false);
    addToast(`Internship "${newInternship.title}" submitted for Admin review. Status: PENDING.`, 'success');
    setNewInternship({
      title: '',
      stipend: '₹25,000 / month',
      duration: '6 Months',
      workMode: 'Hybrid',
      location: 'Bengaluru, Karnataka',
      openings: '3',
      description: '',
    });
  };

  const filtered = internships.filter(i => {
    if (!search.trim()) return true;
    return i.title.toLowerCase().includes(search.toLowerCase()) ||
           i.location?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="portal-page">
      {/* Header */}
      <div className="portal-header-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gray-900)', margin: 0 }}>
            Internship Programs
          </h1>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Hire fresh student talent and graduate interns across Andhra Pradesh & India.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setCreateModalOpen(true)}>
          Post New Internship
        </Button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search internships by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%', height: '42px', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* Internships Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={48} />}
          title="No internships found"
          description="Create and publish your first internship opportunity to recruit student builders."
          action={
            <Button variant="primary" icon={<Plus size={16} />} onClick={() => setCreateModalOpen(true)}>
              Post Internship
            </Button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-gray-200)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                    {item.title}
                  </h3>
                  <StatusBadge status={item.status} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-gray-600)', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <DollarSign size={14} color="var(--color-primary-600)" />
                    <span style={{ fontWeight: 600, color: 'var(--color-gray-800)' }}>{item.stipend}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--color-gray-400)" />
                    <span>{item.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="var(--color-gray-400)" />
                    <span>{item.location || 'Bengaluru'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Users size={14} color="var(--color-gray-400)" />
                    <span>{item.openings || 2} Openings</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>
                  {item.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-gray-100)', paddingTop: '0.75rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                  {item.applicantsCount || 0} Candidates Applied
                </span>
                <Link to="/recruiter/applications">
                  <Button variant="outline" size="sm">
                    View Applicants
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Internship Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Post New Internship Opportunity"
          size="md"
        >
          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormField label="Internship Title *" required>
              <Input
                type="text"
                placeholder="e.g. Frontend React Development Intern"
                value={newInternship.title}
                onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                required
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="Stipend (Monthly) *" required>
                <Input
                  type="text"
                  placeholder="₹25,000 / month"
                  value={newInternship.stipend}
                  onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Duration *" required>
                <Select
                  value={newInternship.duration}
                  onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                >
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </Select>
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="Work Mode">
                <Select
                  value={newInternship.workMode}
                  onChange={(e) => setNewInternship({ ...newInternship, workMode: e.target.value })}
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </Select>
              </FormField>

              <FormField label="Number of Interns">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={newInternship.openings}
                  onChange={(e) => setNewInternship({ ...newInternship, openings: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Internship Description">
              <Textarea
                rows={3}
                placeholder="Describe the projects, learning mentorship, and student responsibilities..."
                value={newInternship.description}
                onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit for Approval
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
