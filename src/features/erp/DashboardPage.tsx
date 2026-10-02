import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import {
  listFinanceRows,
  listClientRows,
  listQuoteRows,
  listServiceOrderRows,
  type FinanceRow,
  type QuoteRow,
  type ServiceOrderRow,
} from '../../services/erpOperations';

type TagSeverity = 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast';

interface Kpi {
  label: string;
  value: string;
  detail: string;
  icon: string;
  color: string;
  severity: TagSeverity;
}

type DashboardDetail = 'orders' | 'quotes' | 'finance' | 'clients' | 'agenda';

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

function KpiCard({ kpi, onClick }: { kpi: Kpi; onClick?: () => void }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => event.key === 'Enter' && onClick?.()}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
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
    </div>
  );
}

function OperationCardView({ card, onDetails }: { card: OperationCard; onDetails?: () => void }) {
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
        <div className="flex align-items-center gap-1">
          {onDetails && <Button label="Detalhes" icon="pi pi-eye" text size="small" onClick={onDetails} />}
          <ActionLink to={card.link} label={card.linkLabel} />
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const [orders, setOrders] = useState<ServiceOrderRow[]>([]);
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [finance, setFinance] = useState<FinanceRow[]>([]);
  const [activeClients, setActiveClients] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detail, setDetail] = useState<DashboardDetail | null>(null);

  useEffect(() => {
    Promise.all([
      listServiceOrderRows(),
      listQuoteRows(),
      listFinanceRows(),
      listClientRows(),
    ])
      .then(([loadedOrders, loadedQuotes, loadedFinance, loadedClients]) => {
        setOrders(loadedOrders);
        setQuotes(loadedQuotes);
        setFinance(loadedFinance);
        setActiveClients(loadedClients.filter((client) => client.status === 'Ativo').length);
      })
      .catch((error: unknown) => {
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar os indicadores agora.',
        );
      });
  }, []);

  const activeOrders = orders.filter(
    (order) => !['Concluída', 'Encerrada', 'Cancelada'].includes(order.status),
  );
  const inProgressOrders = orders.filter((order) => order.status === 'Em andamento');
  const openQuotes = quotes.filter(
    (quote) => !['Aprovado', 'Recusado', 'Cancelado', 'Expirado'].includes(quote.status),
  );
  const openReceivables = finance
    .filter((entry) => entry.type === 'Receita' && entry.status !== 'Pago')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const currentDate = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((order) => order.scheduledAt === currentDate);
  const schedule: ScheduleItem[] = (todayOrders.length ? todayOrders : orders.slice(0, 3)).map(
    (order, index) => ({
      time: todayOrders.length ? 'Hoje' : order.scheduledAt,
      title: order.type,
      customer: order.customer,
      status: order.status,
      severity: order.status === 'Em andamento' ? 'success' : 'info',
      icon: index === 0 ? 'pi pi-wrench' : 'pi pi-calendar',
    }),
  );
  const dynamicKpis: readonly Kpi[] = [
    {
      label: 'Ordens em andamento',
      value: String(activeOrders.length),
      detail: `${inProgressOrders.length} em execução agora`,
      icon: 'pi pi-clipboard',
      color: '#2f7d49',
      severity: 'success',
    },
    {
      label: 'Orçamentos abertos',
      value: String(openQuotes.length),
      detail: `${formatCurrency(openQuotes.reduce((sum, quote) => sum + quote.value, 0))} em propostas`,
      icon: 'pi pi-file-edit',
      color: '#b5771d',
      severity: 'warning',
    },
    {
      label: 'A receber',
      value: formatCurrency(openReceivables),
      detail: 'Títulos em aberto',
      icon: 'pi pi-wallet',
      color: '#3775a8',
      severity: 'info',
    },
    {
      label: 'Clientes ativos',
      value: activeClients === null ? '...' : String(activeClients),
      detail: 'Cadastros ativos no ERP',
      icon: 'pi pi-users',
      color: '#6f5aa8',
      severity: 'secondary',
    },
  ];
  const dynamicOperationCards: readonly OperationCard[] = [
    {
      title: 'Ordens de serviço',
      description: 'Acompanhe os serviços da equipe em campo e na oficina.',
      value: String(activeOrders.length),
      detail: `${inProgressOrders.length} em andamento`,
      icon: 'pi pi-wrench',
      color: '#2f7d49',
      link: '/app/ordens-de-servico',
      linkLabel: 'Ver ordens',
    },
    {
      title: 'Agenda de hoje',
      description: 'Atendimentos programados para a data atual.',
      value: String(todayOrders.length),
      detail: `${orders.length} ordens cadastradas`,
      icon: 'pi pi-calendar',
      color: '#3775a8',
      link: '/app/ordens-de-servico',
      linkLabel: 'Abrir agenda',
    },
    {
      title: 'Compras e estoque',
      description: 'Controle materiais, ferramentas e necessidades da oficina.',
      value: 'Abrir',
      detail: 'Acompanhar abastecimento',
      icon: 'pi pi-box',
      color: '#b5771d',
      link: '/app/estoque',
      linkLabel: 'Ver estoque',
    },
  ];

  const detailTitle = {
    orders: 'Ordens de serviço em aberto',
    quotes: 'Orçamentos em aberto',
    finance: 'Contas a receber',
    clients: 'Clientes ativos',
    agenda: 'Agenda da operação',
  }[detail ?? 'orders'];
  const detailRoute = {
    orders: '/app/ordens-de-servico',
    quotes: '/app/orcamentos',
    finance: '/app/financeiro',
    clients: '/app/clientes',
    agenda: '/app/ordens-de-servico',
  }[detail ?? 'orders'];

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

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
        {dynamicKpis.map((kpi) => (
          <div key={kpi.label} className="col-12 sm:col-6 xl:col-3">
            <KpiCard
              kpi={kpi}
              onClick={() => setDetail(
                kpi.label === 'Ordens em andamento' ? 'orders' :
                kpi.label === 'Orçamentos abertos' ? 'quotes' :
                kpi.label === 'A receber' ? 'finance' : 'clients',
              )}
            />
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
        {loadError && <Message severity="warn" text={loadError} className="mb-3 w-full" />}
        <div className="grid">
          {dynamicOperationCards.map((card) => (
            <div key={card.title} className="col-12 md:col-4">
              <OperationCardView
                card={card}
                onDetails={card.title === 'Ordens de serviço' ? () => setDetail('orders') : card.title === 'Agenda de hoje' ? () => setDetail('agenda') : undefined}
              />
            </div>
          ))}
        </div>
      </section>
      <Dialog
        header={detailTitle}
        visible={Boolean(detail)}
        style={{ width: 'min(720px, 94vw)' }}
        onHide={() => setDetail(null)}
        footer={<Link to={detailRoute} className="p-button p-component p-button-success no-underline"><span className="p-button-label">Abrir módulo</span><i className="pi pi-arrow-right p-button-icon p-button-icon-right" /></Link>}
      >
        {detail === 'orders' && <div className="flex flex-column gap-2">{activeOrders.slice(0, 8).map((order) => <div className="surface-50 border-round-lg p-3 flex justify-content-between gap-3" key={order.id}><div><b>{order.number}</b><div className="text-sm text-600 mt-1">{order.customer} · {order.type}</div></div><Tag value={order.status} /></div>)}{!activeOrders.length && <p className="text-600">Nenhuma ordem em aberto.</p>}</div>}
        {detail === 'quotes' && <div className="flex flex-column gap-2">{openQuotes.slice(0, 8).map((quote) => <div className="surface-50 border-round-lg p-3 flex justify-content-between gap-3" key={quote.id}><div><b>{quote.number}</b><div className="text-sm text-600 mt-1">{quote.customer} · {quote.equipment}</div></div><div className="text-right"><b>{formatCurrency(quote.value)}</b><div><Tag value={quote.status} /></div></div></div>)}{!openQuotes.length && <p className="text-600">Nenhum orçamento em aberto.</p>}</div>}
        {detail === 'finance' && <div className="flex flex-column gap-2">{finance.filter((entry) => entry.type === 'Receita' && entry.status !== 'Pago').slice(0, 8).map((entry) => <div className="surface-50 border-round-lg p-3 flex justify-content-between gap-3" key={entry.id}><div><b>{entry.description}</b><div className="text-sm text-600 mt-1">Vencimento: {entry.dueDate}</div></div><b>{formatCurrency(entry.amount)}</b></div>)}{!openReceivables && <p className="text-600">Nenhum recebimento em aberto.</p>}</div>}
        {detail === 'agenda' && <div className="flex flex-column gap-2">{schedule.map((item) => <div className="surface-50 border-round-lg p-3" key={`${item.time}-${item.title}`}><b>{item.title}</b><div className="text-sm text-600 mt-1">{item.customer} · {item.status}</div></div>)}{!schedule.length && <p className="text-600">Nenhum atendimento programado.</p>}</div>}
        {detail === 'clients' && <p className="text-600">Existem {activeClients ?? 0} clientes ativos cadastrados. Abra o módulo para pesquisar, ver histórico e iniciar um orçamento.</p>}
      </Dialog>

      <section className="grid">
        <div className="col-12 lg:col-7">
          <Card className="erp-panel-card h-full" title="Agenda de hoje" subTitle="Próximos compromissos da equipe">
            <div className="flex flex-column gap-3">
              {schedule.length ? schedule.map((item) => (
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
              )) : (
                <div className="text-sm text-600 py-4">Nenhum atendimento programado para exibir.</div>
              )}
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
