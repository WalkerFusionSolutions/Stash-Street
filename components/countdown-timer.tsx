"use client"

import { useEffect, useState } from "react"

function getTarget() {
  // Target: next Friday at 20:00 local time
  const now = new Date()
  const target = new Date(now)
  const day = now.getDay() // 0 Sun .. 6 Sat
  const daysUntilFriday = (5 - day + 7) % 7 || 7
  target.setDate(now.getDate() + daysUntilFriday)
  target.setHours(20, 0, 0, 0)
  return target
}

function format(n: number) {
  return n.toString().padStart(2, "0")
}

export function CountdownTimer() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const target = getTarget()
  const diff = now ? Math.max(0, target.getTime() - now.getTime()) : 0

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  const cells: Array<{ label: string; value: string }> = [
    { label: "DAYS", value: format(days) },
    { label: "HRS", value: format(hours) },
    { label: "MIN", value: format(minutes) },
    { label: "SEC", value: format(seconds) },
  ]

  return (
    <div
      className="glass relative overflow-hidden rounded-2xl px-5 py-5 md:px-8 md:py-6"
      aria-live="polite"
      aria-label="Next drop countdown"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-px top-0 h-full w-[2px]"
        style={{
          background: "linear-gradient(180deg, transparent, var(--neon-pink), transparent)",
          boxShadow: "0 0 12px var(--neon-pink)",
        }}
      />
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="text-left">
          <div className="font-mono text-[10px] tracking-[0.3em] text-[color:var(--neon-pink)] text-glow-pink">
            NEXT DROP IN
          </div>
          <div className="mt-1 text-sm text-white/70">DROP 008 · Friday · 20:00</div>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cells.map((c) => (
            <div
              key={c.label}
              className="min-w-[64px] rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-center"
            >
              <div className="font-mono text-2xl font-bold tabular-nums text-white text-glow-pink md:text-3xl">
                {now ? c.value : "--"}
              </div>
              <div className="font-mono text-[9px] tracking-[0.2em] text-white/50">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
