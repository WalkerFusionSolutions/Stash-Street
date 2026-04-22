"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { cn } from "@/lib/utils"
import Image from "next/image"

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Custom Order", href: "/custom-order" },
  { label: "How to Buy", href: "/#how-to-buy" },
  { label: "Policies", href: "/#policies" },
]

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const totalItems = useCart((s) => s.totalItems())

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-white/8 bg-background/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Stash Street home">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)] animate-pulse-dot"
          />
          <span className="font-mono text-base font-bold tracking-[0.18em] text-white md:text-lg">
            STASH<span className="neon-text-animated">//</span>STREET
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                pathname === item.href
                  ? "text-[color:var(--neon-cyan)] text-glow-cyan"
                  : "text-white/70 hover:text-[color:var(--neon-cyan)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Cart — ${totalItems} items`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-[color:var(--neon-cyan)]/50 hover:text-[color:var(--neon-cyan)]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--neon-cyan)] font-mono text-[9px] font-bold text-black">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {session ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-[color:var(--neon-cyan)]/40 hover:text-white"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4" aria-hidden />
                )}
                <span className="max-w-[100px] truncate font-mono text-xs tracking-wider">
                  {session.user?.name?.split(" ")[0] ?? "Account"}
                </span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", userMenuOpen && "rotate-180")} aria-hidden />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0f0f12] shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <User className="h-4 w-4" aria-hidden /> Profile
                  </Link>
                  <Link
                    href="/orders"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <ShoppingBag className="h-4 w-4" aria-hidden /> My Orders
                  </Link>
                  {session.user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[color:var(--neon-cyan)] transition-colors hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden /> Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-white/5" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-[color:var(--neon-pink)]"
                  >
                    <LogOut className="h-4 w-4" aria-hidden /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/shop" })}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon-cyan)]/60 bg-transparent px-4 py-2 font-mono text-xs tracking-widest text-[color:var(--neon-cyan)] transition-all hover:bg-[color:var(--neon-cyan)] hover:text-black glow-cyan"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile — cart + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            aria-label={`Cart — ${totalItems} items`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--neon-cyan)] font-mono text-[9px] font-bold text-black">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md border border-white/10 p-2 text-white"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-white/5 text-[color:var(--neon-cyan)]"
                    : "text-white/80 hover:bg-white/5 hover:text-[color:var(--neon-cyan)]"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-white/5" />
            {session ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/80 hover:bg-white/5">
                  <ShoppingBag className="h-4 w-4" /> My Orders
                </Link>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-[color:var(--neon-cyan)] hover:bg-white/5">
                    <LayoutDashboard className="h-4 w-4" /> Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-[color:var(--neon-pink)]"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => signIn("google")}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--neon-cyan)]/60 px-4 py-2 font-mono text-xs tracking-widest text-[color:var(--neon-cyan)]"
              >
                Sign In with Google
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
