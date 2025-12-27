import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientsList from './pages/ClientsList';
import ClientDetails from './pages/ClientDetails';
import ClientForm from './pages/ClientForm';
import CRM from './pages/CRM';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
import Integrations from './pages/Integrations';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Marketing from './pages/Marketing';
import Documents from './pages/Documents';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/new" element={<ClientForm />} />
            <Route path="clients/:id" element={<ClientDetails />} />
            <Route path="clients/:id/edit" element={<ClientForm />} />
            <Route path="leads" element={<Leads />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="documents" element={<Documents />} />
            <Route path="crm" element={<CRM />} />
            <Route path="sales" element={<Sales />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
