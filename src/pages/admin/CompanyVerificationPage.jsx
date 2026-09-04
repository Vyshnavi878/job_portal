import { useState } from 'react';
import {
  Building2, Search, Filter, ShieldCheck, CheckCircle2,
  XCircle, Eye, AlertCircle, MapPin, Calendar, FileText,
  User, Check, X, Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

export default function CompanyVerificationPage() {
  const { companies, approveCompany, rejectCompany } = useAdmin();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComp, setSelectedComp] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({ open: false, compId: null, reason: '' });

  // Filter companies
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.recruiter.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || c.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (comp) => {
    approveCompany(comp.id);
    addToast(`${comp.name} has been verified and approved.`, 'success');
    if (selectedComp?.id === comp.id) {
      setSelectedComp({ ...selectedComp, verificationStatus: 'VERIFIED' });
    }
  };

  const handleConfirmReject = () => {
    if (!rejectionModal.compId) return;
    rejectCompany(rejectionModal.compId, rejectionModal.reason || 'Verification criteria not met.');
    addToast('Company verification request rejected.', 'info');
    setRejectionModal({ open: false, compId: null, reason: '' });
    if (selectedComp?.id === rejectionModal.compId) {
      setSelectedComp({ ...selectedComp, verificationStatus: 'REJECTED' });
    }
  };

  return (
    <div className="portal-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header card */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={22} style={{ color: 'var(--color-primary-600)' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Company Verification Queue</h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', margin: 0 }}>
              Verify enterprise identity, GSTIN registration, CIN, and official business address before companies can publish hiring openings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{
              background: 'var(--color-warning-50)',
              color: 'var(--color-warning-700)',
              border: '1px solid var(--color-warning-200)',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={15} />
              {companies.filter(c => c.verificationStatus === 'PENDING').length} Pending Verification
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1rem', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by company, recruiter, industry, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: statusFilter === status ? '1px solid var(--color-primary-600)' : '1px solid var(--color-border)',
                  background: statusFilter === status ? 'var(--color-primary-50)' : '#fff',
                  color: statusFilter === status ? 'var(--color-primary-700)' : 'var(--color-gray-600)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {status === 'ALL' ? 'All Companies' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Verification Table */}
      <div className="card" style={{ padding: 0, borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-50)', borderBottom: '1px solid var(--color-gray-200)', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gray-500)', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem' }}>Company</th>
                <th style={{ padding: '1rem' }}>Recruiter</th>
                <th style={{ padding: '1rem' }}>Industry</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Submitted Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-gray-500)' }}>
                    <Building2 size={36} style={{ color: 'var(--color-gray-300)', margin: '0 auto 0.5rem' }} />
                    <p style={{ fontWeight: 600, margin: 0 }}>No company verification requests found.</p>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((comp) => (
                  <tr key={comp.id} style={{ borderBottom: '1px solid var(--color-gray-100)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: '8px',
                          background: 'var(--color-primary-50)',
                          color: 'var(--color-primary-700)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}>
                          {comp.name[0]}
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--color-gray-900)' }}>{comp.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>CIN: {comp.cin || 'CIN-PENDING'}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                      {comp.recruiter}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-gray-600)' }}>
                      {comp.industry}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-gray-600)' }}>
                      {comp.location}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>
                      {comp.registrationDate}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {comp.verificationStatus === 'VERIFIED' ? (
                        <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                          VERIFIED
                        </span>
                      ) : comp.verificationStatus === 'PENDING' ? (
                        <span style={{ fontSize: '0.75rem', background: '#fffbeb', color: '#d97706', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                          PENDING
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', background: '#fef2f2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                          REJECTED
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Button
                          size="xs"
                          variant="outline"
                          icon={<Eye size={13} />}
                          onClick={() => setSelectedComp(comp)}
                        >
                          Review
                        </Button>
                        {comp.verificationStatus === 'PENDING' && (
                          <>
                            <Button
                              size="xs"
                              variant="primary"
                              style={{ background: '#16a34a', borderColor: '#16a34a' }}
                              icon={<Check size={13} />}
                              onClick={() => handleApprove(comp)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              style={{ color: 'var(--color-danger-600)' }}
                              icon={<X size={13} />}
                              onClick={() => setRejectionModal({ open: true, compId: comp.id, reason: '' })}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Company Modal */}
      <Modal
        open={Boolean(selectedComp)}
        onClose={() => setSelectedComp(null)}
        title="Enterprise Verification Review"
        size="lg"
      >
        {selectedComp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#f8fafc',
              border: '1px solid var(--color-gray-200)',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'var(--color-primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                  {selectedComp.name[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{selectedComp.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{selectedComp.industry}</span>
                </div>
              </div>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: selectedComp.verificationStatus === 'VERIFIED' ? '#ecfdf5' : selectedComp.verificationStatus === 'PENDING' ? '#fffbeb' : '#fef2f2',
                  color: selectedComp.verificationStatus === 'VERIFIED' ? '#059669' : selectedComp.verificationStatus === 'PENDING' ? '#d97706' : '#dc2626'
                }}>
                  {selectedComp.verificationStatus}
                </span>
              </div>
            </div>

            {/* Entity Verification Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Corporate CIN Number</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>{selectedComp.cin || 'U72200KA2015PTC078912'}</strong>
              </div>
              <div style={{ padding: '0.75rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>GSTIN Registration</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>{selectedComp.gstin || '29ABCDE1234F1Z5'}</strong>
              </div>
              <div style={{ padding: '0.75rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Primary Recruiter / Admin</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>{selectedComp.recruiter}</strong>
              </div>
              <div style={{ padding: '0.75rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', display: 'block' }}>Location / Headquarters</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>{selectedComp.location}</strong>
              </div>
            </div>

            {/* Verification Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-200)' }}>
              <Button variant="outline" onClick={() => setSelectedComp(null)}>
                Close
              </Button>
              {selectedComp.verificationStatus === 'PENDING' && (
                <>
                  <Button
                    variant="ghost"
                    style={{ color: 'var(--color-danger-600)' }}
                    onClick={() => {
                      const id = selectedComp.id;
                      setSelectedComp(null);
                      setRejectionModal({ open: true, compId: id, reason: '' });
                    }}
                  >
                    Reject Verification
                  </Button>
                  <Button
                    variant="primary"
                    style={{ background: '#16a34a', borderColor: '#16a34a' }}
                    onClick={() => handleApprove(selectedComp)}
                  >
                    Approve & Verify Company
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={rejectionModal.open}
        onClose={() => setRejectionModal({ open: false, compId: null, reason: '' })}
        title="Reject Company Verification"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', margin: 0 }}>
            Please state the rejection reason to notify the enterprise contact.
          </p>
          <textarea
            className="form-control"
            rows={3}
            placeholder="e.g. Incomplete GSTIN certificate or mismatch in registered address."
            value={rejectionModal.reason}
            onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
            style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Button variant="outline" size="sm" onClick={() => setRejectionModal({ open: false, compId: null, reason: '' })}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" style={{ background: 'var(--color-danger-600)', borderColor: 'var(--color-danger-600)' }} onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
