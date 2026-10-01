import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LandingPage } from './features/site/LandingPage';
import { BootstrapPage } from './features/auth/BootstrapPage';
import { LoginPage } from './features/auth/LoginPage';
import { AppShell } from './layout/AppShell';
import { DashboardPage } from './features/erp/DashboardPage';
import ClientesPage from './features/erp/modules/ClientesPage';
import QuotesPage from './features/erp/modules/QuotesPage';
import ServiceOrdersPage from './features/erp/modules/ServiceOrdersPage';
import WorkshopPage from './features/erp/modules/WorkshopPage';
import InventoryPage from './features/erp/modules/InventoryPage';
import PurchasesPage from './features/erp/modules/PurchasesPage';
import FinancePage from './features/erp/modules/FinancePage';
import MachinesPage from './features/erp/modules/MachinesPage';
import ReportsPage from './features/erp/modules/ReportsPage';
import SettingsPage from './features/erp/modules/SettingsPage';
import { getSession, listMyCompanies } from './services/auth';

function AuthGate({ children }: { children: ReactNode }): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsChecking(true);

    void getSession()
      .then(async (state) => {
        if (!state.user) {
          navigate('/auth/login', { replace: true });
          return;
        }

        const companies = await listMyCompanies();
        if (!companies.length) {
          navigate('/auth/cadastro', { replace: true });
          return;
        }

        if (isMounted) setIsChecking(false);
      })
      .catch(() => navigate('/auth/login', { replace: true }));

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  if (isChecking) {
    return (
      <main className="min-h-screen flex align-items-center justify-content-center surface-ground">
        <p className="text-600">Verificando o acesso do ERP...</p>
      </main>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/cadastro" element={<BootstrapPage />} />
        <Route path="/app" element={<AuthGate><AppShell /></AuthGate>}>
          <Route index element={<DashboardPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="orcamentos" element={<QuotesPage />} />
          <Route path="ordens-de-servico" element={<ServiceOrdersPage />} />
          <Route path="oficina" element={<WorkshopPage />} />
          <Route path="estoque" element={<InventoryPage />} />
          <Route path="compras" element={<PurchasesPage />} />
          <Route path="financeiro" element={<FinancePage />} />
          <Route path="equipamentos" element={<MachinesPage />} />
          <Route path="relatorios" element={<ReportsPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
