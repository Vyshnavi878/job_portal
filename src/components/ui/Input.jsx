import { useState, forwardRef } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';

/**
 * Input component
 * @param {string} type       - text | password | search | email | number | tel | url
 * @param {string} size       - sm | md | lg
 * @param {ReactNode} leftIcon
 * @param {ReactNode} rightIcon
 * @param {string} error
 * @param {string} success
 * @param {boolean} clearable - show clear button (search inputs)
 */
const Input = forwardRef(function Input({
  type = 'text',
  size = 'md',
  leftIcon,
  rightIcon,
  error,
  success,
  clearable = false,
  onClear,
  className = '',
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isSearch   = type === 'search';

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : (isSearch ? 'text' : type);

  const resolvedLeftIcon = isSearch ? <Search size={16} /> : leftIcon;
  const hasLeft  = !!resolvedLeftIcon;
  const hasRight = isPassword || !!rightIcon || (clearable && props.value);

  const stateClass = error ? 'input-error' : success ? 'input-success' : '';
  const sizeClass  = size === 'sm' ? 'input-sm' : size === 'lg' ? 'input-lg' : '';

  const inputClass = [
    'input',
    stateClass,
    sizeClass,
    hasLeft  ? 'has-icon-left'  : '',
    hasRight ? 'has-icon-right' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="input-wrapper">
      {hasLeft && (
        <span className="input-icon-left">{resolvedLeftIcon}</span>
      )}
      <input
        ref={ref}
        type={inputType}
        className={inputClass}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          className="input-icon-right"
          onClick={() => setShowPassword((v) => !v)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
      {!isPassword && clearable && props.value && (
        <button
          type="button"
          className="input-icon-right"
          onClick={onClear}
          tabIndex={-1}
          aria-label="Clear"
        >
          <X size={16} />
        </button>
      )}
      {!isPassword && rightIcon && !clearable && (
        <span className="input-icon-right">{rightIcon}</span>
      )}
    </div>
  );
});

export default Input;
