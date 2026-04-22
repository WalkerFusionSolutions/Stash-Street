import Link from "next/link"
import { ArrowRight, Shield, Zap, Star } from "lucide-react"
import { CountdownTimer } from "./countdown-timer"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 300px at 20% 20%, rgba(138,43,226,0.22), transparent 60%), radial-gradient(500px 300px at 80% 30%, rgba(0,245,255,0.15), transparent 60%), radial-gradient(400px 300px at 50% 90%, rgba(255,0,110,0.12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-20 text-center md:px-8 md:py-28 lg:py-36 scanlines">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-mono tracking-[0.22em] text-white/70 backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--neon-pink)] shadow-[0_0_8px_var(--neon-pink)] animate-pulse-dot" />
          GRENADA&apos;S FINEST · LIVE NOW
        </div>

        <h1 className="text-balance font-sans text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
          We stay on top so <br className="hidden md:block" />
          <span className="neon-text-animated text-glow-soft">you can be on top.</span>
        </h1>

        <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/65 md:text-lg">
          Stash Street Apparel — Grenada&apos;s home for authentic designer clothing and accessories.
          Every piece verified. Priced right. Dropped fast. No holds, no exceptions.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-cyan)] bg-transparent px-7 py-3.5 font-mono text-sm tracking-[0.2em] text-[color:var(--neon-cyan)] transition-all hover:bg-[color:var(--neon-cyan)] hover:text-black glow-cyan"
          >
            SHOP THE DROP
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="/custom-order"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 font-mono text-sm tracking-[0.2em] text-white/80 transition-colors hover:border-[color:var(--neon-purple)]/50 hover:text-white"
          >
            CUSTOM ORDER
          </Link>
        </div>

        <div className="mt-4 w-full max-w-3xl">
          <CountdownTimer />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono tracking-[0.2em] text-white/45">
          <span className="inline-flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-[color:var(--neon-purple)]" aria-hidden />
            100% AUTHENTIC
          </span>
          <span className="inline-flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-[color:var(--neon-cyan)]" aria-hidden />
            AFFORDABLE PRICES
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-[color:var(--neon-pink)]" aria-hidden />
            PEAK QUALITY
          </span>
        </div>
      </div>
    </section>
  )
}
