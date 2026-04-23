import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import { whatsappLink } from "@/lib/utils"

// Server component — fetches live products directly
async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true, stock: { gt: 0 } },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
  } catch {
    // DB not configured yet — return empty
    return []
  }
}

export async function ProductGrid() {
  const products = await getFeaturedProducts()

  return (
    <section id="drops" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">
            / LATEST DROPS
          </div>
          <h2 className="mt-2 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
            On the rack <span className="neon-text">right now.</span>
          </h2>
          <p className="mt-3 max-w-xl text-white/55">
            First-come, first-served. Every piece authenticated before it hits the floor.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-mono text-xs tracking-[0.2em] text-white/75 hover:text-white transition-colors"
        >
          VIEW ALL DROPS →
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        /* Fallback when DB not yet configured */
        <div className="glass rounded-2xl p-12 text-center">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)]">/ NEW DROP INCOMING</div>
          <p className="mt-4 text-white/60">
            New inventory drops regularly. Follow us on Instagram or WhatsApp to be first in line.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappLink("Hey! I want to know about upcoming drops.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-cyan)]/60 px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-[color:var(--neon-cyan)] transition-colors hover:bg-[color:var(--neon-cyan)] hover:text-black"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              GET NOTIFIED
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
