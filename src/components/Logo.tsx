/** Isotipo "Boca de horno" — la bóveda del horno de barro con una brasa encendida adentro. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M10 58V30a22 22 0 0 1 44 0v28z" fill="#C2511F" />
      <path d="M22 58V35a10 10 0 0 1 20 0v23z" fill="#FBF5EC" />
      <circle cx="32" cy="50" r="4.5" fill="#E09A2D" />
    </svg>
  );
}

export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark size={size} />
      <span className="font-display text-[1.3em] font-black tracking-[-0.02em] text-cafe">hornito</span>
    </span>
  );
}
