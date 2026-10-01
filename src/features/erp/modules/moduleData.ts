import { useEffect, useState } from "react";
import {
  listFinancialEntries,
  listParties,
  listQuotes,
  listServiceOrders,
} from "../../../services/erp";

export type ServiceRecord = Record<string, unknown>;

export type MileniumRuntimeService = {
  list?: (resource: string) => Promise<unknown>;
  create?: (resource: string, payload: ServiceRecord) => Promise<unknown>;
  update?: (
    resource: string,
    id: string | number,
    payload: ServiceRecord,
  ) => Promise<unknown>;
};

type RuntimeWithService = typeof globalThis & {
  mileniumService?: MileniumRuntimeService;
  milenium?: { service?: MileniumRuntimeService };
};

export function getMileniumService(): MileniumRuntimeService | null {
  const runtime = globalThis as RuntimeWithService;
  return runtime.mileniumService ?? runtime.milenium?.service ?? null;
}

export async function requestRows<T extends ServiceRecord>(
  resource: string,
  fallback: T[],
): Promise<T[]> {
  try {
    if (resource === "clients") {
      const parties = await listParties();
      return parties
        .filter((party) =>
          ["customer", "company", "person"].includes(party.party_type),
        )
        .map((party) => ({
          id: party.id,
          name: party.name,
          document: party.document ?? "—",
          phone: party.phone ?? "—",
          city: "—",
          status: party.status === "active" ? "Ativo" : "Inativo",
          lastService: "—",
        })) as unknown as T[];
    }
    if (resource === "quotes") {
      const quotes = await listQuotes();
      return quotes.map((quote) => ({
        id: quote.number,
        customer: quote.party_id ?? "Cliente não informado",
        equipment: quote.notes ?? "Proposta comercial",
        value: quote.total,
        issueDate: quote.issued_at,
        validUntil: quote.expires_at ?? quote.issued_at,
        status:
          (
            {
              draft: "Rascunho",
              sent: "Enviado",
              accepted: "Aprovado",
              rejected: "Recusado",
              expired: "Expirado",
              cancelled: "Cancelado",
            } as Record<string, string>
          )[quote.status] ?? quote.status,
      })) as unknown as T[];
    }
    if (resource === "service-orders") {
      const orders = await listServiceOrders();
      return orders.map((order) => ({
        id: order.number,
        customer: order.party_id ?? "Cliente não informado",
        type: order.title,
        technician: order.assigned_to ?? "Equipe técnica",
        scheduledAt: order.planned_start ?? order.created_at.slice(0, 10),
        status:
          (
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
            } as Record<string, string>
          )[order.status] ?? order.status,
      })) as unknown as T[];
    }
    if (resource === "finance") {
      const entries = await listFinancialEntries();
      return entries.map((entry) => ({
        id: entry.id,
        description: entry.description,
        type: entry.entry_type === "receivable" ? "Receita" : "Despesa",
        category: entry.category ?? "Geral",
        amount: entry.amount,
        dueDate: entry.due_date,
        status:
          (
            {
              pending: "Pendente",
              due: "Vencendo",
              partially_paid: "Parcial",
              paid: "Pago",
              cancelled: "Cancelado",
              overdue: "Vencido",
            } as Record<string, string>
          )[entry.status] ?? entry.status,
      })) as unknown as T[];
    }
  } catch {
    return fallback;
  }

  const service = getMileniumService();
  if (!service?.list) return fallback;

  try {
    const result = await service.list(resource);
    const data =
      result && typeof result === "object" && "data" in result
        ? (result as { data?: unknown }).data
        : result;
    return Array.isArray(data) ? (data as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export async function persistRow<T extends ServiceRecord>(
  resource: string,
  payload: T,
): Promise<T> {
  const service = getMileniumService();
  if (!service?.create) return payload;

  try {
    const result = await service.create(resource, payload);
    const data =
      result && typeof result === "object" && "data" in result
        ? (result as { data?: unknown }).data
        : result;
    return (data && typeof data === "object" ? data : payload) as T;
  } catch {
    return payload;
  }
}

export function useModuleRows<T extends ServiceRecord>(
  resource: string,
  fallback: T[],
) {
  const [rows, setRows] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    requestRows(resource, fallback).then((data) => {
      if (active) {
        setRows(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [resource]);

  return { rows, setRows, loading };
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`));
}
