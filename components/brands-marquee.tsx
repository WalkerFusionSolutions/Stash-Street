import Image from "next/image"

const BRANDS = [
  { name: "Godspeed", logo: "/brands/Godspeed.png" },
  { name: "Bape", logo: "/brands/bape.png" },
  { name: "Billionaire Boys Club", logo: "/brands/billionaire-boys-club.png" },
  { name: "Fashion Nova", logo: "/brands/fashion-nova.jpg" },
  { name: "Hellstar", logo: "/brands/hellstar.png" },
  { name: "New Era", logo: "/brands/new-era.jpg" },
  { name: "Polo", logo: "/brands/polo.png" },
  { name: "Trapstar", logo: "/brands/trapstar.png" },
]

export function BrandsMarquee() {
  const items = [...BRANDS, ...BRANDS] // Exactly 2 sets for seamless loop with translateX(-50%)
  return (
    <section aria-label="Brands we stock" className="relative overflow-hidden border-y border-white/5 bg-black/20 py-12">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
      
      <div className="flex w-max animate-marquee items-center gap-16 whitespace-nowrap px-8">
        {items.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="relative flex items-center justify-center grayscale opacity-40 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:drop-shadow-[0_0_12px_rgba(0,245,255,0.5)]"
          >
            <div className="relative h-12 w-32">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


