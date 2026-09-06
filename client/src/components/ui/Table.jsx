export default function Table({ columns, children, className = '' }) {
  return (
    <div className={`overflow-x-auto border border-line rounded ${className}`}>
      <table className="w-full text-start text-sm">
        <thead>
          <tr className="border-b border-line bg-paper">
            {columns.map((col) => (
              <th key={col.key || col} className="px-4 py-3 font-medium text-ink text-start">
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
  return <tr className={`border-b border-line last:border-0 ${className}`}>{children}</tr>;
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-body ${className}`}>{children}</td>;
}
