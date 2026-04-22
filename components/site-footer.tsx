import Link from "next/link"
import { MessageCircle, Instagram } from "lucide-react"
import { whatsappLink } from "@/lib/utils"

const LINKS = {
  shop: [
    { label: "All Drops", href: "/shop" },
    { label: "Custom Order", href: "/custom-order" },
    { label: "How to Buy", href: "/#how-to-buy" },
    { label: "Authenticity", href: "/#authenticity" },
    { label: "Policies", href: "/#policies" },
  ],
  account: [
    { label: "Sign In", href: "/login" },
    { label: "My Orders", href: "/orders" },
    { label: "Profile", href: "/profile" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-black/60">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--neon-cyan)]/50 to-transparent"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]"
            />
            <span className="font-mono text-lg font-bold tracking-[0.18em] text-white">
              STASH<span className="neon-text">//</span>STREET
            </span>
          </div>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            Supplying authentic clothing and accessories at affordable prices with peak quality.
            Guaranteed authenticity. Based in Grenada, serving worldwide.
          </p>

          <p className="mt-3 font-mono text-xs tracking-[0.2em] text-white/35 italic">
            "We stay on top so you can be on top."
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={whatsappLink("Hey Stash Street, I want to inquire about a product.")}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--neon-cyan)]/50 text-[color:var(--neon-cyan)] transition-all hover:bg-[color:var(--neon-cyan)] hover:text-black"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="https://instagram.com/stash_street.gd"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram @stash_street.gd"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-[color:var(--neon-pink)]/60 hover:text-[color:var(--neon-pink)]"
            >
              <Instagram className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.25em] text-white/40">SHOP</div>
          <ul className="mt-4 space-y-2 text-sm">
            {LINKS.shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/65 transition-colors hover:text-[color:var(--neon-cyan)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.25em] text-white/40">CONTACT</div>
          <ul className="mt-4 space-y-2 text-sm text-white/65">
            <li>Grenada, West Indies</li>
            <li>
              <a
                href="https://wa.me/14734238124"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--neon-cyan)] hover:text-glow-cyan transition-colors"
              >
                +1 (473) 423-8124
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/14734578182"
                target="_blank"
                rel="noreferrer"
                className="text-white/65 hover:text-[color:var(--neon-cyan)] transition-colors"
              >
                +1 (473) 457-8182
              </a>
            </li>
            <li>
              <a
                href="https://linktr.ee/stash_street.gnd"
                target="_blank"
                rel="noreferrer"
                className="text-white/65 hover:text-[color:var(--neon-cyan)] transition-colors"
              >
                linktr.ee/stash_street.gnd
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/stash_street.gd"
                target="_blank"
                rel="noreferrer"
                className="text-white/65 hover:text-[color:var(--neon-cyan)] transition-colors"
              >
                @stash_street.gd
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 font-mono text-[10px] tracking-[0.25em] text-white/35 md:flex-row md:items-center md:px-8">
          <span>© {new Date().getFullYear()} STASH STREET APPAREL · ALL RIGHTS RESERVED</span>
          <span>GRENADA, WEST INDIES · GUARANTEED AUTHENTIC</span>
        </div>
      </div>
    </footer>
  )
}
