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
  EmptyState,
  FormField,
  CloseButton,
} from "./moduleUi";
import { formatDate, persistRow, useModuleRows } from "./moduleData";

type WorkshopJob = {
  id: string;
  machine: string;
  customer: string;
  service: string;
  progress: number;
  status: string;
  entryDate: string;
};
const fallbackJobs: WorkshopJob[] = [
  {
    id: "OF-00841",
    machine: "Bomba B-40",
    customer: "Agro Vale Verde",
    service: "Revisão de conjunto",
    progress: 70,
    status: "Em andamento",
    entryDate: "2026-09-29",
  },
  {
    id: "OF-00838",
    machine: "Painel P-12",
    customer: "Fazenda Santa Clara",
    service: "Reparo elétrico",
    progress: 100,
    status: "Pronto para entrega",
    entryDate: "2026-09-25",
  },
  {
    id: "OF-00835",
    machine: "Válvula V-08",
    customer: "Cooperativa Horizonte",
    service: "Troca de vedação",
    progress: 20,
    status: "Aguardando peça",
    entryDate: "2026-09-30",
  },
];

export default function WorkshopPage() {
  const { rows, setRows, loading } = useModuleRows<WorkshopJob>(
    "workshop",
    fallbackJobs,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    machine: "",
    customer: "",
    service: "",
    status: "Em andamento",
  });
  const filtered = rows.filter(
    (row) =>
      [row.id, row.machine, row.customer, row.service]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || row.status === status),
  );
  const save = async () => {
    if (!form.machine.trim() || !form.customer.trim()) return;
    const job = await persistRow<WorkshopJob>("workshop", {
      ...form,
      id: `OF-${841 + rows.length}`,
      progress: 0,
      entryDate: new Date().toISOString().slice(0, 10),
    });
    setRows((current) => [job, ...current]);
    setVisible(false);
    setForm({ machine: "", customer: "", service: "", status: "Em andamento" });
  };
  return (
    <div>
      <PageHeader
        eyebrow="Oficina"
        title="Oficina"
        description="Organize serviços internos, peças pendentes e entregas de equipamentos."
        action={
          <Button
            label="Abrir serviço"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Em execução",
            value: String(
              rows.filter((row) => row.status === "Em andamento").length,
            ),
            icon: "pi-wrench",
          },
          {
            label: "Aguardando peça",
            value: String(
              rows.filter((row) => row.status === "Aguardando peça").length,
            ),
            icon: "pi-box",
            tone: "#fff5da",
          },
          {
            label: "Prontos",
            value: String(
              rows.filter((row) => row.status === "Pronto para entrega").length,
            ),
            icon: "pi-check",
            tone: "#e7f5ed",
          },
        ]}
      />
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por equipamento, cliente ou serviço"
          secondaryAction={
            <Dropdown
              value={status}
              onChange={(event) => setStatus(event.value)}
              options={[
                "Em andamento",
                "Aguardando peça",
                "Pronto para entrega",
              ]}
              placeholder="Todos os status"
              showClear
            />
          }
          action={
            <Button
              label="Quadro"
              icon="pi pi-th-large"
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
          <Column field="id" header="OS oficina" />
          <Column field="machine" header="Equipamento" />
          <Column field="customer" header="Cliente" />
          <Column field="service" header="Serviço" />
          <Column
            field="entryDate"
            header="Entrada"
            body={(row: WorkshopJob) => formatDate(row.entryDate)}
          />
          <Column
            header="Progresso"
            body={(row: WorkshopJob) => (
              <div style={{ minWidth: 110 }}>
                <div className="flex justify-content-between text-xs mb-1">
                  <span>{row.progress}%</span>
                  <span>{row.status}</span>
                </div>
                <div
                  style={{ height: 6, background: "#e5eee6", borderRadius: 99 }}
                >
                  <div
                    style={{
                      width: `${row.progress}%`,
                      height: "100%",
                      background: "#32804a",
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            )}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações do serviço de oficina"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Abrir serviço de oficina"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button label="Abrir serviço" icon="pi pi-check" onClick={save} />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="Equipamento" className="col-12">
            <InputText
              value={form.machine}
              onChange={(event) =>
                setForm({ ...form, machine: event.target.value })
              }
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="Cliente" className="col-12">
            <InputText
              value={form.customer}
              onChange={(event) =>
                setForm({ ...form, customer: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Serviço solicitado" className="col-12">
            <InputText
              value={form.service}
              onChange={(event) =>
                setForm({ ...form, service: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Status inicial" className="col-12 md:col-6">
            <Dropdown
              value={form.status}
              options={["Em andamento", "Aguardando peça"]}
              onChange={(event) => setForm({ ...form, status: event.value })}
              className="w-full"
            />
          </FormField>
        </div>
      </Dialog>
    </div>
  );
}
