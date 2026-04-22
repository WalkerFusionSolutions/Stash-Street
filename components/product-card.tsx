import Link from "next/link"
import Image from "next/image"
import { MessageCircle, ShoppingCart } from "lucide-react"
import { whatsappLink, formatPrice } from "@/lib/utils"

export type ProductCardData = {
  id: string
  sku: string
  name: string
  brand: string
  price: number
  imageUrl: string
  size: string | null
  tag: string | null
  stock: number
  requiresDeposit: boolean
}

const TAG_STYLES: Record<string, string> = {
  HEAT: "border-[color:var(--neon-pink)]/60 text-[color:var(--neon-pink)]",
  GRAIL: "border-[color:var(--neon-purple)]/60 text-[color:var(--neon-purple)]",
  NEW: "border-[color:var(--neon-cyan)]/60 text-[color:var(--neon-cyan)]",
  LAST: "border-white/30 text-white/75",
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const soldOut = product.stock < 1
  const tagStyle = product.tag ? TAG_STYLES[product.tag] : null

  return (
    <article className="group glass relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:border-[color:var(--neon-cyan)]/40 hover:-translate-y-0.5 hover:glow-cyan">
      {/* Image */}
      <Link href={`/shop/${product.id}`} className="relative block aspect-square overflow-hidden bg-black" tabIndex={-1} aria-hidden>
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={`${product.brand} — ${product.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${soldOut ? "opacity-50 grayscale" : ""}`}
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white/65 backdrop-blur">
            {product.sku}
          </span>
          {product.tag && tagStyle && (
            <span className={`rounded-full border bg-black/50 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] backdrop-blur ${tagStyle}`}>
              {product.tag}
            </span>
          )}
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-white/20 bg-black/70 px-4 py-1.5 font-mono text-xs tracking-[0.2em] text-white/60 backdrop-blur">
              SOLD OUT
            </span>
          </div>
        )}
        {product.requiresDeposit && !soldOut && (
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full border border-[color:var(--neon-purple)]/60 bg-black/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-[color:var(--neon-purple)] backdrop-blur">
              50% DEPOSIT
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] tracking-[0.25em] text-white/45">{product.brand}</div>
            <Link href={`/shop/${product.id}`}>
              <h3 className="mt-1 text-base font-semibold text-white hover:text-[color:var(--neon-cyan)] transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          {product.size && (
            <div className="text-right shrink-0">
              <div className="font-mono text-[10px] tracking-[0.2em] text-white/45">SIZE</div>
              <div className="font-mono text-sm text-white">{product.size}</div>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="font-mono text-xl font-bold text-white text-glow-soft">
            {formatPrice(product.price)}
          </div>
          <div className="flex items-center gap-2">
            {!soldOut && (
              <Link
                href={`/shop/${product.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--neon-cyan)] px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] text-black transition-all hover:-translate-y-0.5 glow-cyan"
              >
                <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
                BUY
              </Link>
            )}
            <a
              href={whatsappLink(`Hi! I'm interested in ${product.brand} ${product.name} (${product.sku}).`)}
              target="_blank"
              rel="noreferrer"
              aria-label="Inquire on WhatsApp"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] text-white/65 transition-colors hover:border-[color:var(--neon-cyan)]/50 hover:text-[color:var(--neon-cyan)]"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              ASK
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
