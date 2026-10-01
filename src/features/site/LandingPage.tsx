import { FormEvent, useState } from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { SectionHeading } from './components/SectionHeading';
import { ServiceCard } from './components/ServiceCard';
import { createLead, LeadPayload } from './leadService';
import './site.css';

const navItems = [
  { label: 'Nossa história', href: '#historia' },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Portfólio', href: '#portfolio' },
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
            <span><strong>MILENIUM</strong><small>engenharia agrícola</small></span>
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
            <span className="hero-kicker"><span className="kicker-dot" /> Engenharia que faz a terra produzir</span>
            <h1>Do projeto à colheita, <em>presença</em> em cada etapa.</h1>
            <p>Há mais de 50 anos, a Milenium transforma experiência de campo em soluções de irrigação, fabricação, manutenção e serviços industriais.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#orcamento">Fale com um especialista {icon('arrow-right')}</a>
              <a className="button button-ghost" href="#historia">Conheça a Milenium {icon('play')}</a>
            </div>
            <div className="hero-trust"><span className="trust-avatars"><i>5</i><i>M</i><i>+</i></span><span>Uma equipe unida<br /><strong>pela experiência de campo</strong></span></div>
          </div>
          <div className="hero-visual" aria-label="Ilustração de um pivô de irrigação em uma plantação">
            <div className="hero-sun" />
            <div className="hero-field field-back" />
            <div className="hero-field field-front" />
            <div className="irrigation-pivot"><span className="pivot-center" /><span className="pivot-arm" /><i className="sprinkler s1" /><i className="sprinkler s2" /><i className="sprinkler s3" /><i className="sprinkler s4" /></div>
            <div className="hero-visual-note"><span className="note-icon">⌁</span><span><strong>Eficiência hídrica</strong><small>planejada para cada cultura</small></span></div>
          </div>
        </div>
        <div className="hero-bottom-line site-container"><span>IRRIGAÇÃO</span><span>FABRICAÇÃO</span><span>MANUTENÇÃO</span><span>RESULTADO</span></div>
      </section>

      <section className="metrics-strip">
        <div className="site-container metrics-grid">
          <div><strong>50<span>+</span></strong><p>anos de experiência<br />acumulada</p></div>
          <div><strong>5</strong><p>sócios unidos<br />pela operação</p></div>
          <div><strong>1</strong><p>parceria operacional<br />em grande volume</p></div>
          <div><strong>ES</strong><p>atuação atual<br />em Linhares</p></div>
          <div className="metrics-quote">“Experiência de oficina, proximidade e compromisso com cada serviço.”</div>
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
            <SectionHeading eyebrow="Nossa história" title="Raiz forte. Olhar para frente." description="A Milenium nasceu no campo, ouvindo quem planta, colhe e movimenta o agro todos os dias." />
            <p>A Milenium nasceu da união de cinco sócios ao final de uma empresa, reunindo conhecimento prático, ferramentas e vontade de continuar trabalhando para o campo.</p>
            <p>Depois de mais de 50 anos ligados à irrigação agrícola, hoje concentramos nossa operação em pequenos serviços em grande volume, com a parceria da Acqua Fértil Irrigação, em Linhares.</p>
            <a className="text-link" href="#solucoes">Ver nossas soluções {icon('arrow-right')}</a>
          </div>
        </div>
      </section>

      <section className="site-section solutions-section" id="solucoes">
        <div className="site-container">
          <SectionHeading eyebrow="O que fazemos" title="Conhecimento técnico que corre a favor do seu resultado." description="Do primeiro desenho à manutenção no dia a dia, cuidamos do que faz a sua operação funcionar melhor." />
          <div className="service-grid">
            <ServiceCard icon="◌" title="Irrigação agrícola" description="Projetos sob medida para levar água na medida certa, reduzir desperdícios e aumentar a produtividade." tags={['Pivô central', 'Aspersão', 'Gotejamento']} tone="green" />
            <ServiceCard icon="⌁" title="Oficina & fabricação" description="Peças, estruturas e reparos feitos com precisão na nossa oficina de torno, furadeira e solda." tags={['Torno', 'Solda', 'Usinagem']} tone="sand" />
            <ServiceCard icon="↻" title="Manutenção no campo" description="Acompanhamento próximo e resposta rápida para manter sua operação sempre em movimento." tags={['Preventiva', 'Corretiva', 'Plantão']} tone="blue" />
          </div>
          <div className="solutions-callout"><span className="callout-symbol">✦</span><p><strong>Você traz o desafio.</strong> A gente combina experiência, ferramenta e presença para encontrar o melhor caminho.</p><a className="text-link" href="#orcamento">Começar uma conversa {icon('arrow-right')}</a></div>
        </div>
      </section>

      <section className="workshop-section">
        <div className="site-container workshop-grid">
          <div className="workshop-copy"><span className="site-eyebrow">Por dentro da oficina</span><h2>A mão que entende a máquina.</h2><p>É na oficina que a experiência vira solução concreta. Cada corte, dobra e solda carrega o cuidado de quem conhece o campo por dentro.</p><div className="workshop-tools"><span>{icon('cog')} Torno</span><span>{icon('wrench')} Furadeira</span><span>{icon('bolt')} Solda</span></div><a className="button button-light" href="#orcamento">Conheça nossa capacidade {icon('arrow-right')}</a></div>
          <div className="workshop-art" aria-label="Ilustração da oficina Milenium"><div className="workshop-glow" /><div className="workshop-window"><span /><span /><span /></div><div className="workshop-shelf" /><div className="workshop-machine machine-lathe"><i /><b /><span /></div><div className="workshop-machine machine-drill"><i /><b /><span /></div><div className="workshop-floor" /><div className="workshop-label">feito aqui,<br /><strong>para durar</strong></div></div>
        </div>
      </section>

      <section className="site-section portfolio-section" id="portfolio">
        <div className="site-container">
          <div className="portfolio-heading"><SectionHeading eyebrow="Portfólio" title="Projetos que deixam marca no mapa." description="Alguns trabalhos que contam um pouco do que gostamos de fazer: resolver, simplificar e entregar resultado." /><a className="text-link" href="#orcamento">Quero um projeto assim {icon('arrow-right')}</a></div>
          <div className="portfolio-grid">
            <article className="portfolio-card portfolio-card-large"><div className="portfolio-art farm-art"><span className="farm-sun" /><span className="farm-pivot" /><span className="farm-crop crop-one" /><span className="farm-crop crop-two" /></div><div className="portfolio-caption"><span>01 / Operação</span><h3>Serviços em volume · Linhares, ES</h3><p>Atendimento terceirizado para a Acqua Fértil Irrigação</p></div></article>
            <article className="portfolio-card"><div className="portfolio-art workshop-art-small"><span className="small-machine" /><span className="small-spark">✦</span></div><div className="portfolio-caption"><span>02 / Oficina</span><h3>Peças e pequenos reparos</h3><p>Torno, furadeira de bancada e solda</p></div></article>
            <article className="portfolio-card"><div className="portfolio-art water-art"><span className="water-ring ring-one" /><span className="water-ring ring-two" /><span className="water-drop">⌁</span></div><div className="portfolio-caption"><span>03 / Eficiência</span><h3>Reuso inteligente de água</h3><p>Mais produtividade, menos desperdício</p></div></article>
          </div>
        </div>
      </section>

      <section className="site-section process-section" id="processo">
        <div className="site-container process-grid"><div><SectionHeading eyebrow="Como fazemos" title="Clareza do começo ao fim." description="Um processo simples, próximo e transparente para transformar necessidade em tranquilidade." /><Link className="button button-outline" to="/app">Acompanhar pelo sistema {icon('arrow-up-right')}</Link></div><div className="process-list"><div className="process-item"><span>01</span><div><h3>Escuta no campo</h3><p>Entendemos sua operação, cultura, solo e o que precisa melhorar.</p></div></div><div className="process-item"><span>02</span><div><h3>Desenho da solução</h3><p>Nosso time combina técnica e viabilidade para apresentar o melhor caminho.</p></div></div><div className="process-item"><span>03</span><div><h3>Execução com cuidado</h3><p>Você acompanha cada etapa com uma equipe que assume o projeto junto.</p></div></div><div className="process-item"><span>04</span><div><h3>Presença que continua</h3><p>Depois da entrega, seguimos próximos com suporte e manutenção.</p></div></div></div></div>
      </section>

      <section className="quote-section" id="orcamento">
        <div className="site-container quote-grid"><div className="quote-intro"><span className="site-eyebrow">Novo orçamento</span><h2>Vamos colocar seu próximo projeto em movimento?</h2><p>Conte um pouco do que você precisa. Nossa equipe retorna em até 1 dia útil para conversar sobre possibilidades.</p><div className="quote-contact-note"><span>{icon('clock')}</span><p><strong>Retorno em até 1 dia útil</strong><br />Segunda a sexta, das 8h às 18h</p></div></div><form className="quote-form" onSubmit={handleSubmit}><div className="form-row"><label>Seu nome *<input required value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Como podemos chamar você?" /></label><label>Empresa<input value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Nome da empresa" /></label></div><div className="form-row"><label>E-mail *<input required type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="voce@empresa.com" /></label><label>Telefone / WhatsApp *<input required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(00) 00000-0000" /></label></div><div className="form-row"><label>Como podemos ajudar? *<select required value={form.service} onChange={(e) => updateField('service', e.target.value)}><option value="">Selecione um serviço</option><option>Irrigação agrícola</option><option>Fabricação e oficina</option><option>Manutenção no campo</option><option>Outro desafio</option></select></label><label>Prazo desejado<select value={form.deadline} onChange={(e) => updateField('deadline', e.target.value)}><option value="">Ainda não sei</option><option>Até 30 dias</option><option>1 a 3 meses</option><option>Mais de 3 meses</option></select></label></div><label>Fale um pouco sobre o projeto *<textarea required rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Onde é, qual o desafio e o que você imagina como solução?" /></label><label className="upload-box"><input type="file" accept="image/*,.pdf" onChange={(e) => updateField('attachmentName', e.target.files?.[0]?.name ?? '')} /><span className="upload-icon">{icon('paperclip')}</span><span><strong>{form.attachmentName || 'Anexe fotos, plantas ou referências'}</strong><small>Opcional · PDF, JPG ou PNG</small></span><span className="upload-action">Escolher arquivo</span></label><label className="consent-check"><input type="checkbox" required checked={form.consent} onChange={(e) => updateField('consent', e.target.checked)} /><span>Autorizo o uso dos meus dados para contato sobre este orçamento, conforme a <a href="#lgpd">Política de Privacidade</a>.</span></label><Button type="submit" loading={submitting} className="button button-primary form-submit" label={submitting ? 'Enviando...' : 'Enviar pedido de orçamento'} icon="pi pi-arrow-right" iconPos="right" />{submitted && <p className="form-success" role="status">Pedido recebido! Em breve nossa equipe entra em contato.</p>}</form></div>
      </section>

      <section className="site-section careers-section" id="trabalhe-conosco"><div className="site-container careers-grid"><div className="careers-art"><span className="careers-sun" /><span className="careers-hill hill-one" /><span className="careers-hill hill-two" /><span className="careers-person person-one" /><span className="careers-person person-two" /><span className="careers-sign">tem lugar<br /><strong>para quem faz</strong></span></div><div className="careers-copy"><span className="site-eyebrow">Trabalhe conosco</span><h2>O campo precisa de gente que gosta de fazer.</h2><p>Se você tem curiosidade, responsabilidade e vontade de construir soluções que importam, deixe seu contato. A equipe Milenium poderá conversar com você sobre futuras oportunidades.</p><a className="button button-outline" href="#contato">Deixe seu contato {icon('arrow-up-right')}</a></div></div></section>

      <section className="contact-section" id="contato"><div className="site-container contact-grid"><div><span className="site-eyebrow">Vamos conversar</span><h2>Tem uma pergunta?<br /><em>A gente responde.</em></h2></div><div className="contact-details"><a href="#orcamento"><span>{icon('phone')}</span><div><small>Solicitar contato</small><strong>Fale com a equipe pelo formulário</strong></div></a><a href="#orcamento"><span>{icon('envelope')}</span><div><small>Orçamento e oportunidades</small><strong>Envie os detalhes do que precisa</strong></div></a><div><span>{icon('map-marker')}</span><div><small>Atuação atual</small><strong>Linhares · Espírito Santo</strong></div></div></div><div className="contact-social"><span>acompanhe a Milenium</span><a href="#contato" aria-label="Instagram">ig</a><a href="#contato" aria-label="LinkedIn">in</a></div></div></section>

      <footer className="site-footer"><div className="site-container footer-grid"><a className="site-logo footer-logo" href="#top"><span className="site-logo-mark">M</span><span><strong>MILENIUM</strong><small>engenharia agrícola</small></span></a><p>Experiência, fabricação e presença<br />para o agro continuar crescendo.</p><div className="footer-links"><a href="#historia">A Milenium</a><a href="#solucoes">Soluções</a><a href="#orcamento">Orçamento</a><Link to="/app">Acessar sistema</Link></div></div><div className="site-container footer-bottom"><span>© 2026 Milenium · Linhares/ES</span><span id="lgpd">Privacidade e LGPD</span></div></footer>
    </main>
  );
}
