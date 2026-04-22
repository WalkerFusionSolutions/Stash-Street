"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Shield } from "lucide-react"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/shop"

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(700px 500px at 50% 30%, rgba(157,78,221,0.15), transparent 60%), radial-gradient(500px 400px at 50% 80%, rgba(0,245,255,0.1), transparent 60%)",
        }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-grid opacity-30" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center justify-center gap-2.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]" />
          <span className="font-mono text-lg font-bold tracking-[0.18em] text-white">
            STASH<span className="neon-text">//</span>STREET
          </span>
        </Link>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          <h1 className="text-center text-2xl font-bold text-white">Sign In</h1>
          <p className="mt-2 text-center text-sm text-white/50">
            Continue with your Google account to shop and track orders.
          </p>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/25"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/25">
            <Shield className="h-3 w-3" aria-hidden />
            Secure authentication via Google
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          By signing in you agree to our{" "}
          <Link href="/#policies" className="text-white/50 underline hover:text-white">
            store policies
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
