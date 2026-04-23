"use client"

import { useState, useEffect } from "react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { formatPrice } from "@/lib/utils"
import { PlusCircle, Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

type Product = {
  id: string; sku: string; name: string; brand: string; price: number
  imageUrl: string; stock: number; size: string | null; tag: string | null
  active: boolean; requiresDeposit: boolean
}

const schema = z.object({
  sku: z.string().min(1, "SKU required"),
  name: z.string().min(1, "Name required"),
  brand: z.string().min(1, "Brand required"),
  description: z.string().min(1, "Description required"),
  price: z.coerce.number().positive("Must be > 0"),
  imageUrl: z.string().url("Valid URL required"),
  stock: z.coerce.number().int().min(0),
  size: z.string().optional(),
  tag: z.enum(["HEAT", "GRAIL", "NEW", "LAST", ""]).optional(),
  requiresDeposit: z.boolean().default(false),
  active: z.boolean().default(true),
})
type FormData = z.infer<typeof schema>

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch("/api/products?limit=100")
    const data = await res.json()
    setProducts(data.products ?? [])
    setLoading(false)
  }

  function openNew() { reset({}); setEditing(null); setShowForm(true) }
  function openEdit(p: Product) {
    reset({ ...p, tag: (p.tag ?? "") as FormData["tag"], size: p.size ?? "", description: "" })
    setEditing(p)
    setShowForm(true)
  }

  async function onSubmit(data: FormData) {
    const url = editing ? `/api/products/${editing.id}` : "/api/products"
    const method = editing ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tag: data.tag || null }),
    })
    if (res.ok) {
      toast.success(editing ? "Product updated" : "Product created")
      setShowForm(false)
      fetchProducts()
    } else {
      toast.error("Save failed")
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Archive "${name}"?`)) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) { toast.success("Product archived"); fetchProducts() }
    else toast.error("Failed to archive")
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="font-mono text-xs tracking-[0.3em] text-[color:var(--neon-cyan)]">/ ADMIN</div>
              <h1 className="text-2xl font-bold text-white">Products</h1>
            </div>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-4 py-2.5 font-mono text-xs tracking-widest text-black hover:-translate-y-0.5 transition-transform glow-cyan">
            <PlusCircle className="h-4 w-4" /> ADD PRODUCT
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-strong mb-8 rounded-2xl p-6">
            <h2 className="mb-5 font-mono text-sm tracking-[0.2em] text-white/60">
              {editing ? "EDIT PRODUCT" : "NEW PRODUCT"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FField label="SKU *" error={errors.sku?.message}><input {...register("sku")} placeholder="SS-0001" className="input-field" /></FField>
                <FField label="Brand *" error={errors.brand?.message}><input {...register("brand")} placeholder="Nike" className="input-field" /></FField>
                <FField label="Name *" error={errors.name?.message}><input {...register("name")} placeholder="Air Max 97" className="input-field" /></FField>
                <FField label="Price (USD) *" error={errors.price?.message}><input {...register("price")} type="number" step="0.01" placeholder="0.00" className="input-field" /></FField>
                <FField label="Stock" error={errors.stock?.message}><input {...register("stock")} type="number" placeholder="1" className="input-field" /></FField>
                <FField label="Size" error={errors.size?.message}><input {...register("size")} placeholder="US 10" className="input-field" /></FField>
                <FField label="Tag" error={errors.tag?.message}>
                  <select {...register("tag")} className="input-field">
                    <option value="">None</option>
                    {["HEAT","GRAIL","NEW","LAST"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FField>
                <FField label="Image URL *" error={errors.imageUrl?.message}><input {...register("imageUrl")} placeholder="https://..." className="input-field" /></FField>
              </div>
              <FField label="Description *" error={errors.description?.message}>
                <textarea {...register("description")} rows={3} placeholder="Item description..." className="input-field resize-none" />
              </FField>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input {...register("requiresDeposit")} type="checkbox" className="rounded border-white/20 bg-white/5" />
                  Requires 50% Deposit
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input {...register("active")} type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5" />
                  Active (visible in shop)
                </label>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon-cyan)] px-5 py-2.5 font-mono text-xs tracking-widest text-black disabled:opacity-50 glow-cyan">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "SAVE"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs tracking-widest text-white/60 hover:text-white">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-white/30" /></div>
        ) : (
          <div className="glass overflow-hidden rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["", "SKU", "Product", "Price", "Stock", "Tag", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] text-white/35">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-black">
                        <Image src={p.imageUrl || "/placeholder.svg"} alt={p.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/55">{p.sku}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="font-mono text-[10px] text-white/40">{p.brand}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{formatPrice(p.price)}</td>
                    <td className={`px-4 py-3 font-mono text-sm ${p.stock === 0 ? "text-[color:var(--neon-pink)]" : "text-[color:var(--neon-cyan)]"}`}>{p.stock}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/45">{p.tag ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="text-white/40 hover:text-[color:var(--neon-cyan)] transition-colors" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="text-white/40 hover:text-[color:var(--neon-pink)] transition-colors" aria-label="Archive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-white/30">No products yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  )
}

function FField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-white/40">{label}</label>
      {children}
      {error && <p className="mt-1 font-mono text-[10px] text-[color:var(--neon-pink)]">{error}</p>}
    </div>
  )
}
