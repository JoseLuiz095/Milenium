import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
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

type Setting = {
  id: string;
  name: string;
  area: string;
  value: string;
  updatedAt: string;
  status: string;
};
const fallbackSettings: Setting[] = [
  {
    id: "CFG-01",
    name: "Empresa padrão",
    area: "Organização",
    value: "Milenium Irrigação",
    updatedAt: "2026-09-28",
    status: "Ativo",
  },
  {
    id: "CFG-02",
    name: "Prazo padrão de orçamento",
    area: "Comercial",
    value: "30 dias",
    updatedAt: "2026-09-26",
    status: "Ativo",
  },
  {
    id: "CFG-03",
    name: "Notificação de estoque crítico",
    area: "Suprimentos",
    value: "Habilitada",
    updatedAt: "2026-09-21",
    status: "Ativo",
  },
];

export default function SettingsPage() {
  const { rows, setRows, loading } = useModuleRows<Setting>(
    "settings",
    fallbackSettings,
  );
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    area: "Organização",
    value: "",
    notifications: true,
  });
  const filtered = rows.filter(
    (row) =>
      [row.name, row.area, row.value]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!area || row.area === area),
  );
  const save = async () => {
    if (!form.name.trim() || !form.value.trim()) return;
    const setting = await persistRow<Setting>("settings", {
      id: `CFG-${String(rows.length + 1).padStart(2, "0")}`,
      name: form.name,
      area: form.area,
      value: form.value,
      updatedAt: new Date().toISOString().slice(0, 10),
      status: "Ativo",
    });
    setRows((current) => [setting, ...current]);
    setVisible(false);
    setForm({ name: "", area: "Organização", value: "", notifications: true });
  };
  return (
    <div>
      <PageHeader
        eyebrow="Administração"
        title="Configurações"
        description="Ajuste parâmetros operacionais e preferências do ambiente Milenium."
        action={
          <Button
            label="Nova configuração"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Parâmetros ativos",
            value: String(rows.filter((row) => row.status === "Ativo").length),
            icon: "pi-sliders-h",
          },
          {
            label: "Áreas configuradas",
            value: String(new Set(rows.map((row) => row.area)).size),
            icon: "pi-sitemap",
            tone: "#e7f5ed",
          },
          { label: "Ambiente", value: "Produção", icon: "pi-server" },
        ]}
      />
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por parâmetro ou valor"
          secondaryAction={
            <Dropdown
              value={area}
              onChange={(event) => setArea(event.value)}
              options={["Organização", "Comercial", "Suprimentos", "Operações"]}
              placeholder="Todas as áreas"
              showClear
            />
          }
          action={
            <Button
              label="Usuários"
              icon="pi pi-users"
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
          emptyMessage={<EmptyState title="Nenhuma configuração encontrada" />}
        >
          <Column field="name" header="Parâmetro" />
          <Column field="area" header="Área" />
          <Column field="value" header="Valor" />
          <Column field="updatedAt" header="Atualizado em" />
          <Column
            header="Status"
            body={(row: Setting) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={() => (
              <Button
                icon="pi pi-pencil"
                text
                rounded
                aria-label="Editar configuração"
              />
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Nova configuração"
        visible={visible}
        style={{ width: "min(520px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button
              label="Salvar configuração"
              icon="pi pi-check"
              onClick={save}
            />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="Nome do parâmetro" className="col-12">
            <InputText
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="Área" className="col-12 md:col-6">
            <Dropdown
              value={form.area}
              options={["Organização", "Comercial", "Suprimentos", "Operações"]}
              onChange={(event) => setForm({ ...form, area: event.value })}
              className="w-full"
            />
          </FormField>
          <FormField label="Valor" className="col-12 md:col-6">
            <InputText
              value={form.value}
              onChange={(event) =>
                setForm({ ...form, value: event.target.value })
              }
              className="w-full"
            />
          </FormField>
          <div className="col-12 flex align-items-center justify-content-between border-top-1 surface-border pt-3 mt-2">
            <div>
              <div className="font-medium">Notificações relacionadas</div>
              <div className="text-sm text-color-secondary mt-1">
                Receber alertas quando o parâmetro exigir atenção.
              </div>
            </div>
            <InputSwitch
              checked={form.notifications}
              onChange={(event) =>
                setForm({ ...form, notifications: event.value })
              }
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
