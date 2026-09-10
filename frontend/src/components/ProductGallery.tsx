import { useRef, useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-base-surface border border-base-border rounded-sm flex items-center justify-center overflow-hidden">
        <span className="text-ink-muted px-8 text-center">{name}</span>
      </div>
    );
  }

  const hasMultiple = images.length > 1;

  function goTo(i: number) {
    setActive((i + images.length) % images.length);
  }

  return (
    <div>
      <div
        className="relative aspect-[4/5] bg-base-surface border border-base-border rounded-sm overflow-hidden"
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
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${name} — foto ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        ))}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Foto anterior"
              className="absolute z-10 left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-accent text-white flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Próxima foto"
              className="absolute z-10 right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-accent text-white flex items-center justify-center transition-colors"
            >
              ›
            </button>

            <div className="absolute z-10 bottom-3 left-0 right-0 flex justify-center gap-2 sm:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir para a foto ${i + 1}`}
                  aria-current={i === active}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-6 bg-accent" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="hidden sm:grid grid-cols-5 gap-2 mt-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === active}
              className={`aspect-square rounded-sm overflow-hidden border transition-colors ${
                i === active ? "border-accent" : "border-base-border hover:border-ink-muted"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
