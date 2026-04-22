const BRANDS = [
  "CHROME HEARTS",
  "RICK OWENS",
  "BALENCIAGA",
  "SAINT LAURENT",
  "STÜSSY",
  "MAISON MARGIELA",
  "BBC ICECREAM",
  "VETEMENTS",
  "OFF-WHITE",
  "PALM ANGELS",
  "FEAR OF GOD",
  "AMIRI",
]

export function BrandsMarquee() {
  const items = [...BRANDS, ...BRANDS]
  return (
    <section aria-label="Brands we stock" className="relative overflow-hidden border-y border-white/5 bg-black/40 py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
        {items.map((b, i) => (
          <span
            key={`${b}-${i}`}
            className="font-mono text-sm tracking-[0.3em] text-white/60 transition-colors hover:text-[color:var(--neon-cyan)] hover:text-glow-cyan"
          >
            {b}
          </span>
        ))}
      </div>
    </section>
  )
}
