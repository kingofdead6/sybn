export default function Table({ columns, children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-md border border-rule shadow-raised ${className}`}>
      <table className="w-full text-start text-sm">
        <thead>
          <tr className="border-b border-rule bg-sunk">
            {columns.map((col) => (
              <th key={col.key || col} className="px-4 py-2.5 text-2xs caps-label text-muted text-start">
                {col.label || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, className = '' }) {
  return <tr className={`border-b border-rule last:border-0 ${className}`}>{children}</tr>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm text-ink-soft ${className}`}>{children}</td>;
}
