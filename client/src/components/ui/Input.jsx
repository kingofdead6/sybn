import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs caps-label text-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted transition-colors duration-fast ease-out focus-visible:border-accent ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <span id={`${inputId}-hint`} className="text-xs text-muted">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${inputId}-error`} className="text-xs text-error">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
