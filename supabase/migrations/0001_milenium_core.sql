-- Milenium ERP core schema.
-- This migration is intentionally isolated from the Academia tables.

create table if not exists public.milenium_companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  trade_name text,
  document text,
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id)
);

create table if not exists public.milenium_memberships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('owner', 'admin', 'manager', 'commercial', 'operations', 'workshop', 'warehouse', 'purchasing', 'finance', 'technician', 'viewer')),
  status text not null default 'active' check (status in ('invited', 'active', 'suspended', 'revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, user_id),
  unique (company_id, id)
);

create table if not exists public.milenium_parties (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  party_type text not null default 'customer' check (party_type in ('customer', 'supplier', 'partner', 'person', 'company')),
  name text not null,
  document text,
  email text,
  phone text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id)
);

create table if not exists public.milenium_properties (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  party_id uuid,
  name text not null,
  address_line text,
  city text,
  state text,
  postal_code text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, party_id) references public.milenium_parties(company_id, id) on delete set null (party_id)
);

create table if not exists public.milenium_machines (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  party_id uuid,
  property_id uuid,
  name text not null,
  manufacturer text,
  model text,
  serial_number text,
  year integer check (year is null or year between 1800 and 3000),
  status text not null default 'active' check (status in ('active', 'maintenance', 'inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, party_id) references public.milenium_parties(company_id, id) on delete set null (party_id),
  foreign key (company_id, property_id) references public.milenium_properties(company_id, id) on delete set null (property_id)
);

create table if not exists public.milenium_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  sku text,
  name text not null,
  item_type text not null default 'material' check (item_type in ('material', 'service', 'asset')),
  unit text not null default 'un',
  unit_price numeric(18,2) not null default 0 check (unit_price >= 0),
  cost_price numeric(18,2) not null default 0 check (cost_price >= 0),
  status text not null default 'active' check (status in ('active', 'inactive', 'discontinued')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id)
);

create table if not exists public.milenium_leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  party_id uuid,
  name text not null,
  company_name text,
  email text,
  phone text,
  source text,
  description text,
  estimated_value numeric(18,2) check (estimated_value is null or estimated_value >= 0),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, party_id) references public.milenium_parties(company_id, id) on delete set null (party_id)
);

create table if not exists public.milenium_quotes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  party_id uuid,
  property_id uuid,
  lead_id uuid,
  number text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired', 'cancelled')),
  issued_at date not null default current_date,
  expires_at date,
  subtotal numeric(18,2) not null default 0 check (subtotal >= 0),
  discount numeric(18,2) not null default 0 check (discount >= 0),
  total numeric(18,2) not null default 0 check (total >= 0),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  unique (company_id, number),
  foreign key (company_id, party_id) references public.milenium_parties(company_id, id) on delete set null (party_id),
  foreign key (company_id, property_id) references public.milenium_properties(company_id, id) on delete set null (property_id),
  foreign key (company_id, lead_id) references public.milenium_leads(company_id, id) on delete set null (lead_id),
  check (expires_at is null or expires_at >= issued_at),
  check (discount <= subtotal)
);

create table if not exists public.milenium_quote_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  quote_id uuid not null,
  item_id uuid,
  description text not null,
  quantity numeric(18,4) not null default 1 check (quantity > 0),
  unit_price numeric(18,2) not null default 0 check (unit_price >= 0),
  cost_price numeric(18,2) not null default 0 check (cost_price >= 0),
  total numeric(18,2) not null default 0 check (total >= 0),
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, quote_id) references public.milenium_quotes(company_id, id) on delete cascade,
  foreign key (company_id, item_id) references public.milenium_items(company_id, id) on delete set null (item_id)
);

create table if not exists public.milenium_service_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  party_id uuid,
  property_id uuid,
  machine_id uuid,
  quote_id uuid,
  lead_id uuid,
  number text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'triage', 'planned', 'in_progress', 'waiting_material', 'waiting_third_party', 'waiting_customer', 'completed', 'approved', 'billed', 'closed', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references auth.users(id) on delete set null,
  planned_start date,
  planned_end date,
  subtotal numeric(18,2) not null default 0 check (subtotal >= 0),
  cost_total numeric(18,2) not null default 0 check (cost_total >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  unique (company_id, number),
  foreign key (company_id, party_id) references public.milenium_parties(company_id, id) on delete set null (party_id),
  foreign key (company_id, property_id) references public.milenium_properties(company_id, id) on delete set null (property_id),
  foreign key (company_id, machine_id) references public.milenium_machines(company_id, id) on delete set null (machine_id),
  foreign key (company_id, quote_id) references public.milenium_quotes(company_id, id) on delete set null (quote_id),
  foreign key (company_id, lead_id) references public.milenium_leads(company_id, id) on delete set null (lead_id),
  check (planned_end is null or planned_start is null or planned_end >= planned_start)
);

