import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  authMode,
  createFirstCompanyAndMembership,
  getSession,
  type FirstCompanyInput,
} from "../../services/auth";
import { AuthBrand, authStyles } from "./authUi";

export function BootstrapPage(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<FirstCompanyInput>({
    legalName: "",
    tradeName: "Milenium Irrigação",
    document: "",
  });
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    void getSession()
      .then((state) => {
        if (!state.user && isMounted) navigate("/auth/login", { replace: true });
      })
      .catch((sessionError) => {
        if (isMounted) {
          setError(
            sessionError instanceof Error
              ? sessionError.message
              : "Não foi possível verificar o acesso.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await createFirstCompanyAndMembership(form);
      navigate("/app", { replace: true });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Não foi possível cadastrar a empresa.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof FirstCompanyInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (isCheckingSession) {
    return (
      <main style={authStyles.page}>
        <section style={authStyles.card}>
          <AuthBrand />
          <p style={authStyles.muted}>Verificando o acesso...</p>
        </section>
      </main>
    );
  }

  return (
    <main style={authStyles.page}>
      <section style={authStyles.card} aria-labelledby="bootstrap-title">
        <AuthBrand />
        <h1 id="bootstrap-title" style={{ margin: "1.25rem 0 .5rem", color: "#173322" }}>
          Cadastre a empresa
        </h1>
        <p style={authStyles.muted}>
          Esta é a configuração inicial. Ela cria a empresa isolada da Milenium e associa seu usuário como proprietário.
        </p>
        {authMode === "demo" && (
          <div style={{ ...authStyles.notice, marginBottom: "1rem" }}>
            Modo demonstração: o cadastro será salvo somente neste navegador.
          </div>
        )}
        {error && <div style={{ ...authStyles.error, marginBottom: "1rem" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <label style={authStyles.label}>
            Razão social
            <input
              style={authStyles.input}
              value={form.legalName}
              onChange={(event) => updateField("legalName", event.target.value)}
              placeholder="Milenium Irrigação e Serviços Ltda."
              required
            />
          </label>
          <label style={authStyles.label}>
            Nome fantasia
            <input
              style={authStyles.input}
              value={form.tradeName}
              onChange={(event) => updateField("tradeName", event.target.value)}
              placeholder="Milenium Irrigação"
            />
          </label>
          <label style={authStyles.label}>
            CNPJ <span style={{ color: "#718174", fontWeight: 400 }}>(opcional)</span>
            <input
              style={authStyles.input}
              value={form.document}
              onChange={(event) => updateField("document", event.target.value)}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
            />
          </label>
          <button style={authStyles.primaryButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Criar empresa e entrar"}
          </button>
        </form>

        <Link to="/auth/login" style={{ ...authStyles.secondaryButton, display: "block", textAlign: "center", marginTop: "1.25rem" }}>
          Voltar para o acesso
        </Link>
      </section>
    </main>
  );
}
