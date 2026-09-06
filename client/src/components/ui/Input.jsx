import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-lg border border-line bg-surface px-4 py-3 text-body shadow-sm placeholder:text-sage transition-colors focus-visible:border-saffron ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <span id={`${inputId}-hint`} className="text-xs text-sage">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${inputId}-error`} className="text-xs text-clay">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
