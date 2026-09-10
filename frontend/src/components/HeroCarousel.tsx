import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface Slide {
  image: string;
  eyebrow: string;
  title: string[];
  subtitle: string;
  primaryCta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
}

const SLIDES: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1559255394-044328bfa8b5?auto=format&fit=crop&w=1600&q=75",
    eyebrow: "NOVA COLEÇÃO",
    title: ["STREETWEAR", "SEM FILTRO"],
    subtitle:
      "Peças pensadas pra rua: conforto, atitude e aquele drip que ninguém tem igual. Envio rápido pra todo o Brasil.",
    primaryCta: { label: "Ver produtos", to: "/produtos" },
    secondaryCta: { label: "Camisetas", to: "/produtos?category=camisetas" },
  },
  {
    image: "https://images.unsplash.com/photo-1637228393246-c38a4b3d2011?auto=format&fit=crop&w=1600&q=75",
    eyebrow: "TODA SEMANA",
    title: ["LANÇAMENTOS", "NOVOS NO DROP"],
    subtitle: "Peças exclusivas chegando toda semana. Sempre tem novidade pra fechar o fit.",
    primaryCta: { label: "Ver lançamentos", to: "/produtos" },
  },
  {
    image: "https://images.unsplash.com/photo-1756641964889-5a04b6e0f4f6?auto=format&fit=crop&w=1600&q=75",
    eyebrow: "FRETE GRÁTIS",
    title: ["ACIMA DE R$ 299", "ENVIO GRÁTIS PRA VOCÊ"],
    subtitle: "Compras acima de R$ 299 têm frete grátis para todo o Brasil. Aproveita.",
    primaryCta: { label: "Aproveitar agora", to: "/produtos" },
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <section
      className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] overflow-hidden border-b border-base-border"
      role="region"
      aria-label="Destaques da loja"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 40) goTo(active + (delta < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="relative z-10 h-full container-page flex items-center">
            <div className="max-w-xl">
              <p className="text-accent text-sm font-semibold tracking-wide mb-4">{slide.eyebrow}</p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6 text-white">
                {slide.title.map((line, li) => (
                  <span key={li}>
                    {line}
                    {li < slide.title.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="text-white/80 max-w-md mb-8">{slide.subtitle}</p>
              <div className="flex gap-4">
                <Link to={slide.primaryCta.to} className="btn-primary">
                  {slide.primaryCta.label}
                </Link>
                {slide.secondaryCta && (
                  <Link
                    to={slide.secondaryCta.to}
                    className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-5 py-3 rounded-sm hover:border-accent hover:text-accent transition-colors"
                  >
                    {slide.secondaryCta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Setas — escondidas no mobile pra não sobrepor o texto (lá o usuário troca pelos indicadores/swipe) */}
      <button
        type="button"
        onClick={() => goTo(active - 1)}
        aria-label="Slide anterior"
        className="hidden sm:flex absolute z-20 left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-accent text-white items-center justify-center transition-colors"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => goTo(active + 1)}
        aria-label="Próximo slide"
        className="hidden sm:flex absolute z-20 right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-accent text-white items-center justify-center transition-colors"
      >
        ›
      </button>

      {/* Indicadores */}
      <div className="absolute z-20 bottom-5 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para o slide ${i + 1}`}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-8 bg-accent" : "w-4 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
