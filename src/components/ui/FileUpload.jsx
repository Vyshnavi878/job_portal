import { useRef, useState } from 'react';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';

/**
 * FileUpload / Dropzone component
 * @param {string}   accept    - e.g. '.pdf,.doc,.docx'
 * @param {boolean}  multiple
 * @param {Function} onChange  - (files: FileList) => void
 * @param {string}   maxSize   - human readable e.g. '5 MB'
 * @param {string}   hint      - extra hint text
 */
export default function FileUpload({
  accept,
  multiple = false,
  onChange,
  maxSize = '10 MB',
  hint,
  error,
  disabled,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    setFiles(arr);
    onChange && onChange(fileList);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
  };

  return (
    <div>
      <div
        className={`dropzone ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''} ${error ? 'input-error' : ''}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); !disabled && setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }}
        aria-label="File upload dropzone"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        <Upload size={32} className="dropzone-icon" />
        <p className="dropzone-title">
          <span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>Click to upload</span> or drag and drop
        </p>
        <p className="dropzone-subtitle">
          {accept ? `Accepted: ${accept}` : 'Any file type'} · Max size: {maxSize}
        </p>
        {hint && <p className="dropzone-subtitle">{hint}</p>}
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {files.map((file, idx) => (
            <div key={idx} className="dropzone-preview">
              <File size={20} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="dropzone-preview-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </p>
                <p className="dropzone-preview-size">{formatSize(file.size)}</p>
              </div>
              <CheckCircle2 size={16} style={{ color: 'var(--color-success-500)', flexShrink: 0 }} />
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                onClick={() => removeFile(idx)}
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
