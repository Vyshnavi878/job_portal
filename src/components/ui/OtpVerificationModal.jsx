import { Modal } from './Modal';
import OtpVerificationView from './OtpVerificationView';

/**
 * Reusable OtpVerificationModal wrapper
 */
export default function OtpVerificationModal({
  open,
  onClose,
  email,
  flowId,
  onVerified,
  onChangeEmail,
  title = 'Verify Your Email',
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      size="sm"
      closable={true}
    >
      <div style={{ padding: 'var(--space-2) var(--space-2) var(--space-2)' }}>
        <OtpVerificationView
          email={email}
          flowId={flowId}
          onVerified={onVerified}
          onChangeEmail={() => {
            if (onChangeEmail) onChangeEmail();
            if (onClose) onClose();
          }}
          title={title}
        />
      </div>
    </Modal>
  );
}
