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

type Machine = {
  id: string;
  code: string;
  name: string;
  customer: string;
  model: string;
  status: string;
  lastMaintenance: string;
};
const fallbackMachines: Machine[] = [
  {
    id: "1",
    code: "EQ-00482",
    name: "Pivô Norte 01",
    customer: "Fazenda Santa Clara",
    model: "Valley 8000",
    status: "Operando",
    lastMaintenance: "2026-08-11",
  },
  {
    id: "2",
    code: "EQ-00476",
    name: "Bomba Captação 02",
    customer: "Agro Vale Verde",
    model: "KSB WKL 80",
    status: "Em manutenção",
    lastMaintenance: "2026-09-29",
  },
  {
    id: "3",
    code: "EQ-00451",
    name: "Painel de controle",
    customer: "Cooperativa Horizonte",
    model: "Milenium Smart 12",
    status: "Parado",
    lastMaintenance: "2026-06-18",
  },
];

export default function MachinesPage() {
  const { rows, setRows, loading } = useModuleRows<Machine>(
    "machines",
    fallbackMachines,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    customer: "",
    model: "",
    status: "Operando",
  });
  const filtered = rows.filter(
    (row) =>
      [row.code, row.name, row.customer, row.model]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || row.status === status),
  );
  const save = async () => {
    if (!form.code.trim() || !form.name.trim()) return;
    const machine = await persistRow<Machine>("machines", {
      ...form,
      id: String(rows.length + 1),
      lastMaintenance: "—",
    });
    setRows((current) => [machine, ...current]);
    setVisible(false);
    setForm({
      code: "",
      name: "",
      customer: "",
      model: "",
      status: "Operando",
    });
  };
  return (
    <div>
      <PageHeader
        eyebrow="Ativos"
        title="Máquinas"
        description="Tenha uma visão atualizada dos equipamentos instalados e seu estado operacional."
        action={
          <Button
            label="Cadastrar máquina"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          { label: "Equipamentos", value: String(rows.length), icon: "pi-cog" },
          {
            label: "Operando",
            value: String(
              rows.filter((row) => row.status === "Operando").length,
            ),
            icon: "pi-check-circle",
            tone: "#e7f5ed",
          },
          {
            label: "Em manutenção",
            value: String(
              rows.filter((row) => row.status === "Em manutenção").length,
            ),
            icon: "pi-wrench",
            tone: "#fff5da",
          },
        ]}
      />
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por código, nome, cliente ou modelo"
          secondaryAction={
            <Dropdown
              value={status}
              onChange={(event) => setStatus(event.value)}
              options={["Operando", "Em manutenção", "Parado"]}
              placeholder="Todos os estados"
              showClear
            />
          }
          action={
            <Button
              label="Manutenção"
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
          <Column field="code" header="Código" />
          <Column field="name" header="Equipamento" />
          <Column field="customer" header="Cliente" />
          <Column field="model" header="Modelo" />
          <Column
            field="lastMaintenance"
            header="Última manutenção"
            body={(row: Machine) =>
              row.lastMaintenance === "—"
                ? row.lastMaintenance
                : formatDate(row.lastMaintenance)
            }
          />
          <Column
            header="Estado"
            body={(row: Machine) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações da máquina"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Cadastrar máquina"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button label="Cadastrar" icon="pi pi-check" onClick={save} />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="Código patrimonial" className="col-12 md:col-6">
            <InputText
              value={form.code}
              onChange={(event) =>
                setForm({ ...form, code: event.target.value })
              }
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="Nome do equipamento" className="col-12 md:col-6">
            <InputText
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Cliente" className="col-12 md:col-6">
            <InputText
              value={form.customer}
              onChange={(event) =>
                setForm({ ...form, customer: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Modelo" className="col-12 md:col-6">
            <InputText
              value={form.model}
              onChange={(event) =>
                setForm({ ...form, model: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Estado atual" className="col-12 md:col-6">
            <Dropdown
              value={form.status}
              options={["Operando", "Em manutenção", "Parado"]}
              onChange={(event) => setForm({ ...form, status: event.value })}
              className="w-full"
            />
          </FormField>
        </div>
      </Dialog>
    </div>
  );
}
