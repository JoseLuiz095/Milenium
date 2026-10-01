import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
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

type ServiceOrder = {
  id: string;
  customer: string;
  type: string;
  technician: string;
  scheduledAt: string;
  status: string;
};
const fallbackOrders: ServiceOrder[] = [
  {
    id: "OS-10482",
    customer: "Fazenda Santa Clara",
    type: "Manutenção preventiva",
    technician: "Carlos Mendes",
    scheduledAt: "2026-10-02",
    status: "Agendada",
  },
  {
    id: "OS-10476",
    customer: "Agro Vale Verde",
    type: "Diagnóstico de bomba",
    technician: "Marina Lopes",
    scheduledAt: "2026-10-01",
    status: "Em andamento",
  },
  {
    id: "OS-10461",
    customer: "Cooperativa Horizonte",
    type: "Instalação de sensor",
    technician: "João Souza",
    scheduledAt: "2026-09-27",
    status: "Concluída",
  },
];

export default function ServiceOrdersPage() {
  const { rows, setRows, loading } = useModuleRows<ServiceOrder>(
    "service-orders",
    fallbackOrders,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    type: "",
    technician: "",
    scheduledAt: "",
    status: "Agendada",
  });
  const filtered = rows.filter(
    (row) =>
      [row.id, row.customer, row.type, row.technician]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || row.status === status),
  );
  const save = async () => {
    if (!form.customer.trim() || !form.type.trim()) return;
    const order = await persistRow<ServiceOrder>("service-orders", {
      ...form,
      id: `OS-${10482 + rows.length}`,
    });
    setRows((current) => [order, ...current]);
    setVisible(false);
    setForm({
      customer: "",
      type: "",
      technician: "",
      scheduledAt: "",
      status: "Agendada",
    });
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
          <Column field="id" header="OS" />
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
            <Button label="Criar ordem" icon="pi pi-check" onClick={save} />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="Cliente" className="col-12">
            <InputText
              value={form.customer}
              onChange={(event) =>
                setForm({ ...form, customer: event.target.value })
              }
              className="w-full"
              autoFocus
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
