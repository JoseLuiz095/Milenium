import type {
  AuthChangeEvent,
  AuthResponse,
  Session,
  User,
} from "@supabase/supabase-js";
import { z } from "zod";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Tables } from "../types/database";

const DEMO_AUTH_KEY = "milenium.demo.auth";
const DEMO_COMPANY_KEY = "milenium.demo.company";

const credentialsSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres.")
    .max(72, "A senha deve ter no máximo 72 caracteres."),
});

const companySchema = z.object({
  legalName: z.string().trim().min(2, "Informe a razão social."),
  tradeName: z.string().trim().optional(),
  document: z.string().trim().optional(),
});

export type AuthMode = "supabase" | "demo";

export type AuthState = {
  mode: AuthMode;
  session: Session | null;
  user: User | null;
};

export type CredentialsInput = z.input<typeof credentialsSchema>;
export type FirstCompanyInput = z.input<typeof companySchema>;

export type FirstCompanyResult = {
  company: Tables<"milenium_companies">;
  membership: Tables<"milenium_memberships">;
};

export const authMode: AuthMode = isSupabaseConfigured ? "supabase" : "demo";

export function isDemoAuth(): boolean {
  return authMode === "demo";
}

export async function signIn(input: CredentialsInput): Promise<AuthState> {
  const credentials = credentialsSchema.parse(input);

  if (!supabase) {
    const demoUser = readDemoUser(credentials.email);
    writeDemoAuth(demoUser);
    return { mode: "demo", session: null, user: demoUser };
  }

  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) throw toAuthError(error);
  return toAuthState(data.session, data.user);
}

export async function signUp(input: CredentialsInput): Promise<AuthState> {
  const credentials = credentialsSchema.parse(input);

  if (!supabase) {
    const demoUser = readDemoUser(credentials.email);
    writeDemoAuth(demoUser);
    return { mode: "demo", session: null, user: demoUser };
  }

  // Do not send options.data here: it maps to user_metadata and is user-editable.
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) throw toAuthError(error);
  return toAuthState(data.session, data.user);
}

export async function signOut(): Promise<void> {
  if (!supabase) {
    removeDemoAuth();
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw toAuthError(error);
}

export async function getSession(): Promise<AuthState> {
  if (!supabase) {
    const user = readDemoAuth();
    return { mode: "demo", session: null, user };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw toAuthError(error);
  return toAuthState(data.session, data.session?.user ?? null);
}

export function onAuthStateChange(
  callback: (state: AuthState, event: AuthChangeEvent) => void,
): () => void {
  if (!supabase) return () => undefined;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(toAuthState(session, session?.user ?? null), event);
  });

  return () => subscription.unsubscribe();
}

export async function listMyCompanies(): Promise<
  Tables<"milenium_companies">[]
> {
  if (!supabase) {
    const company = readDemoCompany();
    return company ? [company] : [];
  }

  const { data, error } = await supabase
    .from("milenium_companies")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createFirstCompanyAndMembership(
  input: FirstCompanyInput,
): Promise<FirstCompanyResult> {
  const companyInput = companySchema.parse(input);
  const state = await getSession();

  if (!state.user) {
    throw new Error("Faça login antes de cadastrar a empresa.");
  }

  if (!supabase) {
    const now = new Date().toISOString();
    const company = {
      id: globalThis.crypto.randomUUID(),
      legal_name: companyInput.legalName,
      trade_name: companyInput.tradeName || null,
      document: companyInput.document || null,
      status: "active",
      created_by: state.user.id,
      created_at: now,
      updated_at: now,
    } as Tables<"milenium_companies">;
    const membership = {
      id: globalThis.crypto.randomUUID(),
      company_id: company.id,
      user_id: state.user.id,
      role: "owner",
      status: "active",
      created_at: now,
      updated_at: now,
    } as Tables<"milenium_memberships">;
    writeDemoCompany(company);
    return { company, membership };
  }

  const { data: company, error: companyError } = await supabase
    .from("milenium_companies")
    .insert({
      legal_name: companyInput.legalName,
      trade_name: companyInput.tradeName || null,
      document: companyInput.document || null,
      created_by: state.user.id,
      status: "active",
    })
    .select("*")
    .single();

  if (companyError) throw companyError;

  const { data: membership, error: membershipError } = await supabase
    .from("milenium_memberships")
    .insert({
      company_id: company.id,
      user_id: state.user.id,
      role: "owner",
      status: "active",
    })
    .select("*")
    .single();

  if (membershipError) {
    // The creator can remove an incomplete bootstrap row under the company RLS policy.
    await supabase.from("milenium_companies").delete().eq("id", company.id);
    throw membershipError;
  }

  return { company, membership };
}

function toAuthState(session: Session | null, user: User | null): AuthState {
  return { mode: "supabase", session, user };
}

function toAuthError(error: AuthResponse["error"]): Error {
  return new Error(
    error?.message || "Não foi possível concluir a autenticação.",
  );
}

function readDemoUser(email: string): User {
  const previous = readDemoAuth();
  const now = new Date().toISOString();
  return {
    id: previous?.id ?? "00000000-0000-4000-8000-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email,
    app_metadata: {},
    created_at: previous?.created_at ?? now,
    updated_at: now,
  } as unknown as User;
}

function readDemoAuth(): User | null {
  if (typeof localStorage === "undefined") return null;
  const value = localStorage.getItem(DEMO_AUTH_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    localStorage.removeItem(DEMO_AUTH_KEY);
    return null;
  }
}

function writeDemoAuth(user: User): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(user));
  }
}

function removeDemoAuth(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(DEMO_AUTH_KEY);
  }
}

function readDemoCompany(): Tables<"milenium_companies"> | null {
  if (typeof localStorage === "undefined") return null;
  const value = localStorage.getItem(DEMO_COMPANY_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as Tables<"milenium_companies">;
  } catch {
    localStorage.removeItem(DEMO_COMPANY_KEY);
    return null;
  }
}

function writeDemoCompany(company: Tables<"milenium_companies">): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(DEMO_COMPANY_KEY, JSON.stringify(company));
  }
}
