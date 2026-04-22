import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error) {
    console.error("[GET /api/products/[id]]", error)
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 })
  }
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
  size: z.string().optional(),
  tag: z.enum(["HEAT", "GRAIL", "NEW", "LAST"]).nullable().optional(),
  requiresDeposit: z.boolean().optional(),
  active: z.boolean().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    const product = await prisma.product.update({ where: { id }, data })
    return NextResponse.json({ product })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 422 })
    }
    console.error("[PUT /api/products/[id]]", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  try {
    // Soft delete — preserve order history
    await prisma.product.update({ where: { id }, data: { active: false, stock: 0 } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/products/[id]]", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
