import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

type TagSeverity = 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast';

interface Kpi {
  label: string;
  value: string;
  detail: string;
  icon: string;
  color: string;
  severity: TagSeverity;
}

interface OperationCard {
  title: string;
  description: string;
  value: string;
  detail: string;
  icon: string;
  color: string;
  link: string;
  linkLabel: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  customer: string;
  status: string;
  severity: TagSeverity;
  icon: string;
}

interface ActionLinkProps {
  to: string;
  label: string;
}

function ActionLink({ to, label }: ActionLinkProps) {
  return (
    <Link to={to} className="p-button p-component p-button-text p-button-sm no-underline">
      <span className="p-button-label">{label}</span>
      <i className="pi pi-arrow-right p-button-icon p-button-icon-right" aria-hidden="true" />
    </Link>
  );
}

function PrimaryActionLink({ to, label }: ActionLinkProps) {
  return (
    <Link to={to} className="p-button p-component p-button-success no-underline">
      <i className="pi pi-plus p-button-icon p-button-icon-left" aria-hidden="true" />
      <span className="p-button-label">{label}</span>
    </Link>
  );
}

const kpis: readonly Kpi[] = [
  {
    label: 'Ordens em andamento',
    value: '28',
    detail: '+12% nesta semana',
    icon: 'pi pi-clipboard',
    color: '#2f7d49',
    severity: 'success',
  },
  {
    label: 'Orçamentos abertos',
    value: '16',
    detail: 'R$ 184,6 mil em propostas',
    icon: 'pi pi-file-edit',
    color: '#b5771d',
    severity: 'warning',
  },
  {
    label: 'A receber no mês',
    value: 'R$ 42,8 mil',
    detail: '89% do previsto',
    icon: 'pi pi-wallet',
    color: '#3775a8',
    severity: 'info',
  },
  {
    label: 'Estoque crítico',
    value: '7 itens',
    detail: 'Requer atenção hoje',
    icon: 'pi pi-box',
    color: '#bd4d45',
    severity: 'danger',
  },
];

const operationCards: readonly OperationCard[] = [
  {
    title: 'Ordens de serviço',
    description: 'Acompanhe os serviços da equipe em campo e na oficina.',
    value: '28',
    detail: '9 aguardando atendimento',
    icon: 'pi pi-wrench',
    color: '#2f7d49',
    link: '/app/ordens-de-servico',
    linkLabel: 'Ver ordens',
  },
  {
    title: 'Agenda de hoje',
    description: 'Visitas técnicas e atendimentos programados para hoje.',
    value: '12',
    detail: '3 próximas em até 2 horas',
    icon: 'pi pi-calendar',
    color: '#3775a8',
    link: '/app/ordens-de-servico',
    linkLabel: 'Abrir agenda',
  },
  {
    title: 'Compras pendentes',
    description: 'Pedidos de compra aguardando aprovação ou recebimento.',
    value: '6',
    detail: 'R$ 18,4 mil comprometidos',
    icon: 'pi pi-shopping-cart',
    color: '#b5771d',
    link: '/app/compras',
    linkLabel: 'Ver compras',
  },
];

const schedule: readonly ScheduleItem[] = [
  {
    time: '08:30',
    title: 'Manutenção do pivô central',
    customer: 'Fazenda Boa Vista',
    status: 'Em campo',
    severity: 'success',
    icon: 'pi pi-map-marker',
  },
  {
    time: '10:00',
    title: 'Avaliação de sistema de irrigação',
    customer: 'Agro Santa Clara',
    status: 'A confirmar',
    severity: 'warning',
    icon: 'pi pi-clock',
  },
  {
    time: '14:00',
    title: 'Entrega de conjunto de filtros',
    customer: 'Sítio Água Limpa',
    status: 'Programada',
    severity: 'info',
    icon: 'pi pi-truck',
  },
];

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <Card className="erp-kpi-card h-full" style={{ '--kpi-color': kpi.color } as CSSProperties}>
      <div className="flex justify-content-between align-items-start gap-3">
        <div>
          <div className="text-sm text-600 mb-2">{kpi.label}</div>
          <div className="text-2xl font-bold text-900">{kpi.value}</div>
        </div>
        <div
          className="flex align-items-center justify-content-center border-round-lg"
          style={{ width: '2.5rem', height: '2.5rem', color: kpi.color, background: `${kpi.color}18` }}
        >
          <i className={`${kpi.icon} text-lg`} aria-hidden="true" />
        </div>
      </div>
      <div className="flex align-items-center gap-2 mt-3">
        <Tag value={kpi.detail} severity={kpi.severity} rounded />
      </div>
    </Card>
  );
}

