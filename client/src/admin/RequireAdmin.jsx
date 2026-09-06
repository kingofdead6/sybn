import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="py-10 text-center text-sage">…</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
