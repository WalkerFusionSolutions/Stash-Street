import Link from "next/link"
import { whatsappLink } from "@/lib/utils"
import { MessageCircle } from "lucide-react"

const STEPS = [
  {
    n: "01",
    title: "Browse & Select",
    body: "Browse the live drop, find your piece. Check the size, condition, and SKU code carefully. Everything listed is in stock and authenticated.",
  },
  {
    n: "02",
    title: "Add to Cart or Message Us",
    body: "Add to cart and checkout online, or tap WhatsApp and send the SKU code. We reply within minutes with availability and payment options.",
  },
  {
    n: "03",
    title: "Pay & Receive",
    body: "Settle within the 30-minute grace period. We authenticate, package, and ship same-day with tracking. Custom orders require a 50% deposit upfront.",
  },
]

export function HowToBuy() {
  return (
    <section id="how-to-buy" className="relative overflow-hidden border-y border-white/5 bg-black/40">
      <div aria-hidden className="absolute inset-0 bg-grid-fine opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">
            / HOW IT WORKS
          </div>
          <h2 className="mt-2 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
            From scroll to <span className="neon-text">doorstep.</span>
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="glass group relative flex flex-col gap-4 rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:border-[color:var(--neon-cyan)]/40"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{ background: "rgba(0,245,255,0.3)" }}
                  />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--neon-cyan)]/60 bg-black/60 font-mono text-xl font-bold text-[color:var(--neon-cyan)] text-glow-cyan">
                    {s.n}
                  </div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[color:var(--neon-cyan)]/40 to-transparent" />
              </div>
              <h3 className="text-xl font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{s.body}</p>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="hidden md:absolute md:-right-3.5 md:top-1/2 md:block md:-translate-y-1/2 md:text-xl md:text-[color:var(--neon-cyan)]/50"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-3 font-mono text-sm tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 glow-cyan"
          >
            SHOP NOW
          </Link>
          <a
            href={whatsappLink("Hi Stash Street! I have a question about buying.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-sm tracking-[0.2em] text-white/75 hover:text-white transition-colors"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            ASK ON WHATSAPP
          </a>
        </div>
      </div>
    </section>
  )
}
