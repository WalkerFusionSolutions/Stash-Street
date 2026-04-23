"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"
import { Shield, CreditCard, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [paymentMode, setPaymentMode] = useState<"full" | "deposit">("full")
  const [loading, setLoading] = useState(false)

  const total = subtotal()
  const depositTotal = Math.round(total * 0.5 * 100) / 100
  const hasDepositItems = items.some((i) => i.requiresDeposit)
  const chargeAmount = paymentMode === "deposit" ? depositTotal : total

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, isDeposit: paymentMode === "deposit" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Checkout failed")
      // Redirect to Stripe hosted checkout
      window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.replace("/cart")
    return null
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">
            / CHECKOUT
          </div>
          <h1 className="mt-2 text-3xl font-bold text-white">Complete Your Order</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left — order details */}
          <div className="space-y-6">
            {/* Buyer info */}
            <div className="glass rounded-2xl p-6">
              <div className="font-mono text-[11px] tracking-[0.3em] text-white/40 mb-4">ACCOUNT</div>
              {session?.user && (
                <div className="flex items-center gap-3">
                  {session.user.image && (
                    <Image src={session.user.image} alt="" width={36} height={36} className="rounded-full" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-white">{session.user.name}</div>
                    <div className="text-xs text-white/45">{session.user.email}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Items review */}
            <div className="glass rounded-2xl p-6">
              <div className="font-mono text-[11px] tracking-[0.3em] text-white/40 mb-4">ITEMS</div>
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black">
                      <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{item.name}</div>
                        <div className="font-mono text-[10px] text-white/40">{item.brand}{item.size ? ` · ${item.size}` : ""}</div>
                      </div>
                      <div className="font-mono text-sm font-bold text-white">{formatPrice(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment mode */}
            {hasDepositItems && (
              <div className="glass rounded-2xl p-6">
                <div className="font-mono text-[11px] tracking-[0.3em] text-white/40 mb-4">PAYMENT OPTION</div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("full")}
                    className={[
                      "rounded-xl border p-4 text-left transition-colors",
                      paymentMode === "full"
                        ? "border-[color:var(--neon-cyan)] bg-[color:var(--neon-cyan)]/5"
                        : "border-white/10 hover:border-white/20",
                    ].join(" ")}
                  >
                    <div className="font-mono text-xs tracking-widest text-white">FULL PAYMENT</div>
                    <div className="mt-1 font-mono text-xl font-bold text-white">{formatPrice(total)}</div>
                    <div className="mt-1 text-xs text-white/45">Pay in full now</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode("deposit")}
                    className={[
                      "rounded-xl border p-4 text-left transition-colors",
                      paymentMode === "deposit"
                        ? "border-[color:var(--neon-purple)] bg-[color:var(--neon-purple)]/5"
                        : "border-white/10 hover:border-white/20",
                    ].join(" ")}
                  >
                    <div className="font-mono text-xs tracking-widest text-[color:var(--neon-purple)]">50% DEPOSIT</div>
                    <div className="mt-1 font-mono text-xl font-bold text-[color:var(--neon-purple)]">{formatPrice(depositTotal)}</div>
                    <div className="mt-1 text-xs text-white/45">Balance due on delivery</div>
                  </button>
                </div>
                <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-[color:var(--neon-cyan)]/60">
                  If your order is not ready by the promised date, you keep the 50% balance.
                </p>
              </div>
            )}
          </div>

          {/* Right — pay summary */}
          <div className="glass-strong rounded-2xl p-6 self-start sticky top-24">
            <div className="font-mono text-[11px] tracking-[0.3em] text-white/40 mb-5">PAYMENT SUMMARY</div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/65">
                <span>Items ({items.length})</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-white/65">
                <span>Shipping</span>
                <span className="font-mono text-[color:var(--neon-cyan)]">TBD</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between font-mono font-bold text-white text-lg">
                <span>DUE NOW</span>
                <span>{formatPrice(chargeAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-4 font-mono text-sm font-bold tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed glow-cyan"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-4 w-4" aria-hidden />
                  PAY {formatPrice(chargeAmount)}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-widest text-white/25">
              <Shield className="h-3 w-3" /> SECURED BY STRIPE
            </div>

            <p className="mt-4 text-center font-mono text-[10px] leading-relaxed text-white/30 tracking-[0.1em]">
              By completing your order you agree to our store policies, including our no-holds and 30-minute grace period rules.
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
