import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-accent text-on-saffron shadow-accent hover:brightness-110 hover:shadow-lg',
  secondary: 'bg-surface text-ink border border-line shadow-sm hover:border-saffron hover:text-saffron-deep',
  ghost: 'bg-transparent text-ink hover:bg-surface-muted',
  danger: 'bg-clay text-on-ink shadow-sm hover:opacity-90',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-md',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', as: Comp = 'button', ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
});

export default Button;
