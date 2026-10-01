import type {
  FinancialEntry,
  Item,
  Lead,
  Party,
  Quote,
  ServiceOrder,
} from "../types/domain";

const now = "2026-01-15T12:00:00.000Z";
const companyId = "00000000-0000-0000-0000-000000000001";

export const mockParties: Party[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    company_id: companyId,
    party_type: "customer",
    name: "Fazenda Santa Helena",
    document: null,
    email: "contato@santahelena.example",
    phone: "(27) 99999-0001",
    notes: "Cliente de irrigação e manutenção.",
    status: "active",
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    company_id: companyId,
    party_type: "supplier",
    name: "Aço Linhares",
    document: null,
    email: "compras@acolinhares.example",
    phone: "(27) 3333-0002",
    notes: null,
    status: "active",
    created_at: now,
    updated_at: now,
  },
];

export const mockItems: Item[] = [
  {
    id: "00000000-0000-0000-0000-000000000201",
    company_id: companyId,
    sku: "MAT-001",
    name: 'Tubo galvanizado 2"',
    item_type: "material",
    unit: "m",
    unit_price: 48.5,
    cost_price: 31.2,
    status: "active",
    notes: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000202",
    company_id: companyId,
    sku: "SRV-001",
    name: "Diagnóstico técnico em campo",
    item_type: "service",
    unit: "serviço",
    unit_price: 850,
    cost_price: 420,
    status: "active",
    notes: null,
    created_at: now,
    updated_at: now,
  },
];

export const mockLeads: Lead[] = [
  {
    id: "00000000-0000-0000-0000-000000000301",
    company_id: companyId,
    party_id: null,
    name: "Marcos Oliveira",
    company_name: "Sítio Boa Vista",
    email: "marcos@example.com",
    phone: "(27) 98888-0003",
    source: "site",
    description: "Adequação de conjunto de bombeamento.",
    estimated_value: 12500,
    status: "qualified",
    created_at: now,
    updated_at: now,
  },
];

export const mockQuotes: Quote[] = [
  {
    id: "00000000-0000-0000-0000-000000000401",
    company_id: companyId,
    party_id: mockParties[0].id,
    property_id: null,
    lead_id: mockLeads[0].id,
    number: "ORC-2026-0001",
    status: "sent",
    issued_at: "2026-01-14",
    expires_at: "2026-02-13",
    subtotal: 12500,
    discount: 0,
    total: 12500,
    notes: "Validade de 30 dias.",
    created_by: null,
    created_at: now,
    updated_at: now,
  },
];

export const mockServiceOrders: ServiceOrder[] = [
  {
    id: "00000000-0000-0000-0000-000000000501",
    company_id: companyId,
    party_id: mockParties[0].id,
    property_id: null,
    machine_id: null,
    quote_id: mockQuotes[0].id,
    lead_id: mockLeads[0].id,
    number: "OS-2026-0001",
    title: "Adequação do conjunto de bombeamento",
    status: "planned",
    priority: "high",
    assigned_to: null,
    planned_start: "2026-01-20",
    planned_end: "2026-01-22",
    subtotal: 12500,
    cost_total: 7200,
    notes: "Aguardando confirmação de material.",
    created_at: now,
    updated_at: now,
  },
];

export const mockFinancialEntries: FinancialEntry[] = [
  {
    id: "00000000-0000-0000-0000-000000000601",
    company_id: companyId,
    party_id: mockParties[0].id,
    quote_id: mockQuotes[0].id,
    service_order_id: mockServiceOrders[0].id,
    purchase_order_id: null,
    entry_type: "receivable",
    category: "Serviços",
    description: "Sinal da OS-2026-0001",
    amount: 6250,
    due_date: "2026-02-20",
    settled_at: null,
    status: "pending",
    created_by: null,
    created_at: now,
    updated_at: now,
  },
];
