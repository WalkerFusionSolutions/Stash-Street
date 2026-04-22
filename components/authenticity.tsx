import { ShieldCheck, Fingerprint, Camera, Package } from "lucide-react"

const POINTS = [
  {
    icon: Fingerprint,
    title: "Multi-point check",
    body: "Stitching, weight, tags, receipts, and cross-referencing against brand databases. Every piece before it enters our inventory.",
  },
  {
    icon: Camera,
    title: "Photo-documented",
    body: "Every item photographed from multiple angles before shipping. Copies kept on file for every transaction.",
  },
  {
    icon: Package,
    title: "Sealed & Certified",
    body: "Shipped with a tamper-evident Stash Street authenticity seal. If a third party ever flags an item, we refund in full.",
  },
]

export function Authenticity() {
  return (
    <section id="authenticity" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-purple)]/50 bg-[color:var(--neon-purple)]/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.25em] text-[color:var(--neon-purple)] text-glow-purple">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            GUARANTEED AUTHENTIC
          </div>
          <h2 className="mt-5 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
            If it isn&apos;t real,{" "}
            <span className="text-[color:var(--neon-purple)] text-glow-purple">we don&apos;t stock it.</span>
          </h2>
          <p className="mt-4 max-w-lg text-white/60">
            Every garment, sneaker, and accessory in our catalogue passes a strict authentication process
            before it earns a listing. We stake our reputation on every piece — guaranteed.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {POINTS.map((p) => (
              <div key={p.title} className="glass rounded-xl p-4">
                <p.icon className="h-5 w-5 text-[color:var(--neon-purple)] text-glow-purple" aria-hidden />
                <div className="mt-3 font-mono text-[11px] tracking-[0.2em] text-[color:var(--neon-purple)]">
                  {p.title.toUpperCase()}
                </div>
                <p className="mt-1 text-sm text-white/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth certificate mockup */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-3xl blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(157,78,221,0.35), transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,245,255,0.2), transparent 60%)",
            }}
          />
          <div className="glass-strong relative overflow-hidden rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-white/45">CERTIFICATE</div>
                <div className="mt-1 font-mono text-sm text-white">SS-AUTH / 001</div>
              </div>
              <div className="h-10 w-10 rounded-full border border-[color:var(--neon-purple)]/60 bg-[color:var(--neon-purple)]/15 p-2 text-[color:var(--neon-purple)]">
                <ShieldCheck className="h-full w-full" aria-hidden />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 font-mono text-[11px]">
              {[
                ["BRAND", "STASH STREET"],
                ["ORIGIN", "GRENADA, GD"],
                ["CONDITION", "VERIFIED"],
                ["STITCH CHECK", "PASS ✓"],
                ["TAG CHECK", "PASS ✓"],
                ["WEIGHT CHECK", "PASS ✓"],
                ["PHOTO DOC", "ON FILE"],
                ["RECEIPT", "ON FILE"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/8 bg-black/30 px-3 py-2">
                  <div className="text-[9px] tracking-[0.2em] text-white/35">{label}</div>
                  <div className="mt-1 tracking-[0.1em] text-white">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
              <div className="font-mono text-[10px] tracking-[0.25em] text-white/40">
                ISSUED · STASH STREET APPAREL
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-[color:var(--neon-cyan)] text-glow-cyan">
                VERIFIED ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