create table if not exists public.milenium_service_order_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  service_order_id uuid not null,
  item_id uuid,
  description text not null,
  quantity numeric(18,4) not null default 1 check (quantity > 0),
  unit_price numeric(18,2) not null default 0 check (unit_price >= 0),
  cost_price numeric(18,2) not null default 0 check (cost_price >= 0),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, service_order_id) references public.milenium_service_orders(company_id, id) on delete cascade,
  foreign key (company_id, item_id) references public.milenium_items(company_id, id) on delete set null (item_id)
);

create table if not exists public.milenium_purchase_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  supplier_party_id uuid,
  number text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'confirmed', 'partially_received', 'received', 'cancelled')),
  ordered_at date,
  expected_at date,
  subtotal numeric(18,2) not null default 0 check (subtotal >= 0),
  total numeric(18,2) not null default 0 check (total >= 0),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  unique (company_id, number),
  foreign key (company_id, supplier_party_id) references public.milenium_parties(company_id, id) on delete set null (supplier_party_id),
  check (expected_at is null or ordered_at is null or expected_at >= ordered_at)
);

create table if not exists public.milenium_purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  purchase_order_id uuid not null,
  item_id uuid,
  description text not null,
  quantity numeric(18,4) not null default 1 check (quantity > 0),
  received_quantity numeric(18,4) not null default 0 check (received_quantity >= 0 and received_quantity <= quantity),
  unit_cost numeric(18,2) not null default 0 check (unit_cost >= 0),
  status text not null default 'pending' check (status in ('pending', 'partially_received', 'received', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, purchase_order_id) references public.milenium_purchase_orders(company_id, id) on delete cascade,
  foreign key (company_id, item_id) references public.milenium_items(company_id, id) on delete set null (item_id)
);

create table if not exists public.milenium_stock_movements (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  item_id uuid not null,
  service_order_id uuid,
  purchase_order_id uuid,
  movement_type text not null check (movement_type in ('receipt', 'issue', 'transfer', 'adjustment', 'reservation', 'release', 'return')),
  quantity numeric(18,4) not null check (quantity <> 0),
  unit_cost numeric(18,2) not null default 0 check (unit_cost >= 0),
  reference text,
  status text not null default 'posted' check (status in ('draft', 'posted', 'cancelled')),
  occurred_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, item_id) references public.milenium_items(company_id, id) on delete restrict,
  foreign key (company_id, service_order_id) references public.milenium_service_orders(company_id, id) on delete set null (service_order_id),
  foreign key (company_id, purchase_order_id) references public.milenium_purchase_orders(company_id, id) on delete set null (purchase_order_id)
);

create table if not exists public.milenium_financial_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  party_id uuid,
  quote_id uuid,
  service_order_id uuid,
  purchase_order_id uuid,
  entry_type text not null check (entry_type in ('receivable', 'payable')),
  category text,
  description text not null,
  amount numeric(18,2) not null check (amount > 0),
  due_date date not null,
  settled_at date,
  status text not null default 'pending' check (status in ('pending', 'due', 'partially_paid', 'paid', 'cancelled', 'overdue')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, id),
  foreign key (company_id, party_id) references public.milenium_parties(company_id, id) on delete set null (party_id),
  foreign key (company_id, quote_id) references public.milenium_quotes(company_id, id) on delete set null (quote_id),
  foreign key (company_id, service_order_id) references public.milenium_service_orders(company_id, id) on delete set null (service_order_id),
  foreign key (company_id, purchase_order_id) references public.milenium_purchase_orders(company_id, id) on delete set null (purchase_order_id),
  check ((status = 'paid') = (settled_at is not null))
);

