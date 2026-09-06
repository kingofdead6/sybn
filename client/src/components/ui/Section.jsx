export default function Section({ tone = 'paper', className = '', children, as: Comp = 'section', ...props }) {
  const bg = tone === 'surface' ? 'bg-surface-muted' : 'bg-paper';
  return (
    <Comp className={`${bg} py-9 md:py-10 ${className}`} {...props}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">{children}</div>
    </Comp>
  );
}
