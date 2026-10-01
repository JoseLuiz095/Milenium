import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
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
import {
  formatCurrency,
  formatDate,
  persistRow,
  useModuleRows,
} from "./moduleData";

type Purchase = {
  id: string;
  supplier: string;
  reference: string;
  total: number;
  dueDate: string;
  status: string;
};
const fallbackPurchases: Purchase[] = [
  {
    id: "PC-00614",
    supplier: "HidroParts Distribuidora",
    reference: "Pedido de selos e rolamentos",
    total: 18450,
    dueDate: "2026-10-04",
    status: "Aguardando aprovação",
  },
  {
    id: "PC-00608",
    supplier: "SensorTech Brasil",
    reference: "Sensores de pressão",
    total: 7950,
    dueDate: "2026-10-07",
    status: "Aprovado",
  },
  {
    id: "PC-00597",
    supplier: "Metalúrgica Nova Era",
    reference: "Conexões galvanizadas",
    total: 12100,
    dueDate: "2026-09-28",
    status: "Recebido",
  },
];

export default function PurchasesPage() {
  const { rows, setRows, loading } = useModuleRows<Purchase>(
    "purchases",
    fallbackPurchases,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    supplier: "",
    reference: "",
    total: 0,
    dueDate: "",
    status: "Rascunho",
  });
  const filtered = rows.filter(
    (row) =>
      [row.id, row.supplier, row.reference]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || row.status === status),
  );
  const save = async () => {
    if (!form.supplier.trim() || !form.reference.trim()) return;
    const purchase = await persistRow<Purchase>("purchases", {
      ...form,
      id: `PC-${614 + rows.length}`,
    });
    setRows((current) => [purchase, ...current]);
    setVisible(false);
    setForm({
      supplier: "",
      reference: "",
      total: 0,
      dueDate: "",
      status: "Rascunho",
    });
  };
  return (
    <div>
      <PageHeader
        eyebrow="Suprimentos"
        title="Compras"
        description="Controle solicitações, aprovações e recebimentos de fornecedores."
        action={
          <Button
            label="Nova compra"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Aguardando aprovação",
            value: String(
              rows.filter((row) => row.status === "Aguardando aprovação")
                .length,
            ),
            icon: "pi-clock",
            tone: "#fff5da",
          },
          {
            label: "Comprometido",
            value: formatCurrency(
              rows.reduce((sum, row) => sum + row.total, 0),
            ),
            icon: "pi-wallet",
          },
          {
            label: "Recebidas",
            value: String(
              rows.filter((row) => row.status === "Recebido").length,
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
          placeholder="Buscar por fornecedor ou pedido"
          secondaryAction={
            <Dropdown
              value={status}
              onChange={(event) => setStatus(event.value)}
              options={[
                "Rascunho",
                "Aguardando aprovação",
                "Aprovado",
                "Recebido",
              ]}
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
          <Column field="id" header="Pedido" />
          <Column field="supplier" header="Fornecedor" />
          <Column field="reference" header="Descrição" />
          <Column
            field="total"
            header="Total"
            body={(row: Purchase) => formatCurrency(row.total)}
          />
          <Column
            field="dueDate"
            header="Entrega prevista"
            body={(row: Purchase) => formatDate(row.dueDate)}
          />
          <Column
            header="Status"
            body={(row: Purchase) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações da compra"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Nova solicitação de compra"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button
              label="Salvar solicitação"
              icon="pi pi-check"
              onClick={save}
            />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="Fornecedor" className="col-12">
            <InputText
              value={form.supplier}
              onChange={(event) =>
                setForm({ ...form, supplier: event.target.value })
              }
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="Descrição do pedido" className="col-12">
            <InputText
              value={form.reference}
              onChange={(event) =>
                setForm({ ...form, reference: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Valor total" className="col-12 md:col-6">
            <InputNumber
              value={form.total}
              onValueChange={(event) =>
                setForm({ ...form, total: event.value ?? 0 })
              }
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              className="w-full"
              inputClassName="w-full"
            />
          </FormField>
          <FormField label="Entrega prevista" className="col-12 md:col-6">
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
