import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-base-border mt-16">
      <div className="container-page py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="h-12 mb-3">
            <Logo />
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">
            Streetwear com atitude. Peças selecionadas para quem não abre mão do estilo.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Atendimento</h4>
          <ul className="text-sm text-ink-muted space-y-2">
            <li>Segunda à Sábado, 9h às 18h</li>
            <li>contato@jwstore.com.br</li>
            <li>Atendimento via WhatsApp</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Políticas</h4>
          <ul className="text-sm text-ink-muted space-y-2">
            <li>Política de reembolso</li>
            <li>Trocas e devoluções</li>
            <li>Política de frete</li>
            <li>Termos de serviço</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Formas de pagamento</h4>
          <p className="text-sm text-ink-muted">Cartão de crédito, Pix e Boleto.</p>
        </div>
      </div>

      <div className="border-t border-base-border py-6 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} JW Store — Todos os direitos reservados.
      </div>
    </footer>
  );
}
