export const runtime = "nodejs"

import type { Metadata } from "next"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = { title: "Admin — Orders" }

const STATUS_COLORS: Record<string, string> = {
  PENDING:      "text-white/45 border-white/15",
  PARTIAL_PAID: "text-[color:var(--neon-purple)] border-[color:var(--neon-purple)]/40",
  PAID:         "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40",
  SHIPPED:      "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40",
  DELIVERED:    "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40",
  CANCELLED:    "text-[color:var(--neon-pink)] border-[color:var(--neon-pink)]/40",
  FAILED:       "text-[color:var(--neon-pink)] border-[color:var(--neon-pink)]/40",
}

async function getOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { 
        user: { select: { name: true, email: true } }, 
        items: { include: { product: { select: { name: true } } } } 
      },
    })
  } catch (error) {
    console.error("Failed to fetch admin orders:", error)
    return []
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)]">/ ADMIN</div>
            <h1 className="text-2xl font-bold text-white">All Orders <span className="ml-2 font-mono text-base text-white/35">({orders.length})</span></h1>
          </div>
        </div>

        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Order", "Customer", "Items", "Total", "Deposit", "Status", "Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] text-white/35">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-white/55">#{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="text-white/75">{o.user.name ?? "—"}</div>
                    <div className="font-mono text-[10px] text-white/35">{o.user.email}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[160px] truncate text-white/55">
                    {o.items.map((i: any) => i.product.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-white">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[color:var(--neon-purple)]">
                    {o.isDeposit ? formatPrice(o.amountPaid) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] ${STATUS_COLORS[o.status] ?? "text-white/45 border-white/15"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white/35">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-white/30">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
