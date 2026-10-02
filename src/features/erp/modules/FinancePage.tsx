import { useState } from "react";
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

type Transaction = {
  id: string;
  code: string;
  description: string;
  type: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
};
const fallbackTransactions: Transaction[] = [
  {
    id: "fallback-finance-1",
    code: "FIN-0001",
    description: "Parcela OS-10461",
    type: "Receita",
    category: "Serviços",
    amount: 8950,
    dueDate: "2026-10-03",
    status: "Pendente",
  },
  {
    id: "fallback-finance-2",
    code: "FIN-0002",
    description: "HidroParts Distribuidora",
    type: "Despesa",
    category: "Compras",
    amount: 18450,
    dueDate: "2026-10-04",
    status: "Pendente",
  },
  {
    id: "fallback-finance-3",
    code: "FIN-0003",
    description: "Contrato manutenção Santa Clara",
    type: "Receita",
    category: "Contratos",
    amount: 22400,
    dueDate: "2026-09-30",
    status: "Pago",
  },
];

export default function FinancePage() {
  const { rows, setRows, loading, error: loadError } = useModuleRows<Transaction>(
    "finance",
    fallbackTransactions,
  );
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: "",
    type: "Receita",
    category: "Serviços",
    amount: 0,
    dueDate: "",
    status: "Pendente",
  });
  const filtered = rows.filter(
    (row) =>
      [row.code, row.description, row.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!type || row.type === type),
  );
  const income = rows
    .filter((row) => row.type === "Receita")
    .reduce((sum, row) => sum + row.amount, 0);
  const expenses = rows
    .filter((row) => row.type === "Despesa")
    .reduce((sum, row) => sum + row.amount, 0);
  const save = async () => {
    if (!form.description.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const transaction = await persistRow<Transaction>("finance", form);
      setRows((current) => [transaction, ...current]);
      setVisible(false);
      setForm({
        description: "",
        type: "Receita",
        category: "Serviços",
        amount: 0,
        dueDate: "",
        status: "Pendente",
      });
    } catch (requestError) {
      setSaveError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o lançamento.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <PageHeader
        eyebrow="Gestão"
        title="Financeiro"
        description="Acompanhe contas a receber, despesas e o fluxo financeiro da operação."
        action={
          <Button
            label="Lançar título"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Receitas previstas",
            value: formatCurrency(income),
            icon: "pi-arrow-up-right",
            tone: "#e7f5ed",
          },
          {
            label: "Despesas previstas",
            value: formatCurrency(expenses),
            icon: "pi-arrow-down-right",
            tone: "#fde9e7",
          },
          {
            label: "Saldo projetado",
            value: formatCurrency(income - expenses),
            icon: "pi-chart-line",
          },
        ]}
      />
      {loadError && <Message severity="warn" text={loadError} className="mb-3 w-full" />}
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por descrição ou categoria"
          secondaryAction={
            <Dropdown
              value={type}
              onChange={(event) => setType(event.value)}
              options={["Receita", "Despesa"]}
              placeholder="Receitas e despesas"
              showClear
            />
          }
          action={
            <Button
              label="Conciliação"
              icon="pi pi-sync"
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
          <Column field="code" header="Lançamento" />
          <Column field="description" header="Descrição" />
          <Column
            field="type"
            header="Tipo"
            body={(row: Transaction) => (
              <StatusTag
                value={row.type}
                severity={row.type === "Receita" ? "success" : "danger"}
              />
            )}
          />
          <Column field="category" header="Categoria" />
          <Column
            field="amount"
            header="Valor"
            body={(row: Transaction) => formatCurrency(row.amount)}
          />
          <Column
            field="dueDate"
            header="Vencimento"
            body={(row: Transaction) => formatDate(row.dueDate)}
          />
          <Column
            header="Status"
            body={(row: Transaction) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações do lançamento"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Novo lançamento financeiro"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button
              label="Salvar lançamento"
              icon="pi pi-check"
              onClick={() => void save()}
              loading={saving}
            />
          </>
        }
      >
        <div className="grid pt-2">
          {saveError && <div className="col-12"><Message severity="error" text={saveError} className="w-full" /></div>}
          <FormField label="Descrição" className="col-12">
            <InputText
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="Tipo" className="col-12 md:col-6">
            <Dropdown
              value={form.type}
              options={["Receita", "Despesa"]}
              onChange={(event) => setForm({ ...form, type: event.value })}
              className="w-full"
            />
          </FormField>
          <FormField label="Categoria" className="col-12 md:col-6">
            <InputText
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Valor" className="col-12 md:col-6">
            <InputNumber
              value={form.amount}
              onValueChange={(event) =>
                setForm({ ...form, amount: event.value ?? 0 })
              }
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              className="w-full"
              inputClassName="w-full"
            />
          </FormField>
          <FormField label="Vencimento" className="col-12 md:col-6">
            <InputText
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm({ ...form, dueDate: event.target.value })
              }
              className="w-full"
            />
          </FormField>
        </div>
      </Dialog>
    </div>
  );
}
