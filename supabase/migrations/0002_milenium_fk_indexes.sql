-- Cover foreign keys that are not already covered by the operational indexes.
-- This migration only touches Milenium tables.

create index if not exists milenium_companies_created_by_idx
  on public.milenium_companies(created_by);
create index if not exists milenium_attachments_uploaded_by_idx
  on public.milenium_attachments(uploaded_by);
create index if not exists milenium_audit_events_actor_idx
  on public.milenium_audit_events(actor_user_id);

create index if not exists milenium_leads_company_party_idx
  on public.milenium_leads(company_id, party_id);

create index if not exists milenium_quotes_company_party_idx
  on public.milenium_quotes(company_id, party_id);
create index if not exists milenium_quotes_company_property_idx
  on public.milenium_quotes(company_id, property_id);
create index if not exists milenium_quotes_company_lead_idx
  on public.milenium_quotes(company_id, lead_id);
create index if not exists milenium_quotes_created_by_idx
  on public.milenium_quotes(created_by);

create index if not exists milenium_quote_items_company_item_idx
  on public.milenium_quote_items(company_id, item_id);

create index if not exists milenium_service_orders_assigned_to_idx
  on public.milenium_service_orders(assigned_to);
create index if not exists milenium_service_orders_company_party_idx
  on public.milenium_service_orders(company_id, party_id);
create index if not exists milenium_service_orders_company_property_idx
  on public.milenium_service_orders(company_id, property_id);
create index if not exists milenium_service_orders_company_machine_idx
  on public.milenium_service_orders(company_id, machine_id);
create index if not exists milenium_service_orders_company_quote_idx
  on public.milenium_service_orders(company_id, quote_id);
create index if not exists milenium_service_orders_company_lead_idx
  on public.milenium_service_orders(company_id, lead_id);

create index if not exists milenium_service_order_items_company_item_idx
  on public.milenium_service_order_items(company_id, item_id);

create index if not exists milenium_purchase_orders_company_supplier_idx
  on public.milenium_purchase_orders(company_id, supplier_party_id);
create index if not exists milenium_purchase_orders_created_by_idx
  on public.milenium_purchase_orders(created_by);

create index if not exists milenium_purchase_order_items_company_item_idx
  on public.milenium_purchase_order_items(company_id, item_id);

create index if not exists milenium_stock_movements_company_purchase_idx
  on public.milenium_stock_movements(company_id, purchase_order_id);
create index if not exists milenium_stock_movements_created_by_idx
  on public.milenium_stock_movements(created_by);

create index if not exists milenium_financial_entries_company_party_idx
  on public.milenium_financial_entries(company_id, party_id);
create index if not exists milenium_financial_entries_company_quote_idx
  on public.milenium_financial_entries(company_id, quote_id);
create index if not exists milenium_financial_entries_company_service_order_idx
  on public.milenium_financial_entries(company_id, service_order_id);
create index if not exists milenium_financial_entries_company_purchase_idx
  on public.milenium_financial_entries(company_id, purchase_order_id);
create index if not exists milenium_financial_entries_created_by_idx
  on public.milenium_financial_entries(created_by);
