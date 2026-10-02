import { supabase } from "../lib/supabase";
import type {
  FinancialEntry,
  Party,
} from "../types/domain";
import { getSession, listMyCompanies } from "./auth";

const DEMO_OPERATIONS_KEY = "milenium.demo.operations.v1";

export type ClientRow = {
  id: string;
  code: string;
  name: string;
  document: string;
  phone: string;
  city: string;
  status: string;
  lastService: string;
};

export type ClientOption = Pick<ClientRow, "id" | "name">;

export type QuoteRow = {
  id: string;
  number: string;
  customerId: string | null;
  customer: string;
  equipment: string;
  value: number;
  issueDate: string;
  validUntil: string;
  status: string;
};

export type ServiceOrderRow = {
  id: string;
  number: string;
  customerId: string | null;
  customer: string;
  type: string;
  technician: string;
  scheduledAt: string;
  status: string;
};

export type FinanceRow = {
  id: string;
  code: string;
  description: string;
  type: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
};

export type ClientActivity = {
  id: string;
  type: "Orçamento" | "Ordem de serviço";
  title: string;
  date: string;
  status: string;
  value?: number;
};

type DemoStore = {
  clients: ClientRow[];
  quotes: QuoteRow[];
  orders: ServiceOrderRow[];
  finance: FinanceRow[];
};

const demoSeed: DemoStore = {
  clients: [
    {
      id: "demo-client-santa-helena",
      code: "CLI-0001",
      name: "Fazenda Santa Helena",
      document: "—",
      phone: "(27) 99999-0001",
      city: "Linhares/ES",
      status: "Ativo",
      lastService: "2026-09-18",
    },
  ],
  quotes: [
    {
      id: "demo-quote-1",
      number: "ORC-2026-0001",
      customerId: "demo-client-santa-helena",
      customer: "Fazenda Santa Helena",
      equipment: "Recuperação de componentes e adequação de irrigação",
      value: 12500,
      issueDate: "2026-09-23",
      validUntil: "2026-10-23",
      status: "Enviado",
    },
  ],
  orders: [
    {
      id: "demo-order-1",
      number: "OS-2026-0001",
      customerId: "demo-client-santa-helena",
      customer: "Fazenda Santa Helena",
      type: "Usinagem e reparo de componente",
      technician: "Equipe de oficina",
      scheduledAt: "2026-10-02",
      status: "Agendada",
    },
  ],
  finance: [
    {
      id: "demo-finance-1",
      code: "FIN-0001",
      description: "Sinal do orçamento ORC-2026-0001",
      type: "Receita",
      category: "Serviços",
      amount: 6250,
      dueDate: "2026-10-03",
      status: "Pendente",
    },
  ],
};

function cloneSeed(): DemoStore {
  return JSON.parse(JSON.stringify(demoSeed)) as DemoStore;
}

