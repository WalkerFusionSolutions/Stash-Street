"use client"

import { notFound } from "next/navigation"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { formatPrice, whatsappLink } from "@/lib/utils"
import { useCart } from "@/lib/cart-store"
import { toast } from "sonner"
import { ShoppingCart, MessageCircle, Shield, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use, useEffect, useState } from "react"

type Product = {
  id: string
  sku: string
  name: string
  brand: string
  description: string
  price: number
  imageUrl: string
  size: string | null
  tag: string | null
  stock: number
  requiresDeposit: boolean
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCart((s) => s.addItem)
  const cartItems = useCart((s) => s.items)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-dvh bg-background text-foreground">
        <SiteNavbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="font-mono text-sm tracking-widest text-white/40">LOADING...</div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  if (!product) return notFound()

  const inCart = cartItems.some((i) => i.id === product.id)
  const soldOut = product.stock < 1

  function handleAddToCart() {
    if (!product) return
    addItem({
      id: product.id,
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
      size: product.size,
      requiresDeposit: product.requiresDeposit,
    })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-8">
        <Link href="/shop" className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs tracking-widest text-white/45 hover:text-white transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> BACK TO SHOP
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-black">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={`${product.brand} ${product.name}`}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute left-3 top-3 flex gap-2">
              <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white/65 backdrop-blur">
                {product.sku}
              </span>
              {product.tag && (
                <span className="rounded-full border border-[color:var(--neon-cyan)]/60 bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-[color:var(--neon-cyan)] backdrop-blur">
                  {product.tag}
                </span>
              )}
            </div>
            {product.requiresDeposit && (
              <div className="absolute bottom-3 left-3">
                <span className="rounded-full border border-[color:var(--neon-purple)]/60 bg-black/70 px-2.5 py-1 font-mono text-[10px] tracking-widest text-[color:var(--neon-purple)] backdrop-blur">
                  50% DEPOSIT REQUIRED
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="font-mono text-xs tracking-[0.3em] text-white/45">{product.brand}</div>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{product.name}</h1>
              {product.size && (
                <div className="mt-2 font-mono text-sm text-white/55">
                  SIZE: <span className="text-white">{product.size}</span>
                </div>
              )}
            </div>

            <div className="font-mono text-3xl font-bold text-white text-glow-soft">
              {formatPrice(product.price)}
              {product.requiresDeposit && (
                <span className="ml-3 font-mono text-sm text-[color:var(--neon-purple)] text-glow-purple">
                  ({formatPrice(product.price * 0.5)} deposit)
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-white/65">{product.description}</p>

            {/* Auth guarantee */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-[color:var(--neon-purple)] text-glow-purple">
                <Shield className="h-4 w-4" aria-hidden />
                GUARANTEED AUTHENTIC
              </div>
              <p className="mt-1 text-xs text-white/50">
                Every piece passes a multi-point authentication check. Certificate included.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {soldOut ? (
                <div className="rounded-full border border-white/10 px-6 py-3 text-center font-mono text-sm tracking-widest text-white/35">
                  SOLD OUT
                </div>
              ) : inCart ? (
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-3.5 font-mono text-sm tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 glow-cyan"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden />
                  VIEW CART
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-3.5 font-mono text-sm tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 glow-cyan"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden />
                  ADD TO CART
                </button>
              )}
              <a
                href={whatsappLink(`Hi! I'm interested in ${product.brand} ${product.name} (${product.sku}). Is it available?`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 font-mono text-sm tracking-[0.2em] text-white/75 transition-colors hover:border-white/30 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                INQUIRE ON WHATSAPP
              </a>
            </div>

            {/* Policy note */}
            <p className="font-mono text-[11px] tracking-[0.15em] text-[color:var(--neon-pink)]/70">
              ⚠ First Come, First Served · ABSOLUTELY NO HOLDS · 30 min response window
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  )
}