create table if not exists public.milenium_attachments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  entity_type text not null check (entity_type in ('company', 'party', 'property', 'machine', 'item', 'lead', 'quote', 'service_order', 'purchase_order', 'financial_entry', 'audit_event')),
  entity_id uuid not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  checksum text,
  status text not null default 'available' check (status in ('pending', 'available', 'archived')),
  uploaded_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milenium_audit_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.milenium_companies(id) on delete cascade,
  actor_user_id uuid default auth.uid() references auth.users(id) on delete set null,
  entity_type text not null check (entity_type in ('company', 'membership', 'party', 'property', 'machine', 'item', 'lead', 'quote', 'quote_item', 'service_order', 'service_order_item', 'stock_movement', 'purchase_order', 'purchase_order_item', 'financial_entry', 'attachment')),
  entity_id uuid,
  action text not null check (action in ('created', 'updated', 'status_changed', 'approved', 'cancelled', 'deleted', 'posted', 'settled')),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'recorded' check (status in ('recorded', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.milenium_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.milenium_is_member(p_company_id uuid)
returns boolean
language sql
stable
set search_path = public
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from public.milenium_memberships as membership
      where membership.company_id = p_company_id
        and membership.user_id = (select auth.uid())
        and membership.status = 'active'
    );
$$;

create or replace function public.milenium_prevent_company_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.company_id is distinct from old.company_id then
    raise exception 'company_id is immutable for Milenium records';
  end if;
  return new;
end;
$$;

revoke all on function public.milenium_set_updated_at() from public;
revoke all on function public.milenium_is_member(uuid) from public;
revoke all on function public.milenium_prevent_company_change() from public;
grant execute on function public.milenium_set_updated_at() to authenticated;
grant execute on function public.milenium_is_member(uuid) to authenticated;
grant execute on function public.milenium_prevent_company_change() to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'milenium_companies', 'milenium_memberships', 'milenium_parties',
    'milenium_properties', 'milenium_machines', 'milenium_items',
    'milenium_leads', 'milenium_quotes', 'milenium_quote_items',
    'milenium_service_orders', 'milenium_service_order_items',
    'milenium_purchase_orders', 'milenium_purchase_order_items',
    'milenium_stock_movements', 'milenium_financial_entries',
    'milenium_attachments', 'milenium_audit_events'
  ] loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_updated_at', table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.milenium_set_updated_at()', table_name || '_updated_at', table_name);
    if table_name <> 'milenium_companies' then
      execute format('drop trigger if exists %I on public.%I', table_name || '_company_immutable', table_name);
      execute format('create trigger %I before update on public.%I for each row execute function public.milenium_prevent_company_change()', table_name || '_company_immutable', table_name);
    end if;
  end loop;
end;
$$;

create index if not exists milenium_memberships_user_idx on public.milenium_memberships(user_id, status);
create index if not exists milenium_memberships_company_idx on public.milenium_memberships(company_id, status);
create index if not exists milenium_parties_company_status_idx on public.milenium_parties(company_id, status);
create index if not exists milenium_properties_company_party_idx on public.milenium_properties(company_id, party_id);
create index if not exists milenium_machines_company_property_idx on public.milenium_machines(company_id, property_id);
create index if not exists milenium_machines_company_party_idx on public.milenium_machines(company_id, party_id);
create index if not exists milenium_items_company_status_idx on public.milenium_items(company_id, status);
create index if not exists milenium_leads_company_status_idx on public.milenium_leads(company_id, status);
create index if not exists milenium_quotes_company_status_idx on public.milenium_quotes(company_id, status);
create index if not exists milenium_quote_items_quote_idx on public.milenium_quote_items(company_id, quote_id);
create index if not exists milenium_service_orders_company_status_idx on public.milenium_service_orders(company_id, status);
create index if not exists milenium_service_orders_assigned_idx on public.milenium_service_orders(company_id, assigned_to, status);
create index if not exists milenium_service_order_items_order_idx on public.milenium_service_order_items(company_id, service_order_id);
create index if not exists milenium_purchase_orders_company_status_idx on public.milenium_purchase_orders(company_id, status);
create index if not exists milenium_purchase_order_items_order_idx on public.milenium_purchase_order_items(company_id, purchase_order_id);
create index if not exists milenium_stock_movements_item_time_idx on public.milenium_stock_movements(company_id, item_id, occurred_at desc);
create index if not exists milenium_stock_movements_order_idx on public.milenium_stock_movements(company_id, service_order_id);
create index if not exists milenium_financial_entries_due_idx on public.milenium_financial_entries(company_id, status, due_date);
create index if not exists milenium_attachments_entity_idx on public.milenium_attachments(company_id, entity_type, entity_id);
create index if not exists milenium_audit_events_entity_idx on public.milenium_audit_events(company_id, entity_type, entity_id, created_at desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'milenium_companies', 'milenium_memberships', 'milenium_parties',
    'milenium_properties', 'milenium_machines', 'milenium_items',
    'milenium_leads', 'milenium_quotes', 'milenium_quote_items',
    'milenium_service_orders', 'milenium_service_order_items',
    'milenium_purchase_orders', 'milenium_purchase_order_items',
    'milenium_stock_movements', 'milenium_financial_entries',
    'milenium_attachments', 'milenium_audit_events'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
  end loop;
  revoke update, delete on table public.milenium_memberships from authenticated;
  revoke update, delete on table public.milenium_audit_events from authenticated;
end;
$$;

-- Companies are bootstrapped by their creator. Memberships are user-scoped;
-- invitations for another user should be performed by a trusted server flow later.
create policy "milenium companies select" on public.milenium_companies
  for select to authenticated
  using (created_by = (select auth.uid()) or public.milenium_is_member(id));
create policy "milenium companies insert" on public.milenium_companies
  for insert to authenticated
  with check (created_by = (select auth.uid()));
create policy "milenium companies update" on public.milenium_companies
  for update to authenticated
  using (created_by = (select auth.uid()))
  with check (created_by = (select auth.uid()));
create policy "milenium companies delete" on public.milenium_companies
  for delete to authenticated
  using (created_by = (select auth.uid()));

create policy "milenium memberships select own" on public.milenium_memberships
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "milenium memberships insert own" on public.milenium_memberships
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.milenium_companies as company
      where company.id = company_id and company.created_by = (select auth.uid())
    )
  );

