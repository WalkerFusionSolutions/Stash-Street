"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { whatsappLink } from "@/lib/utils"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show after brief delay so it doesn't flash immediately
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      href={whatsappLink("Hey Stash Street! I want to inquire about a piece.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_0_0_1px_rgba(37,211,102,0.4),0_8px_32px_rgba(37,211,102,0.35)] transition-all duration-500",
        "hover:scale-110 hover:shadow-[0_0_0_1px_rgba(37,211,102,0.6),0_12px_40px_rgba(37,211,102,0.5)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <MessageCircle className="h-6 w-6 text-white" aria-hidden />
    </a>
  )
}
