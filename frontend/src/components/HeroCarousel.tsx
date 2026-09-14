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
    image:
      "https://www.image2url.com/r2/default/images/1789066181503-8141d8a6-67a7-408f-bb8a-a9d78a7b6319.png",
    eyebrow: "REDES SOCIAIS",
    title: ['JÁ NOS SEGUE NAS', 'REDES SOCIAIS?'],
    subtitle:
      "Acompanhe a JW Store nas redes sociais e fique por dentro de todas as novidades, lançamentos, coleções e drops exclusivos. Descubra as tendências, confira nossas peças e faça parte da nossa comunidade.",
    primaryCta: {
      label: "Instagram",
      to: "https://www.instagram.com/jordanwearstore/",
    },
    secondaryCta: {
      label: 'TikTok',
      to: "https://www.tiktok.com/@jordanwearstore",
    },
  },
  {
    image:
      "https://www.image2url.com/r2/default/images/1789067165412-68514b5a-bb05-47d3-93b2-fdbd50ef11c4.png",
    eyebrow: "TODA SEMANA",
    title: ["LANÇAMENTOS", "NOVOS NO DROP"],
    subtitle:
      "Peças exclusivas chegando toda semana. Sempre tem novidade pra fechar o fit.",
    primaryCta: {
      label: "Ver lançamentos",
      to: "/produtos",
    },
  },
  {
    image:
      "https://www.image2url.com/r2/default/images/1789067346897-7e8f4290-1763-48a3-b6dc-e3354bdfd92d.png",
    eyebrow: "FRETE GRÁTIS",
    title: ["ACIMA DE R$ 299", "ENVIO GRÁTIS PRA VOCÊ"],
    subtitle:
      "Compras acima de R$ 299 têm frete grátis para todo o Brasil. Aproveita.",
    primaryCta: {
      label: "Aproveitar agora",
      to: "/produtos",
    },
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [paused]);

  return (
    <>
      {/* ==============================
          STYLESHEET
      ============================== */}

      <style>{`
        .jw-hero {
          position: relative;
          width: 100%;
          height: 480px;
          overflow: hidden;
          background: #08030d;
          border-bottom: 1px solid #321447;
        }

        /* SLIDE */

        .jw-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          z-index: 0;
          transition:
            opacity 0.7s ease-in-out,
            visibility 0.7s ease-in-out;
        }

        .jw-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 10;
        }

        /* IMAGEM */

        .jw-slide-image {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          object-fit: cover;
          object-position: center;

          display: block;

          transition: transform 6s ease;
        }

        .jw-slide.active .jw-slide-image {
          transform: scale(1.03);
        }

        /* GRADIENTE SOBRE A IMAGEM */

        .jw-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;

          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.9) 0%,
              rgba(8, 3, 13, 0.7) 35%,
              rgba(8, 3, 13, 0.25) 75%,
              rgba(8, 3, 13, 0.05) 100%
            );
        }

        .jw-overlay-bottom {
          position: absolute;
          inset: 0;
          z-index: 3;

          background:
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.75),
              transparent 65%
            );
        }

        /* CONTEÚDO */

        .jw-content {
          position: relative;
          z-index: 10;

          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;

          padding: 0 7%;
          box-sizing: border-box;
        }

        .jw-content-box {
          max-width: 600px;
        }

        /* TEXTO PEQUENO */

        .jw-eyebrow {
          margin: 0 0 16px;

          color: #a855f7;

          font-size: 14px;
          font-weight: 800;

          letter-spacing: 0.14em;
          text-transform: uppercase;

          text-shadow:
            0 0 12px rgba(168, 85, 247, 0.5);
        }

        /* TÍTULO */

        .jw-title {
          margin: 0 0 24px;

          color: #ffffff;

          font-size: 48px;
          font-weight: 900;

          line-height: 1.02;
          letter-spacing: -0.02em;

          text-transform: uppercase;

          text-shadow:
            4px 4px 0 #1a0624,
            0 0 20px rgba(168, 85, 247, 0.25);
        }

        .jw-title span {
          display: inline;
        }

        /* DESTAQUE ROXO */

        .jw-title span:last-child {
          color: #a855f7;

          text-shadow:
            4px 4px 0 #2b0a3d,
            0 0 20px rgba(168, 85, 247, 0.65);
        }

        /* SUBTÍTULO */

        .jw-subtitle {
          max-width: 500px;

          margin: 0 0 30px;

          color: rgba(255, 255, 255, 0.82);

          font-size: 16px;
          line-height: 1.6;
        }

        /* BOTÕES */

        .jw-buttons {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .jw-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 46px;

          padding: 0 22px;

          color: #ffffff;
          background: #8b2bd9;

          border: 1px solid #a855f7;
          border-radius: 4px;

          font-size: 14px;
          font-weight: 800;

          text-decoration: none;
          text-transform: uppercase;

          transition: all 0.3s ease;

          box-shadow:
            0 0 0 rgba(168, 85, 247, 0);
        }

        .jw-primary:hover {
          background: #a855f7;

          transform: translateY(-2px);

          box-shadow:
            0 8px 25px rgba(168, 85, 247, 0.4);
        }

        .jw-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 46px;

          padding: 0 22px;

          color: #ffffff;
          background: rgba(0, 0, 0, 0.25);

          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 4px;

          font-size: 14px;
          font-weight: 700;

          text-decoration: none;
          text-transform: uppercase;

          transition: all 0.3s ease;
        }

        .jw-secondary:hover {
          color: #a855f7;

          border-color: #a855f7;

          background: rgba(168, 85, 247, 0.1);

          box-shadow:
            0 0 15px rgba(168, 85, 247, 0.25);
        }

        /* SETAS */

        .jw-arrow {
          position: absolute;

          top: 50%;

          transform: translateY(-50%);

          z-index: 20;

          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #ffffff;

          background: rgba(0, 0, 0, 0.5);

          border: 1px solid rgba(168, 85, 247, 0.45);

          border-radius: 50%;

          font-size: 28px;
          line-height: 1;

          cursor: pointer;

          transition: all 0.3s ease;
        }

        .jw-arrow:hover {
          background: #8b2bd9;

          border-color: #a855f7;

          box-shadow:
            0 0 18px rgba(168, 85, 247, 0.6);
        }

        .jw-arrow-left {
          left: 24px;
        }

        .jw-arrow-right {
          right: 24px;
        }

        /* INDICADORES */

        .jw-indicators {
          position: absolute;

          left: 0;
          right: 0;
          bottom: 20px;

          z-index: 20;

          display: flex;
          justify-content: center;
          align-items: center;

          gap: 8px;
        }

        .jw-indicator {
          width: 16px;
          height: 6px;

          padding: 0;

          background: rgba(255, 255, 255, 0.4);

          border: none;
          border-radius: 20px;

          cursor: pointer;

          transition: all 0.3s ease;
        }

        .jw-indicator.active {
          width: 34px;

          background: #a855f7;

          box-shadow:
            0 0 10px rgba(168, 85, 247, 0.7);
        }

        .jw-indicator:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        /* =====================================
           TABLET
        ===================================== */

        @media (min-width: 640px) {
          .jw-hero {
            height: 560px;
          }

          .jw-title {
            font-size: 56px;
          }
        }

        /* =====================================
           DESKTOP
        ===================================== */

        @media (min-width: 1024px) {
          .jw-hero {
            height: 620px;
          }

          .jw-title {
            font-size: 68px;
          }

          .jw-content {
            padding-left: 8%;
          }
        }

        /* =====================================
           CELULAR
        ===================================== */

        @media (max-width: 639px) {
          .jw-hero {
            height: 520px;
          }

          .jw-slide-image {
            object-position: center;
          }

          .jw-overlay {
            background:
              linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.9),
                rgba(8, 3, 13, 0.55)
              );
          }

          .jw-content {
            padding: 0 24px;
          }

          .jw-content-box {
            width: 100%;
            max-width: 100%;
          }

          .jw-eyebrow {
            font-size: 12px;
            margin-bottom: 12px;
          }

          .jw-title {
            font-size: 36px;
            line-height: 1.05;
            margin-bottom: 18px;
          }

          .jw-subtitle {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 24px;
          }

          .jw-buttons {
            width: 100%;
            flex-direction: column;
            gap: 10px;
          }

          .jw-primary,
          .jw-secondary {
            width: 100%;
            box-sizing: border-box;
          }

          .jw-arrow {
            display: none;
          }

          .jw-indicators {
            bottom: 16px;
          }
        }

        /* =====================================
           CELULARES PEQUENOS
        ===================================== */

        @media (max-width: 400px) {
          .jw-hero {
            height: 500px;
          }

          .jw-title {
            font-size: 30px;
          }

          .jw-subtitle {
            font-size: 13px;
          }

          .jw-primary,
          .jw-secondary {
            min-height: 42px;
            font-size: 12px;
          }
        }
      `}</style>

      {/* ==============================
          CAROUSEL
      ============================== */}

      <section
        className="jw-hero"
        role="region"
        aria-label="Destaques da loja"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;

          const delta =
            e.changedTouches[0].clientX - touchStartX.current;

          if (Math.abs(delta) > 40) {
            goTo(active + (delta < 0 ? 1 : -1));
          }

          touchStartX.current = null;
        }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== active}
            className={`jw-slide ${
              i === active ? "active" : ""
            }`}
          >
            {/* IMAGEM */}

            <img
              src={slide.image}
              alt=""
              className="jw-slide-image"
              loading={i === 0 ? "eager" : "lazy"}
            />

            {/* GRADIENTES */}

            <div className="jw-overlay" />
            <div className="jw-overlay-bottom" />

            {/* CONTEÚDO */}

            <div className="jw-content">
              <div className="jw-content-box">
                <p className="jw-eyebrow">
                  {slide.eyebrow}
                </p>

                <h1 className="jw-title">
                  {slide.title.map((line, li) => (
                    <span key={li}>
                      {line}

                      {li < slide.title.length - 1 && <br />}
                    </span>
                  ))}
                </h1>

                <p className="jw-subtitle">
                  {slide.subtitle}
                </p>

                <div className="jw-buttons">
                  <Link
                    to={slide.primaryCta.to}
                    className="jw-primary"
                  >
                    {slide.primaryCta.label}
                  </Link>

                  {slide.secondaryCta && (
                    <Link
                      to={slide.secondaryCta.to}
                      className="jw-secondary"
                    >
                      {slide.secondaryCta.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ==============================
            SETA ANTERIOR
        ============================== */}

        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Slide anterior"
          className="jw-arrow jw-arrow-left"
        >
          ‹
        </button>

        {/* ==============================
            SETA PRÓXIMA
        ============================== */}

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Próximo slide"
          className="jw-arrow jw-arrow-right"
        >
          ›
        </button>

        {/* ==============================
            INDICADORES
        ============================== */}

        <div className="jw-indicators">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === active}
              className={`jw-indicator ${
                i === active ? "active" : ""
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}