function readDemoStore(): DemoStore {
  if (typeof localStorage === "undefined") return cloneSeed();
  const value = localStorage.getItem(DEMO_OPERATIONS_KEY);
  if (!value) {
    const seed = cloneSeed();
    localStorage.setItem(DEMO_OPERATIONS_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(value) as DemoStore;
  } catch {
    const seed = cloneSeed();
    localStorage.setItem(DEMO_OPERATIONS_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeDemoStore(store: DemoStore): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(DEMO_OPERATIONS_KEY, JSON.stringify(store));
  }
}

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function activeCompanyId(): Promise<string> {
  const companies = await listMyCompanies();
  const company = companies.find((item) => item.status === "active") ?? companies[0];
  if (!company) {
    throw new Error(
      "Finalize o cadastro inicial da empresa antes de registrar informações no ERP.",
    );
  }
  return company.id;
}

async function currentUserId(): Promise<string | null> {
  const session = await getSession();
  return session.user?.id ?? null;
}

function displayClientStatus(notes: string | null, status: string): string {
  const match = notes?.match(/^\[milenium-status:(.+?)\]/);
  if (match) return match[1];
  return status === "active" ? "Ativo" : "Inativo";
}

function clientNotes(status: string): string {
  return `[milenium-status:${status}]`;
}

function splitCity(value: string): { city: string | null; state: string | null } {
  const [city, state] = value.split("/").map((part) => part.trim());
  return { city: city || null, state: state || null };
}

function toQuoteStatus(status: string): QuoteRow["status"] {
  return (
    {
      draft: "Rascunho",
      sent: "Enviado",
      accepted: "Aprovado",
      rejected: "Recusado",
      expired: "Expirado",
      cancelled: "Cancelado",
    } as Record<string, QuoteRow["status"]>
  )[status] ?? status;
}

function toServiceOrderStatus(status: string): ServiceOrderRow["status"] {
  return (
    {
      draft: "Rascunho",
      triage: "Triagem",
      planned: "Agendada",
      in_progress: "Em andamento",
      waiting_material: "Aguardando peça",
      waiting_third_party: "Aguardando terceiro",
      waiting_customer: "Aguardando cliente",
      completed: "Concluída",
      approved: "Aprovada",
      billed: "Faturada",
      closed: "Encerrada",
      cancelled: "Cancelada",
    } as Record<string, ServiceOrderRow["status"]>
  )[status] ?? status;
}

function toFinanceStatus(status: string): FinanceRow["status"] {
  return (
    {
      pending: "Pendente",
      due: "Vencendo",
      partially_paid: "Parcial",
      paid: "Pago",
      cancelled: "Cancelado",
      overdue: "Vencido",
    } as Record<string, FinanceRow["status"]>
  )[status] ?? status;
}

function parseTechnician(notes: string | null): string {
  const match = notes?.match(/^\[milenium-technician:(.+?)\]/);
  return match?.[1] || "Equipe de oficina";
}

function serviceOrderNotes(technician: string): string {
  return `[milenium-technician:${technician || "Equipe de oficina"}]`;
}

function clientRow(
  party: Party,
  index: number,
  city = "—",
  lastService = "—",
): ClientRow {
  return {
    id: party.id,
    code: `CLI-${String(index + 1).padStart(4, "0")}`,
    name: party.name,
    document: party.document ?? "—",
    phone: party.phone ?? "—",
    city,
    status: displayClientStatus(party.notes, party.status),
    lastService,
  };
}

export async function listClientRows(): Promise<ClientRow[]> {
  if (!supabase) return readDemoStore().clients;

  const companyId = await activeCompanyId();
  const [partiesResult, propertiesResult, ordersResult] = await Promise.all([
    supabase
      .from("milenium_parties")
      .select("*")
      .eq("company_id", companyId)
      .in("party_type", ["customer", "company", "person"])
      .order("created_at", { ascending: false }),
    supabase
      .from("milenium_properties")
      .select("party_id, city, state")
      .eq("company_id", companyId)
      .eq("status", "active"),
    supabase
      .from("milenium_service_orders")
      .select("party_id, planned_start, created_at")
      .eq("company_id", companyId)
      .order("planned_start", { ascending: false }),
  ]);
  if (partiesResult.error) throw partiesResult.error;
  if (propertiesResult.error) throw propertiesResult.error;
  if (ordersResult.error) throw ordersResult.error;

  return partiesResult.data.map((party, index) => {
    const property = propertiesResult.data.find((item) => item.party_id === party.id);
    const latestOrder = ordersResult.data.find((item) => item.party_id === party.id);
    const city = [property?.city, property?.state].filter(Boolean).join("/") || "—";
    return clientRow(
      party,
      index,
      city,
      latestOrder?.planned_start ?? latestOrder?.created_at.slice(0, 10) ?? "—",
    );
  });
}

export async function listClientOptions(): Promise<ClientOption[]> {
  const clients = await listClientRows();
  return clients.map(({ id, name }) => ({ id, name }));
}

export async function createClientRow(input: {
  name: string;
  document?: string;
  phone?: string;
  city?: string;
  status?: string;
}): Promise<ClientRow> {
  if (!supabase) {
    const store = readDemoStore();
    const row: ClientRow = {
      id: createId(),
      code: `CLI-${String(store.clients.length + 1).padStart(4, "0")}`,
      name: input.name.trim(),
      document: input.document?.trim() || "—",
      phone: input.phone?.trim() || "—",
      city: input.city?.trim() || "—",
      status: input.status || "Ativo",
      lastService: "—",
    };
    store.clients = [row, ...store.clients];
    writeDemoStore(store);
    return row;
  }

  const companyId = await activeCompanyId();
  const status = input.status || "Ativo";
  const { data: party, error } = await supabase
    .from("milenium_parties")
    .insert({
      company_id: companyId,
      party_type: "customer",
      name: input.name.trim(),
      document: input.document?.trim() || null,
      phone: input.phone?.trim() || null,
      status: status === "Inativo" ? "inactive" : "active",
      notes: clientNotes(status),
    })
    .select("*")
    .single();
  if (error) throw error;

  const location = splitCity(input.city?.trim() || "");
  if (location.city) {
    const { error: propertyError } = await supabase
      .from("milenium_properties")
      .insert({
        company_id: companyId,
        party_id: party.id,
        name: `Local principal · ${party.name}`,
        city: location.city,
        state: location.state,
        status: "active",
      });
    if (propertyError) throw propertyError;
  }

  return clientRow(party, 0, input.city?.trim() || "—");
}

export async function listQuoteRows(): Promise<QuoteRow[]> {
  if (!supabase) return readDemoStore().quotes;
  const companyId = await activeCompanyId();
  const [quotesResult, clients] = await Promise.all([
    supabase
      .from("milenium_quotes")
      .select("*")
      .eq("company_id", companyId)
      .order("issued_at", { ascending: false }),
    listClientOptions(),
  ]);
  if (quotesResult.error) throw quotesResult.error;
  const names = new Map(clients.map((client) => [client.id, client.name]));
  return quotesResult.data.map((quote) => ({
    id: quote.id,
    number: quote.number,
    customerId: quote.party_id,
    customer: quote.party_id ? names.get(quote.party_id) ?? "Cliente removido" : "Cliente não informado",
    equipment: quote.notes || "Serviço técnico",
    value: quote.total,
    issueDate: quote.issued_at,
    validUntil: quote.expires_at ?? quote.issued_at,
    status: toQuoteStatus(quote.status),
  }));
}

export async function createQuoteRow(input: {
  customerId: string;
  customer?: string;
  equipment: string;
  value: number;
  validUntil?: string;
  status?: string;
}): Promise<QuoteRow> {
  if (!supabase) {
    const store = readDemoStore();
    const customer = store.clients.find((client) => client.id === input.customerId);
    if (!customer) throw new Error("Selecione um cliente cadastrado para criar o orçamento.");
    const row: QuoteRow = {
      id: createId(),
      number: nextDemoNumber("ORC", store.quotes.length),
      customerId: customer.id,
      customer: customer.name,
      equipment: input.equipment.trim(),
      value: input.value,
      issueDate: today(),
      validUntil: input.validUntil || today(),
      status: input.status || "Rascunho",
    };
    store.quotes = [row, ...store.quotes];
    writeDemoStore(store);
    return row;
  }

  const [companyId, userId, clients] = await Promise.all([
    activeCompanyId(),
    currentUserId(),
    listClientOptions(),
  ]);
  const customer = clients.find((client) => client.id === input.customerId);
  if (!customer) throw new Error("Selecione um cliente cadastrado para criar o orçamento.");

  const number = await nextDatabaseNumber("ORC", "milenium_quotes", companyId);
  const { data, error } = await supabase
    .from("milenium_quotes")
    .insert({
      company_id: companyId,
      party_id: customer.id,
      number,
      status: "draft",
      issued_at: today(),
      expires_at: input.validUntil || null,
      subtotal: input.value,
      discount: 0,
      total: input.value,
      notes: input.equipment.trim(),
      created_by: userId,
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    number: data.number,
    customerId: data.party_id,
    customer: customer.name,
    equipment: data.notes || "Serviço técnico",
    value: data.total,
    issueDate: data.issued_at,
    validUntil: data.expires_at ?? data.issued_at,
    status: toQuoteStatus(data.status),
  };
}

export async function listServiceOrderRows(): Promise<ServiceOrderRow[]> {
  if (!supabase) return readDemoStore().orders;
  const companyId = await activeCompanyId();
  const [ordersResult, clients] = await Promise.all([
    supabase
      .from("milenium_service_orders")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
    listClientOptions(),
  ]);
  if (ordersResult.error) throw ordersResult.error;
  const names = new Map(clients.map((client) => [client.id, client.name]));
  return ordersResult.data.map((order) => ({
    id: order.id,
    number: order.number,
    customerId: order.party_id,
    customer: order.party_id ? names.get(order.party_id) ?? "Cliente removido" : "Cliente não informado",
    type: order.title,
    technician: parseTechnician(order.notes),
    scheduledAt: order.planned_start ?? order.created_at.slice(0, 10),
    status: toServiceOrderStatus(order.status),
  }));
}

export async function createServiceOrderRow(input: {
  customerId: string;
  type: string;
  technician?: string;
  scheduledAt?: string;
  status?: string;
}): Promise<ServiceOrderRow> {
  if (!supabase) {
    const store = readDemoStore();
    const customer = store.clients.find((client) => client.id === input.customerId);
    if (!customer) throw new Error("Selecione um cliente cadastrado para criar a ordem de serviço.");
    const row: ServiceOrderRow = {
      id: createId(),
      number: nextDemoNumber("OS", store.orders.length),
      customerId: customer.id,
      customer: customer.name,
      type: input.type.trim(),
      technician: input.technician?.trim() || "Equipe de oficina",
      scheduledAt: input.scheduledAt || today(),
      status: input.status || "Agendada",
    };
    store.orders = [row, ...store.orders];
    store.clients = store.clients.map((client) =>
      client.id === customer.id ? { ...client, lastService: row.scheduledAt } : client,
    );
    writeDemoStore(store);
    return row;
  }

  const [companyId, clients] = await Promise.all([
    activeCompanyId(),
    listClientOptions(),
  ]);
  const customer = clients.find((client) => client.id === input.customerId);
  if (!customer) throw new Error("Selecione um cliente cadastrado para criar a ordem de serviço.");

  const number = await nextDatabaseNumber("OS", "milenium_service_orders", companyId);
  const { data, error } = await supabase
    .from("milenium_service_orders")
    .insert({
      company_id: companyId,
      party_id: customer.id,
      number,
      title: input.type.trim(),
      status: "planned",
      priority: "normal",
      planned_start: input.scheduledAt || null,
      subtotal: 0,
      cost_total: 0,
      notes: serviceOrderNotes(input.technician?.trim() || "Equipe de oficina"),
    })
    .select("*")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    number: data.number,
    customerId: data.party_id,
    customer: customer.name,
    type: data.title,
    technician: parseTechnician(data.notes),
    scheduledAt: data.planned_start ?? data.created_at.slice(0, 10),
    status: toServiceOrderStatus(data.status),
  };
}

export async function listFinanceRows(): Promise<FinanceRow[]> {
  if (!supabase) return readDemoStore().finance;
  const companyId = await activeCompanyId();
  const { data, error } = await supabase
    .from("milenium_financial_entries")
    .select("*")
    .eq("company_id", companyId)
    .order("due_date", { ascending: true });
  if (error) throw error;
  return data.map((entry, index) => financeRow(entry, index));
}

export async function createFinanceRow(input: {
  description: string;
  type: string;
  category?: string;
  amount: number;
  dueDate: string;
  status?: string;
}): Promise<FinanceRow> {
  if (!supabase) {
    const store = readDemoStore();
    const row: FinanceRow = {
      id: createId(),
      code: `FIN-${String(store.finance.length + 1).padStart(4, "0")}`,
      description: input.description.trim(),
      type: input.type,
      category: input.category?.trim() || "Geral",
      amount: input.amount,
      dueDate: input.dueDate || today(),
      status: input.status || "Pendente",
    };
    store.finance = [row, ...store.finance];
    writeDemoStore(store);
    return row;
  }

  const [companyId, userId] = await Promise.all([activeCompanyId(), currentUserId()]);
  const { data, error } = await supabase
    .from("milenium_financial_entries")
    .insert({
      company_id: companyId,
      entry_type: input.type === "Despesa" ? "payable" : "receivable",
      category: input.category?.trim() || "Geral",
      description: input.description.trim(),
      amount: input.amount,
      due_date: input.dueDate || today(),
      status: "pending",
      created_by: userId,
    })
    .select("*")
    .single();
  if (error) throw error;
  return financeRow(data, 0);
}

export async function listClientActivity(clientId: string): Promise<ClientActivity[]> {
  const [quotes, orders] = await Promise.all([listQuoteRows(), listServiceOrderRows()]);
  return [
    ...quotes
      .filter((quote) => quote.customerId === clientId)
      .map((quote) => ({
        id: `quote-${quote.id}`,
        type: "Orçamento" as const,
        title: `${quote.number} · ${quote.equipment}`,
        date: quote.issueDate,
        status: quote.status,
        value: quote.value,
      })),
    ...orders
      .filter((order) => order.customerId === clientId)
      .map((order) => ({
        id: `order-${order.id}`,
        type: "Ordem de serviço" as const,
        title: `${order.number} · ${order.type}`,
        date: order.scheduledAt,
        status: order.status,
      })),
  ].sort((a, b) => b.date.localeCompare(a.date));
}

function financeRow(entry: FinancialEntry, index: number): FinanceRow {
  return {
    id: entry.id,
    code: `FIN-${String(index + 1).padStart(4, "0")}`,
    description: entry.description,
    type: entry.entry_type === "receivable" ? "Receita" : "Despesa",
    category: entry.category ?? "Geral",
    amount: entry.amount,
    dueDate: entry.due_date,
    status: toFinanceStatus(entry.status),
  };
}

function nextDemoNumber(prefix: string, currentCount: number): string {
  return `${prefix}-${new Date().getFullYear()}-${String(currentCount + 1).padStart(4, "0")}`;
}

async function nextDatabaseNumber(
  prefix: string,
  table: "milenium_quotes" | "milenium_service_orders",
  companyId: string,
): Promise<string> {
  if (!supabase) return nextDemoNumber(prefix, 0);
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);
  if (error) throw error;
  return `${prefix}-${new Date().getFullYear()}-${String((count ?? 0) + 1).padStart(4, "0")}`;
}