create policy "milenium parties select" on public.milenium_parties for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium parties insert" on public.milenium_parties for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium parties update" on public.milenium_parties for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium parties delete" on public.milenium_parties for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium properties select" on public.milenium_properties for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium properties insert" on public.milenium_properties for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium properties update" on public.milenium_properties for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium properties delete" on public.milenium_properties for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium machines select" on public.milenium_machines for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium machines insert" on public.milenium_machines for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium machines update" on public.milenium_machines for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium machines delete" on public.milenium_machines for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium items select" on public.milenium_items for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium items insert" on public.milenium_items for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium items update" on public.milenium_items for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium items delete" on public.milenium_items for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium leads select" on public.milenium_leads for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium leads insert" on public.milenium_leads for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium leads update" on public.milenium_leads for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium leads delete" on public.milenium_leads for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium quotes select" on public.milenium_quotes for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium quotes insert" on public.milenium_quotes for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium quotes update" on public.milenium_quotes for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium quotes delete" on public.milenium_quotes for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium quote items select" on public.milenium_quote_items for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium quote items insert" on public.milenium_quote_items for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium quote items update" on public.milenium_quote_items for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium quote items delete" on public.milenium_quote_items for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium service orders select" on public.milenium_service_orders for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium service orders insert" on public.milenium_service_orders for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium service orders update" on public.milenium_service_orders for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium service orders delete" on public.milenium_service_orders for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium service order items select" on public.milenium_service_order_items for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium service order items insert" on public.milenium_service_order_items for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium service order items update" on public.milenium_service_order_items for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium service order items delete" on public.milenium_service_order_items for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium purchase orders select" on public.milenium_purchase_orders for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium purchase orders insert" on public.milenium_purchase_orders for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium purchase orders update" on public.milenium_purchase_orders for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium purchase orders delete" on public.milenium_purchase_orders for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium purchase order items select" on public.milenium_purchase_order_items for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium purchase order items insert" on public.milenium_purchase_order_items for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium purchase order items update" on public.milenium_purchase_order_items for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium purchase order items delete" on public.milenium_purchase_order_items for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium stock movements select" on public.milenium_stock_movements for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium stock movements insert" on public.milenium_stock_movements for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium stock movements update" on public.milenium_stock_movements for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium stock movements delete" on public.milenium_stock_movements for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium financial entries select" on public.milenium_financial_entries for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium financial entries insert" on public.milenium_financial_entries for insert to authenticated with check (public.milenium_is_member(company_id));
create policy "milenium financial entries update" on public.milenium_financial_entries for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium financial entries delete" on public.milenium_financial_entries for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium attachments select" on public.milenium_attachments for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium attachments insert" on public.milenium_attachments for insert to authenticated with check (public.milenium_is_member(company_id) and uploaded_by = (select auth.uid()));
create policy "milenium attachments update" on public.milenium_attachments for update to authenticated using (public.milenium_is_member(company_id)) with check (public.milenium_is_member(company_id));
create policy "milenium attachments delete" on public.milenium_attachments for delete to authenticated using (public.milenium_is_member(company_id));

create policy "milenium audit events select" on public.milenium_audit_events for select to authenticated using (public.milenium_is_member(company_id));
create policy "milenium audit events insert" on public.milenium_audit_events for insert to authenticated with check (public.milenium_is_member(company_id) and actor_user_id = (select auth.uid()));
