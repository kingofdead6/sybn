export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`border border-line bg-surface p-6 rounded ${className}`} {...props}>
      {children}
    </div>
  );
}
