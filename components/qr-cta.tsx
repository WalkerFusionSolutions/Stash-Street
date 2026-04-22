import Link from "next/link"
import { MessageCircle, Instagram } from "lucide-react"
import { whatsappLink } from "@/lib/utils"

function QrPattern() {
  const pattern: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 0, 0, 1, 1],
    [1, 1, 0, 1, 0, 1, 1, 0, 1],
  ]
  return (
    <div
      role="img"
      aria-label="Scan to open Stash Street WhatsApp"
      className="grid aspect-square w-full grid-cols-9 gap-[3px] rounded-2xl bg-white p-4"
    >
      {pattern.flatMap((row, y) =>
        row.map((cell, x) => (
          <span
            key={`${x}-${y}`}
            className="rounded-[2px]"
            style={{
              background: cell
                ? "linear-gradient(135deg, #8A2BE2, #FF00FF 60%, #00F5FF)"
                : "transparent",
            }}
          />
        ))
      )}
    </div>
  )
}

export function QrCta() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grid-fine opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-20 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(138,43,226,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,245,255,0.25), transparent 50%)",
            }}
          />
          <div className="relative grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto] md:gap-14">
            <div>
              <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">
                / REACH US
              </div>
              <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
                Scan. Message. <span className="neon-text">Cop.</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/65">
                Questions? Custom requests? Just want to know what&apos;s dropping? Hit us on WhatsApp —
                we&apos;re active and respond fast.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink("Hey Stash Street! I want to cop something.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-3 font-mono text-sm font-semibold tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5 glow-cyan"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WHATSAPP US
                </a>
                <a
                  href="https://instagram.com/stash_street.gd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-mono text-sm tracking-[0.2em] text-white/80 hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4" aria-hidden />
                  @stash_street.gd
                </a>
              </div>
              <div className="mt-6 space-y-1 font-mono text-[11px] tracking-[0.2em] text-white/35">
                <div>+1 (473) 423-8124 · +1 (473) 457-8182</div>
                <div>linktr.ee/stash_street.gnd</div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[220px]">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-3xl blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(157,78,221,0.45), rgba(0,245,255,0.25) 60%, transparent)",
                  }}
                />
                <div className="relative rounded-3xl border border-white/10 bg-black/40 p-4">
                  <QrPattern />
                  <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-white/50">
                    <span>SS://WHATSAPP</span>
                    <span className="text-[color:var(--neon-cyan)]">GD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
