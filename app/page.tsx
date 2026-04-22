import { SiteNavbar } from "@/components/site-navbar"
import { Hero } from "@/components/hero"
import { BrandsMarquee } from "@/components/brands-marquee"
import { ProductGrid } from "@/components/product-grid"
import { HowToBuy } from "@/components/how-to-buy"
import { Policies } from "@/components/policies"
import { Authenticity } from "@/components/authenticity"
import { QrCta } from "@/components/qr-cta"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      <SiteNavbar />
      <Hero />
      <BrandsMarquee />
      <ProductGrid />
      <HowToBuy />
      <Policies />
      <Authenticity />
      <QrCta />
      <SiteFooter />
      <WhatsAppButton />
    </main>
  )
}
