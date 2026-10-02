import { useEffect, useState } from "react";
import {
  createClientRow,
  createFinanceRow,
  createQuoteRow,
  createServiceOrderRow,
  listClientRows,
  listFinanceRows,
  listQuoteRows,
  listServiceOrderRows,
} from "../../../services/erpOperations";

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
  if (resource === "clients") return (await listClientRows()) as unknown as T[];
  if (resource === "quotes") return (await listQuoteRows()) as unknown as T[];
  if (resource === "service-orders") {
    return (await listServiceOrderRows()) as unknown as T[];
  }
  if (resource === "finance") return (await listFinanceRows()) as unknown as T[];

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
  payload: ServiceRecord,
): Promise<T> {
  if (resource === "clients") {
    return (await createClientRow({
      name: String(payload.name ?? ""),
      document: String(payload.document ?? ""),
      phone: String(payload.phone ?? ""),
      city: String(payload.city ?? ""),
      status: String(payload.status ?? "Ativo"),
    })) as unknown as T;
  }
  if (resource === "quotes") {
    return (await createQuoteRow({
      customerId: String(payload.customerId ?? ""),
      customer: String(payload.customer ?? ""),
      equipment: String(payload.equipment ?? ""),
      value: Number(payload.value ?? 0),
      validUntil: String(payload.validUntil ?? ""),
      status: String(payload.status ?? "Rascunho"),
    })) as unknown as T;
  }
  if (resource === "service-orders") {
    return (await createServiceOrderRow({
      customerId: String(payload.customerId ?? ""),
      type: String(payload.type ?? ""),
      technician: String(payload.technician ?? ""),
      scheduledAt: String(payload.scheduledAt ?? ""),
      status: String(payload.status ?? "Agendada"),
    })) as unknown as T;
  }
  if (resource === "finance") {
    return (await createFinanceRow({
      description: String(payload.description ?? ""),
      type: String(payload.type ?? "Receita"),
      category: String(payload.category ?? "Geral"),
      amount: Number(payload.amount ?? 0),
      dueDate: String(payload.dueDate ?? ""),
      status: String(payload.status ?? "Pendente"),
    })) as unknown as T;
  }

  const service = getMileniumService();
  if (!service?.create) return payload as T;

  try {
    const result = await service.create(resource, payload);
    const data =
      result && typeof result === "object" && "data" in result
        ? (result as { data?: unknown }).data
        : result;
    return (data && typeof data === "object" ? data : payload) as T;
  } catch {
    return payload as T;
  }
}

export function useModuleRows<T extends ServiceRecord>(
  resource: string,
  fallback: T[],
) {
  const [rows, setRows] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    requestRows(resource, fallback)
      .then((data) => {
        if (active) setRows(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar os dados agora.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resource]);

  return { rows, setRows, loading, error };
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`));
}
