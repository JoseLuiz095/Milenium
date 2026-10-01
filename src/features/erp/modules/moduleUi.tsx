import { ReactNode } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
      <div>
        <div
          className="text-sm font-semibold uppercase"
          style={{ color: "#32804a", letterSpacing: ".08em" }}
        >
          {eyebrow}
        </div>
        <h1 className="mt-2 mb-2 text-3xl" style={{ color: "#173322" }}>
          {title}
        </h1>
        <p className="m-0 text-color-secondary line-height-3">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function ModuleToolbar({
  value,
  onChange,
  placeholder,
  action,
  secondaryAction,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="flex align-items-center gap-2 flex-wrap mb-3">
      <span className="p-input-icon-left flex-1" style={{ minWidth: 240 }}>
        <i className="pi pi-search" />
        <InputText
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      </span>
      {secondaryAction}
      {action}
    </div>
  );
}

export function SummaryStrip({
  items,
}: {
  items: Array<{ label: string; value: string; icon: string; tone?: string }>;
}) {
  return (
    <div className="grid mb-4">
      {items.map((item) => (
        <div className="col-12 md:col-4" key={item.label}>
          <Card
            className="h-full"
            style={{ border: "1px solid #dce8dc", borderRadius: 14 }}
          >
            <div className="flex align-items-center gap-3">
              <div
                className="flex align-items-center justify-content-center border-round-xl"
                style={{
                  width: 42,
                  height: 42,
                  background: item.tone ?? "#e8f4e9",
                  color: "#27663b",
                }}
              >
                <i className={`pi ${item.icon} text-lg`} />
              </div>
              <div>
                <div className="text-sm text-color-secondary">{item.label}</div>
                <div className="text-xl font-semibold mt-1">{item.value}</div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

export function StatusTag({
  value,
  severity,
}: {
  value: string;
  severity?: "success" | "info" | "warning" | "danger" | "secondary";
}) {
  return (
    <Tag value={value} severity={severity ?? statusSeverity(value)} rounded />
  );
}

export function statusSeverity(
  value: string,
): "success" | "info" | "warning" | "danger" | "secondary" {
  const normalized = value.toLowerCase();
  if (
    normalized.includes("conclu") ||
    normalized.includes("ativo") ||
    normalized.includes("pago") ||
    normalized.includes("aprov")
  )
    return "success";
  if (
    normalized.includes("andamento") ||
    normalized.includes("pendente") ||
    normalized.includes("abert") ||
    normalized.includes("análise")
  )
    return "warning";
  if (
    normalized.includes("cancel") ||
    normalized.includes("atras") ||
    normalized.includes("inativo") ||
    normalized.includes("venc")
  )
    return "danger";
  if (normalized.includes("aguard") || normalized.includes("planej"))
    return "info";
  return "secondary";
}

export function EmptyState({
  title = "Nenhum registro encontrado",
  description = "Ajuste os filtros ou crie um novo registro para começar.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center p-5">
      <i className="pi pi-inbox text-4xl mb-3" style={{ color: "#79a985" }} />
      <div className="font-semibold text-lg mb-2">{title}</div>
      <div className="text-color-secondary mb-3">{description}</div>
      {action}
    </div>
  );
}

export function FormField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`field ${className}`}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {children}
    </div>
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button label="Cancelar" severity="secondary" text onClick={onClick} />
  );
}
