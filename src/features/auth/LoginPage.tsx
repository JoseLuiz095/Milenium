import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  authMode,
  listMyCompanies,
  signIn,
  signUp,
  type CredentialsInput,
} from "../../services/auth";
import { AuthBrand, authStyles } from "./authUi";

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [credentials, setCredentials] = useState<CredentialsInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const state = isCreatingAccount
        ? await signUp(credentials)
        : await signIn(credentials);

      if (isCreatingAccount && !state.session && authMode === "supabase") {
        setNotice(
          "Conta criada. Confirme o e-mail, se essa exigência estiver habilitada no Supabase, e depois entre novamente.",
        );
      } else {
        const companies = await listMyCompanies();
        navigate(companies.length > 0 ? "/app" : "/auth/bootstrap", {
          replace: true,
        });
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Não foi possível concluir a operação.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof CredentialsInput, value: string) {
    setCredentials((current) => ({ ...current, [field]: value }));
  }

  return (
    <main style={authStyles.page}>
      <section style={authStyles.card} aria-labelledby="login-title">
        <AuthBrand />
        <p style={{ ...authStyles.muted, margin: ".5rem 0 1.5rem" }}>
          Gestão operacional para serviços de irrigação, oficina e manutenção.
        </p>

        <h1 id="login-title" style={{ margin: 0, color: "#173322" }}>
          {isCreatingAccount ? "Crie o acesso da Milenium" : "Acesse o ERP"}
        </h1>
        <p style={authStyles.muted}>
          {isCreatingAccount
            ? "Comece criando o primeiro usuário administrador. A empresa será cadastrada na próxima etapa."
            : "Entre para acessar clientes, orçamentos, ordens de serviço, oficina, estoque e financeiro."}
        </p>

        {authMode === "demo" && (
          <div style={{ ...authStyles.notice, marginBottom: "1rem" }}>
            Modo demonstração ativo: as informações ficam somente neste navegador até configurar as variáveis do Supabase.
          </div>
        )}
        {error && <div style={{ ...authStyles.error, marginBottom: "1rem" }}>{error}</div>}
        {notice && <div style={{ ...authStyles.notice, marginBottom: "1rem" }}>{notice}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <label style={authStyles.label}>
            E-mail
            <input
              style={authStyles.input}
              type="email"
              value={credentials.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label style={authStyles.label}>
            Senha
            <input
              style={authStyles.input}
              type="password"
              value={credentials.password}
              onChange={(event) => updateField("password", event.target.value)}
              autoComplete={isCreatingAccount ? "new-password" : "current-password"}
              minLength={6}
              required
            />
          </label>
          <button style={authStyles.primaryButton} type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Aguarde..."
              : isCreatingAccount
                ? "Criar acesso"
                : "Entrar no ERP"}
          </button>
        </form>

        <div style={{ display: "grid", gap: ".8rem", marginTop: "1.25rem" }}>
          <button
            type="button"
            style={authStyles.secondaryButton}
            onClick={() => {
              setIsCreatingAccount((current) => !current);
              setError("");
              setNotice("");
            }}
          >
            {isCreatingAccount
              ? "Já tenho acesso"
              : "Primeiro acesso? Crie a conta da empresa"}
          </button>
          <Link to="/" style={{ ...authStyles.secondaryButton, textAlign: "center" }}>
            Voltar para o site
          </Link>
        </div>
      </section>
    </main>
  );
}
