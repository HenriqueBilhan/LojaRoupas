import { Link } from "react-router-dom";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-base mb-3">{title}</h2>
      <div className="text-sm text-ink-muted leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function ExchangePolicy() {
  return (
    <div className="container-page py-10 max-w-3xl">
      <nav className="text-xs text-ink-muted mb-6 flex items-center gap-1">
        <Link to="/" className="hover:text-accent transition-colors">
          Início
        </Link>
        <span>›</span>
        <span className="text-ink">Política de Trocas e Devoluções</span>
      </nav>

      <h1 className="font-display text-2xl mb-2">Política de Trocas e Devoluções</h1>
      <p className="text-sm text-ink-muted leading-relaxed mb-10">
        Na nossa loja, a sua satisfação é prioridade. Por isso, oferecemos uma política clara e
        justa para trocas e devoluções, garantindo uma experiência tranquila e segura para você. A
        seguir, detalhamos tudo o que você precisa saber para solicitar uma troca ou devolução.
      </p>

      <Section title="1. Prazo para Solicitação">
        <p>
          De acordo com o Código de Defesa do Consumidor, você tem até 7 dias corridos após o
          recebimento do produto para solicitar a troca ou devolução.
        </p>
        <p>
          <span className="text-ink font-medium">Produtos em promoção:</span> trocas são
          permitidas, porém o frete de envio e reenvio fica por conta do cliente.
        </p>
      </Section>

      <Section title="2. Troca por Tamanho ou Modelo">
        <p>
          Sabemos que o tamanho pode não servir como esperado — isso acontece! Para facilitar essa
          troca, observe as seguintes condições:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>O produto deve estar sem uso.</li>
          <li>Manter as etiquetas originais fixadas.</li>
          <li>Estar na embalagem original.</li>
          <li>Sem sinais de lavagem, odores ou qualquer alteração.</li>
        </ul>

        <p className="text-ink font-medium pt-2">Custos de Frete</p>
        <ul className="list-disc list-inside space-y-1">
          <li>O envio do produto de volta para a loja fica por sua conta.</li>
          <li>O reenvio do produto novo é gratuito na primeira troca.</li>
          <li>
            A partir da segunda troca, o custo dos dois envios (de ida e volta) será por conta do
            cliente.
          </li>
        </ul>
      </Section>

      <Section title="3. Condições Gerais para Troca ou Devolução">
        <p>Para que a troca ou devolução seja aceita, o produto precisa estar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Sem uso.</li>
          <li>Com a etiqueta fixada.</li>
          <li>Na embalagem original.</li>
          <li>Sem manchas, odores ou sinais de uso.</li>
        </ul>
        <p>Caso o produto não atenda a essas condições, a troca poderá ser recusada.</p>
      </Section>

      <Section title="4. Produto com Defeito">
        <p>Se o produto apresentar defeito de fabricação, siga os passos abaixo:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Entre em contato conosco em até 7 dias após o recebimento.</li>
          <li>Envie fotos ou vídeos que comprovem o defeito para análise.</li>
        </ol>
        <p>Após confirmação do problema:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Realizaremos a troca do produto sem custo; ou</li>
          <li>Ofereceremos o reembolso integral do valor pago.</li>
        </ul>
      </Section>

      <Section title="5. Como Solicitar Troca ou Devolução">
        <p>Para iniciar o processo, entre em contato pelos canais abaixo:</p>
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
              wearstorejordan@gmail.com
            </a>
          </li>
        </ul>
        <p>Lembre-se de informar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Número do pedido</li>
          <li>Motivo da troca ou devolução</li>
          <li>Fotos do produto, se necessário</li>
        </ul>
      </Section>

      <p className="text-sm text-ink-muted leading-relaxed border-t border-base-border pt-6">
        Estamos aqui para garantir que sua experiência de compra seja sempre positiva. Qualquer
        dúvida sobre trocas ou devoluções, fale com a nossa equipe pelos canais acima.
      </p>
    </div>
  );
}
