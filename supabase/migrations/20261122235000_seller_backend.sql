-- Works on a new Supabase project or the original LEADLY schema.
begin;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  business text not null,
  plan text check (plan in ('starter','pro')),
  message text,
  created_at timestamptz default now()
);
alter table public.leads add column if not exists seller_id uuid references auth.users(id) on delete set null;
alter table public.leads add column if not exists request_key uuid;
create unique index if not exists leads_seller_request_idx on public.leads (seller_id, request_key);
alter table public.leads enable row level security;

drop policy if exists anon_insert_leads on public.leads;
drop policy if exists authenticated_select_leads on public.leads;
drop policy if exists authenticated_delete_leads on public.leads;
revoke all on public.leads from public, anon, authenticated;
grant select, delete on public.leads to authenticated;

create policy leadly_read_requests on public.leads for select to authenticated
using (seller_id = (select auth.uid()) or coalesce((select auth.jwt())->'app_metadata'->'leadly_admin', 'false'::jsonb) = 'true'::jsonb);
create policy leadly_admin_delete on public.leads for delete to authenticated
using (coalesce((select auth.jwt())->'app_metadata'->'leadly_admin', 'false'::jsonb) = 'true'::jsonb);

-- Retire the old public RPCs. Historical rows remain available to operators.
do $$
declare old_function regprocedure;
begin
  foreach old_function in array array[to_regprocedure('public.insert_lead(text,text,text,text,text)'), to_regprocedure('public.insert_lead_json(json)')]
  loop
    if old_function is not null then
      execute format('revoke all on function %s from public, anon, authenticated, service_role', old_function);
    end if;
  end loop;
end $$;

-- The former edge endpoint used a service role. Reject ownerless new writes,
-- including writes from that endpoint, without modifying historical rows.
create or replace function public.leadly_require_owner() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.seller_id is null then raise exception 'Seller required' using errcode = '23502'; end if;
  return new;
end $$;
create trigger leadly_require_owner before insert on public.leads
for each row execute function public.leadly_require_owner();

create or replace function public.submit_seller_request(
  p_key uuid, p_name text, p_whatsapp text, p_business text, p_plan text, p_message text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  seller uuid := auth.uid();
  saved_id uuid;
begin
  if seller is null then raise exception 'Sign-in required' using errcode = '42501'; end if;
  if p_key is null or coalesce(length(btrim(p_name)),0) not between 1 and 120
    or coalesce(length(btrim(p_business)),0) not between 1 and 300
    or p_whatsapp is null or p_whatsapp !~ '^[+][1-9][0-9]{6,14}$'
    or (p_plan is not null and p_plan not in ('starter','pro'))
    or length(p_message) > 1500 then
    raise exception 'Invalid buyer request' using errcode = '22023';
  end if;
  insert into public.leads (seller_id, request_key, name, whatsapp, business, plan, message)
    values (seller, p_key, btrim(p_name), p_whatsapp, btrim(p_business), p_plan, nullif(btrim(p_message),''))
    on conflict (seller_id, request_key) do nothing returning id into saved_id;
  if saved_id is null then
    select id into saved_id from public.leads where seller_id = seller and request_key = p_key
      and (name,whatsapp,business,plan,message) is not distinct from
          (btrim(p_name),p_whatsapp,btrim(p_business),p_plan,nullif(btrim(p_message),''));
    if saved_id is null then raise exception 'Request key already used with different details' using errcode = '22023'; end if;
  end if;
  return saved_id;
end $$;
revoke all on function public.submit_seller_request(uuid,text,text,text,text,text) from public,anon;
grant execute on function public.submit_seller_request(uuid,text,text,text,text,text) to authenticated;
commit;
