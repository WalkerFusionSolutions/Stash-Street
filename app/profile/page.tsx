export const runtime = "nodejs"
import type { Metadata } from "next"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Settings } from "lucide-react"

export const metadata: Metadata = { title: "My Profile" }

export default async function ProfilePage() {
  const session = await auth()

  let orderCount = 0
  try {
    orderCount = await prisma.order.count({ where: { userId: session!.user.id } })
  } catch { /* DB not configured */ }

  const user = session!.user

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">/ ACCOUNT</div>
          <h1 className="mt-2 text-3xl font-bold text-white">My Profile</h1>
        </div>

        {/* Profile card */}
        <div className="glass-strong rounded-2xl p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Profile"}
                width={72}
                height={72}
                className="rounded-full ring-2 ring-[color:var(--neon-cyan)]/40"
              />
            ) : (
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30">
                <Settings className="h-8 w-8" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{user.name ?? "—"}</h2>
              <p className="text-sm text-white/50">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-white/40">
                {user.role === "ADMIN" ? "⚡ ADMIN" : "CUSTOMER"}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard label="Total Orders" value={String(orderCount)} />
            <StatCard label="Member Since" value={formatDate(new Date())} />
            <StatCard label="Account Type" value={user.role === "ADMIN" ? "Admin" : "Customer"} />
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/orders"
            className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-[color:var(--neon-cyan)]/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--neon-cyan)]/40 bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]">
              <ShoppingBag className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <div className="font-semibold text-white">My Orders</div>
              <div className="text-xs text-white/45">{orderCount} order{orderCount !== 1 ? "s" : ""}</div>
            </div>
          </Link>
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-[color:var(--neon-purple)]/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--neon-purple)]/40 bg-[color:var(--neon-purple)]/10 text-[color:var(--neon-purple)]">
                <Settings className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <div className="font-semibold text-white">Admin Dashboard</div>
                <div className="text-xs text-white/45">Manage products & orders</div>
              </div>
            </Link>
          )}
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="font-mono text-[10px] tracking-[0.2em] text-white/35">{label.toUpperCase()}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  )
}
