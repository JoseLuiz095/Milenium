import { supabase } from "../lib/supabase";
import type { TablesInsert } from "../types/database";
import type {
  DashboardSummary,
  FinancialEntry,
  Lead,
  Party,
  Quote,
  ServiceOrder,
} from "../types/domain";
import {
  mockFinancialEntries,
  mockLeads,
  mockParties,
  mockQuotes,
  mockServiceOrders,
} from "./mockData";

export async function listParties(companyId?: string): Promise<Party[]> {
  if (!supabase) return filterByCompany(mockParties, companyId);

  let query = supabase.from("milenium_parties").select("*").order("name");
  if (companyId) query = query.eq("company_id", companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listLeads(companyId?: string): Promise<Lead[]> {
  if (!supabase) return filterByCompany(mockLeads, companyId);

  let query = supabase
    .from("milenium_leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (companyId) query = query.eq("company_id", companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listQuotes(companyId?: string): Promise<Quote[]> {
  if (!supabase) return filterByCompany(mockQuotes, companyId);

  let query = supabase
    .from("milenium_quotes")
    .select("*")
    .order("issued_at", { ascending: false });
  if (companyId) query = query.eq("company_id", companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listServiceOrders(
  companyId?: string,
): Promise<ServiceOrder[]> {
  if (!supabase) return filterByCompany(mockServiceOrders, companyId);

  let query = supabase
    .from("milenium_service_orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (companyId) query = query.eq("company_id", companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listFinancialEntries(
  companyId?: string,
): Promise<FinancialEntry[]> {
  if (!supabase) return filterByCompany(mockFinancialEntries, companyId);

  let query = supabase
    .from("milenium_financial_entries")
    .select("*")
    .order("due_date");
  if (companyId) query = query.eq("company_id", companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createLead(
  input: TablesInsert<"milenium_leads">,
): Promise<Lead> {
  if (!supabase) {
    return {
      ...mockLeads[0],
      ...input,
      id: globalThis.crypto.randomUUID(),
    } as Lead;
  }

  const { data, error } = await supabase
    .from("milenium_leads")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createQuote(
  input: TablesInsert<"milenium_quotes">,
): Promise<Quote> {
  if (!supabase) {
    return {
      ...mockQuotes[0],
      ...input,
      id: globalThis.crypto.randomUUID(),
    } as Quote;
  }

  const { data, error } = await supabase
    .from("milenium_quotes")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createServiceOrder(
  input: TablesInsert<"milenium_service_orders">,
): Promise<ServiceOrder> {
  if (!supabase) {
    return {
      ...mockServiceOrders[0],
      ...input,
      id: globalThis.crypto.randomUUID(),
    } as ServiceOrder;
  }

  const { data, error } = await supabase
    .from("milenium_service_orders")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function getDashboardSummary(
  companyId?: string,
): Promise<DashboardSummary> {
  const [leads, quotes, serviceOrders, financialEntries] = await Promise.all([
    listLeads(companyId),
    listQuotes(companyId),
    listServiceOrders(companyId),
    listFinancialEntries(companyId),
  ]);

  return {
    openLeads: leads.filter(
      (lead) => !["won", "lost", "archived"].includes(lead.status),
    ).length,
    openQuotes: quotes.filter((quote) =>
      ["draft", "sent"].includes(quote.status),
    ).length,
    openServiceOrders: serviceOrders.filter(
      (order) => !["closed", "cancelled"].includes(order.status),
    ).length,
    overdueFinancialEntries: financialEntries.filter(
      (entry) => entry.status === "overdue",
    ).length,
  };
}

function filterByCompany<T extends { company_id: string }>(
  rows: T[],
  companyId?: string,
): T[] {
  return companyId ? rows.filter((row) => row.company_id === companyId) : rows;
}
