import type { Metadata } from "next"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

export const metadata: Metadata = { title: "Admin — Custom Orders" }

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "text-white/50 border-white/15",
  REVIEWING:  "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40",
  SOURCING:   "text-[color:var(--neon-purple)] border-[color:var(--neon-purple)]/40",
  READY:      "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40",
  COMPLETED:  "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40",
  CANCELLED:  "text-[color:var(--neon-pink)] border-[color:var(--neon-pink)]/40",
}

export default async function AdminCustomOrdersPage() {
  let orders: Awaited<ReturnType<typeof getOrders>> = []
  try { orders = await getOrders() } catch { /* DB not configured */ }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-purple)] text-glow-purple">/ ADMIN</div>
            <h1 className="text-2xl font-bold text-white">Custom Orders <span className="ml-2 font-mono text-base text-white/35">({orders.length})</span></h1>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((o: any) => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.2em] ${STATUS_COLORS[o.status] ?? "text-white/45 border-white/15"}`}>
                      {o.status}
                    </span>
                    <span className="font-mono text-xs text-white/35">#{o.id.slice(-8).toUpperCase()}</span>
                    <span className="font-mono text-xs text-white/35">{formatDate(o.createdAt)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">{o.name}</span>
                    <span className="ml-2 text-sm text-white/45">{o.email}</span>
                    {o.phone && <span className="ml-2 text-sm text-white/40">{o.phone}</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-white/60">
                    {o.brand && <span><span className="text-white/35">Brand:</span> {o.brand}</span>}
                    <span><span className="text-white/35">Size:</span> {o.size}</span>
                    {o.colorway && <span><span className="text-white/35">Colorway:</span> {o.colorway}</span>}
                    {o.budget && <span><span className="text-white/35">Budget:</span> {o.budget}</span>}
                  </div>
                  {o.notes && <p className="text-sm text-white/50 italic">&ldquo;{o.notes}&rdquo;</p>}
                </div>
                <div className="shrink-0">
                  <a
                    href={o.itemLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--neon-cyan)]/40 px-3 py-1.5 font-mono text-[11px] tracking-widest text-[color:var(--neon-cyan)] hover:bg-[color:var(--neon-cyan)] hover:text-black transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> VIEW ITEM
                  </a>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="glass rounded-2xl py-16 text-center text-white/30">No custom order requests yet.</div>
          )}
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}

async function getOrders() {
  return prisma.customOrderRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })
}
