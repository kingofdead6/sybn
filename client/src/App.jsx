import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LocaleProvider } from './context/LocaleContext';
import RootLayout from './components/layout/RootLayout';
import AdminLayout from './admin/AdminLayout';
import RequireAdmin from './admin/RequireAdmin';
import { AdminLocaleProvider } from './admin/AdminLocaleContext';
import Styleguide from './pages/Styleguide';
import NotFound from './pages/NotFound';

const Home = lazy(() => import('./pages/Home'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const About = lazy(() => import('./pages/About'));
const Worldwide = lazy(() => import('./pages/Worldwide'));
const Network = lazy(() => import('./pages/Network'));
const NetworkProfile = lazy(() => import('./pages/NetworkProfile'));
const Stories = lazy(() => import('./pages/Stories'));
const Forums = lazy(() => import('./pages/Forums'));
const Store = lazy(() => import('./pages/Store'));
const Product = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));
const Verify = lazy(() => import('./pages/Verify'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

const Login = lazy(() => import('./pages/account/Login'));
const Register = lazy(() => import('./pages/account/Register'));
const Dashboard = lazy(() => import('./pages/account/Dashboard'));
const DashboardCertificates = lazy(() => import('./pages/account/DashboardCertificates'));
const DashboardBookings = lazy(() => import('./pages/account/DashboardBookings'));
const ExamAttempt = lazy(() => import('./pages/account/ExamAttempt'));

const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminList = lazy(() => import('./admin/AdminList'));
const AdminForm = lazy(() => import('./admin/AdminForm'));
const AdminForumsGrid = lazy(() => import('./admin/AdminForumsGrid'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));
const AdminExamForm = lazy(() => import('./admin/AdminExamForm'));

function Fallback() {
  return <div className="py-10 text-center text-sage">…</div>;
}

function PublicRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="programs/:slug" element={<ProgramDetail />} />
        <Route path="categories/:slug" element={<CategoryDetail />} />
        <Route path="about" element={<About />} />
        <Route path="worldwide" element={<Worldwide />} />
        <Route path="network" element={<Network />} />
        <Route path="network/:slug" element={<NetworkProfile />} />
        <Route path="stories" element={<Stories />} />
        <Route path="forums" element={<Forums />} />
        <Route path="store" element={<Store />} />
        <Route path="store/:slug" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="verify" element={<Verify />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/certificates" element={<DashboardCertificates />} />
        <Route path="dashboard/bookings" element={<DashboardBookings />} />
        <Route path="exams/:id" element={<ExamAttempt />} />

        <Route path="styleguide" element={<Styleguide />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/en/*" element={<PublicRoutes />} />
          <Route
            path="/admin/login"
            element={
              <AdminLocaleProvider>
                <AdminLogin />
              </AdminLocaleProvider>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminLocaleProvider>
                  <AdminLayout />
                </AdminLocaleProvider>
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="forums-grid" element={<AdminForumsGrid />} />
            <Route path="exams/new" element={<AdminExamForm />} />
            <Route path="exams/:id" element={<AdminExamForm />} />
            <Route path=":resource" element={<AdminList />} />
            <Route path=":resource/new" element={<AdminForm />} />
            <Route path=":resource/:id" element={<AdminForm />} />
          </Route>
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </Suspense>
    </LocaleProvider>
  );
}
