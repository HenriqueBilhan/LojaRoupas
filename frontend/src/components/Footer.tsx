import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Truck, CreditCard, RefreshCcw, MessageCircle, Mail, Phone } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

const FEATURES = [
  {
    icon: Truck,
    title: "Envios Para Todo o Brasil",
    text: "Compre e receba no conforto da sua casa!",
  },
  {
    icon: CreditCard,
    title: "Compre no Pix ou Cartão",
    text: "Desconto no Pix ou Parcelamento no Cartão",
  },
  {
    icon: RefreshCcw,
    title: "Produto Não Serviu?",
    text: "Sem Problemas, Nós Trocamos para Você.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento Personalizado!",
    text: "Dúvidas? Contate Nossos Vendedores.",
  },
];

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 4v10.2a3.3 3.3 0 1 1-3.3-3.3" />
      <path d="M14 4c.3 2.2 2 3.9 4.2 4.2" />
    </svg>
  );
}

function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: ligar num endpoint real de newsletter quando existir no backend.
    setSent(true);
  }

  if (sent) {
    return <p className="text-sm text-accent">Cadastro recebido! Em breve as novidades chegam até você.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${compact ? "" : "max-w-sm"}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        className="input-field py-2 text-sm"
      />
      <button type="submit" className="btn-primary py-2 px-5 text-sm whitespace-nowrap">
        Enviar
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16">
      {/* Barra de benefícios */}
      <div className="bg-accent">
        <div className="container-page py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <Icon size={26} className="text-base" />
              <p className="text-base text-sm font-semibold">{title}</p>
              <p className="text-base/80 text-xs">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter em destaque */}
      <div className="bg-base-surface border-b border-base-border">
        <div className="container-page py-10">
          <h3 className="font-display text-xl mb-2">Newsletter</h3>
          <p className="text-sm text-ink-muted mb-4">
            Quer receber nossas ofertas? Cadastre-se e comece a recebê-las!
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Colunas principais */}
      <div className="container-page py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="h-12 mb-3">
            <Logo />
          </div>
          <p className="text-sm text-ink-muted leading-relaxed mb-4">
            Streetwear com atitude. Peças selecionadas para quem não abre mão do estilo.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/jordanwearstore/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram da JW Store"
              className="text-ink-muted hover:text-accent transition-colors"
            >
              <InstagramIcon width={20} height={20} />
            </a>
            <a
              href={`${API_URL}/go/tiktok`}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok da JW Store"
              className="text-ink-muted hover:text-accent transition-colors"
            >
              <TikTokIcon width={20} height={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Atendimento</h4>
          <ul className="text-sm text-ink-muted space-y-2">
            <li>Segunda à Sábado, 9h às 18h</li>
            <li className="flex items-center gap-2">
              <Phone size={14} />
              <a href="https://wa.me/5551995214307" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                51 99521-4307
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} />
              <a href="mailto:contato@jwstore.com.br" className="hover:text-accent transition-colors">
                contato@jwstore.com.br
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Políticas</h4>
          <ul className="text-sm text-ink-muted space-y-2">
            <li>
              <Link to="/politica-de-trocas-e-devolucoes" className="hover:text-accent transition-colors">
                Política de reembolso
              </Link>
            </li>
            <li>
              <Link to="/politica-de-trocas-e-devolucoes" className="hover:text-accent transition-colors">
                Trocas e devoluções
              </Link>
            </li>
            <li>
              <Link to="/politica-de-privacidade" className="hover:text-accent transition-colors">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link to="/politica-de-frete" className="hover:text-accent transition-colors">
                Política de frete
              </Link>
            </li>
            <li>
              <Link to="/termos-de-servico" className="hover:text-accent transition-colors">
                Termos de serviço
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Newsletter</h4>
          <NewsletterForm compact />
        </div>
      </div>

     
    </footer>
  );
}
