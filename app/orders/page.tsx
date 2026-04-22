import type { Metadata } from "next"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, Clock, CheckCircle2, Truck, XCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "My Orders" }

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PENDING:      { label: "Pending",      icon: Clock,         color: "text-white/50 border-white/20" },
  PARTIAL_PAID: { label: "Deposit Paid", icon: Clock,         color: "text-[color:var(--neon-purple)] border-[color:var(--neon-purple)]/40" },
  PAID:         { label: "Paid",         icon: CheckCircle2,  color: "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40" },
  SHIPPED:      { label: "Shipped",      icon: Truck,         color: "text-[color:var(--neon-cyan)] border-[color:var(--neon-cyan)]/40" },
  DELIVERED:    { label: "Delivered",    icon: CheckCircle2,  color: "text-[color:var(--neon-purple)] border-[color:var(--neon-purple)]/40" },
  CANCELLED:    { label: "Cancelled",    icon: XCircle,       color: "text-[color:var(--neon-pink)] border-[color:var(--neon-pink)]/40" },
  FAILED:       { label: "Failed",       icon: XCircle,       color: "text-[color:var(--neon-pink)] border-[color:var(--neon-pink)]/40" },
}

export default async function OrdersPage() {
  const session = await auth()

  let orders: Awaited<ReturnType<typeof getOrders>> = []
  try {
    orders = await getOrders(session!.user.id)
  } catch { /* DB not configured */ }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-4xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">/ MY ORDERS</div>
          <h1 className="mt-2 text-3xl font-bold text-white">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-white/20" />
            <p className="mt-4 text-white/50">No orders yet.</p>
            <Link href="/shop" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-2.5 font-mono text-sm tracking-widest text-black hover:-translate-y-0.5 transition-transform glow-cyan">
              SHOP NOW
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING
              const Icon = cfg.icon
              return (
                <div key={order.id} className="glass rounded-2xl p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.2em] ${cfg.color}`}>
                          <Icon className="h-3 w-3" aria-hidden />
                          {cfg.label}
                        </div>
                        {order.isDeposit && (
                          <span className="rounded-full border border-[color:var(--neon-purple)]/40 px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-[color:var(--neon-purple)]">
                            DEPOSIT
                          </span>
                        )}
                      </div>
                      <div className="mt-2 font-mono text-xs text-white/35">
                        #{order.id.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
                      </div>
                      <div className="mt-2 text-sm text-white/60">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
                        {order.items.map((i) => i.product.name).join(", ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold text-white">{formatPrice(order.total)}</div>
                      {order.isDeposit && (
                        <div className="font-mono text-xs text-[color:var(--neon-purple)]">
                          Paid: {formatPrice(order.amountPaid)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}

async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })
}
