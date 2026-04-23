import type { Metadata } from "next"
export const runtime = "nodejs"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ProductCard } from "@/components/product-card"
import { prisma } from "@/lib/prisma"
import { MessageCircle } from "lucide-react"
import { whatsappLink } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Shop All Drops",
  description: "Browse Stash Street Apparel's latest drops — authenticated designer clothing and accessories at affordable prices.",
}

const TAG_OPTIONS = ["ALL", "HEAT", "GRAIL", "NEW", "LAST"]

async function getProducts(tag?: string) {
  try {
    return await prisma.product.findMany({
      where: {
        active: true,
        ...(tag && tag !== "ALL" ? { tag } : {}),
      },
      orderBy: [{ stock: "desc" }, { createdAt: "desc" }],
    })
  } catch {
    return []
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const products = await getProducts(tag)
  const activeTag = tag ?? "ALL"

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)] text-glow-cyan">
            / ALL DROPS
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
            The Rack
          </h1>
          <p className="mt-3 text-white/55">
            {products.length} piece{products.length !== 1 ? "s" : ""} available · First come, first served · No holds
          </p>
        </div>

        {/* Tag filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {TAG_OPTIONS.map((t) => (
            <a
              key={t}
              href={t === "ALL" ? "/shop" : `/shop?tag=${t}`}
              className={[
                "rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.2em] transition-colors",
                activeTag === t
                  ? "border-[color:var(--neon-cyan)] bg-[color:var(--neon-cyan)]/10 text-[color:var(--neon-cyan)]"
                  : "border-white/10 text-white/55 hover:border-white/25 hover:text-white",
              ].join(" ")}
            >
              {t}
            </a>
          ))}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl py-20 text-center">
            <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)]">/ INCOMING</div>
            <p className="mt-4 text-white/55">No pieces in this category right now. New inventory drops regularly.</p>
            <a
              href={whatsappLink("Hey! What's coming in next?")}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-cyan)]/60 px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-[color:var(--neon-cyan)] hover:bg-[color:var(--neon-cyan)] hover:text-black transition-colors"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              ASK WHAT'S NEXT
            </a>
          </div>
        )}
      </div>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  )
}
