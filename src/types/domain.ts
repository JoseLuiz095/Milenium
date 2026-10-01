export type UUID = string;
export type Timestamp = string;
export type Money = number;

export type CompanyStatus = "active" | "suspended";
export type MembershipRole =
  | "owner"
  | "admin"
  | "manager"
  | "commercial"
  | "operations"
  | "workshop"
  | "warehouse"
  | "purchasing"
  | "finance"
  | "technician"
  | "viewer";
export type MembershipStatus = "invited" | "active" | "suspended" | "revoked";
export type PartyType =
  "customer" | "supplier" | "partner" | "person" | "company";
export type RecordStatus = "active" | "inactive";
export type MachineStatus = "active" | "maintenance" | "inactive";
export type ItemType = "material" | "service" | "asset";
export type ItemStatus = "active" | "inactive" | "discontinued";
export type LeadStatus =
  "new" | "contacted" | "qualified" | "proposal" | "won" | "lost" | "archived";
export type QuoteStatus =
  "draft" | "sent" | "accepted" | "rejected" | "expired" | "cancelled";
export type QuoteItemStatus = "active" | "cancelled";
export type ServiceOrderStatus =
  | "draft"
  | "triage"
  | "planned"
  | "in_progress"
  | "waiting_material"
  | "waiting_third_party"
  | "waiting_customer"
  | "completed"
  | "approved"
  | "billed"
  | "closed"
  | "cancelled";
export type Priority = "low" | "normal" | "high" | "urgent";
export type ServiceOrderItemStatus =
  "planned" | "in_progress" | "completed" | "cancelled";
export type PurchaseOrderStatus =
  | "draft"
  | "sent"
  | "confirmed"
  | "partially_received"
  | "received"
  | "cancelled";
export type PurchaseOrderItemStatus =
  "pending" | "partially_received" | "received" | "cancelled";
export type StockMovementType =
  | "receipt"
  | "issue"
  | "transfer"
  | "adjustment"
  | "reservation"
  | "release"
  | "return";
export type StockMovementStatus = "draft" | "posted" | "cancelled";
export type FinancialEntryType = "receivable" | "payable";
export type FinancialEntryStatus =
  "pending" | "due" | "partially_paid" | "paid" | "cancelled" | "overdue";
export type AttachmentStatus = "pending" | "available" | "archived";
export type AuditStatus = "recorded" | "archived";

