import type {
  Attachment,
  AuditEvent,
  Company,
  FinancialEntry,
  Item,
  Lead,
  Machine,
  Membership,
  Party,
  PurchaseOrder,
  PurchaseOrderItem,
  Property,
  Quote,
  QuoteItem,
  ServiceOrder,
  ServiceOrderItem,
  StockMovement,
} from "./domain";

type DomainRow<T> = T & Record<string, unknown>;

type TableDefinition<Row extends Record<string, unknown>> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      milenium_companies: TableDefinition<DomainRow<Company>>;
      milenium_memberships: TableDefinition<DomainRow<Membership>>;
      milenium_parties: TableDefinition<DomainRow<Party>>;
      milenium_properties: TableDefinition<DomainRow<Property>>;
      milenium_machines: TableDefinition<DomainRow<Machine>>;
      milenium_items: TableDefinition<DomainRow<Item>>;
      milenium_leads: TableDefinition<DomainRow<Lead>>;
      milenium_quotes: TableDefinition<DomainRow<Quote>>;
      milenium_quote_items: TableDefinition<DomainRow<QuoteItem>>;
      milenium_service_orders: TableDefinition<DomainRow<ServiceOrder>>;
      milenium_service_order_items: TableDefinition<
        DomainRow<ServiceOrderItem>
      >;
      milenium_purchase_orders: TableDefinition<DomainRow<PurchaseOrder>>;
      milenium_purchase_order_items: TableDefinition<
        DomainRow<PurchaseOrderItem>
      >;
      milenium_stock_movements: TableDefinition<DomainRow<StockMovement>>;
      milenium_financial_entries: TableDefinition<DomainRow<FinancialEntry>>;
      milenium_attachments: TableDefinition<DomainRow<Attachment>>;
      milenium_audit_events: TableDefinition<DomainRow<AuditEvent>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
