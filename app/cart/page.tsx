"use client"

import Link from "next/link"
import Image from "next/image"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"
import { Trash2, ShoppingBag, ArrowRight, Shield } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, subtotal, clearCart } = useCart()
  const total = subtotal()
  const hasDeposit = items.some((i) => i.requiresDeposit)

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">
            / YOUR CART
          </div>
          <h1 className="mt-2 text-3xl font-bold text-white">
            {items.length === 0 ? "Cart is Empty" : `${items.length} Item${items.length > 1 ? "s" : ""}`}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-2xl py-20 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-white/20" aria-hidden />
            <p className="mt-4 text-white/50">Nothing here yet.</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-3 font-mono text-sm tracking-[0.2em] text-black hover:-translate-y-0.5 transition-transform glow-cyan"
            >
              BROWSE THE DROP
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="glass flex items-center gap-4 rounded-2xl p-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.25em] text-white/40">{item.brand}</div>
                      <div className="mt-0.5 font-semibold text-white">{item.name}</div>
                      {item.size && (
                        <div className="mt-0.5 font-mono text-xs text-white/50">SIZE: {item.size}</div>
                      )}
                      {item.requiresDeposit && (
                        <div className="mt-1 font-mono text-[10px] tracking-[0.15em] text-[color:var(--neon-purple)]">
                          50% DEPOSIT · {formatPrice(item.price * 0.5)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-mono text-lg font-bold text-white">{formatPrice(item.price)}</div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-white/30 transition-colors hover:text-[color:var(--neon-pink)]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={clearCart}
                className="font-mono text-xs tracking-[0.2em] text-white/30 hover:text-[color:var(--neon-pink)] transition-colors"
              >
                CLEAR CART
              </button>
            </div>

            {/* Summary */}
            <div className="glass-strong rounded-2xl p-6 self-start sticky top-24">
              <div className="font-mono text-[11px] tracking-[0.3em] text-white/40">ORDER SUMMARY</div>

              <div className="mt-5 space-y-3 text-sm">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 text-white/65">
                    <span className="truncate">{item.name}</span>
                    <span className="shrink-0 font-mono">{formatPrice(item.price)}</span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-3 flex items-center justify-between font-mono font-bold text-white">
                  <span>SUBTOTAL</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {hasDeposit && (
                  <div className="rounded-lg border border-[color:var(--neon-purple)]/30 bg-[color:var(--neon-purple)]/5 px-3 py-2 text-xs text-[color:var(--neon-purple)]">
                    Some items require a 50% deposit at checkout.
                  </div>
                )}
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-3.5 font-mono text-sm tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 glow-cyan"
              >
                CHECKOUT <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-white/30">
                <Shield className="h-3 w-3" aria-hidden />
                SECURED BY STRIPE
              </div>

              <p className="mt-3 text-center font-mono text-[10px] tracking-[0.12em] text-[color:var(--neon-pink)]/60">
                30 min response window after checkout
              </p>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
