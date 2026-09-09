import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-accent text-on-accent border border-accent shadow-raised hover:bg-accent-deep hover:border-accent-deep hover:shadow-md',
  secondary: 'bg-transparent text-ink border border-rule-strong hover:border-ink hover:bg-sunk',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-sunk',
  danger: 'bg-error text-on-accent border border-error hover:opacity-90',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', as: Comp = 'button', ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      className={`btn-label inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-base ease-out disabled:opacity-45 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
});

export default Button;
