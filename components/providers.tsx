"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0f0f12",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
          },
        }}
      />
    </SessionProvider>
  )
}
