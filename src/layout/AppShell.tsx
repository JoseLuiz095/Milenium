import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { erpNavigation, type ErpNavigationItem } from '../features/erp/erpNavigation';
import { signOut } from '../services/auth';

interface NavigationProps {
  onNavigate?: () => void;
}

function Brand(): ReactNode {
  return (
    <div className="flex align-items-center gap-2 px-3 py-3">
      <div
        className="flex align-items-center justify-content-center border-round-xl"
        style={{ width: '2.65rem', height: '2.65rem', background: '#d4efdc', color: '#103923' }}
        aria-hidden="true"
      >
        <i className="pi pi-sun text-xl" />
      </div>
      <div>
        <div className="font-bold text-xl line-height-1 milenium-brand">Milenium</div>
        <div className="text-xs mt-1" style={{ color: '#b9d8bf' }}>
          Gestão operacional
        </div>
      </div>
    </div>
  );
}

function Navigation({ onNavigate }: NavigationProps): ReactNode {
  return (
    <nav aria-label="Módulos do ERP" className="flex flex-column gap-1 px-2 pb-3 overflow-y-auto">
      {erpNavigation.map((item: ErpNavigationItem) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.id === 'dashboard'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex align-items-center gap-3 px-3 py-3 border-round-lg no-underline transition-colors ${
              isActive ? 'bg-green-700 text-white shadow-2' : 'text-green-50 hover:bg-white-alpha-10'
            }`
          }
          style={{ minHeight: '2.9rem' }}
        >
          <i className={`${item.icon} text-base`} aria-hidden="true" />
          <span className="text-sm font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarFooter(): ReactNode {
  return (
    <div className="mt-auto px-3 py-3 border-top-1 border-green-800">
      <div className="flex align-items-center gap-2 p-2 border-round-lg" style={{ background: 'rgba(255,255,255,.08)' }}>
        <Avatar label="JL" shape="circle" style={{ background: '#d4efdc', color: '#103923' }} />
        <div className="min-w-0">
          <div className="text-sm font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">José Luiz</div>
          <div className="text-xs" style={{ color: '#b9d8bf' }}>Administrador</div>
        </div>
        <i className="pi pi-ellipsis-v ml-auto" aria-hidden="true" />
      </div>
    </div>
  );
}

export function AppShell(): ReactNode {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = erpNavigation.find((item) => item.path === location.pathname) ?? erpNavigation[0];

  return (
    <div className="milenium-shell flex" style={{ background: '#f4f7f2' }}>
      <aside className="erp-sidebar hidden lg:flex flex-column flex-shrink-0" aria-label="Navegação principal">
        <Brand />
        <div className="px-3 pb-2 text-xs uppercase font-semibold" style={{ color: '#8fba98', letterSpacing: '.08em' }}>
          Menu principal
        </div>
        <Navigation />
        <SidebarFooter />
      </aside>

      <Sidebar
        visible={mobileMenuVisible}
        onHide={() => setMobileMenuVisible(false)}
        position="left"
        className="erp-sidebar lg:hidden"
      >
        <div className="h-full flex flex-column" style={{ background: '#103923', color: '#eaf6eb' }}>
          <Brand />
          <div className="px-3 pb-2 text-xs uppercase font-semibold" style={{ color: '#8fba98', letterSpacing: '.08em' }}>
            Menu principal
          </div>
          <Navigation onNavigate={() => setMobileMenuVisible(false)} />
          <SidebarFooter />
        </div>
      </Sidebar>

      <div className="flex-1 min-w-0">
        <header
          className="flex align-items-center justify-content-between px-3 md:px-5 py-3 border-bottom-1 surface-border bg-white sticky top-0 z-2"
          style={{ minHeight: '4rem' }}
        >
          <div className="flex align-items-center gap-3">
            <Button
              icon="pi pi-bars"
              text
              rounded
              className="lg:hidden"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuVisible(true)}
            />
            <div>
              <div className="text-sm text-600 hidden sm:block">Milenium ERP</div>
              <h1 className="m-0 text-xl md:text-2xl font-semibold text-900">{activeItem.label}</h1>
            </div>
          </div>
          <div className="flex align-items-center gap-2 md:gap-3">
            <Button icon="pi pi-bell" text rounded aria-label="Notificações" badge="3" badgeClassName="p-badge-danger" />
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold text-900">José Luiz</div>
              <div className="text-xs text-600">Administrador</div>
            </div>
            <Avatar label="JL" shape="circle" style={{ background: '#d4efdc', color: '#23613a' }} />
            <Button
              icon="pi pi-sign-out"
              text
              rounded
              severity="secondary"
              aria-label="Sair"
              tooltip="Sair"
              onClick={() => {
                void signOut().finally(() => navigate('/auth/login', { replace: true }));
              }}
            />
          </div>
        </header>

        <main className="erp-content p-3 md:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
