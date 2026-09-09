// Logo oficial da loja (enviada pelo usuário), em /public/logo.png
export default function Logo({ className = "" }: { className?: string }) {
  return <img src="/logo.png" alt="JW" className={`h-full w-auto object-contain ${className}`} />;
}
