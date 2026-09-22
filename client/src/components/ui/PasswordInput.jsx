import { forwardRef, useState } from 'react';
import Input from './Input';

// A password field with a reveal toggle. The button sits inside the field on
// the trailing edge, so it follows the input's own direction rather than the
// page's — password inputs are forced to ltr on the admin forms.
const PasswordInput = forwardRef(function PasswordInput(
  { showLabel, hideLabel, dir, className = '', ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  const trailing = dir === 'ltr' ? 'right-2' : dir === 'rtl' ? 'left-2' : 'end-2';
  const padding = dir === 'ltr' ? 'pr-11' : dir === 'rtl' ? 'pl-11' : 'pe-11';
  const label = visible ? hideLabel || 'Hide password' : showLabel || 'Show password';

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        dir={dir}
        className={`${padding} ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className={`absolute ${trailing} bottom-[9px] rounded-sm p-1 text-muted transition-colors duration-fast ease-out hover:text-accent focus-visible:text-accent`}
        aria-label={label}
        title={label}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <path d="M6.61 6.61A18.15 18.15 0 0 0 2 12s3 8 10 8a9.12 9.12 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
