export interface ErpNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
}

export const erpNavigation: readonly ErpNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/app',
    icon: 'pi pi-home',
    description: 'Visão geral da operação',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    path: '/app/clientes',
    icon: 'pi pi-users',
    description: 'Relacionamento e cadastros',
  },
  {
    id: 'orcamentos',
    label: 'Orçamentos',
    path: '/app/orcamentos',
    icon: 'pi pi-file-edit',
    description: 'Propostas comerciais',
  },
  {
    id: 'ordens-de-servico',
    label: 'Ordens de serviço',
    path: '/app/ordens-de-servico',
    icon: 'pi pi-clipboard',
    description: 'Acompanhe os atendimentos',
  },
  {
    id: 'oficina',
    label: 'Oficina',
    path: '/app/oficina',
    icon: 'pi pi-wrench',
    description: 'Manutenção e bancada',
  },
  {
    id: 'estoque',
    label: 'Estoque',
    path: '/app/estoque',
    icon: 'pi pi-box',
    description: 'Materiais e movimentações',
  },
  {
    id: 'compras',
    label: 'Compras',
    path: '/app/compras',
    icon: 'pi pi-shopping-cart',
    description: 'Pedidos e fornecedores',
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    path: '/app/financeiro',
    icon: 'pi pi-wallet',
    description: 'Contas e fluxo de caixa',
  },
  {
    id: 'equipamentos',
    label: 'Equipamentos',
    path: '/app/equipamentos',
    icon: 'pi pi-cog',
    description: 'Ativos e histórico técnico',
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    path: '/app/relatorios',
    icon: 'pi pi-chart-bar',
    description: 'Indicadores para decisão',
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    path: '/app/configuracoes',
    icon: 'pi pi-sliders-h',
    description: 'Preferências do sistema',
  },
];
