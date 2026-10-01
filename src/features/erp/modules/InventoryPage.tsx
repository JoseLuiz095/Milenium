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
import { persistRow, useModuleRows } from "./moduleData";

type StockItem = {
  id: string;
  sku: string;
  item: string;
  category: string;
  stock: number;
  minStock: number;
  location: string;
};
const fallbackItems: StockItem[] = [
  {
    id: "1",
    sku: "BOM-0040",
    item: "Selo mecânico 40 cv",
    category: "Bombas",
    stock: 12,
    minStock: 5,
    location: "A-01-03",
  },
  {
    id: "2",
    sku: "SEN-0012",
    item: "Sensor de pressão 0–10 bar",
    category: "Automação",
    stock: 3,
    minStock: 6,
    location: "B-02-01",
  },
  {
    id: "3",
    sku: "VAL-0008",
    item: "Válvula solenoide 2”",
    category: "Válvulas",
    stock: 0,
    minStock: 4,
    location: "B-01-04",
  },
];

export default function InventoryPage() {
  const { rows, setRows, loading } = useModuleRows<StockItem>(
    "inventory",
    fallbackItems,
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [onlyLow, setOnlyLow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    item: "",
    category: "Bombas",
    stock: 0,
    minStock: 1,
    location: "",
  });
  const filtered = rows.filter(
    (row) =>
      [row.sku, row.item, row.location]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!category || row.category === category) &&
      (!onlyLow || row.stock <= row.minStock),
  );
  const save = async () => {
    if (!form.sku.trim() || !form.item.trim()) return;
    const item = await persistRow<StockItem>("inventory", {
      ...form,
      id: String(rows.length + 1),
    });
    setRows((current) => [item, ...current]);
    setVisible(false);
    setForm({
      sku: "",
      item: "",
      category: "Bombas",
      stock: 0,
      minStock: 1,
      location: "",
    });
  };
  return (
    <div>
      <PageHeader
        eyebrow="Suprimentos"
        title="Estoque"
        description="Monitore disponibilidade de peças e evite paradas por falta de material."
        action={
          <Button
            label="Novo item"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Itens cadastrados",
            value: String(rows.length),
            icon: "pi-box",
          },
          {
            label: "Estoque crítico",
            value: String(
              rows.filter((row) => row.stock <= row.minStock).length,
            ),
            icon: "pi-exclamation-triangle",
            tone: "#fff5da",
          },
          {
            label: "Sem estoque",
            value: String(rows.filter((row) => row.stock === 0).length),
            icon: "pi-times-circle",
            tone: "#fde9e7",
          },
        ]}
      />
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por SKU, item ou localização"
          secondaryAction={
            <>
              <Dropdown
                value={category}
                onChange={(event) => setCategory(event.value)}
                options={["Bombas", "Automação", "Válvulas"]}
                placeholder="Todas as categorias"
                showClear
              />
              <Button
                label="Estoque crítico"
                icon="pi pi-filter"
                severity={onlyLow ? "warning" : "secondary"}
                outlined
                onClick={() => setOnlyLow(!onlyLow)}
              />
            </>
          }
          action={
            <Button
              label="Movimentar"
              icon="pi pi-arrows-v"
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
          <Column field="sku" header="SKU" />
          <Column field="item" header="Item" />
          <Column field="category" header="Categoria" />
          <Column field="location" header="Localização" />
          <Column field="stock" header="Saldo" />
          <Column field="minStock" header="Mínimo" />
          <Column
            header="Situação"
            body={(row: StockItem) => (
              <StatusTag
                value={
                  row.stock === 0
                    ? "Sem estoque"
                    : row.stock <= row.minStock
                      ? "Estoque crítico"
                      : "Disponível"
                }
              />
            )}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Ações do item"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Novo item de estoque"
        visible={visible}
        style={{ width: "min(560px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button label="Cadastrar item" icon="pi pi-check" onClick={save} />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="SKU" className="col-12 md:col-6">
            <InputText
              value={form.sku}
              onChange={(event) =>
                setForm({ ...form, sku: event.target.value })
              }
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="Item" className="col-12 md:col-6">
            <InputText
              value={form.item}
              onChange={(event) =>
                setForm({ ...form, item: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Categoria" className="col-12 md:col-6">
            <Dropdown
              value={form.category}
              options={["Bombas", "Automação", "Válvulas"]}
              onChange={(event) => setForm({ ...form, category: event.value })}
              className="w-full"
            />
          </FormField>
          <FormField label="Localização" className="col-12 md:col-6">
            <InputText
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <FormField label="Saldo inicial" className="col-12 md:col-6">
            <InputNumber
              value={form.stock}
              onValueChange={(event) =>
                setForm({ ...form, stock: event.value ?? 0 })
              }
              className="w-full"
              inputClassName="w-full"
            />
          </FormField>
          <FormField label="Estoque mínimo" className="col-12 md:col-6">
            <InputNumber
              value={form.minStock}
              onValueChange={(event) =>
                setForm({ ...form, minStock: event.value ?? 0 })
              }
              className="w-full"
              inputClassName="w-full"
            />
          </FormField>
        </div>
      </Dialog>
    </div>
  );
}
