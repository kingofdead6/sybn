import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-saffron text-on-saffron hover:bg-saffron-deep',
  secondary: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-on-ink',
  ghost: 'bg-transparent text-ink hover:bg-surface',
  danger: 'bg-clay text-on-ink hover:opacity-90',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-md',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', as: Comp = 'button', ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
});

export default Button;
