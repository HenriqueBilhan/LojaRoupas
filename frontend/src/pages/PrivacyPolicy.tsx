import { Link } from "react-router-dom";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-base mb-3">{title}</h2>
      <div className="text-sm text-ink-muted leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="container-page py-10 max-w-3xl">
      <nav className="text-xs text-ink-muted mb-6 flex items-center gap-1">
        <Link to="/" className="hover:text-accent transition-colors">
          Início
        </Link>
        <span>›</span>
        <span className="text-ink">Política de Privacidade</span>
      </nav>

      <h1 className="font-display text-2xl mb-2">Política de Privacidade</h1>
      <p className="text-sm text-ink-muted leading-relaxed mb-10">
        A sua privacidade é importante para nós. Esta política explica quais dados coletamos,
        como usamos essas informações e quais são os seus direitos, em conformidade com a Lei
        Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
      </p>

      <Section title="1. Quais dados coletamos">
        <p>Coletamos as informações necessárias para processar seu pedido e melhorar sua experiência de compra, como:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Nome completo, e-mail e telefone.</li>
          <li>CPF e endereço, para emissão de nota fiscal e entrega.</li>
          <li>Dados de navegação (cookies, páginas visitadas, produtos visualizados).</li>
          <li>Histórico de pedidos e comunicações com o nosso atendimento.</li>
        </ul>
        <p>Dados de pagamento (como número de cartão) são processados diretamente pela plataforma de pagamento parceira e não ficam armazenados em nossos servidores.</p>
      </Section>

      <Section title="2. Como usamos os seus dados">
        <ul className="list-disc list-inside space-y-1">
          <li>Processar e entregar os seus pedidos.</li>
          <li>Emitir nota fiscal e cumprir obrigações legais e fiscais.</li>
          <li>Enviar atualizações sobre o status da compra.</li>
          <li>Oferecer suporte e responder dúvidas, trocas e devoluções.</li>
          <li>Com o seu consentimento, enviar promoções e novidades por e-mail ou WhatsApp.</li>
          <li>Melhorar a navegação e a segurança do site.</li>
        </ul>
      </Section>

      <Section title="3. Compartilhamento de dados">
        <p>Não vendemos os seus dados pessoais. Compartilhamos apenas o necessário com:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Transportadoras e Correios, para realizar a entrega.</li>
          <li>Processadores de pagamento, para viabilizar a compra.</li>
          <li>Autoridades públicas, quando exigido por lei.</li>
        </ul>
      </Section>

      <Section title="4. Cookies">
        <p>
          Utilizamos cookies para lembrar itens no seu carrinho, manter você conectado à sua
          conta e entender como o site é utilizado, permitindo melhorias contínuas. Você pode
          desativar os cookies nas configurações do seu navegador, mas isso pode afetar algumas
          funcionalidades do site.
        </p>
      </Section>

      <Section title="5. Armazenamento e segurança">
        <p>
          Seus dados são armazenados em ambiente seguro e mantidos apenas pelo tempo necessário
          para cumprir as finalidades descritas nesta política ou obrigações legais, sendo
          descartados com segurança em seguida.
        </p>
      </Section>

      <Section title="6. Seus direitos">
        <p>De acordo com a LGPD, você pode, a qualquer momento, solicitar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Confirmação de que tratamos os seus dados.</li>
          <li>Acesso, correção ou atualização dos seus dados.</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
          <li>Revogação do consentimento para comunicações de marketing.</li>
          <li>Exclusão dos seus dados, quando não houver obrigação legal de retenção.</li>
        </ul>
      </Section>

      <Section title="7. Fale conosco">
        <p>Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            WhatsApp:{" "}
            <a
              href="https://wa.me/5551995214307"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              51 99521-4307
            </a>
          </li>
          <li>
            E-mail:{" "}
            <a href="mailto:2kkconcept@gmail.com" className="text-accent hover:underline">
              2kkconcept@gmail.com
            </a>
          </li>
        </ul>
      </Section>

      <p className="text-sm text-ink-muted leading-relaxed border-t border-base-border pt-6">
        Esta política pode ser atualizada periodicamente para refletir melhorias no site ou
        mudanças na legislação. Recomendamos revisá-la de tempos em tempos.
      </p>
    </div>
  );
}