function OperationCardView({ card }: { card: OperationCard }) {
  return (
    <Card className="erp-operation-card h-full">
      <div className="flex align-items-start gap-3 mb-3">
        <div
          className="flex align-items-center justify-content-center border-round-lg flex-shrink-0"
          style={{ width: '2.65rem', height: '2.65rem', color: card.color, background: `${card.color}18` }}
        >
          <i className={`${card.icon} text-lg`} aria-hidden="true" />
        </div>
        <div>
          <h3 className="m-0 text-lg text-900">{card.title}</h3>
          <p className="m-0 mt-1 text-sm text-600 line-height-3">{card.description}</p>
        </div>
      </div>
      <div className="flex align-items-end justify-content-between gap-3 mt-4">
        <div>
          <div className="text-3xl font-bold text-900">{card.value}</div>
          <div className="text-xs text-600 mt-1">{card.detail}</div>
        </div>
        <ActionLink to={card.link} label={card.linkLabel} />
      </div>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <div className="erp-dashboard flex flex-column gap-4">
      <section className="erp-welcome-card flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
        <div>
          <div className="erp-eyebrow mb-2">Centro de operação</div>
          <h2 className="m-0 text-3xl font-semibold text-900">Bom dia, José Luiz</h2>
          <p className="m-0 mt-2 text-600">Uma visão rápida do que precisa avançar hoje na Milenium.</p>
        </div>
        <div className="flex align-items-center gap-2 flex-wrap">
          <Link to="/app/ordens-de-servico" className="p-button p-component p-button-outlined p-button-secondary no-underline">
            <i className="pi pi-calendar p-button-icon p-button-icon-left" aria-hidden="true" />
            <span className="p-button-label">Ver agenda</span>
          </Link>
          <PrimaryActionLink to="/app/orcamentos" label="Novo orçamento" />
        </div>
      </section>

      <section className="grid" aria-label="Indicadores principais">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="col-12 sm:col-6 xl:col-3">
            <KpiCard kpi={kpi} />
          </div>
        ))}
      </section>

      <section>
        <div className="flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="m-0 text-xl font-semibold text-900">Operação</h2>
            <p className="m-0 mt-1 text-sm text-600">Acompanhe os pontos que pedem atenção.</p>
          </div>
          <ActionLink to="/app/relatorios" label="Ver relatórios" />
        </div>
        <div className="grid">
          {operationCards.map((card) => (
            <div key={card.title} className="col-12 md:col-4">
              <OperationCardView card={card} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid">
        <div className="col-12 lg:col-7">
          <Card className="erp-panel-card h-full" title="Agenda de hoje" subTitle="Próximos compromissos da equipe">
            <div className="flex flex-column gap-3">
              {schedule.map((item) => (
                <div key={`${item.time}-${item.title}`} className="flex align-items-center gap-3 py-2 border-bottom-1 surface-border">
                  <div className="text-sm font-semibold text-700" style={{ width: '3.25rem' }}>{item.time}</div>
                  <div className="flex align-items-center justify-content-center border-round-lg bg-green-50 text-green-700 flex-shrink-0" style={{ width: '2.25rem', height: '2.25rem' }}>
                    <i className={item.icon} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-900 white-space-nowrap overflow-hidden text-overflow-ellipsis">{item.title}</div>
                    <div className="text-sm text-600 mt-1">{item.customer}</div>
                  </div>
                  <Tag value={item.status} severity={item.severity} className="hidden sm:inline-flex" />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <ActionLink to="/app/ordens-de-servico" label="Ver agenda completa" />
            </div>
          </Card>
        </div>

        <div className="col-12 lg:col-5">
          <Card className="erp-panel-card h-full" title="Saúde do estoque" subTitle="Posição atual dos materiais">
            <div className="flex align-items-center justify-content-between mb-2">
              <span className="text-sm text-600">Nível médio de disponibilidade</span>
              <span className="font-bold text-green-700">78%</span>
            </div>
            <ProgressBar value={78} showValue={false} className="h-1rem" />
            <div className="grid mt-3">
              <div className="col-6">
                <div className="text-2xl font-bold text-900">142</div>
                <div className="text-sm text-600 mt-1">Itens disponíveis</div>
              </div>
              <div className="col-6">
                <div className="text-2xl font-bold text-orange-600">7</div>
                <div className="text-sm text-600 mt-1">Abaixo do mínimo</div>
              </div>
            </div>
            <div className="flex align-items-center gap-2 mt-3 p-3 border-round-lg bg-orange-50 text-orange-800">
              <i className="pi pi-exclamation-triangle" aria-hidden="true" />
              <span className="text-sm">Revise os itens críticos antes das próximas demandas da oficina.</span>
            </div>
            <div className="mt-3">
              <ActionLink to="/app/estoque" label="Abrir estoque" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
