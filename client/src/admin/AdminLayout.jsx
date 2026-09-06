import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RESOURCES = [
  ['programs', 'Programs'],
  ['categories', 'Categories'],
  ['courses', 'Courses'],
  ['team', 'Team'],
  ['stories', 'Stories'],
  ['products', 'Products'],
  ['orders', 'Orders'],
  ['exams', 'Exams'],
  ['certificates', 'Certificates'],
  ['certificate-requests', 'Certificate Requests'],
  ['forum-registrations', 'Forum Registrations'],
  ['proposal-requests', 'Proposal Requests'],
  ['enquiries', 'Enquiries'],
  ['users', 'Users'],
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-paper text-body">
      <aside className="w-60 shrink-0 border-e border-line bg-surface hidden md:flex flex-col">
        <div className="px-4 py-4 border-b border-line">
          <p className="font-display text-md text-ink">SIYB Admin</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-4 py-2 text-sm ${isActive ? 'bg-paper text-saffron-deep font-medium' : 'text-body hover:bg-paper'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/forums-grid"
            className={({ isActive }) =>
              `block px-4 py-2 text-sm ${isActive ? 'bg-paper text-saffron-deep font-medium' : 'text-body hover:bg-paper'}`
            }
          >
            Forums Grid
          </NavLink>
          {RESOURCES.map(([key, label]) => (
            <NavLink
              key={key}
              to={`/admin/${key}`}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm ${isActive ? 'bg-paper text-saffron-deep font-medium' : 'text-body hover:bg-paper'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `block px-4 py-2 text-sm ${isActive ? 'bg-paper text-saffron-deep font-medium' : 'text-body hover:bg-paper'}`
            }
          >
            Settings
          </NavLink>
        </nav>
        <button type="button" onClick={onLogout} className="px-4 py-3 text-sm text-clay border-t border-line text-start">
          Log out
        </button>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
