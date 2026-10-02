import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import {
  PageHeader,
  ModuleToolbar,
  SummaryStrip,
  StatusTag,
  EmptyState,
  FormField,
  CloseButton,
} from "./moduleUi";
import { formatDate, persistRow, useModuleRows } from "./moduleData";
import {
  listClientOptions,
  type ClientOption,
} from "../../../services/erpOperations";

type ServiceOrder = {
  id: string;
  number: string;
  customerId: string | null;
  customer: string;
  type: string;
  technician: string;
  scheduledAt: string;
  status: string;
};
const fallbackOrders: ServiceOrder[] = [
  {
    id: "fallback-order-1",
    number: "OS-2026-0001",
    customerId: "fallback-client-1",
    customer: "Fazenda Santa Clara",
    type: "Manutenção preventiva",
    technician: "Carlos Mendes",
    scheduledAt: "2026-10-02",
    status: "Agendada",
  },
  {
    id: "fallback-order-2",
    number: "OS-2026-0002",
    customerId: "fallback-client-2",
    customer: "Agro Vale Verde",
    type: "Diagnóstico de bomba",
    technician: "Marina Lopes",
    scheduledAt: "2026-10-01",
    status: "Em andamento",
  },
  {
    id: "fallback-order-3",
    number: "OS-2026-0003",
    customerId: "fallback-client-3",
    customer: "Cooperativa Horizonte",
    type: "Instalação de sensor",
    technician: "João Souza",
    scheduledAt: "2026-09-27",
    status: "Concluída",
  },
];

export default function ServiceOrdersPage() {
  const { rows, setRows, loading, error: loadError } = useModuleRows<ServiceOrder>(
    "service-orders",
    fallbackOrders,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientError, setClientError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerId: "",
    type: "",
    technician: "",
    scheduledAt: "",
    status: "Agendada",
  });
  useEffect(() => {
    listClientOptions()
      .then(setClients)
      .catch((error: unknown) => {
        setClientError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os clientes.",
        );
      });
  }, []);
  const filtered = rows.filter(
    (row) =>
      [row.number, row.customer, row.type, row.technician]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || row.status === status),
  );
  const save = async () => {
    if (!form.customerId || !form.type.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const order = await persistRow<ServiceOrder>("service-orders", form);
      setRows((current) => [order, ...current]);
      setVisible(false);
      setForm({
        customerId: "",
        type: "",
        technician: "",
        scheduledAt: "",
        status: "Agendada",
      });
    } catch (requestError) {
      setSaveError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível criar a ordem de serviço.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <PageHeader
        eyebrow="Operações"
        title="Ordens de serviço"
        description="Planeje a agenda técnica e acompanhe cada atendimento até a entrega."
        action={
          <Button
            label="Nova ordem"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Hoje",
            value: String(
              rows.filter((row) => row.scheduledAt === "2026-10-01").length,
            ),
            icon: "pi-calendar",
          },
          {
            label: "Em andamento",
            value: String(
              rows.filter((row) => row.status === "Em andamento").length,
            ),
            icon: "pi-cog",
            tone: "#fff5da",
          },
          {
            label: "Concluídas no mês",
            value: String(
              rows.filter((row) => row.status === "Concluída").length,
            ),
            icon: "pi-check-circle",
            tone: "#e7f5ed",
          },
        ]}
      />
      {(loadError || clientError) && (
        <Message severity="warn" text={loadError ?? clientError ?? ""} className="mb-3 w-full" />
      )}
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por cliente, serviço ou técnico"
          secondaryAction={
            <Dropdown
              value={status}
              onChange={(event) => setStatus(event.value)}
              options={["Agendada", "Em andamento", "Concluída", "Cancelada"]}
              placeholder="Todos os status"
              showClear
            />
          }
          action={
            <Button
              label="Agenda"
              icon="pi pi-calendar"
              severity="secondary"
              outlined
            />
          }
        />
        <DataTable
          value={filtered}
          loading={loading}
          dataKey="id"
          paginator
          rows={8}
          responsiveLayout="scroll"
          emptyMessage={<EmptyState />}
        >
          <Column field="number" header="OS" />
          <Column field="customer" header="Cliente" />
          <Column field="type" header="Serviço" />
          <Column field="technician" header="Técnico" />
          <Column
            field="scheduledAt"
            header="Agendamento"
            body={(row: ServiceOrder) => formatDate(row.scheduledAt)}
          />
          <Column
            header="Status"
            body={(row: ServiceOrder) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações da ordem de serviço"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Nova ordem de serviço"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button
              label="Criar ordem"
              icon="pi pi-check"
              onClick={() => void save()}
              loading={saving}
              disabled={!clients.length}
            />
          </>
        }
      >
        <div className="grid pt-2">
          {saveError && <div className="col-12"><Message severity="error" text={saveError} className="w-full" /></div>}
          <FormField label="Cliente" className="col-12">
            <Dropdown
              value={form.customerId}
              options={clients}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => setForm({ ...form, customerId: event.value })}
              placeholder={clients.length ? "Selecione um cliente" : "Cadastre um cliente antes"}
              className="w-full"
              filter
              filterBy="name"
            />
          </FormField>
          <FormField label="Tipo de serviço" className="col-12">
            <InputText
              value={form.type}
              onChange={(event) =>
                setForm({ ...form, type: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Técnico responsável" className="col-12 md:col-6">
            <InputText
              value={form.technician}
              onChange={(event) =>
                setForm({ ...form, technician: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Data prevista" className="col-12 md:col-6">
            <InputText
              type="date"
              value={form.scheduledAt}
              onChange={(event) =>
                setForm({ ...form, scheduledAt: event.target.value })
              }
              className="w-full"
            />
          </FormField>
        </div>
      </Dialog>
    </div>
  );
}
