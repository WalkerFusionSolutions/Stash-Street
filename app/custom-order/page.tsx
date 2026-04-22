"use client"

import { useState } from "react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, CheckCircle2, ExternalLink, Shield } from "lucide-react"

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  itemLink: z.string().url("Paste the item link (e.g. from Nike, Farfetch, SSENSE, etc.)"),
  brand: z.string().optional(),
  size: z.string().min(1, "Size required"),
  colorway: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CustomOrderPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/custom-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? "Submission failed. Please try again.")
    }
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8">
          <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-purple)] text-glow-purple">
            / PERSONAL SHOPPING
          </div>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">Custom Order</h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Can&apos;t find what you want in the drop? We&apos;ll source it for you. Send us the link,
            your size, and budget — we handle the rest. A 50% deposit is required to begin sourcing.
          </p>
        </div>

        {/* Guarantee notice */}
        <div className="mb-8 glass rounded-2xl p-5 border border-[color:var(--neon-cyan)]/20">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--neon-cyan)]" aria-hidden />
            <div>
              <div className="font-mono text-xs tracking-[0.2em] text-[color:var(--neon-cyan)]">OUR GUARANTEE</div>
              <p className="mt-1 text-sm text-white/65">
                If your custom order is not ready by the promised collection date,{" "}
                <strong className="text-white">you keep the 50% balance</strong>. We take full responsibility.
              </p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="glass-strong rounded-2xl p-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[color:var(--neon-cyan)]" aria-hidden />
            <h2 className="mt-4 text-2xl font-bold text-white">Request Received!</h2>
            <p className="mt-3 text-white/60">
              We&apos;ll review your request and reach out within 24 hours via WhatsApp or email to confirm availability and next steps.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Full Name *" error={errors.name?.message}>
                <input {...register("name")} placeholder="Your name" className="input-field" />
              </Field>
              <Field label="Email *" error={errors.email?.message}>
                <input {...register("email")} type="email" placeholder="your@email.com" className="input-field" />
              </Field>
            </div>

            <Field label="WhatsApp / Phone" error={errors.phone?.message}>
              <input {...register("phone")} placeholder="+1 (473) ..." className="input-field" />
            </Field>

            <Field label="Item Link *" error={errors.itemLink?.message}>
              <div className="relative">
                <input
                  {...register("itemLink")}
                  placeholder="https://www.nike.com/product/..."
                  className="input-field pr-10"
                />
                <ExternalLink className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" aria-hidden />
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Brand" error={errors.brand?.message}>
                <input {...register("brand")} placeholder="e.g. Nike, Off-White..." className="input-field" />
              </Field>
              <Field label="Size *" error={errors.size?.message}>
                <input {...register("size")} placeholder="e.g. US 10, EU 44, L..." className="input-field" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Colorway / Style" error={errors.colorway?.message}>
                <input {...register("colorway")} placeholder="e.g. Triple Black, OG..." className="input-field" />
              </Field>
              <Field label="Budget (USD/XCD)" error={errors.budget?.message}>
                <input {...register("budget")} placeholder="e.g. $300 USD" className="input-field" />
              </Field>
            </div>

            <Field label="Additional Notes" error={errors.notes?.message}>
              <textarea
                {...register("notes")}
                rows={4}
                placeholder="Any other details — deadline, gift wrapping, etc."
                className="input-field resize-none"
              />
            </Field>

            <p className="font-mono text-[11px] tracking-[0.12em] text-[color:var(--neon-pink)]/60">
              ⚠ A 50% deposit is required before sourcing begins. Balance due upon arrival.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-6 py-4 font-mono text-sm font-bold tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 disabled:opacity-50 glow-cyan"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "SUBMIT CUSTOM ORDER"}
            </button>
          </form>
        )}
      </div>

      <SiteFooter />
      <WhatsAppButton />
    </main>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[11px] tracking-[0.2em] text-white/50">{label}</label>
      {children}
      {error && <p className="mt-1 font-mono text-[11px] text-[color:var(--neon-pink)]">{error}</p>}
    </div>
  )
}
