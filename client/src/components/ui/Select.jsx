import { forwardRef } from 'react';

const Select = forwardRef(function Select({ label, error, id, className = '', children, ...props }, ref) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs caps-label text-muted">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full rounded-sm border border-rule bg-surface px-3.5 py-2.5 text-ink transition-colors duration-fast ease-out focus-visible:border-accent ${className}`}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
});

export default Select;
