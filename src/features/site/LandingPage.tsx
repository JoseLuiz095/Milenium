import { FormEvent, useState } from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { SectionHeading } from './components/SectionHeading';
import { ServiceCard } from './components/ServiceCard';
import { createLead, LeadPayload } from './leadService';
import './site.css';
import './site-overrides.css';

const navItems = [
  { label: 'A Milenium', href: '#historia' },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Para quem', href: '#para-quem' },
  { label: 'Como fazemos', href: '#processo' },
  { label: 'Contato', href: '#contato' },
];

const initialForm: LeadPayload = {
  name: '', email: '', phone: '', company: '', service: '', description: '', deadline: '', attachmentName: '', consent: false,
};

const icon = (name: string) => <i className={`pi pi-${name}`} aria-hidden="true" />;

export function LandingPage() {
  const [form, setForm] = useState<LeadPayload>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateField = (field: keyof LeadPayload, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createLead(form);
      setSubmitted(true);
      setForm(initialForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="milenium-site">
      <header className="site-header">
        <div className="site-container site-header-inner">
          <a className="site-logo" href="#top" aria-label="Milenium, início">
            <span className="site-logo-mark">M</span>
            <span><strong>MILENIUM</strong><small>irrigação &amp; oficina</small></span>
          </a>
          <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu" aria-expanded={menuOpen}>
            {icon(menuOpen ? 'times' : 'bars')}
          </button>
          <nav className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navegação principal">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
            <Link className="nav-app-link" to="/app">Acessar sistema {icon('arrow-up-right')}</Link>
          </nav>
        </div>
      </header>

      <section className="site-hero" id="top">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="kicker-dot" /> Irrigação, oficina e manutenção para o agro</span>
            <h1>Serviço que entende o campo e <em>faz acontecer.</em></h1>
            <p>A Milenium une experiência de campo, oficina bem equipada e organização para atender pequenos serviços de irrigação, manutenção, reparos e fabricação — e avaliar outras demandas que façam sentido para a sua estrutura.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#orcamento">Descrever meu desafio {icon('arrow-right')}</a>
              <a className="button button-ghost" href="#historia">Por que a Milenium? {icon('play')}</a>
            </div>
            <div className="hero-trust"><span className="trust-avatars"><i>50+</i><i>OF</i><i>ES</i></span><span>Experiência, oficina e critério<br /><strong>da necessidade ao próximo passo</strong></span></div>
          </div>
          <div className="hero-visual hero-photo" aria-label="Sistema de irrigação em operação no campo">
            <img src="/images/milenium-irrigacao-hero.png" alt="Pivô de irrigação em uma lavoura ao entardecer" />
            <div className="hero-photo-shade" />
            <div className="hero-visual-note"><span className="note-icon"><i className="pi pi-check" /></span><span><strong>Experiência que vira resposta</strong><small>serviços para operações que não podem parar</small></span></div>
          </div>
        </div>
        <div className="hero-bottom-line site-container"><span>IRRIGAÇÃO</span><span>FABRICAÇÃO</span><span>MANUTENÇÃO</span><span>RESULTADO</span></div>
      </section>

      <section className="metrics-strip">
        <div className="site-container metrics-grid">
          <div><strong>50<span>+</span></strong><p>anos de experiência<br />prática no agro</p></div>
          <div><strong>Oficina</strong><p>estrutura para reparos,<br />ajustes e adaptações</p></div>
          <div><strong>Lin.</strong><p>base em Linhares<br />e atuação regional</p></div>
          <div><strong>Escopo</strong><p>avaliação responsável<br />antes de assumir</p></div>
          <div className="metrics-quote">“Entender a demanda, respeitar a capacidade e executar bem o que foi combinado.”</div>
        </div>
      </section>

      <section className="site-section story-section" id="historia">
        <div className="site-container story-grid">
          <div className="story-art">
            <div className="story-card story-card-back"><span>50+</span><small>anos de experiência</small></div>
            <div className="story-photo"><div className="story-photo-sky" /><div className="story-photo-ground" /><div className="story-tree" /><span className="story-photo-label">Campo &amp; conhecimento</span></div>
            <div className="story-stamp">M<br /><small>história</small><br />50+</div>
          </div>
          <div className="story-copy">
            <SectionHeading eyebrow="Nossa história" title="Uma história construída na prática, com continuidade." description="A experiência da Milenium foi formada ao longo de décadas de trabalho com irrigação, oficina e apoio técnico no agro." />
            <p>O campo ensinou a nossa equipe a olhar para o que realmente importa: equipamento funcionando, resposta objetiva e compromisso com a rotina de quem produz.</p>
            <p>Hoje, em Linhares, a Milenium atua em serviços terceirizados em volume para a Acqua Fértil Irrigação e mantém a oficina disponível para parceiros que precisam de pequenos reparos, adaptações e demandas técnicas avaliadas com critério.</p>
            <div className="story-principles"><span><i className="pi pi-compass" /> Experiência de campo</span><span><i className="pi pi-users" /> Relação próxima</span><span><i className="pi pi-check-circle" /> Entrega responsável</span></div>
            <a className="text-link" href="#solucoes">Conhecer nossa capacidade {icon('arrow-right')}</a>
          </div>
        </div>
      </section>

      <section className="site-section solutions-section" id="solucoes">
        <div className="site-container">
          <SectionHeading eyebrow="O que fazemos" title="Capacidade prática para resolver bem o que está ao alcance." description="Entramos onde a sua operação precisa de ferramenta, organização e critério: da rotina de irrigação ao reparo que não pode esperar." />
          <div className="service-grid">
            <ServiceCard icon="◌" title="Apoio à irrigação" description="Manutenção, ajustes e suporte para componentes e rotinas que ajudam o sistema de irrigação a continuar trabalhando." tags={['Manutenção', 'Componentes', 'Rotina de campo']} tone="green" />
            <ServiceCard icon="⌁" title="Oficina & reparos" description="Peças, adaptações e pequenos reparos com torno, bancada, solda, elevação de carga e ferramentas manuais." tags={['Torno e bancada', 'Elevação', 'Ferramentas']} tone="sand" />
            <ServiceCard icon="↻" title="Demandas sob avaliação" description="Pequenos serviços recorrentes ou pontuais analisados conforme prazo, materiais, segurança e capacidade da oficina." tags={['Ajustes', 'Reparos', 'Sob medida']} tone="blue" />
          </div>
          <div className="solutions-callout"><span className="callout-symbol">✦</span><p><strong>Você traz o desafio.</strong> A gente entende o contexto, avalia a capacidade e devolve um próximo passo possível — sem promessa genérica.</p><a className="text-link" href="#orcamento">Avaliar meu serviço {icon('arrow-right')}</a></div>
        </div>
      </section>

      <section className="site-section fit-section" id="para-quem">
        <div className="site-container">
          <SectionHeading eyebrow="Onde podemos ajudar" title="Quando a operação precisa de uma equipe que assume junto." description="A Milenium é uma boa parceira para empresas e produtores que precisam de execução confiável, capacidade de oficina e comunicação simples." />
          <div className="fit-grid">
            <article className="fit-card"><span className="fit-number">01</span><i className="pi pi-building" /><h3>Empresas de irrigação</h3><p>Terceirize serviços e pequenos lotes sem perder rastreabilidade, padrão e ritmo de atendimento.</p></article>
            <article className="fit-card"><span className="fit-number">02</span><i className="pi pi-sun" /><h3>Operações agrícolas</h3><p>Resolva ajustes, manutenção e necessidades de campo com alguém que conhece a pressão da produção.</p></article>
            <article className="fit-card"><span className="fit-number">03</span><i className="pi pi-cog" /><h3>Indústrias e oficinas</h3><p>Conte com uma estrutura parceira para peças, soldas, adaptações e demandas fora do fluxo principal.</p></article>
          </div>
        </div>
      </section>

      <section className="workshop-section">
        <div className="site-container workshop-grid">
          <div className="workshop-copy"><span className="site-eyebrow">Por dentro da oficina</span><h2>Ferramenta certa para o pequeno serviço que precisa andar.</h2><p>Além de torno mecânico, furadeira de bancada e solda, a oficina reúne girafa de elevação de carga, esmerilhadeiras, furadeiras portáteis e outras ferramentas para reparos, adaptações e demandas pontuais.</p><div className="workshop-tools workshop-capabilities"><span>{icon('cog')} Torno e bancada</span><span>{icon('arrow-up')} Girafa de elevação</span><span>{icon('bolt')} Solda</span><span>{icon('wrench')} Esmerilhadeiras</span><span>{icon('wrench')} Furadeiras portáteis</span></div><div className="workshop-scope"><i className="pi pi-check-circle" /><span><strong>Escopo técnico avaliado antes de assumir</strong><small>Assim, prazo, materiais e segurança entram no combinado desde o início.</small></span></div><a className="button button-light" href="#orcamento">Consultar capacidade {icon('arrow-right')}</a></div>
          <div className="workshop-art workshop-photo" aria-label="Oficina com diversas ferramentas para reparos e adaptações"><img src="/images/milenium-oficina-capacidade.png" alt="Oficina com torno mecânico, girafa de elevação, furadeira de bancada e ferramentas manuais" /><div className="workshop-photo-shade" /><div className="workshop-label">feito aqui,<br /><strong>para resolver</strong></div></div>
        </div>
      </section>

      <section className="site-section portfolio-section" id="portfolio">
        <div className="site-container">
          <div className="portfolio-heading"><SectionHeading eyebrow="Frentes de trabalho" title="Da demanda recorrente ao serviço que pede solução rápida." description="A operação da Milenium foi construída para lidar com volume, variedade e o cuidado que cada peça ou atendimento exige." /><a className="text-link" href="#orcamento">Conversar sobre uma demanda {icon('arrow-right')}</a></div>
          <div className="portfolio-grid">
            <article className="portfolio-card portfolio-card-large"><div className="portfolio-art farm-art"><span className="farm-sun" /><span className="farm-pivot" /><span className="farm-crop crop-one" /><span className="farm-crop crop-two" /></div><div className="portfolio-caption"><span>01 / Parceria operacional</span><h3>Pequenos serviços em grande volume</h3><p>Atendimento terceirizado para a Acqua Fértil Irrigação, em Linhares.</p></div></article>
            <article className="portfolio-card"><div className="portfolio-art workshop-art-small"><span className="small-machine" /><span className="small-spark">✦</span></div><div className="portfolio-caption"><span>02 / Oficina</span><h3>Peças, ajustes e reparos</h3><p>Uma estrutura compacta para resolver o que trava a operação.</p></div></article>
            <article className="portfolio-card"><div className="portfolio-art water-art"><span className="water-ring ring-one" /><span className="water-ring ring-two" /><span className="water-drop">⌁</span></div><div className="portfolio-caption"><span>03 / Irrigação</span><h3>Rotina que protege o resultado</h3><p>Manutenção e apoio para sistemas que precisam continuar trabalhando.</p></div></article>
          </div>
        </div>
      </section>

      <section className="site-section process-section" id="processo">
        <div className="site-container process-grid"><div><SectionHeading eyebrow="Como fazemos" title="Clareza do primeiro contato à entrega." description="Você não precisa chegar com o pedido pronto. Basta compartilhar o contexto; a Milenium ajuda a organizar a necessidade e o próximo passo." /><Link className="button button-outline" to="/app">Acompanhar pelo sistema {icon('arrow-up-right')}</Link></div><div className="process-list"><div className="process-item"><span>01</span><div><h3>Entendemos o contexto</h3><p>Recebemos fotos, medidas, local e o que está pressionando sua operação.</p></div></div><div className="process-item"><span>02</span><div><h3>Avaliamos a capacidade</h3><p>Conversamos sobre prazo, volume, materiais e o que faz sentido executar.</p></div></div><div className="process-item"><span>03</span><div><h3>Combinamos o próximo passo</h3><p>Você recebe uma orientação clara para avançar com segurança e transparência.</p></div></div><div className="process-item"><span>04</span><div><h3>Registramos e acompanhamos</h3><p>Quando o serviço começa, a equipe mantém a informação organizada do início ao fim.</p></div></div></div></div>
      </section>

      <section className="quote-section" id="orcamento">
        <div className="site-container quote-grid"><div className="quote-intro"><span className="site-eyebrow">Novo orçamento</span><h2>Vamos entender o que precisa ser resolvido?</h2><p>Conte o contexto, o volume e o prazo que você tem em mente. A equipe Milenium avalia a demanda e retorna com um próximo passo possível.</p><div className="quote-contact-note"><span>{icon('check-circle')}</span><p><strong>Sem compromisso e sem formulário genérico</strong><br />Quanto mais contexto você enviar, melhor será nossa orientação.</p></div><div className="quote-proof"><span><i className="pi pi-map-marker" /> Linhares, ES</span><span><i className="pi pi-wrench" /> Oficina e campo</span></div></div><form className="quote-form" onSubmit={handleSubmit}><div className="form-heading"><span>Conte sobre o serviço</span><strong>Vamos começar pela sua necessidade.</strong></div><div className="form-row"><label>Seu nome *<input required value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Como podemos chamar você?" /></label><label>Empresa<input value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Nome da empresa" /></label></div><div className="form-row"><label>E-mail *<input required type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="voce@empresa.com" /></label><label>Telefone / WhatsApp *<input required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(00) 00000-0000" /></label></div><div className="form-row"><label>Como podemos ajudar? *<select required value={form.service} onChange={(e) => updateField('service', e.target.value)}><option value="">Selecione uma frente</option><option>Apoio à irrigação</option><option>Oficina, reparo ou adaptação</option><option>Pequeno serviço em volume</option><option>Demanda especial sob avaliação</option><option>Ainda preciso entender</option></select></label><label>Prazo desejado<select value={form.deadline} onChange={(e) => updateField('deadline', e.target.value)}><option value="">Ainda não sei</option><option>Urgente</option><option>Até 30 dias</option><option>1 a 3 meses</option><option>Mais de 3 meses</option></select></label></div><label>Fale um pouco sobre o projeto *<textarea required rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Onde é, qual o desafio, volume aproximado e o que você já sabe sobre a solução?" /></label><label className="upload-box"><input type="file" accept="image/*,.pdf" onChange={(e) => updateField('attachmentName', e.target.files?.[0]?.name ?? '')} /><span className="upload-icon">{icon('paperclip')}</span><span><strong>{form.attachmentName || 'Anexe fotos, plantas ou referências'}</strong><small>Opcional · PDF, JPG ou PNG</small></span><span className="upload-action">Escolher arquivo</span></label><label className="consent-check"><input type="checkbox" required checked={form.consent} onChange={(e) => updateField('consent', e.target.checked)} /><span>Autorizo o uso dos meus dados para contato sobre este orçamento, conforme a <a href="#lgpd">Política de Privacidade</a>.</span></label><Button type="submit" loading={submitting} className="button button-primary form-submit" label={submitting ? 'Enviando...' : 'Quero conversar sobre o serviço'} icon="pi pi-arrow-right" iconPos="right" />{submitted && <p className="form-success" role="status">Recebemos sua solicitação. O próximo passo é entender o contexto com você.</p>}</form></div>
      </section>

      <section className="site-section careers-section" id="trabalhe-conosco"><div className="site-container careers-grid"><div className="careers-art"><span className="careers-sun" /><span className="careers-hill hill-one" /><span className="careers-hill hill-two" /><span className="careers-person person-one" /><span className="careers-person person-two" /><span className="careers-sign">tem lugar<br /><strong>para quem faz</strong></span></div><div className="careers-copy"><span className="site-eyebrow">Trabalhe conosco</span><h2>Gente boa reconhece trabalho bem feito.</h2><p>Se você gosta de aprender, resolver e trabalhar com responsabilidade, envie seu contato. A Milenium valoriza quem transforma conhecimento prático em cuidado com o cliente e com a equipe.</p><a className="button button-outline" href="#contato">Enviar meu contato {icon('arrow-up-right')}</a></div></div></section>

      <section className="contact-section" id="contato"><div className="site-container contact-grid"><div><span className="site-eyebrow">Vamos conversar</span><h2>Tem uma pergunta?<br /><em>A gente responde.</em></h2></div><div className="contact-details"><a href="#orcamento"><span>{icon('phone')}</span><div><small>Solicitar contato</small><strong>Fale com a equipe pelo formulário</strong></div></a><a href="#orcamento"><span>{icon('envelope')}</span><div><small>Orçamento e oportunidades</small><strong>Envie os detalhes do que precisa</strong></div></a><div><span>{icon('map-marker')}</span><div><small>Atuação atual</small><strong>Linhares · Espírito Santo</strong></div></div></div><div className="contact-social"><span>acompanhe a Milenium</span><a href="#contato" aria-label="Instagram">ig</a><a href="#contato" aria-label="LinkedIn">in</a></div></div></section>

      <footer className="site-footer"><div className="site-container footer-grid"><a className="site-logo footer-logo" href="#top"><span className="site-logo-mark">M</span><span><strong>MILENIUM</strong><small>irrigação &amp; oficina</small></span></a><p>Experiência, fabricação e presença<br />para o agro continuar crescendo.</p><div className="footer-links"><a href="#historia">A Milenium</a><a href="#solucoes">Soluções</a><a href="#orcamento">Orçamento</a><Link to="/app">Acessar sistema</Link></div></div><div className="site-container footer-bottom"><span>© 2026 Milenium · Linhares/ES</span><span id="lgpd">Privacidade e LGPD</span></div></footer>
    </main>
  );
}
