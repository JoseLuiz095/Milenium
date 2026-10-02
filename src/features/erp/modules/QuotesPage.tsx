import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
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
import {
  formatCurrency,
  formatDate,
  persistRow,
  useModuleRows,
} from "./moduleData";
import {
  listClientOptions,
  type ClientOption,
} from "../../../services/erpOperations";

type Quote = {
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
const fallbackQuotes: Quote[] = [
  {
    id: "fallback-quote-1",
    number: "ORC-2026-0001",
    customerId: "fallback-client-1",
    customer: "Fazenda Santa Clara",
    equipment: "Pivô central 120 ha",
    value: 184500,
    issueDate: "2026-09-23",
    validUntil: "2026-10-23",
    status: "Enviado",
  },
  {
    id: "fallback-quote-2",
    number: "ORC-2026-0002",
    customerId: "fallback-client-2",
    customer: "Agro Vale Verde",
    equipment: "Bomba vertical 40 cv",
    value: 32700,
    issueDate: "2026-09-19",
    validUntil: "2026-10-19",
    status: "Aprovado",
  },
  {
    id: "fallback-quote-3",
    number: "ORC-2026-0003",
    customerId: "fallback-client-3",
    customer: "Cooperativa Horizonte",
    equipment: "Automação de irrigação",
    value: 78600,
    issueDate: "2026-09-05",
    validUntil: "2026-10-05",
    status: "Rascunho",
  },
];

export default function QuotesPage() {
  const { rows, setRows, loading, error: loadError } = useModuleRows<Quote>(
    "quotes",
    fallbackQuotes,
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
    equipment: "",
    value: 0,
    validUntil: "",
    status: "Rascunho",
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
      [row.number, row.customer, row.equipment]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || row.status === status),
  );
  const save = async () => {
    if (!form.customerId || !form.equipment.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const customer = clients.find((item) => item.id === form.customerId);
      const quote = await persistRow<Quote>("quotes", {
        ...form,
        customer: customer?.name ?? "",
      });
      setRows((current) => [quote, ...current]);
      setVisible(false);
      setForm({
        customerId: "",
        equipment: "",
        value: 0,
        validUntil: "",
        status: "Rascunho",
      });
    } catch (requestError) {
      setSaveError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o orçamento.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <PageHeader
        eyebrow="Comercial"
        title="Orçamentos"
        description="Acompanhe propostas, valores e aprovações em um só lugar."
        action={
          <Button
            label="Novo orçamento"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Em negociação",
            value: String(
              rows.filter((row) => row.status === "Enviado").length,
            ),
            icon: "pi-send",
          },
          {
            label: "Valor em aberto",
            value: formatCurrency(
              rows
                .filter((row) => row.status !== "Aprovado")
                .reduce((sum, row) => sum + row.value, 0),
            ),
            icon: "pi-chart-line",
            tone: "#e7f5ed",
          },
          {
            label: "Aprovados",
            value: String(
              rows.filter((row) => row.status === "Aprovado").length,
            ),
            icon: "pi-check",
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
          placeholder="Buscar por cliente ou equipamento"
          secondaryAction={
            <Dropdown
              value={status}
              onChange={(event) => setStatus(event.value)}
              options={["Rascunho", "Enviado", "Aprovado", "Recusado"]}
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
          <Column field="number" header="Número" />
          <Column field="customer" header="Cliente" />
          <Column field="equipment" header="Escopo" />
          <Column
            field="value"
            header="Valor"
            body={(row: Quote) => formatCurrency(row.value)}
          />
          <Column
            field="issueDate"
            header="Emissão"
            body={(row: Quote) => formatDate(row.issueDate)}
          />
          <Column
            field="validUntil"
            header="Validade"
            body={(row: Quote) => formatDate(row.validUntil)}
          />
          <Column
            header="Status"
            body={(row: Quote) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações do orçamento"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Novo orçamento"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button
              label="Salvar orçamento"
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
          <FormField label="Descrição do escopo" className="col-12">
            <InputText
              value={form.equipment}
              onChange={(event) =>
                setForm({ ...form, equipment: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Valor estimado" className="col-12 md:col-6">
            <InputNumber
              value={form.value}
              onValueChange={(event) =>
                setForm({ ...form, value: event.value ?? 0 })
              }
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              className="w-full"
              inputClassName="w-full"
            />
          </FormField>
          <FormField label="Validade" className="col-12 md:col-6">
            <InputText
              type="date"
              value={form.validUntil}
              onChange={(event) =>
                setForm({ ...form, validUntil: event.target.value })
              }
              className="w-full"
            />
          </FormField>
        </div>
      </Dialog>
    </div>
  );
}
