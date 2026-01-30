import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './lib/auth-store';
import { LoginPage } from './pages/LoginPage';
import { ShellLayout } from './layout/ShellLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { ServicesPage } from './pages/ServicesPage';
import { PackagesPage } from './pages/PackagesPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { WorkOrdersPage } from './pages/WorkOrdersPage';
import { CompanyPage } from './pages/CompanyPage';
import { SpacesPage } from './pages/SpacesPage';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.accessToken);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <ShellLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointments/new" element={<AppointmentsPage />} />
        <Route path="work-orders" element={<WorkOrdersPage />} />
        <Route path="work-orders/new" element={<WorkOrdersPage />} />
        <Route path="spaces" element={<SpacesPage />} />
      </Route>
    </Routes>
  );
}