export interface AuditFields {
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Company extends AuditFields {
  id: UUID;
  legal_name: string;
  trade_name: string | null;
  document: string | null;
  status: CompanyStatus;
  created_by: UUID;
}

export interface Membership extends AuditFields {
  id: UUID;
  company_id: UUID;
  user_id: UUID;
  role: MembershipRole;
  status: MembershipStatus;
}

export interface Party extends AuditFields {
  id: UUID;
  company_id: UUID;
  party_type: PartyType;
  name: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: RecordStatus;
}

export interface Property extends AuditFields {
  id: UUID;
  company_id: UUID;
  party_id: UUID | null;
  name: string;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  status: RecordStatus;
}

export interface Machine extends AuditFields {
  id: UUID;
  company_id: UUID;
  party_id: UUID | null;
  property_id: UUID | null;
  name: string;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  year: number | null;
  status: MachineStatus;
  notes: string | null;
}

export interface Item extends AuditFields {
  id: UUID;
  company_id: UUID;
  sku: string | null;
  name: string;
  item_type: ItemType;
  unit: string;
  unit_price: Money;
  cost_price: Money;
  status: ItemStatus;
  notes: string | null;
}

export interface Lead extends AuditFields {
  id: UUID;
  company_id: UUID;
  party_id: UUID | null;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  description: string | null;
  estimated_value: Money | null;
  status: LeadStatus;
}

export interface Quote extends AuditFields {
  id: UUID;
  company_id: UUID;
  party_id: UUID | null;
  property_id: UUID | null;
  lead_id: UUID | null;
  number: string;
  status: QuoteStatus;
  issued_at: string;
  expires_at: string | null;
  subtotal: Money;
  discount: Money;
  total: Money;
  notes: string | null;
  created_by: UUID | null;
}

export interface QuoteItem extends AuditFields {
  id: UUID;
  company_id: UUID;
  quote_id: UUID;
  item_id: UUID | null;
  description: string;
  quantity: number;
  unit_price: Money;
  cost_price: Money;
  total: Money;
  status: QuoteItemStatus;
}

export interface ServiceOrder extends AuditFields {
  id: UUID;
  company_id: UUID;
  party_id: UUID | null;
  property_id: UUID | null;
  machine_id: UUID | null;
  quote_id: UUID | null;
  lead_id: UUID | null;
  number: string;
  title: string;
  status: ServiceOrderStatus;
  priority: Priority;
  assigned_to: UUID | null;
  planned_start: string | null;
  planned_end: string | null;
  subtotal: Money;
  cost_total: Money;
  notes: string | null;
}

export interface ServiceOrderItem extends AuditFields {
  id: UUID;
  company_id: UUID;
  service_order_id: UUID;
  item_id: UUID | null;
  description: string;
  quantity: number;
  unit_price: Money;
  cost_price: Money;
  status: ServiceOrderItemStatus;
}

export interface PurchaseOrder extends AuditFields {
  id: UUID;
  company_id: UUID;
  supplier_party_id: UUID | null;
  number: string;
  status: PurchaseOrderStatus;
  ordered_at: string | null;
  expected_at: string | null;
  subtotal: Money;
  total: Money;
  notes: string | null;
  created_by: UUID | null;
}

export interface PurchaseOrderItem extends AuditFields {
  id: UUID;
  company_id: UUID;
  purchase_order_id: UUID;
  item_id: UUID | null;
  description: string;
  quantity: number;
  received_quantity: number;
  unit_cost: Money;
  status: PurchaseOrderItemStatus;
}

export interface StockMovement extends AuditFields {
  id: UUID;
  company_id: UUID;
  item_id: UUID;
  service_order_id: UUID | null;
  purchase_order_id: UUID | null;
  movement_type: StockMovementType;
  quantity: number;
  unit_cost: Money;
  reference: string | null;
  status: StockMovementStatus;
  occurred_at: Timestamp;
  created_by: UUID | null;
}

export interface FinancialEntry extends AuditFields {
  id: UUID;
  company_id: UUID;
  party_id: UUID | null;
  quote_id: UUID | null;
  service_order_id: UUID | null;
  purchase_order_id: UUID | null;
  entry_type: FinancialEntryType;
  category: string | null;
  description: string;
  amount: Money;
  due_date: string;
  settled_at: string | null;
  status: FinancialEntryStatus;
  created_by: UUID | null;
}

export interface Attachment extends AuditFields {
  id: UUID;
  company_id: UUID;
  entity_type:
    | "company"
    | "party"
    | "property"
    | "machine"
    | "item"
    | "lead"
    | "quote"
    | "service_order"
    | "purchase_order"
    | "financial_entry"
    | "audit_event";
  entity_id: UUID;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  byte_size: number | null;
  checksum: string | null;
  status: AttachmentStatus;
  uploaded_by: UUID | null;
}

export interface AuditEvent {
  id: UUID;
  company_id: UUID;
  actor_user_id: UUID | null;
  entity_type:
    | "company"
    | "membership"
    | "party"
    | "property"
    | "machine"
    | "item"
    | "lead"
    | "quote"
    | "quote_item"
    | "service_order"
    | "service_order_item"
    | "stock_movement"
    | "purchase_order"
    | "purchase_order_item"
    | "financial_entry"
    | "attachment";
  entity_id: UUID | null;
  action:
    | "created"
    | "updated"
    | "status_changed"
    | "approved"
    | "cancelled"
    | "deleted"
    | "posted"
    | "settled";
  payload: Record<string, unknown>;
  status: AuditStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface DashboardSummary {
  openLeads: number;
  openQuotes: number;
  openServiceOrders: number;
  overdueFinancialEntries: number;
}
