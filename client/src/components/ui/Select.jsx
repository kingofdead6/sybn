import { forwardRef } from 'react';

const Select = forwardRef(function Select({ label, error, id, className = '', children, ...props }, ref) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full rounded-lg border border-line bg-surface px-4 py-3 text-body shadow-sm transition-colors focus-visible:border-saffron ${className}`}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-clay">{error}</span>}
    </div>
  );
});

export default Select;
