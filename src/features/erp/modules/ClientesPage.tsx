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
import { persistRow, useModuleRows } from "./moduleData";

type Client = {
  id: string;
  name: string;
  document: string;
  phone: string;
  city: string;
  status: string;
  lastService: string;
};
const fallbackClients: Client[] = [
  {
    id: "CLI-001",
    name: "Fazenda Santa Clara",
    document: "12.345.678/0001-90",
    phone: "(16) 3221-0900",
    city: "Ribeirão Preto/SP",
    status: "Ativo",
    lastService: "2026-09-18",
  },
  {
    id: "CLI-002",
    name: "Agro Vale Verde",
    document: "45.987.321/0001-08",
    phone: "(19) 3662-4510",
    city: "Mogi Mirim/SP",
    status: "Ativo",
    lastService: "2026-08-28",
  },
  {
    id: "CLI-003",
    name: "Cooperativa Horizonte",
    document: "08.112.554/0001-44",
    phone: "(34) 3234-7712",
    city: "Uberaba/MG",
    status: "Em análise",
    lastService: "2026-07-11",
  },
];

export default function ClientesPage() {
  const { rows, setRows, loading } = useModuleRows<Client>(
    "clients",
    fallbackClients,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    document: "",
    phone: "",
    city: "",
    status: "Ativo",
  });
  const filtered = rows.filter((client) => {
    const matchesQuery = [client.name, client.document, client.city]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (!status || client.status === status);
  });
  const save = async () => {
    if (!form.name.trim()) return;
    const client = await persistRow<Client>("clients", {
      ...form,
      id: `CLI-${String(rows.length + 1).padStart(3, "0")}`,
      lastService: "—",
    });
    setRows((current) => [client, ...current]);
    setForm({ name: "", document: "", phone: "", city: "", status: "Ativo" });
    setVisible(false);
  };
  return (
    <div>
      <PageHeader
        eyebrow="Cadastro"
        title="Clientes"
        description="Centralize dados, relacionamento e histórico dos produtores atendidos."
        action={
          <Button
            label="Novo cliente"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Clientes cadastrados",
            value: String(rows.length),
            icon: "pi-users",
          },
          {
            label: "Ativos",
            value: String(rows.filter((row) => row.status === "Ativo").length),
            icon: "pi-check-circle",
            tone: "#e7f5ed",
          },
          {
            label: "Em análise",
            value: String(
              rows.filter((row) => row.status === "Em análise").length,
            ),
            icon: "pi-clock",
            tone: "#fff5da",
          },
        ]}
      />
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nome, documento ou cidade"
          secondaryAction={
            <Dropdown
              value={status}
              onChange={(event) => setStatus(event.value)}
              options={["Ativo", "Em análise", "Inativo"]}
              placeholder="Todos os status"
              showClear
            />
          }
          action={
            <Button
              label="Exportar"
              icon="pi pi-download"
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
          <Column field="id" header="Código" />
          <Column field="name" header="Cliente" />
          <Column field="document" header="Documento" />
          <Column field="phone" header="Telefone" />
          <Column field="city" header="Localidade" />
          <Column field="lastService" header="Último atendimento" />
          <Column
            header="Status"
            body={(row: Client) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações do cliente"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Novo cliente"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button label="Salvar cliente" icon="pi pi-check" onClick={save} />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="Nome ou razão social" className="col-12">
            <InputText
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="CPF/CNPJ" className="col-12 md:col-6">
            <InputText
              value={form.document}
              onChange={(event) =>
                setForm({ ...form, document: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Telefone" className="col-12 md:col-6">
            <InputText
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Cidade/UF" className="col-12 md:col-6">
            <InputText
              value={form.city}
              onChange={(event) =>
                setForm({ ...form, city: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Status" className="col-12 md:col-6">
            <Dropdown
              value={form.status}
              options={["Ativo", "Em análise", "Inativo"]}
              onChange={(event) => setForm({ ...form, status: event.value })}
              className="w-full"
            />
          </FormField>
        </div>
      </Dialog>
    </div>
  );
}
