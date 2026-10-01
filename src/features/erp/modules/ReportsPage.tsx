import { useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
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

type ReportRecord = {
  id: string;
  name: string;
  period: string;
  generatedAt: string;
  owner: string;
  status: string;
};
const fallbackReports: ReportRecord[] = [
  {
    id: "REL-0128",
    name: "Ordens de serviço por técnico",
    period: "01/09/2026 – 30/09/2026",
    generatedAt: "2026-09-30",
    owner: "Marina Lopes",
    status: "Pronto",
  },
  {
    id: "REL-0127",
    name: "Giro e estoque crítico",
    period: "01/09/2026 – 30/09/2026",
    generatedAt: "2026-09-29",
    owner: "Carlos Mendes",
    status: "Pronto",
  },
  {
    id: "REL-0126",
    name: "Fluxo financeiro mensal",
    period: "01/08/2026 – 31/08/2026",
    generatedAt: "2026-09-01",
    owner: "Administração",
    status: "Pronto",
  },
];

export default function ReportsPage() {
  const { rows, setRows, loading } = useModuleRows<ReportRecord>(
    "reports",
    fallbackReports,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    name: "Ordens de serviço por técnico",
    period: "Este mês",
  });
  const filtered = rows.filter(
    (row) =>
      [row.id, row.name, row.owner]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!status || row.status === status),
  );
  const save = async () => {
    const report = await persistRow<ReportRecord>("reports", {
      id: `REL-${128 + rows.length}`,
      name: form.name,
      period: form.period,
      generatedAt: new Date().toISOString().slice(0, 10),
      owner: "Usuário atual",
      status: "Pronto",
    });
    setRows((current) => [report, ...current]);
    setVisible(false);
  };
  return (
    <div>
      <PageHeader
        eyebrow="Inteligência"
        title="Relatórios"
        description="Transforme os dados da operação em visões prontas para decisão e acompanhamento."
        action={
          <Button
            label="Gerar relatório"
            icon="pi pi-chart-bar"
            onClick={() => setVisible(true)}
          />
        }
      />
      <SummaryStrip
        items={[
          {
            label: "Relatórios gerados",
            value: String(rows.length),
            icon: "pi-file",
          },
          {
            label: "Prontos para consulta",
            value: String(rows.filter((row) => row.status === "Pronto").length),
            icon: "pi-check-circle",
            tone: "#e7f5ed",
          },
          { label: "Atualizado em", value: "01 out 2026", icon: "pi-refresh" },
        ]}
      />
      <Card style={{ border: "1px solid #dce8dc", borderRadius: 14 }}>
        <ModuleToolbar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por relatório ou responsável"
          secondaryAction={
            <Dropdown
              value={status}
              onChange={(event) => setStatus(event.value)}
              options={["Pronto", "Processando"]}
              placeholder="Todos os status"
              showClear
            />
          }
          action={
            <Button
              label="Modelos"
              icon="pi pi-bookmark"
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
          emptyMessage={
            <EmptyState
              title="Nenhum relatório salvo"
              description="Gere seu primeiro relatório usando os filtros operacionais."
              action={
                <Button
                  label="Gerar relatório"
                  icon="pi pi-plus"
                  onClick={() => setVisible(true)}
                />
              }
            />
          }
        >
          <Column field="id" header="Código" />
          <Column field="name" header="Relatório" />
          <Column field="period" header="Período" />
          <Column field="owner" header="Responsável" />
          <Column
            field="generatedAt"
            header="Gerado em"
            body={(row: ReportRecord) => formatDate(row.generatedAt)}
          />
          <Column
            header="Status"
            body={(row: ReportRecord) => <StatusTag value={row.status} />}
          />
          <Column
            header="Ações"
            body={(row: ReportRecord) => (
              <div className="flex gap-1">
                <Button
                  icon="pi pi-eye"
                  text
                  rounded
                  aria-label={`Visualizar ${row.name}`}
                />
                <Button
                  icon="pi pi-download"
                  text
                  rounded
                  aria-label={`Baixar ${row.name}`}
                />
              </div>
            )}
          />
        </DataTable>
      </Card>
      <Dialog
        header="Gerar relatório"
        visible={visible}
        style={{ width: "min(500px, 94vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <>
            <CloseButton onClick={() => setVisible(false)} />
            <Button label="Gerar agora" icon="pi pi-chart-bar" onClick={save} />
          </>
        }
      >
        <div className="grid pt-2">
          <FormField label="Modelo de relatório" className="col-12">
            <Dropdown
              value={form.name}
              options={[
                "Ordens de serviço por técnico",
                "Giro e estoque crítico",
                "Fluxo financeiro mensal",
                "Manutenção de máquinas",
              ]}
              onChange={(event) => setForm({ ...form, name: event.value })}
              className="w-full"
              autoFocus
            />
          </FormField>
          <FormField label="Período" className="col-12">
            <Dropdown
              value={form.period}
              options={[
                "Este mês",
                "Mês anterior",
                "Últimos 90 dias",
                "Ano atual",
              ]}
              onChange={(event) => setForm({ ...form, period: event.value })}
              className="w-full"
            />
          </FormField>
          <div className="col-12 text-sm text-color-secondary">
            <i className="pi pi-info-circle mr-2" />O relatório será gerado com
            os dados disponíveis no serviço Milenium.
          </div>
        </div>
      </Dialog>
    </div>
  );
}
