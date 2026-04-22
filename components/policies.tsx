import { Ban, Hourglass, Lock, AlertTriangle, Clock, RefreshCw } from "lucide-react"

const POLICIES = [
  {
    icon: AlertTriangle,
    title: "NO-SHOW POLICY",
    body: "No-shows or failure to communicate lateness will result in Automatic Cancellation & Permanent Blacklist.",
    color: "pink",
  },
  {
    icon: Ban,
    title: "FIRST COME, FIRST SERVED",
    body: "ABSOLUTELY NO HOLDS. The first confirmed payment secures the piece — full stop.",
    color: "pink",
  },
  {
    icon: RefreshCw,
    title: "REFUND / EXCHANGE",
    body: "7-Day Refund/Exchange for Manufacturing Defects ONLY. All other sales are final.",
    color: "purple",
  },
  {
    icon: Lock,
    title: "CUSTOM ORDER GUARANTEE",
    body: "If your custom order is not ready by the promised collection date, you keep the 50% balance.",
    color: "cyan",
  },
  {
    icon: Clock,
    title: "GRACE PERIOD",
    body: "Grace Period: 30 mins silence = Order Cancellation. Respond promptly once an invoice is sent.",
    color: "pink",
  },
  {
    icon: Hourglass,
    title: "DEPOSIT SYSTEM",
    body: "Certain items require a 50% deposit to begin sourcing. Balance due upon arrival. No exceptions.",
    color: "purple",
  },
]

const colorMap = {
  pink: {
    bar: "var(--neon-pink)",
    icon: "border-[color:var(--neon-pink)]/50 bg-[color:var(--neon-pink)]/10 text-[color:var(--neon-pink)]",
    title: "text-[color:var(--neon-pink)] text-glow-pink",
    hover: "hover:border-[color:var(--neon-pink)]/40",
  },
  purple: {
    bar: "var(--neon-purple)",
    icon: "border-[color:var(--neon-purple)]/50 bg-[color:var(--neon-purple)]/10 text-[color:var(--neon-purple)]",
    title: "text-[color:var(--neon-purple)] text-glow-purple",
    hover: "hover:border-[color:var(--neon-purple)]/40",
  },
  cyan: {
    bar: "var(--neon-cyan)",
    icon: "border-[color:var(--neon-cyan)]/50 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]",
    title: "text-[color:var(--neon-cyan)] text-glow-cyan",
    hover: "hover:border-[color:var(--neon-cyan)]/40",
  },
}

export function Policies() {
  return (
    <section id="policies" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,0,110,0.6), transparent)",
          boxShadow: "0 0 12px var(--neon-pink)",
        }}
      />

      <div className="mb-12 max-w-2xl">
        <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-pink)] text-glow-pink">
          / STORE POLICIES
        </div>
        <h2 className="mt-2 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
          Know the <span className="text-[color:var(--neon-pink)] text-glow-pink">rules.</span>
        </h2>
        <p className="mt-3 text-white/60">
          Reading this counts as consent. These policies protect our community and ensure every
          transaction runs smoothly. No exceptions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {POLICIES.map((p) => {
          const c = colorMap[p.color as keyof typeof colorMap]
          return (
            <article
              key={p.title}
              className={`glass relative overflow-hidden rounded-2xl p-6 transition-colors ${c.hover}`}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px]"
                style={{
                  background: c.bar,
                  boxShadow: `0 0 14px ${c.bar}`,
                }}
              />
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${c.icon}`}>
                  <p.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className={`font-mono text-[11px] font-bold tracking-[0.22em] ${c.title}`}>
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
