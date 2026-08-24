import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Plus, Search, Users, Eye, Edit2,
  MapPin, DollarSign, Clock, Calendar, CheckCircle2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { EmptyState } from '../../components/ui/States';
import { useToast } from '../../context/ToastContext';

const INITIAL_INTERNSHIPS = [
  {
    id: 'INT-01',
    title: 'Frontend React Development Intern',
    stipend: '₹25,000 / month',
    duration: '6 Months',
    workMode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    applicantsCount: 42,
    status: 'PUBLISHED',
    postedOn: '2026-08-16',
    openings: 4,
  },
  {
    id: 'INT-02',
    title: 'Cloud Infrastructure & DevOps Intern',
    stipend: '₹30,000 / month',
    duration: '6 Months',
    workMode: 'On-site',
    location: 'Bengaluru, Karnataka',
    applicantsCount: 28,
    status: 'PUBLISHED',
    postedOn: '2026-08-19',
    openings: 2,
  },
  {
    id: 'INT-03',
    title: 'UI/UX Design & Research Intern',
    stipend: '₹20,000 / month',
    duration: '3 Months',
    workMode: 'Remote',
    location: 'Remote',
    applicantsCount: 15,
    status: 'PENDING',
    postedOn: '2026-08-22',
    openings: 2,
  },
];

export default function RecruiterInternshipsPage() {
  const { toast } = useToast();

  const [internships, setInternships] = useState(INITIAL_INTERNSHIPS);
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newInternship, setNewInternship] = useState({
    title: '',
    stipend: '₹25,000 / month',
    duration: '6 Months',
    workMode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    openings: '3',
    description: 'We are looking for enthusiastic computer science interns to build modern UI experiences.',
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newInternship.title.trim()) return;
    const created = {
      id: `INT-0${internships.length + 1}`,
      ...newInternship,
      applicantsCount: 0,
      status: 'PENDING',
      postedOn: new Date().toISOString().split('T')[0],
      openings: parseInt(newInternship.openings, 10) || 1,
    };
    setInternships([created, ...internships]);
    setCreateModalOpen(false);
    toast({
      type: 'success',
      title: 'Internship Submitted',
      message: `Internship "${created.title}" submitted for Admin review.`,
    });
  };

  const filtered = internships.filter(i => {
    if (!search.trim()) return true;
    return i.title.toLowerCase().includes(search.toLowerCase());
  });

  const columns = [
    {
      key: 'title',
      label: 'Internship Role',
      sortable: true,
      render: (_, row) => (
        <div>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{row.title}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            {row.duration} • {row.workMode} ({row.location})
          </p>
        </div>
      )
    },
    {
      key: 'stipend',
      label: 'Stipend / Month',
      render: (v) => <strong style={{ color: 'var(--color-success-700)', fontSize: 'var(--text-xs)' }}>{v}</strong>
    },
    {
      key: 'applicantsCount',
      label: 'Applicants',
      sortable: true,
      render: (count) => (
        <span className="badge badge-primary">
          <Users size={12} style={{ marginRight: 4 }} /> {count} Students
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v} />
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <Button size="xs" variant="outline" onClick={() => toast({ type: 'info', title: 'Reviewing Applicants', message: `Opening student list for ${row.title}` })}>
          Review Applicants
        </Button>
      )
    }
  ];

  return (
    <div className="recruiter-internships-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-16)' }}>

      {/* Header Bar */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
              <GraduationCap size={20} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>Manage Internship Opportunities</h1>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Source emerging campus talent, offer summer internships, and build early career pipelines
            </p>
          </div>

          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={() => setCreateModalOpen(true)}>
            Post New Internship
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="input-wrapper" style={{ width: 320 }}>
            <span className="input-icon-left"><Search size={15} /></span>
            <input
              className="input has-icon-left"
              placeholder="Search internships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filtered.length}</strong> active programs
          </p>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-10)' }}>
              <EmptyState icon="internships" title="No internships found" description="Post a new internship to recruit students from top universities." />
            </div>
          ) : (
            <Table
              columns={columns}
              data={filtered}
              rowKey="id"
            />
          )}
        </div>
      </div>

      {/* ── Post Internship Modal ── */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Post New Internship"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <FormField label="Internship Title" required>
            <Input
              placeholder="e.g. AI & ML Engineering Intern"
              value={newInternship.title}
              onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
              required
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField label="Monthly Stipend" required>
              <Input
                value={newInternship.stipend}
                onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Duration" required>
              <Select
                options={['2 Months', '3 Months', '6 Months', '1 Year']}
                value={newInternship.duration}
                onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField label="Work Mode" required>
              <Select
                options={['Hybrid', 'Remote', 'On-site']}
                value={newInternship.workMode}
                onChange={(e) => setNewInternship({ ...newInternship, workMode: e.target.value })}
              />
            </FormField>

            <FormField label="Openings" required>
              <Input
                type="number"
                min="1"
                value={newInternship.openings}
                onChange={(e) => setNewInternship({ ...newInternship, openings: e.target.value })}
                required
              />
            </FormField>
          </div>

          <FormField label="Description & Learning Objectives" required>
            <Textarea
              rows={3}
              value={newInternship.description}
              onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
              required
            />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit for Review</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
