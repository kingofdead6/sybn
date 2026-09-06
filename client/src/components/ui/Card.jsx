export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`border border-line bg-surface p-6 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
