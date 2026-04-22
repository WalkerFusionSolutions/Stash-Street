import type { Metadata } from "next"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Package, Users, ShoppingBag, TrendingUp, PlusCircle, ClipboardList } from "lucide-react"

export const metadata: Metadata = { title: "Admin Dashboard" }

async function getStats() {
  const [products, orders, users, customOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.customOrderRequest.count({ where: { status: "PENDING" } }),
  ])
  const revenue = await prisma.order.aggregate({
    _sum: { amountPaid: true },
    where: { status: { in: ["PAID", "PARTIAL_PAID", "SHIPPED", "DELIVERED"] } },
  })
  return {
    products,
    orders,
    users,
    pendingCustomOrders: customOrders,
    revenue: revenue._sum.amountPaid ?? 0,
  }
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, items: { include: { product: { select: { name: true } } } } },
  })
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:      "text-white/50",
  PARTIAL_PAID: "text-[color:var(--neon-purple)]",
  PAID:         "text-[color:var(--neon-cyan)]",
  SHIPPED:      "text-[color:var(--neon-cyan)]",
  DELIVERED:    "text-[color:var(--neon-cyan)]",
  CANCELLED:    "text-[color:var(--neon-pink)]",
  FAILED:       "text-[color:var(--neon-pink)]",
}

export default async function AdminPage() {
  await auth() // middleware already guards, but double-check server-side

  let stats = { products: 0, orders: 0, users: 0, pendingCustomOrders: 0, revenue: 0 }
  let recentOrders: Awaited<ReturnType<typeof getRecentOrders>> = []

  try {
    stats = await getStats()
    recentOrders = await getRecentOrders()
  } catch { /* DB not configured */ }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">/ ADMIN</div>
            <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-4 py-2.5 font-mono text-xs tracking-widest text-black transition-all hover:-translate-y-0.5 glow-cyan"
          >
            <PlusCircle className="h-4 w-4" aria-hidden />
            ADD PRODUCT
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          <StatCard icon={TrendingUp} label="Revenue" value={formatPrice(stats.revenue)} color="cyan" />
          <StatCard icon={Package} label="Products" value={String(stats.products)} color="purple" />
          <StatCard icon={ShoppingBag} label="Orders" value={String(stats.orders)} color="cyan" />
          <StatCard icon={Users} label="Customers" value={String(stats.users)} color="purple" />
          <StatCard icon={ClipboardList} label="Custom Requests" value={String(stats.pendingCustomOrders)} color="pink" />
        </div>

        {/* Quick nav */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminNavCard href="/admin/products" label="Products" desc="Add, edit, remove listings" color="cyan" />
          <AdminNavCard href="/admin/orders" label="Orders" desc="View & update order status" color="purple" />
          <AdminNavCard href="/admin/custom-orders" label="Custom Orders" desc="Review sourcing requests" color="pink" />
        </div>

        {/* Recent orders */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-sm tracking-[0.2em] text-white/60">RECENT ORDERS</h2>
            <Link href="/admin/orders" className="font-mono text-xs tracking-widest text-[color:var(--neon-cyan)] hover:text-glow-cyan">
              VIEW ALL →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="glass rounded-2xl py-10 text-center text-white/35 text-sm">No orders yet.</div>
          ) : (
            <div className="glass overflow-hidden rounded-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] text-white/35">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-white/55">#{o.id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3 text-white/75">{o.user.name ?? o.user.email}</td>
                      <td className="px-4 py-3 text-white/55 max-w-[160px] truncate">{o.items.map((i) => i.product.name).join(", ")}</td>
                      <td className="px-4 py-3 font-mono font-bold text-white">{formatPrice(o.total)}</td>
                      <td className={`px-4 py-3 font-mono text-xs ${STATUS_COLORS[o.status] ?? "text-white/50"}`}>{o.status}</td>
                      <td className="px-4 py-3 text-white/40 text-xs">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: "cyan" | "purple" | "pink" }) {
  const c = {
    cyan:   "border-[color:var(--neon-cyan)]/30 text-[color:var(--neon-cyan)] bg-[color:var(--neon-cyan)]/5",
    purple: "border-[color:var(--neon-purple)]/30 text-[color:var(--neon-purple)] bg-[color:var(--neon-purple)]/5",
    pink:   "border-[color:var(--neon-pink)]/30 text-[color:var(--neon-pink)] bg-[color:var(--neon-pink)]/5",
  }[color]
  return (
    <div className="glass rounded-2xl p-5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${c}`}>
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="mt-3 font-mono text-2xl font-bold text-white">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-white/35">{label.toUpperCase()}</div>
    </div>
  )
}

function AdminNavCard({ href, label, desc, color }: { href: string; label: string; desc: string; color: "cyan" | "purple" | "pink" }) {
  const c = {
    cyan:   "hover:border-[color:var(--neon-cyan)]/40 text-[color:var(--neon-cyan)]",
    purple: "hover:border-[color:var(--neon-purple)]/40 text-[color:var(--neon-purple)]",
    pink:   "hover:border-[color:var(--neon-pink)]/40 text-[color:var(--neon-pink)]",
  }[color]
  return (
    <Link href={href} className={`glass rounded-2xl p-5 transition-colors ${c}`}>
      <div className="font-mono text-sm font-bold tracking-[0.15em]">{label.toUpperCase()}</div>
      <div className="mt-1 text-sm text-white/50">{desc}</div>
    </Link>
  )
}
